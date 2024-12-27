const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Make sure this path is correct

// Route to get admin details
router.get('/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching admin details', error: error.message });
  }
});


router.delete('/delete-payment/:loanId/:paymentSno', async (req, res) => {
  const { loanId, paymentSno } = req.params;

  try {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Find the payment by sno and remove it
    const paymentIndex = loan.paymentSchedule.findIndex(payment => payment.sno === Number(paymentSno));
    
    if (paymentIndex === -1) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    loan.paymentSchedule.splice(paymentIndex, 1); // Remove the payment

    await loan.save(); // Save the updated loan document

    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ message: 'Error deleting payment', error: err });
  }
});


// Add more admin-specific routes as needed

module.exports = router;