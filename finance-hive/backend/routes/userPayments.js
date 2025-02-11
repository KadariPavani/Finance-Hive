const express = require('express');
const router = express.Router();
const UserPayment = require('../models/UserPayment');

// Fetch and format payment details
router.get('/finance-payments', async (req, res) => {
  try {
    const payments = await UserPayment.find().populate('organizerId').populate('userId');
    const formattedPayments = payments.map(payment => {
      return payment.paymentSchedule.map(schedule => ({
        sno: schedule.serialNo,
        userName: payment.name,
        dueDate: schedule.paymentDate,
        emiAmount: schedule.emiAmount,
        paymentDate: schedule.paidDate,
        balance: schedule.balance,
        status: schedule.status
      }));
    }).flat();

    console.log('Formatted Payments:', formattedPayments);
    res.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;