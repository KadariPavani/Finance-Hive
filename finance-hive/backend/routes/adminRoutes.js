const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Make sure this path is correct
const bcrypt = require('bcryptjs');
const Organizer = require('../models/Organizer');

const auth = require('../middleware/auth'); // Correct import for auth middleware

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

// Route to add an admin
router.post('/admin/add', auth, async (req, res) => {
  try {
    const { email, password, firstName, lastName, userId, mobileNumber, address } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin with this email already exists' 
      });
    }

    // Check if userId already exists
    admin = await Admin.findOne({ userId });
    if (admin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin with this userId already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    admin = new Admin({
      role: 'Admin',
      email,
      firstName,
      lastName,
      userId,
      mobileNumber,
      address,
      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        userId: admin.userId,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error in adding admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding admin'
    });
  }
});

// Route to add an organizer
router.post('/add', auth, async (req, res) => {  // Use 'auth' middleware
  const { email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

  // Basic validation
  if (!email || !firstName || !lastName || !userId || !mobileNumber || !address || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if organizer already exists by email
    const existingOrganizer = await Organizer.findOne({ email });
    if (existingOrganizer) {
      return res.status(400).json({ success: false, message: 'Organizer already exists with this email' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new organizer
    const newOrganizer = new Organizer({
      email,
      firstName,
      lastName,
      userId,
      mobileNumber,
      address,
      password: hashedPassword, // Store hashed password
      role: 'Organizer', // Default role is Organizer
    });

    // Save the organizer to the database
    await newOrganizer.save();

    // Return success response
    res.status(201).json({ success: true, message: 'Organizer added successfully!' });

  } catch (err) {
    console.error('Error adding organizer:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Add more admin-specific routes as needed

module.exports = router;
