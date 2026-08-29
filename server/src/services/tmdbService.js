const axios = require('axios');

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 8000,
});

const cache = new Map();
const inflight = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const STALE_CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_LIMIT = 200;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1000];

const buildKey = (path, params) => `${path}?${new URLSearchParams(
  Object.entries(params || {})
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)])
).toString()}`;

const pruneCache = () => {
  const now = Date.now();

  for (const [key, entry] of cache) {
    if (entry.expiresAt + STALE_CACHE_TTL_MS <= now) cache.delete(key);
  }

  while (cache.size > CACHE_LIMIT) {
    cache.delete(cache.keys().next().value);
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const status = error.response?.status;

  if (status) {
    return status === 408 || status === 425 || status === 429 || status >= 500;
  }

  return [
    'ECONNABORTED',
    'ECONNRESET',
    'ETIMEDOUT',
    'EAI_AGAIN',
    'ENOTFOUND',
    'ERR_NETWORK',
  ].includes(error.code);
};

tmdbClient.interceptors.request.use((config) => {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    const error = new Error('TMDB_ACCESS_TOKEN is not configured on the server.');
    error.status = 503;
    throw error;
  }

  config.headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  return config;
});

const fetchFromTmdb = async (path, params) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await tmdbClient.get(path, { params });
      return response.data;
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === MAX_ATTEMPTS) {
        throw error;
      }

      await wait(RETRY_DELAYS_MS[attempt - 1] || RETRY_DELAYS_MS.at(-1));
    }
  }

  throw lastError;
};

const requestTmdb = async (path, params = {}, options = {}) => {
  const key = buildKey(path, params);
  const now = Date.now();

  let staleFallback;

  if (!options.skipCache) {
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now) return cached.data;
    if (cached && cached.expiresAt + STALE_CACHE_TTL_MS > now) staleFallback = cached.data;
    if (inflight.has(key)) return inflight.get(key);
  }

  const request = fetchFromTmdb(path, params)
    .then((data) => {
      if (!options.skipCache) {
        pruneCache();
        cache.set(key, {
          data,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
      }

      return data;
    })
    .catch((error) => {
      if (!options.skipCache && staleFallback) return staleFallback;
      throw error;
    })
    .finally(() => {
      if (!options.skipCache) inflight.delete(key);
    });

  if (!options.skipCache) inflight.set(key, request);
  return request;
};

module.exports = {
  requestTmdb,
  buildKey,
  isRetryableError,
};
