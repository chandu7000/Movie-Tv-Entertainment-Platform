const StreamSource = require('../models/StreamSource');
const { successResponse } = require('../utils/apiResponse');

const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const publicSource = (source) => ({
  sourceType: source.sourceType,
  url: source.url,
  quality: source.quality,
  language: source.language,
});

const groupResult = (records) => ({
  title: records[0]?.title || null,
  sources: records.map(publicSource),
  subtitles: records.flatMap((record) => record.subtitles || []).filter((track, index, values) => values.findIndex((item) => item.url === track.url) === index),
  licenseNote: records[0]?.licenseNote || 'Only authorized or public-domain streams should be configured.',
});

const getSources = async (req, res, next) => {
  try {
    const { mediaType, tmdbId } = req.params;
    if (!['movie', 'tv'].includes(mediaType)) return res.status(400).json({ success: false, message: 'Invalid media type.', data: null });
    const id = normalizeNumber(tmdbId, -1);
    if (id < 1) return res.status(400).json({ success: false, message: 'Invalid TMDB ID.', data: null });
    const season = mediaType === 'tv' ? normalizeNumber(req.query.season) : 0;
    const episode = mediaType === 'tv' ? normalizeNumber(req.query.episode) : 0;
    const records = await StreamSource.find({ mediaType, tmdbId: id, season, episode, isActive: true }).sort({ quality: -1 }).lean();
    return successResponse(res, { data: groupResult(records) });
  } catch (error) { return next(error); }
};

const getAvailability = async (req, res, next) => {
  try {
    const { mediaType, tmdbId } = req.params;
    if (!['movie', 'tv'].includes(mediaType)) return res.status(400).json({ success: false, message: 'Invalid media type.', data: null });
    const id = normalizeNumber(tmdbId, -1);
    if (id < 1) return res.status(400).json({ success: false, message: 'Invalid TMDB ID.', data: null });
    const season = mediaType === 'tv' ? normalizeNumber(req.query.season) : 0;
    const episode = mediaType === 'tv' ? normalizeNumber(req.query.episode) : 0;
    const count = await StreamSource.countDocuments({ mediaType, tmdbId: id, season, episode, isActive: true });
    return successResponse(res, { data: { available: count > 0, sourceCount: count } });
  } catch (error) { return next(error); }
};

const getEpisodes = async (req, res, next) => {
  try {
    const tmdbId = normalizeNumber(req.params.tmdbId, -1);
    const season = normalizeNumber(req.query.season, -1);
    if (tmdbId < 1 || season < 1) return res.status(400).json({ success: false, message: 'Valid TMDB ID and season are required.', data: null });
    const records = await StreamSource.find({ mediaType: 'tv', tmdbId, season, isActive: true }).sort({ episode: 1 }).lean();
    const episodes = [];
    for (const record of records) {
      if (!episodes.some((item) => item.episode === record.episode)) episodes.push({ episode: record.episode, title: record.title || `Episode ${record.episode}`, available: true });
    }
    return successResponse(res, { data: { tmdbId, season, episodes } });
  } catch (error) { return next(error); }
};

const getDemo = async (_req, res, next) => {
  try {
    const records = await StreamSource.find({ mediaType: 'demo', isDemo: true, isActive: true }).sort({ createdAt: 1 }).lean();
    return successResponse(res, { data: groupResult(records) });
  } catch (error) { return next(error); }
};

module.exports = { getSources, getAvailability, getEpisodes, getDemo };
