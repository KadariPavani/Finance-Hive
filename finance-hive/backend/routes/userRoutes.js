const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

// Get user data by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  // Check if userId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
    // Find user by _id
    const user = await User.findById(userId); 
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

