module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING(400) },
    role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'user' }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  });
  return User;
};
