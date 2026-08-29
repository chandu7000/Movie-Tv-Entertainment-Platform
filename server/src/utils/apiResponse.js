const successResponse = (res, { status = 200, message = 'Success', data = null } = {}) =>
  res.status(status).json({ success: true, message, data });

module.exports = { successResponse };
