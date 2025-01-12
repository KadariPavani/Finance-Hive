// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/PaymentSchema');
const auth = require('../middleware/auth');
const LoansUpdate =require('../models/Loan');

// Get all payments
router.get('/payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});


router.delete('/payments/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    // First, find and delete the payment
    const deletedPayment = await Payment.findByIdAndDelete(id);
    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Then, find and update the corresponding loan record
    const loanUpdate = await LoansUpdate.findOne({ email });
    if (loanUpdate) {
      // Find the payment in the paymentSchedule array and update its status
      loanUpdate.paymentSchedule = loanUpdate.paymentSchedule.map(payment => {
        if (payment.transactionId === deletedPayment.transactionId) {
          return {
            ...payment,
            status: 'Pay now',
            transactionId: null,
            is_verified: false
          };
        }
        return payment;
      });

      await loanUpdate.save();
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
});
module.exports = router;