const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

exports.refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: 'Token required' });

  const saved = await RefreshToken.findOne({ token });
  if (!saved || saved.expiresAt < new Date())
    return res.status(403).json({ msg: 'Invalid or expired refresh token' });

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const accessToken = jwt.sign(
    { id: payload.id, role: payload.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ accessToken });
};

exports.logout = async (req, res) => {
  const { token } = req.body;
  await RefreshToken.deleteOne({ token });
  res.json({ msg: 'Logged out' });
};
