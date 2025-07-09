const express = require('express');
const router = express.Router();
const controller = require('../controller/tokenController');

router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
// router.post('/token/refresh', controller.refreshToken);

module.exports = router;
