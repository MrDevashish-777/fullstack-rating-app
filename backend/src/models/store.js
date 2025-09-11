module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING(400) }
  }, {
    tableName: 'stores',
    underscored: true,
    timestamps: true
  });
  return Store;
};
