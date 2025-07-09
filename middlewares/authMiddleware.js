const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ msg: 'Unauthorized' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passcode');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

exports.checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ msg: 'Forbidden' });
  next();
};
