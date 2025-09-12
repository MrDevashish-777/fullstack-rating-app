const { User, Store, Rating, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Password regex for validation
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,16}$/;

// Get dashboard statistics
exports.stats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user (admin can create any type of user)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) 
      return res.status(400).json({ message: 'Missing required fields' });
    
    if (name.length < 20 || name.length > 60) 
      return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    
    if (address && address.length > 400)
      return res.status(400).json({ message: 'Address cannot exceed 400 characters' });
    
    if (!passwordRegex.test(password)) 
      return res.status(400).json({ 
        message: 'Password must be 8-16 characters and include at least one uppercase letter and one special character' 
      });
    
    if (!['admin', 'user', 'owner'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Create user
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const password_hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password_hash, address, role });
    
    return res.status(201).json({ 
      id: user.id, 
      name: user.name,
      email: user.email, 
      role: user.role 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new store
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    
    if (!name || !address) 
      return res.status(400).json({ message: 'Name and address are required' });
    
    if (address.length > 400)
      return res.status(400).json({ message: 'Address cannot exceed 400 characters' });
    
    // Create store with optional owner
    const storeData = { name, email, address };
    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner) 
        return res.status(404).json({ message: 'Owner not found' });
      
      if (owner.role !== 'owner')
        return res.status(400).json({ message: 'User must have owner role to own a store' });
      
      storeData.owner_id = owner_id;
    }
    
    const store = await Store.create(storeData);
    res.status(201).json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users with filtering
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sort, order } = req.query;
    
    // Build filter conditions
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;
    
    // Build sort options
    const orderOptions = [];
    if (sort) {
      const direction = order === 'desc' ? 'DESC' : 'ASC';
      orderOptions.push([sort, direction]);
    } else {
      orderOptions.push(['created_at', 'DESC']);
    }
    
    const users = await User.findAll({
      where,
      order: orderOptions,
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all stores with filtering
exports.getStores = async (req, res) => {
  try {
    const { name, email, address, sort, order } = req.query;
    
    // Build filter conditions
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    
    // Build sort options
    const orderOptions = [];
    if (sort) {
      const direction = order === 'desc' ? 'DESC' : 'ASC';
      orderOptions.push([sort, direction]);
    } else {
      orderOptions.push(['created_at', 'DESC']);
    }
    
    // Get stores with average rating
    const stores = await Store.findAll({
      where,
      order: orderOptions,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    // Calculate average rating for each store
    const storesWithRatings = await Promise.all(stores.map(async (store) => {
      const storeObj = store.toJSON();
      
      // Calculate average rating
      const avgRating = await Rating.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
        ],
        where: { store_id: store.id }
      });
      
      storeObj.averageRating = avgRating.getDataValue('averageRating') || 0;
      return storeObj;
    }));
    
    res.json(storesWithRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user details by ID
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const userData = user.toJSON();
    
    // If user is a store owner, get their store's average rating
    if (user.role === 'owner') {
      const stores = await Store.findAll({
        where: { owner_id: user.id }
      });
      
      const storeIds = stores.map(store => store.id);
      
      if (storeIds.length > 0) {
        const avgRating = await Rating.findOne({
          attributes: [
            [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
          ],
          where: { store_id: { [Op.in]: storeIds } }
        });
        
        userData.averageRating = avgRating.getDataValue('averageRating') || 0;
      }
    }
    
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
