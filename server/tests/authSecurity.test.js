const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin } = require('../src/utils/validation');

describe('authentication validation', () => {
  test('accepts a valid registration payload', () => {
    expect(validateRegister({ name: 'Sekhar', email: 'user@example.com', password: 'StrongPass123' })).toEqual({});
  });
  test('rejects oversized passwords and invalid email', () => {
    const errors = validateRegister({ name: 'Sekhar', email: 'bad', password: 'x'.repeat(129) });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
  test('JWT signatures cannot be verified with another secret', () => {
    const token = jwt.sign({ sub: '123' }, 'a'.repeat(32), { expiresIn: '1h' });
    expect(() => jwt.verify(token, 'b'.repeat(32))).toThrow();
  });
  test('login validation rejects non-string/oversized credentials', () => {
    expect(validateLogin({ email: 'user@example.com', password: 'x'.repeat(129) })).toHaveProperty('password');
  });
});
