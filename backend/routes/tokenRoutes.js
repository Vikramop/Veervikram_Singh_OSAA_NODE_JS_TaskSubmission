const express = require('express');
const router = express.Router();
const controller = require('../controller/tokenController');

/**
 * @swagger
 * /token/refresh:
 *   post:
 *     summary: Refresh JWT access token
 *     tags:
 *       - Token
 *     requestBody:
 *       description: Send valid refresh token in the request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', controller.refresh);

/**
 * @swagger
 * /token/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     tags:
 *       - Token
 *     requestBody:
 *       description: Send refresh token to invalidate it
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: Invalid or missing refresh token
 */
router.post('/logout', controller.logout);

module.exports = router;
