const express = require('express');
const User = require('../models/User');
const Loan = require('../models/Loan'); // Import the Loan model
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const router = express.Router();

// Get user data by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
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

// Update user password
router.put('/change-password/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Check loan eligibility by user email
router.get('/eligibility/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find any active loans associated with the email
    const activeLoan = await Loan.findOne({ email, status: 'active' });

    if (activeLoan) {
      const pendingPayments = activeLoan.paymentSchedule.filter((payment) => payment.status === 'Pay now').length;

      // Return ineligible if there are pending payments
      return res.status(200).json({
        isEligible: false,
        msg: 'You have pending payments. Complete them to apply for another loan.',
        pendingPayments,
      });
    }

    // Eligible if no active loans
    res.status(200).json({ isEligible: true, msg: 'Eligible to apply for a loan.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
