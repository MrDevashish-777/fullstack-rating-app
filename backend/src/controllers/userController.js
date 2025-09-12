const { User } = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Password regex for validation
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,16}$/;

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) 
      return res.status(400).json({ message: 'Current and new password are required' });
    
    // Validate new password
    if (!passwordRegex.test(newPassword)) 
      return res.status(400).json({ 
        message: 'Password must be 8-16 characters and include at least one uppercase letter and one special character' 
      });
    
    // Get user with password
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Current password is incorrect' });
    
    // Update password
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const password_hash = await bcrypt.hash(newPassword, salt);
    
    user.password_hash = password_hash;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};