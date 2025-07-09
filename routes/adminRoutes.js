const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get(
  '/users',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.getUsers
);
router.patch(
  '/user/:id/role',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.updateUserRole
);
router.patch(
  '/user/:id/ban',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.setBanStatus
);
router.get(
  '/activity-logs',
  authMiddleware.protect,
  authMiddleware.checkRole('admin'),
  adminController.getActivityLogs
);
module.exports = router;
