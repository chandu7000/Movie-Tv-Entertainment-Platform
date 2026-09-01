process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/app');
const StreamSource = require('../src/models/StreamSource');

jest.mock('../src/models/StreamSource');

describe('public stream API', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejects invalid media types', async () => {
    const response = await request(app).get('/api/streams/person/12');
    expect(response.status).toBe(400);
  });

  test('returns unavailable when no authorized source exists', async () => {
    StreamSource.countDocuments.mockResolvedValue(0);
    const response = await request(app).get('/api/streams/movie/12/availability');
    expect(response.status).toBe(200);
    expect(response.body.data.available).toBe(false);
  });

  test('returns configured stream sources', async () => {
    StreamSource.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([{ sourceType: 'mp4', url: 'https://example.com/video.mp4', quality: '720p', language: 'en', subtitles: [], licenseNote: 'Authorized.', title: 'Demo' }]) }) });
    const response = await request(app).get('/api/streams/movie/12');
    expect(response.status).toBe(200);
    expect(response.body.data.sources).toHaveLength(1);
  });
});
