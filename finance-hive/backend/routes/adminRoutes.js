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


// Admin routes for payment management
router.get('/admin/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

router.put('/admin/payments/:paymentId/verify', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      { status: 'Verified' },
      { new: true }
    );
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error verifying payment' });
  }
});

router.delete('/admin/payments/:paymentId', async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.paymentId);
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting payment' });
  }
});

// Add more admin-specific routes as needed

module.exports = router;