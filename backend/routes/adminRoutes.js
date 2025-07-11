const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-related operations
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/users',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.getUsers
);

/**
 * @swagger
 * /admin/user/{id}/role:
 *   patch:
 *     summary: Update a user's role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch(
  '/user/:id/role',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.updateUserRole
);

/**
 * @swagger
 * /admin/user/{id}/ban:
 *   patch:
 *     summary: Ban or unban a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ban
 *             properties:
 *               ban:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User ban status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch(
  '/user/:id/ban',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.setBanStatus
);

/**
 * @swagger
 * /admin/activity-logs:
 *   get:
 *     summary: Get system activity logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of activity logs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/activity-logs',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.getActivityLogs
);

module.exports = router;
