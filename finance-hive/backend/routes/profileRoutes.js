const express = require('express');
const Profile = require('../models/Profile');
const router = express.Router();

// POST route to submit profile form data
router.post('/submit', async (req, res) => {
  const { firstName, lastName, email, loanTaken, paidAmount } = req.body;

  try {
    // Create a new profile entry
    const newProfile = new Profile({
      firstName,
      lastName,
      email,
      loanTaken,
      paidAmount,
    });

    // Save profile to database
    await newProfile.save();
    res.status(201).json({ message: 'Profile form updated successfully!', data: newProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile form', error });
  }
});

module.exports = router;