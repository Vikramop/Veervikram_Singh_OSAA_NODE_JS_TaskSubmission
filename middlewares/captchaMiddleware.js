const axios = require('axios');

exports.verifyCaptcha = async (req, res, next) => {
  const token = req.body.captcha_token;
  if (!token) return res.status(400).json({ msg: 'Captcha token is missing' });

  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      new URLSearchParams({
        secret: process.env.CF_CAPTCHA_SECRET_KEY,
        response: token,
        remoteip: req.ip,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (!response.data.success) {
      return res.status(403).json({ msg: 'Captcha verification failed' });
    }

    next();
  } catch (err) {
    console.error('CAPTCHA verify error:', err.message);
    res.status(500).json({ msg: 'Captcha verification error' });
  }
};
