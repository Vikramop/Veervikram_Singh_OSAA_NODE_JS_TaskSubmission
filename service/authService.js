const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const REFRESH_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
exports.comparePasscode = async (input, hash) => bcrypt.compare(input, hash);

// ⏫ Issue refresh token and save to DB
exports.issueToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

exports.issueRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  await RefreshToken.create({
    userId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_EXPIRY),
  });

  return refreshToken;
};

// ✅ Verify stored refresh token
exports.verifyRefreshToken = async (token) => {
  const found = await RefreshToken.findOne({ token });
  if (!found || found.expiresAt < new Date()) {
    throw new Error('Refresh token is invalid or expired');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// ❌ Delete token from DB on logout
exports.revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};
