const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

// Password must be 8-16 characters, include at least one uppercase letter and one special character
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,16}$/;

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    
    // Validation checks
    if (!name || !email || !password) 
      return res.status(400).json({ message: 'Missing required fields' });
    
    if (name.length < 20 || name.length > 60) 
      return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    
    if (address && address.length > 400)
      return res.status(400).json({ message: 'Address cannot exceed 400 characters' });
    
    if (!passwordRegex.test(password)) 
      return res.status(400).json({ 
        message: 'Password must be 8-16 characters and include at least one uppercase letter and one special character' 
      });

    // Check if email is already registered
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Create new user
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const password_hash = await bcrypt.hash(password, salt);
    const user = await User.create({ 
      name, 
      email, 
      password_hash, 
      address, 
      role: 'user' // Default role for self-registration is 'user'
    });
    
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
