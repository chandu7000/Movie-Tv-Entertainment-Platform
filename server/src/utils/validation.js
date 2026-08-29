const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cleanText = (value) => String(value || '').trim();

const validateRegister = ({ name, email, password } = {}) => {
  const errors = {};
  const cleanName = cleanText(name);
  if (cleanName.length < 2 || cleanName.length > 80) errors.name = 'Name must be 2 to 80 characters.';
  if (!email || !EMAIL_PATTERN.test(cleanText(email)) || cleanText(email).length > 254) errors.email = 'Enter a valid email address.';
  if (!password || password.length < 8 || password.length > 128) errors.password = 'Password must be 8 to 128 characters.';
  return errors;
};
const validateLogin = ({ email, password } = {}) => { const errors = {}; if (!email || !EMAIL_PATTERN.test(cleanText(email)) || cleanText(email).length > 254) errors.email = 'Enter a valid email address.'; if (!password || typeof password !== 'string' || password.length > 128) errors.password = 'Password is required and must not exceed 128 characters.'; return errors; };
const validateMediaType = (value) => ['movie', 'tv'].includes(value);
const validateMediaItem = ({ tmdbId, mediaType, title } = {}) => { const errors = {}; if (!Number.isInteger(Number(tmdbId)) || Number(tmdbId) <= 0) errors.tmdbId = 'A valid TMDB id is required.'; if (!validateMediaType(mediaType)) errors.mediaType = 'Media type must be movie or tv.'; const cleanTitle=cleanText(title); if (!cleanTitle || cleanTitle.length>300) errors.title = 'Title is required and must not exceed 300 characters.'; return errors; };
const validateRating = (payload = {}) => { const errors = validateMediaItem(payload); const value = Number(payload.value); if (!Number.isFinite(value) || value < 1 || value > 10) errors.value = 'Rating must be between 1 and 10.'; return errors; };
const validateReview = (payload = {}) => { const errors = validateMediaItem(payload); const content = cleanText(payload.content); if (content.length < 3 || content.length > 2000) errors.content = 'Review must be 3 to 2000 characters.'; return errors; };
module.exports = { validateRegister, validateLogin, validateMediaItem, validateRating, validateReview, validateMediaType };
