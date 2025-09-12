const { Store, Rating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get store owner dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get stores owned by this user
    const stores = await Store.findAll({
      where: { owner_id: userId }
    });
    
    if (stores.length === 0) {
      return res.status(404).json({ message: 'No stores found for this owner' });
    }
    
    const storeIds = stores.map(store => store.id);
    
    // Get average rating for all stores
    const avgRating = await Rating.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { store_id: { [Op.in]: storeIds } }
    });
    
    // Get users who rated the stores
    const ratings = await Rating.findAll({
      where: { store_id: { [Op.in]: storeIds } },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'address']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        }
      ]
    });
    
    // Group ratings by store
    const ratingsByStore = {};
    stores.forEach(store => {
      ratingsByStore[store.id] = {
        storeId: store.id,
        storeName: store.name,
        ratings: []
      };
    });
    
    ratings.forEach(rating => {
      if (ratingsByStore[rating.store_id]) {
        ratingsByStore[rating.store_id].ratings.push({
          id: rating.id,
          rating: rating.rating,
          comment: rating.comment,
          user: rating.user
        });
      }
    });
    
    res.json({
      stores: stores,
      averageRating: avgRating.getDataValue('averageRating') || 0,
      ratingsByStore: Object.values(ratingsByStore)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};