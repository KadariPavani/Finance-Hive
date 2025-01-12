// routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path based on your project structure


// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Update password endpoint - now at /api/settings/change-password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('Received request:', { email }); // Debug log

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        msg: 'Email and new password are required'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found with this email address'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    
    return res.status(200).json({
      success: true,
      msg: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      msg: 'Server error while updating password'
    });
  }
});

module.exports = router;