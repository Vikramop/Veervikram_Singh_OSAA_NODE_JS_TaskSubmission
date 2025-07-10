const express = require('express');
const router = express.Router();
const controller = require('../controller/authController');
const { verifyCaptcha } = require('../middlewares/captchaMiddleware');

router.post('/register', controller.register);
router.post('/verify-otp', controller.verifyOTP);
router.post('/login', controller.login);
router.post('/resend-otp', verifyCaptcha, controller.resendOTP);
router.post('/logout', controller.logout);

module.exports = router;
