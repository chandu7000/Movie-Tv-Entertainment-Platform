const { validateRegister, validateLogin } = require('../src/utils/validation');

describe('authentication validation', () => {
  it('rejects weak registration data', () => {
    const errors = validateRegister({ name: 'A', email: 'bad', password: '123' });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('accepts valid login fields', () => {
    expect(validateLogin({ email: 'user@example.com', password: 'password123' })).toEqual({});
  });
});
