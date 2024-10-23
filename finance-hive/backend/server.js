
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // For loading environment variables

// MongoDB URI
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-hive-data';
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

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

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

    let userModel;
    if (role === 'User') {
      userModel = User;
    } else if (role === 'Organizer') {
      userModel = Organizer;
    } else if (role === 'Admin') {
      userModel = Admin;
    } else {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    await userModel.create(newUser);
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error registering user', error: error.message });
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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Error logging in', error: error.message });
  }
});

// Get User Details Route
app.get('/user-details', authenticateToken, async (req, res) => {
  try {
    let userData;
    if (req.user.role === 'User') {
      userData = await User.findById(req.user.id);
    } else if (req.user.role === 'Organizer') {
      userData = await Organizer.findById(req.user.id);
    } else if (req.user.role === 'Admin') {
      userData = await Admin.findById(req.user.id);
    }

    if (!userData) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



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
