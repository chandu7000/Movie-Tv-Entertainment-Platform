const REQUIRED_ALWAYS = ['MONGODB_URI', 'JWT_SECRET'];
const PLACEHOLDER_PATTERN = /replace-with|changeme|your[-_ ]?secret/i;

const validateEnvironment = () => {
  const required = [...REQUIRED_ALWAYS];
  if (process.env.NODE_ENV === 'production') required.push('TMDB_ACCESS_TOKEN', 'CLIENT_URL');
  const missing = required.filter((key) => !String(process.env[key] || '').trim());
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);

  const jwtSecret = String(process.env.JWT_SECRET || '');
  if (jwtSecret.length < 32 || PLACEHOLDER_PATTERN.test(jwtSecret)) {
    throw new Error('JWT_SECRET must be a non-placeholder secret of at least 32 characters.');
  }
  if (process.env.NODE_ENV === 'production' && String(process.env.CLIENT_URL || '').includes('localhost')) {
    throw new Error('CLIENT_URL must use the deployed frontend origin in production.');
  }
};

module.exports = { validateEnvironment };
