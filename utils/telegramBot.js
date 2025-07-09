require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const User = require('../models/User');
const otpService = require('../service/otpService');

// Existing OTP sender function
exports.sendOTP = async (chatId, otp) => {
  try {
    const message = `🔐 Your OTP: *${otp}*\nExpires in 5 minutes.`;
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Telegram Error:', err.message);
  }
};

// /start command to show buttons + log chat ID
bot.onText(/\/start (.+)/, async (msg, match) => {
  const username = match[1];
  const chatId = msg.chat.id;

  const User = require('../models/User');
  const user = await User.findOne({ username });

  if (!user) {
    return bot.sendMessage(
      chatId,
      '❌ User not found in system. Please register first.'
    );
  }

  // Link chat ID
  user.telegramChatId = String(chatId);
  await user.save();

  bot.sendMessage(
    chatId,
    `✅ Telegram linked successfully for ${username}! You will now receive OTPs here.`
  );
});

// Button handler for "Send OTP"
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const user = await User.findOne({ telegramChatId: String(chatId) });

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
      {
        parse_mode: 'Markdown',
      }
    );
  }
});
