const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

// Admin dashboard statistics
router.get('/stats', authMiddleware, roleMiddleware(['admin']), adminCtrl.stats);

// User management
router.post('/users', authMiddleware, roleMiddleware(['admin']), adminCtrl.createUser);
router.get('/users', authMiddleware, roleMiddleware(['admin']), adminCtrl.getUsers);
router.get('/users/:id', authMiddleware, roleMiddleware(['admin']), adminCtrl.getUserDetails);

// Store management
router.post('/stores', authMiddleware, roleMiddleware(['admin']), adminCtrl.createStore);
router.get('/stores', authMiddleware, roleMiddleware(['admin']), adminCtrl.getStores);

module.exports = router;
