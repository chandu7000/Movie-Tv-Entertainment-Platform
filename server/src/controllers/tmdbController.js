const { requestTmdb } = require('../services/tmdbService');
const { successResponse } = require('../utils/apiResponse');

const allowedRoots = new Set(['configuration', 'trending', 'movie', 'tv', 'genre', 'discover', 'search', 'person']);

const proxy = async (req, res, next) => {
  try {
    const relativePath = req.params[0] || req.path.replace(/^\//, '');
    const path = `/${relativePath}`;
    const root = relativePath.split('/').filter(Boolean)[0];
    if (!allowedRoots.has(root)) return res.status(400).json({ success: false, message: 'Unsupported TMDB resource.', data: null });
    const data = await requestTmdb(path, req.query);
    return successResponse(res, { data });
  } catch (error) {
    if (error.response) {
      error.status = error.response.status;
      error.message = error.response.data?.status_message || 'TMDB request failed.';
    }
    return next(error);
  }
};

module.exports = { proxy };
