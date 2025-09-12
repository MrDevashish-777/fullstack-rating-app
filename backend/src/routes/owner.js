const express = require('express');
const router = express.Router();
const ownerCtrl = require('../controllers/ownerController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

// Store owner dashboard
router.get('/dashboard', authMiddleware, roleMiddleware(['owner']), ownerCtrl.getDashboard);

module.exports = router;