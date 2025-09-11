const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.get('/stats', authMiddleware, roleMiddleware(['admin']), adminCtrl.stats);

module.exports = router;
