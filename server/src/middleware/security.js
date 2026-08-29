const BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

const sanitizeValue = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== 'object') return value;
  const clean = {};
  for (const [key, child] of Object.entries(value)) {
    if (BLOCKED_KEYS.has(key) || key.startsWith('$') || key.includes('.')) continue;
    clean[key] = sanitizeValue(child);
  }
  return clean;
};

const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === 'object') req.body = sanitizeValue(req.body);
  next();
};

const securityHeaders = (req, res, next) => {
  res.setHeader('Cache-Control', req.path.startsWith('/api/auth') ? 'no-store' : 'no-cache');
  res.setHeader('Pragma', 'no-cache');
  next();
};

module.exports = { sanitizeValue, sanitizeRequest, securityHeaders };
