const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4 },
  username: { type: String, unique: true },
  dob: Date,
  referralCode: String,
  passcode: String,
  telegramChatId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
