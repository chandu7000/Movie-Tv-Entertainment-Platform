const request = require('supertest');
const { sanitizeValue } = require('../src/middleware/security');
const { validateEnvironment } = require('../src/config/env');

describe('security hardening', () => {
  const originalEnv = { ...process.env };
  afterEach(() => { process.env = { ...originalEnv }; });

  test('removes Mongo operator and dotted keys recursively', () => {
    expect(sanitizeValue({ email: { $ne: null }, 'profile.admin': true, safe: { name: 'A' } })).toEqual({ email: {}, safe: { name: 'A' } });
  });

  test('rejects weak JWT secrets', () => {
    process.env.MONGODB_URI = 'mongodb://localhost/test';
    process.env.JWT_SECRET = 'short';
    expect(validateEnvironment).toThrow(/JWT_SECRET/);
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

  test('rejects oversized JSON bodies', async () => {
    const response = await request(require('../src/app')).post('/api/auth/login').send({ email: 'a@example.com', password: 'x'.repeat(110000) });
    expect(response.status).toBe(413);
  });
});
