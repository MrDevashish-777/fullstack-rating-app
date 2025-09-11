const express = require('express');
const router = express.Router();
const ratingCtrl = require('../controllers/ratingController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/:id/rate', authMiddleware, ratingCtrl.submitOrUpdate); // id = store id
module.exports = router;
