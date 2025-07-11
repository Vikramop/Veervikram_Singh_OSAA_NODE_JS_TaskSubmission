const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controller/authController');

/**
 * @swagger
 * tags: [Auth]
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john123"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               referralCode:
 *                 type: string
 *                 example: "ref123"
 *               passcode:
 *                 type: string
 *                 example: "securePass@123"
 *     responses:
 *       200:
 *         description: Registration success
 */

router.post('/register', controller.register);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP and receive tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, otp]
 *             properties:
 *               username: { type: string }
 *               otp:      { type: string }
 *     responses:
 *       200:
 *         description: Tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:        { type: string }
 *                 refreshToken: { type: string }
 *       400: { description: Invalid or expired OTP }
 */
router.post('/verify-otp', controller.verifyOTP);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Start login flow (OTP sent to Telegram)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, passcode]
 *             properties:
 *               username: { type: string }
 *               passcode: { type: string }
 *     responses:
 *       200: { description: OTP sent }
 *       401: { description: Wrong passcode }
 *       404: { description: User not found }
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend OTP (subject to rate limit & CAPTCHA)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *     responses:
 *       200: { description: OTP resent }
 *       429: { description: Too many requests }
 */
router.post('/resend-otp', controller.resendOTP);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout (revoke refresh token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logged out }
 *       401: { description: Unauthorized }
 */
router.post('/logout', controller.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:      { type: string }
 *                 username: { type: string }
 *                 role:     { type: string }
 *       401: { description: Unauthorized }
 */
router.get('/me', authMiddleware.protect, controller.getUsersMe);

module.exports = router;
