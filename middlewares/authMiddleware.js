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

exports.checkRole = (requiredRole) => async (req, res, next) => {
  try {
    if (req.user.role !== requiredRole) {
      // 🔐 Log unauthorized access
      await ActivityLog.create({
        userId: req.user._id,
        type: 'unauthorized_access',
        endpoint: req.originalUrl,
        ip: req.ip,
        timestamp: new Date(),
      });

      return res.status(403).json({ msg: 'Forbidden' });
    }

    next();
  } catch (err) {
    console.error('Role check error:', err.message);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};
