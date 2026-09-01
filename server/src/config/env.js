const REQUIRED_ALWAYS = ['MONGODB_URI'];

const validateEnvironment = () => {
  const required = [...REQUIRED_ALWAYS];
  if (process.env.NODE_ENV === 'production') required.push('TMDB_ACCESS_TOKEN', 'CLIENT_URL');
  const missing = required.filter((key) => !String(process.env[key] || '').trim());
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  if (process.env.NODE_ENV === 'production' && String(process.env.CLIENT_URL || '').includes('localhost')) {
    throw new Error('CLIENT_URL must use the deployed frontend origin in production.');
  }
};

module.exports = { validateEnvironment };
