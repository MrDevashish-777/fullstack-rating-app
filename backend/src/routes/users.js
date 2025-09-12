const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update password
router.put('/password', authMiddleware, userController.updatePassword);

module.exports = router;
