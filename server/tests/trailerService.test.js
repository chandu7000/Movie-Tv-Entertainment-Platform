const axios = require('axios');
const { requestTmdb } = require('../src/services/tmdbService');

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: { request: { use: jest.fn() } },
    get: jest.fn(),
  })),
  get: jest.fn(),
}));
jest.mock('../src/services/tmdbService', () => ({ requestTmdb: jest.fn() }));

const { pickBestTmdbTrailer, resolveTrailer } = require('../src/services/trailerService');

describe('trailer resolver', () => {
  const originalKey = process.env.YOUTUBE_API_KEY;

  afterEach(() => {
    jest.clearAllMocks();
    if (originalKey === undefined) delete process.env.YOUTUBE_API_KEY;
    else process.env.YOUTUBE_API_KEY = originalKey;
  });

  test('prefers an official trailer over clips and featurettes', () => {
    const best = pickBestTmdbTrailer([
      { site: 'YouTube', key: 'clip', type: 'Clip', name: 'Official Clip', official: true },
      { site: 'YouTube', key: 'teaser', type: 'Teaser', name: 'Teaser', official: true },
      { site: 'YouTube', key: 'trailer', type: 'Trailer', name: 'Official Trailer', official: true },
    ], 'te');

    expect(best.key).toBe('trailer');
  });

  test('checks multiple TMDB language variants for regional trailers', async () => {
    delete process.env.YOUTUBE_API_KEY;
    requestTmdb.mockImplementation(async (path, params) => {
      if (!path.endsWith('/videos')) {
        return { title: 'Example', original_title: 'Example', original_language: 'te', release_date: '2026-01-01' };
      }
      if (params?.language === 'te-IN') {
        return { results: [{ site: 'YouTube', key: 'teluguTrailer', type: 'Trailer', name: 'Official Trailer', official: true, iso_639_1: 'te' }] };
      }
      return { results: [] };
    });

    const trailer = await resolveTrailer('movie', 100);
    expect(trailer.key).toBe('teluguTrailer');
    expect(trailer.source).toBe('tmdb');
  });

  test('uses YouTube search fallback when TMDB has no usable trailer and API key exists', async () => {
    process.env.YOUTUBE_API_KEY = 'test-key';
    requestTmdb.mockImplementation(async (path) => {
      if (!path.endsWith('/videos')) return { title: 'Example Film', original_title: 'Example Film', original_language: 'te', release_date: '2026-01-01' };
      return { results: [] };
    });
    axios.get.mockResolvedValue({ data: { items: [{ id: { videoId: 'yt123' }, snippet: { title: 'Example Film Official Trailer 2026 Telugu', channelTitle: 'Studio' } }] } });

    const trailer = await resolveTrailer('movie', 100);
    expect(trailer.key).toBe('yt123');
    expect(trailer.source).toBe('youtube-search');
  });
});
