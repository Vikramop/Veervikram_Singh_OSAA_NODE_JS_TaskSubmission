const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String, // 'login' or 'logout'
  timestamp: { type: Date, default: Date.now },
  ip: String,
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
