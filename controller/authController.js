const User = require('../models/User');

const otpService = require('../service/otpService');
const authService = require('../service/authService');
const { sendOTP } = require('../utils/telegramBot');

exports.register = async (req, res) => {
  try {
    const { username, dob, referralCode, passcode, telegramChatId } = req.body;

    const exists = await User.findOne({
      $or: [{ username }, { telegramChatId }],
    });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await authService.hashPasscode(passcode);
    const user = await User.create({
      username,
      dob,
      referralCode,
      telegramChatId,
      passcode: hashed,
    });

    const otp = otpService.generateOTP();
    await otpService.storeOTP(user._id, otp);
    await sendOTP(telegramChatId, otp);

    res.status(201).json({ msg: 'User registered, OTP sent' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { username, otp } = req.body;

    // ✅ Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // ✅ Validate OTP using service
    await otpService.validateOTP(user._id, otp);
    console.log('OTP is valid');

    // ✅ Generate tokens
    const token = authService.issueToken(user);
    const refreshToken = await authService.issueRefreshToken(user._id);

    // ✅ Send response
    res.status(200).json({
      msg: 'OTP verified',
      token,
      refreshToken,
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, passcode } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const match = await authService.comparePasscode(passcode, user.passcode);
    if (!match) return res.status(401).json({ msg: 'Incorrect passcode' });

    // 1️⃣ Generate OTP
    const otp = otpService.generateOTP();
    await otpService.storeOTP(user._id, otp);

    // 2️⃣ Send OTP via Telegram
    await sendOTP(user.telegramChatId, otp);

    // 3️⃣ Respond that OTP was sent
    return res.status(200).json({
      msg: 'Login OTP sent to your Telegram. Please verify to get your token.',
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Optional: Rate-limit logic (example: 1 OTP per 60 seconds)
    const recentOtp = await Otp.findOne({ userId: user._id }).sort({
      createdAt: -1,
    });
    if (recentOtp && Date.now() - recentOtp.createdAt.getTime() < 60 * 1000) {
      return res
        .status(429)
        .json({ msg: 'Please wait before requesting another OTP' });
    }

    // Generate and store OTP
    const otp = otpService.generateOTP();
    await otpService.storeOTP(user._id, otp);

    // Send OTP via Telegram
    await sendOTP(user.telegramChatId, otp);

    return res.status(200).json({ msg: 'OTP resent to Telegram' });
  } catch (err) {
    console.error('Resend OTP error:', err.message);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.refreshToken = async (req, res) => {
  console.log('ENTER');

  const { token } = req.body;
  try {
    const userId = await authService.verifyRefreshToken(token);
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const newAccessToken = authService.issueToken(user);
    const newRefreshToken = await authService.issueRefreshToken(userId);

    return res.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ msg: err.message });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    await authService.revokeRefreshToken(refreshToken);
    return res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
