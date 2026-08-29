const { successResponse } = require('../utils/apiResponse');
const { validateRegister, validateLogin } = require('../utils/validation');
const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const errors = validateRegister(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', data: { errors } });
    const data = await registerUser(req.body);
    return successResponse(res, { status: 201, message: 'Account created successfully.', data });
  } catch (error) { return next(error); }
};

const login = async (req, res, next) => {
  try {
    const errors = validateLogin(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', data: { errors } });
    const data = await loginUser(req.body);
    return successResponse(res, { message: 'Login successful.', data });
  } catch (error) { return next(error); }
};

const logout = async (req, res, next) => {
  try {
    req.user.tokenVersion = (req.user.tokenVersion || 0) + 1;
    await req.user.save();
    return successResponse(res, { message: 'Logged out successfully.' });
  } catch (error) { return next(error); }
};
const me = async (req, res) => successResponse(res, { data: { user: req.user.toPublicJSON() } });

module.exports = { register, login, logout, me };
