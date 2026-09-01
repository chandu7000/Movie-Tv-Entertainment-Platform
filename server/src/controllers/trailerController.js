const { resolveTrailer } = require('../services/trailerService');
const { successResponse } = require('../utils/apiResponse');

const getResolvedTrailer = async (req, res, next) => {
  try {
    const { mediaType, id } = req.params;
    if (!/^\d+$/.test(String(id))) {
      return res.status(400).json({ success: false, message: 'Invalid TMDB ID.', data: null });
    }

    const trailer = await resolveTrailer(mediaType, Number(id));
    return successResponse(res, {
      data: {
        available: Boolean(trailer),
        trailer: trailer || null,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getResolvedTrailer };
