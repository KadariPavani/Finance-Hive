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

// Add more admin-specific routes as needed

module.exports = router;
