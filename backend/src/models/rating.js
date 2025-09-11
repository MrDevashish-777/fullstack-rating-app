module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT }
  }, {
    tableName: 'ratings',
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['user_id', 'store_id'] }]
  });
  return Rating;
};
