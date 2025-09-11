const { Rating } = require('../models');

exports.submitOrUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id);
    let { rating, comment } = req.body;
    rating = parseInt(rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be integer 1-5' });
    }

    // upsert-like behavior
    const existing = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json(existing);
    } else {
      const r = await Rating.create({ user_id: userId, store_id: storeId, rating, comment });
      return res.status(201).json(r);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
