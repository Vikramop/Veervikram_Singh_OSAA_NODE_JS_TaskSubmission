const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controller/authController');
const { verifyCaptcha } = require('../middlewares/captchaMiddleware');

router.post('/register', controller.register);
router.post('/verify-otp', controller.verifyOTP);
router.post('/login', controller.login);
router.post('/resend-otp', controller.resendOTP);
router.post('/logout', controller.logout);

router.get('/me', authMiddleware.protect, controller.getUsersMe);

module.exports = router;
