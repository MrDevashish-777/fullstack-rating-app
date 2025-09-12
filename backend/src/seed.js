const bcrypt = require('bcrypt');
const { sequelize, User, Store, Rating } = require('./models');
require('dotenv').config();

const run = async () => {
  await sequelize.sync({ force: true });
  const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
  const pw = await bcrypt.hash('Admin@1234!', salt);
  const admin = await User.create({ name: 'System Administrator ExampleNameLongEnough', email: 'admin@example.com', password_hash: pw, address: 'Admin HQ', role: 'admin' });

  const ownerPw = await bcrypt.hash('Owner@1234!', salt);
  const owner = await User.create({ name: 'Store Owner ExampleNameLongEnough', email: 'owner@example.com', password_hash: ownerPw, address: 'Owner address', role: 'owner' });

  const userPw = await bcrypt.hash('User@1234!', salt);
  const normal = await User.create({ name: 'Normal User ExampleNameLongEnough', email: 'user@example.com', password_hash: userPw, address: 'User address', role: 'user' });

  const s1 = await Store.create({ name: 'Alpha Grocers', email: 'alpha@store.com', address: 'MG Road', owner_id: owner.id });
  const s2 = await Store.create({ name: 'Beta Mart', email: 'beta@store.com', address: 'Main Street', owner_id: owner.id });

  await Rating.create({ user_id: normal.id, store_id: s1.id, rating: 4, comment: 'Nice store' });
  await Rating.create({ user_id: normal.id, store_id: s2.id, rating: 5, comment: 'Excellent' });

  console.log('Seed done');
  process.exit();
};

run();
