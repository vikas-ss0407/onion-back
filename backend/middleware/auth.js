
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // fetch user from DB and attach full user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user; // now req.user._id exists
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      if (process.env.DEBUG_COOKIES === 'true') console.log('Auth middleware: token expired', err);
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    if (process.env.DEBUG_COOKIES === 'true') console.log('Auth middleware: invalid token', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
