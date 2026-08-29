const notFound = (req, res) => res.status(404).json({ success: false, message: 'Route not found.', data: null });

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  let status = error.status || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
  if (error.type === 'entity.too.large') status = 413;
  if (error.code === 11000) status = 409;
  const production = process.env.NODE_ENV === 'production';
  const message = status === 500 && production ? 'Internal server error.' : (error.message || 'Request failed.');
  return res.status(status).json({
    success: false,
    message,
    data: null,
    ...(!production && status === 500 ? { stack: error.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };
