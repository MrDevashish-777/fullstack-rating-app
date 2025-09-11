const express = require('express');
const { User } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const { Op } = require('sequelize');

const router = express.Router();

// admin create user
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    // hashing and creation omitted here — in production follow same as register
    res.status(501).json({ message: 'Use register or seed for creating users' });
  } catch (err) { res.status(500).json({message:'Server error'}); }
});

// list users with filters
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, address, role, sort='name', order='ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;
    const users = await User.findAll({ where, order: [[sort, order.toUpperCase()]] });
    res.json(users);
  } catch (err) { console.error(err); res.status(500).json({message:'Server error'}); }
});

module.exports = router;
