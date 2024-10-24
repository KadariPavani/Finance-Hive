const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// MongoDB URI from environment or default to localhost
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-hive-data';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define User Schema
const UserSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

// Models for User, Organizer, Admin based on role
const User = mongoose.model('User', UserSchema);
const Organizer = mongoose.model('Organizer', UserSchema);
const Admin = mongoose.model('Admin', UserSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
  if (!token) return res.sendStatus(401); // Unauthorized if no token provided

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if invalid token
    req.user = user;
    next();
  });
};

// Role validation function
const validateRole = (role) => ['User', 'Organizer', 'Admin'].includes(role);

// Signup Route
app.post('/signup', async (req, res) => {
  const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

  try {
    if (!validateRole(role)) return res.status(400).json({ msg: 'Invalid role' });

    // Validate mobile number and email
    if (!/^\d{10}$/.test(mobileNumber)) return res.status(400).json({ msg: 'Invalid phone number. Must be 10 digits.' });
    if (!/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email)) return res.status(400).json({ msg: 'Please use a valid Gmail address.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = { role, email, firstName, lastName, userId, mobileNumber, address, password: hashedPassword };
    let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;

    // Save user
    await userModel.create(newUser);
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error registering user', error: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { role, email, password } = req.body;

  try {
    let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : role === 'Admin' ? Admin : null;
    if (!userModel) return res.status(400).json({ msg: 'Invalid role' });

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ msg: `No ${role} found with this email.` });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid password' });

    // Generate JWT token
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
    // Determine the correct model based on the user's role
    let userModel = req.user.role === 'User' ? User : req.user.role === 'Organizer' ? Organizer : Admin;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user details', error: error.message });
  }
});

// Get All Users (Admin only)
app.get('/all-users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Access denied' });

  try {
    const users = await User.find();
    const organizers = await Organizer.find();
    const admins = await Admin.find();
    res.json({ users, organizers, admins });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users', error: error.message });
  }
});

// Import organizer routes and use them
const organizerRoutes = require('./routes/organizerRoutes');
// Import admin routes and use them
const adminRoutes = require('./routes/adminRoutes');

// Use organizer and admin routes and protect with JWT middleware
app.use('/organizer-details', authenticateToken, organizerRoutes);
app.use('/admin-details', authenticateToken, adminRoutes); // Protect admin routes with JWT middleware

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

/*
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017/finance-hive-data'; // Use your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// User Schemas
const UserSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const Organizer = mongoose.model('Organizer', UserSchema);
const Admin = mongoose.model('Admin', UserSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      role,
      email,
      firstName,
      lastName,
      userId,
      mobileNumber,
      address,
      password: hashedPassword,
    };

    if (role === 'User') {
      await User.create(newUser);
    } else if (role === 'Organizer') {
      await Organizer.create(newUser);
    } else if (role === 'Admin') {
      await Admin.create(newUser);
    }

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error registering user' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }) || await Organizer.findOne({ email }) || await Admin.findOne({ email });
    
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Error logging in' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
*/