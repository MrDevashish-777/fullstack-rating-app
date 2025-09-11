const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Store = require('./store')(sequelize, Sequelize.DataTypes);
const Rating = require('./rating')(sequelize, Sequelize.DataTypes);

// associations
User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

module.exports = { sequelize, User, Store, Rating };
