const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
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

module.exports = router;
