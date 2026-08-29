const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.', data: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('+tokenVersion');
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.', data: null });
    if ((payload.tv || 0) !== (user.tokenVersion || 0)) return res.status(401).json({ success: false, message: 'Session has been revoked.', data: null });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.', data: null });
  }
};

module.exports = { requireAuth };
