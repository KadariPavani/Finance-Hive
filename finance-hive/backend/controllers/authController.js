const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Find user by mobile number
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Send response based on role
    res.json({ 
      token, 
      role: user.role,
      redirect: `/${user.role}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Seed initial admin user
exports.seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ 
      mobileNumber: '9347132534', 
      role: 'admin' 
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin@fh', 10);
      
      const adminUser = new User({
        mobileNumber: '9347132534',
        password: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      console.log('Admin user seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};