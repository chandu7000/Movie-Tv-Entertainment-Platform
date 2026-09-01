const request = require('supertest');
const { sanitizeValue } = require('../src/middleware/security');
const { validateEnvironment } = require('../src/config/env');

jest.setTimeout(15000);

describe('security hardening', () => {
  const originalEnv = { ...process.env };
  afterEach(() => { process.env = { ...originalEnv }; });

  test('removes Mongo operator and dotted keys recursively', () => {
    expect(sanitizeValue({ filter: { $ne: null }, 'profile.admin': true, safe: { name: 'A' } })).toEqual({ filter: {}, safe: { name: 'A' } });
  });

  test('requires the CineVerse database connection', () => {
    delete process.env.MONGODB_URI;
    expect(validateEnvironment).toThrow(/MONGODB_URI/);
  });

  test('health endpoint includes security headers and hides Express signature', async () => {
    const response = await request(require('../src/app')).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.body.success).toBe(true);
  });

  test('unknown routes use a safe standardized response', async () => {
    const response = await request(require('../src/app')).get('/api/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'Route not found.', data: null });
  });
});
