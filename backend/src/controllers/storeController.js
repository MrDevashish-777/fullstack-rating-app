const { Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listStores = async (req, res) => {
  try {
    const { search, sort='name', order='ASC', page=1, limit=20 } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }
    const offset = (page-1)*limit;

    // fetch stores and compute avg rating and user rating if auth
    const stores = await Store.findAll({
      where,
      order: [[sort, order.toUpperCase()]],
      offset,
      limit: parseInt(limit),
      include: [
        { model: Rating, as: 'ratings', attributes: ['rating', 'user_id'] }
      ]
    });

    // compute avg & optionally user's rating
    const result = stores.map(s => {
      const ratings = s.ratings || [];
      const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.rating,0)/ratings.length).toFixed(2) : null;
      let userRating = null;
      if (req.user) {
        const ur = ratings.find(r => r.user_id === req.user.id);
        if (ur) userRating = { rating: ur.rating };
      }
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        avgRating: avg,
        userRating
      };
    });

    res.json({ data: result, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: require('../models').User, as: 'user', attributes: ['id', 'name', 'email', 'address', 'role'] }]
    });
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
