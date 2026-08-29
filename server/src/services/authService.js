const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign(
  { sub: user._id.toString(), role: user.role, tv: user.tokenVersion || 0 },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const exists = await User.exists({ email: normalizedEmail });
  if (exists) {
    const error = new Error('An account with this email already exists.');
    error.status = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
  return { user: user.toPublicJSON(), token: signToken(user) };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash +tokenVersion');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }
  return { user: user.toPublicJSON(), token: signToken(user) };
};

module.exports = { registerUser, loginUser };
