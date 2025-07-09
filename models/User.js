const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4 },
  username: { type: String, required: true, unique: true },
  dob: Date,
  referralCode: String,
  passcode: String,
  telegramChatId: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  isBanned: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
