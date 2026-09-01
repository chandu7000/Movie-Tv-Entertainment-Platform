const axios = require('axios');
const { requestTmdb } = require('./tmdbService');

const LANGUAGE_LOCALES = {
  te: ['te-IN', 'en-US'],
  hi: ['hi-IN', 'en-US'],
  ta: ['ta-IN', 'en-US'],
  ml: ['ml-IN', 'en-US'],
  kn: ['kn-IN', 'en-US'],
  bn: ['bn-IN', 'en-US'],
  mr: ['mr-IN', 'en-US'],
  pa: ['pa-IN', 'en-US'],
  en: ['en-US'],
};

const normalize = (value = '') => String(value)
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const dedupeVideos = (videos = []) => {
  const seen = new Set();
  return videos.filter((video) => {
    const key = `${video?.site || ''}:${video?.key || ''}`;
    if (!video?.key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const trailerScore = (video, originalLanguage) => {
  if (video?.site !== 'YouTube' || !video?.key) return -10000;

  const type = normalize(video.type);
  const name = normalize(video.name);
  const language = normalize(video.iso_639_1);
  let score = 0;

  if (type === 'trailer') score += 100;
  else if (type === 'teaser') score += 45;
  else score -= 120;

  if (video.official === true) score += 45;
  if (name.includes('official trailer')) score += 55;
  else if (name.includes('trailer')) score += 30;
  if (name.includes('theatrical trailer')) score += 15;
  if (name.includes('final trailer')) score += 10;
  if (name.includes('teaser')) score += 5;

  if (['clip', 'featurette', 'behind the scenes', 'promo', 'song', 'scene'].some((term) => name.includes(term))) score -= 100;
  if (originalLanguage && language === normalize(originalLanguage)) score += 12;

  return score;
};

const pickBestTmdbTrailer = (videos, originalLanguage) => dedupeVideos(videos)
  .map((video) => ({ video, score: trailerScore(video, originalLanguage) }))
  .filter(({ score }) => score >= 60)
  .sort((a, b) => b.score - a.score)[0]?.video || null;

const fetchTmdbVideoCandidates = async (mediaType, id, originalLanguage) => {
  const locales = Array.from(new Set([
    ...(LANGUAGE_LOCALES[originalLanguage] || []),
    'en-US', 'te-IN', 'hi-IN', 'ta-IN', 'ml-IN', 'kn-IN',
  ])).slice(0, 7);

  const requests = [requestTmdb(`/${mediaType}/${id}/videos`), ...locales.map((language) => (
    requestTmdb(`/${mediaType}/${id}/videos`, { language })
  ))];

  const settled = await Promise.allSettled(requests);
  return settled.flatMap((result) => result.status === 'fulfilled' ? (result.value?.results || []) : []);
};

const youtubeSearch = async ({ title, originalTitle, year, originalLanguage }) => {
  if (!process.env.YOUTUBE_API_KEY) return null;

  const languageWord = ({ te: 'Telugu', hi: 'Hindi', ta: 'Tamil', ml: 'Malayalam', kn: 'Kannada' })[originalLanguage] || '';
  const queryTitle = originalTitle || title;
  const q = [queryTitle, year, languageWord, 'official trailer'].filter(Boolean).join(' ');

  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    timeout: 8000,
    params: {
      key: process.env.YOUTUBE_API_KEY,
      part: 'snippet',
      type: 'video',
      maxResults: 10,
      q,
      safeSearch: 'moderate',
      videoEmbeddable: 'true',
    },
  });

  const normalizedTitle = normalize(queryTitle);
  const candidates = (response.data?.items || [])
    .filter((item) => item?.id?.videoId)
    .map((item) => {
      const videoTitle = normalize(item.snippet?.title);
      let score = 0;
      if (videoTitle.includes('official trailer')) score += 80;
      else if (videoTitle.includes('trailer')) score += 45;
      if (normalizedTitle && videoTitle.includes(normalizedTitle)) score += 60;
      if (year && videoTitle.includes(String(year))) score += 8;
      if (languageWord && videoTitle.includes(normalize(languageWord))) score += 10;
      if (['clip', 'scene', 'song', 'promo', 'review', 'reaction', 'fan made'].some((term) => videoTitle.includes(term))) score -= 80;
      return { item, score };
    })
    .filter(({ score }) => score >= 80)
    .sort((a, b) => b.score - a.score);

  const best = candidates[0]?.item;
  if (!best) return null;

  return {
    id: `youtube-${best.id.videoId}`,
    key: best.id.videoId,
    site: 'YouTube',
    type: 'Trailer',
    name: best.snippet?.title || `${queryTitle} Official Trailer`,
    official: true,
    source: 'youtube-search',
    channelTitle: best.snippet?.channelTitle || '',
  };
};

const resolveTrailer = async (mediaType, id) => {
  if (!['movie', 'tv'].includes(mediaType)) {
    const error = new Error('Invalid media type.');
    error.status = 400;
    throw error;
  }

  const details = await requestTmdb(`/${mediaType}/${id}`);
  const title = details?.title || details?.name || '';
  const originalTitle = details?.original_title || details?.original_name || title;
  const originalLanguage = details?.original_language || 'en';
  const date = details?.release_date || details?.first_air_date || '';
  const year = date ? String(date).slice(0, 4) : '';

  const videos = await fetchTmdbVideoCandidates(mediaType, id, originalLanguage);
  const tmdbTrailer = pickBestTmdbTrailer(videos, originalLanguage);
  if (tmdbTrailer) return { ...tmdbTrailer, source: 'tmdb' };

  return youtubeSearch({ title, originalTitle, year, originalLanguage });
};

module.exports = {
  resolveTrailer,
  pickBestTmdbTrailer,
  trailerScore,
};
