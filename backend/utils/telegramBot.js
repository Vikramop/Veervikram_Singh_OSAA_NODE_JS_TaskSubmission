require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const User = require('../models/User');
const otpService = require('../service/otpService');

// 📤 Send OTP utility
exports.sendOTP = async (chatId, otp) => {
  try {
    const message = `🔐 Your OTP: *${otp}*\nExpires in 5 minutes.`;
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Telegram Error:', err.message);
  }
};

// 🔗 Handle Telegram linking
bot.onText(/\/start link_(.+)/, async (msg, match) => {
  const chatId = String(msg.chat.id);
  const username = match[1];

  // ⚠️ Block reuse of Telegram account
  const existing = await User.findOne({ telegramChatId: chatId });
  if (existing && existing.username !== username) {
    return bot.sendMessage(
      chatId,
      `❌ This Telegram account is already linked to another username: *${existing.username}*`,
      { parse_mode: 'Markdown' }
    );
  }

  // ✅ Link to correct user
  const user = await User.findOne({ username });
  if (!user) {
    return bot.sendMessage(
      chatId,
      '❌ Username not found. Please register first.'
    );
  }

  user.telegramChatId = chatId;
  user.isTelegramLinked = true;
  await user.save();

  bot.sendMessage(chatId, `✅ Telegram linked successfully to *${username}*`, {
    parse_mode: 'Markdown',
  });
});

// 🔘 OTP Button handler (optional if you use inline keyboard in future)
bot.on('callback_query', async (query) => {
  const chatId = String(query.message.chat.id);
  const user = await User.findOne({ telegramChatId: chatId });

  if (query.data === 'send_otp') {
    if (!user) {
      return bot.sendMessage(
        chatId,
        "❌ You're not registered. Please register first."
      );
    }

    const otp = otpService.generateOTP();
    await otpService.storeOTP(user._id, otp);

    await bot.sendMessage(
      chatId,
      `🔐 Your OTP is: *${otp}*\n_Expires in 5 minutes_`,
      { parse_mode: 'Markdown' }
    );
  }
});
