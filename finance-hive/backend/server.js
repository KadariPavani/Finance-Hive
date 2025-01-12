const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const adminRoutes = require('./routes/adminRoutes');
const jwt = require('jsonwebtoken');
const notificationRoutes = require('./routes/notificationRoutes');
const multer = require('multer');
const personalDetailsRoutes = require('./routes/PersonalDetailsRoutes');
const expensesRoute = require('./routes/expensesRoutes');
const savings = require('./routes/savingsroute');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { transferDonePayments } =require('./routes/LoanRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Import profile routes
const app = express();
const userRoutes = require('./routes/userRoutes');
const Transaction = require('./routes/transactionroutes');
// MongoDB URI
const mongoURI = process.env.MONGO_URI || 'finance-hive-data';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the user routes
app.use('/api/expenses', expensesRoute);
app.use('/api/savings', savings);
app.use('/notifications', notificationRoutes);
app.use('/api/transactions', Transaction);
app.use('/personal-details', personalDetailsRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use('/api/admin', adminRoutes);
app.use('/api/organizer', adminRoutes);
app.use('/api/profiles', profileRoutes); // Use profile routes
// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Schema and Models
const UserSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  loginCount: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', UserSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', UserSchema);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'payment_screenshots/');  // Folder where screenshots will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Generate a unique filename based on timestamp
  },
});
const paymentRoutes = require('./routes/paymentRoutes');
app.use(paymentRoutes);

const upload = multer({ storage });


// Role validation function
const validateRole = (role) => ['User', 'Organizer', 'Admin'].includes(role);

app.post('/signup', async (req, res) => {
  const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

  try {
    // Validation checks
    if (!validateRole(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }
    
    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ msg: 'Invalid phone number. Must be 10 digits.' });
    }
    
    if (!/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email)) {
      return res.status(400).json({ msg: 'Please use a valid Gmail address.' });
    }

    // Check if user already exists
    let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
    const existingUser = await userModel.findOne({ 
      $or: [{ email }, { userId }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        msg: 'User already exists with this email or userId' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await userModel.create({
      role,
      email,
      firstName,
      lastName,
      userId,
      mobileNumber,
      address,
      password: hashedPassword
    });

    res.status(201).json({ 
      msg: 'User registered successfully',
      userId: newUser._id 
    });

  } catch (error) {
    console.error('Signup Error:', error);
    
    // More specific error handling
    if (error.code === 11000) {
      return res.status(400).json({ 
        msg: 'Duplicate key error. Email or userId already exists.' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Invalid data provided',
        details: error.message 
      });
    }

    res.status(500).json({ 
      msg: 'Error registering user', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    msg: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
// Validation middleware
const validateSignupInput = (req, res, next) => {
  const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

  if (!role || !email || !firstName || !lastName || !userId || !mobileNumber || !address || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  next();
};
// Login Route
app.post('/login', async (req, res) => {
  const { role, email, password } = req.body;

  try {
    let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
    if (!userModel) return res.status(400).json({ msg: 'Invalid role' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ msg: `No ${role} found with this email.` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role, userId: user._id });
  } catch (error) {
    res.status(500).json({ msg: 'Error logging in', error: error.message });
  }
});

// Protected route: Get User Details
app.get('/user-details/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    let userModel = req.user.role === 'User' ? User : req.user.role === 'Organizer' ? Organizer : Admin;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user details', error: error.message });
  }
});

// Validate Email Route (Check if email exists in users collection)
app.get('/api/users/validate-email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'Email found, form can be filled' });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user email', error: error.message });
  }
});


app.get('/organizer-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const organizer = await Organizer.findById(id);
    if (!organizer) return res.status(404).json({ msg: 'Organizer not found' });
    res.json(organizer);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching organizer details', error: error.message });
  }
});

app.get('/admin-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id); // Corrected to use the Admin model
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching Admin details', error: error.message });
  }
});

// Fetch login counts for all roles (Admin only)
app.get('/login-count', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied: Only admins can access this data' });
  }

  try {
    const userLoginCount = await User.aggregate([{ $group: { _id: null, totalLogins: { $sum: '$loginCount' } } }]);
    const organizerLoginCount = await Organizer.aggregate([{ $group: { _id: null, totalLogins: { $sum: '$loginCount' } } }]);
    const adminLoginCount = await Admin.aggregate([{ $group: { _id: null, totalLogins: { $sum: '$loginCount' } } }]);

    res.status(200).json({
      userLogins: userLoginCount[0]?.totalLogins || 0,
      organizerLogins: organizerLoginCount[0]?.totalLogins || 0,
      adminLogins: adminLoginCount[0]?.totalLogins || 0,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching login counts', error: error.message });
  }
});
// Fetch signup counts for all roles (Admin only)
app.get('/signup-count', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied: Only admins can access this data' });
  }

  try {
    const userCount = await User.countDocuments();
    const organizerCount = await Organizer.countDocuments();
    const adminCount = await Admin.countDocuments();

    res.status(200).json({
      userSignups: userCount,
      organizerSignups: organizerCount,
      adminSignups: adminCount,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching signup counts', error: error.message });
  }
});



app.get('/all-users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Access denied' });

  try {
    const users = await User.find({}, 'firstName lastName email role mobileNumber address userId');
    const organizers = await Organizer.find({}, 'firstName lastName email role mobileNumber address userId');
    const admins = await Admin.find({}, 'firstName lastName email role mobileNumber address userId');

    res.json({ users, organizers, admins });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users', error: error.message });
  }
});




// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





// Loan Routes
const loanRoutes = require('./routes/LoanRoutes');
app.use('/api/loans', loanRoutes);

const organizationRoutes = require('./routes/organizerRoutes');
app.use('/api/organization', organizationRoutes);
//settings
const settingsRoutes = require('./routes/settingRoutes');
app.use('/api/settings', settingsRoutes);

//fedback
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);


// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
