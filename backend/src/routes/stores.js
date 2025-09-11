const express = require('express');
const router = express.Router();
const storeCtrl = require('../controllers/storeController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, roleMiddleware(['admin']), storeCtrl.createStore);
router.get('/', authMiddleware, storeCtrl.listStores); // allow anonymous later if needed
router.get('/:id/ratings', authMiddleware, storeCtrl.getStoreRatings);

module.exports = router;
