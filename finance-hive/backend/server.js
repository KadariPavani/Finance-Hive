// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const cors = require('cors');
// // // const bodyParser = require('body-parser');
// // // const bcrypt = require('bcryptjs');
// // // const jwt = require('jsonwebtoken');
// // // const multer = require('multer');
// // // const path = require('path');
// // // const fs = require('fs');
// // // const { body, validationResult } = require('express-validator');
// // // require('dotenv').config();

// // // const app = express();

// // // // Import models
// // // const PersonalDetails = require('./models/PersonalDetails');
// // // const User = require('./models/User');
// // // const Organizer = require('./models/Organizer');
// // // const Admin = require('./models/Admin');

// // // // MongoDB URI
// // // const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-hive-data';
// // // mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
// // //   .then(() => console.log('MongoDB connected'))
// // //   .catch((err) => console.error('MongoDB connection error:', err));

// // // // Middleware
// // // app.use(cors());
// // // app.use(bodyParser.json());
// // // app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// // // // JWT Secret
// // // const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// // // // Multer setup for file uploads
// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => {
// // //     const uploadDir = './uploads';
// // //     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// // //     cb(null, uploadDir);
// // //   },
// // //   filename: (req, file, cb) => {
// // //     cb(null, `${Date.now()}-${file.originalname}`);
// // //   },
// // // });

// // // const upload = multer({ 
// // //   storage,
// // //   limits: {
// // //     fileSize: 5 * 1024 * 1024 // 5MB limit
// // //   },
// // //   fileFilter: (req, file, cb) => {
// // //     const allowedTypes = /jpeg|jpg|png|pdf/;
// // //     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// // //     const mimetype = allowedTypes.test(file.mimetype);
    
// // //     if (extname && mimetype) {
// // //       return cb(null, true);
// // //     }
// // //     cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'));
// // //   }
// // // });

// // // // JWT Authentication Middleware
// // // const authenticateToken = (req, res, next) => {
// // //   const token = req.headers['authorization']?.split(' ')[1];
// // //   if (!token) return res.sendStatus(401);

// // //   jwt.verify(token, JWT_SECRET, (err, user) => {
// // //     if (err) return res.sendStatus(403);
// // //     req.user = user;
// // //     next();
// // //   });
// // // };

// // // // User Schema and Models
// // // const UserSchema = new mongoose.Schema({
// // //   role: { type: String, required: true },
// // //   email: { type: String, required: true, unique: true },
// // //   firstName: { type: String, required: true },
// // //   lastName: { type: String, required: true },
// // //   userId: { type: String, required: true, unique: true },
// // //   mobileNumber: { type: String, required: true },
// // //   address: { type: String, required: true },
// // //   password: { type: String, required: true },
// // // });

// // // // Role validation function
// // // const validateRole = (role) => ['User', 'Organizer', 'Admin'].includes(role);

// // // // Validation middleware for personal details
// // // const validatePersonalDetails = [
// // //   body('email').isEmail().normalizeEmail(),
// // //   body('phoneNumber').matches(/^\+?[\d\s-]{10,}$/),
// // //   body('dateOfBirth').isDate(),
// // //   body('password').isLength({ min: 8 })
// // //     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
// // //     .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
// // //   body('termsAccepted').equals('true').withMessage('Terms must be accepted'),
// // //   body('idNumber').notEmpty().trim(),
// // //   body('username').isLength({ min: 4 }).trim(),
// // // ];

// // // // Personal Details Route
// // // app.post('/api/personal-details', 
// // //   upload.single('idDocument'),
// // //   validatePersonalDetails,
// // //   async (req, res) => {
// // //     try {
// // //       const errors = validationResult(req);
// // //       if (!errors.isEmpty()) {
// // //         return res.status(400).json({ errors: errors.array() });
// // //       }

// // //       if (!req.file) {
// // //         return res.status(400).json({ message: 'ID document is required' });
// // //       }

// // //       const hashedPassword = await bcrypt.hash(req.body.password, 10);

// // //       const personalDetails = new PersonalDetails({
// // //         ...req.body,
// // //         password: hashedPassword,
// // //         idDocumentPath: req.file.path
// // //       });

// // //       await personalDetails.save();

// // //       res.status(201).json({
// // //         message: 'Personal details saved successfully',
// // //         userId: personalDetails._id
// // //       });

// // //     } catch (error) {
// // //       console.error('Error saving personal details:', error);
      
// // //       if (error.code === 11000) {
// // //         return res.status(400).json({
// // //           message: 'Email or username already exists'
// // //         });
// // //       }

// // //       res.status(500).json({
// // //         message: 'Error saving personal details',
// // //         error: error.message
// // //       });
// // //     }
// // // });

// // // // Signup Route
// // // app.post('/signup', async (req, res) => {
// // //   const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

// // //   try {
// // //     if (!validateRole(role)) return res.status(400).json({ msg: 'Invalid role' });
// // //     if (!/^\d{10}$/.test(mobileNumber)) return res.status(400).json({ msg: 'Invalid phone number. Must be 10 digits.' });
// // //     if (!/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email)) return res.status(400).json({ msg: 'Please use a valid Gmail address.' });

// // //     const hashedPassword = await bcrypt.hash(password, 10);
// // //     const newUser = { role, email, firstName, lastName, userId, mobileNumber, address, password: hashedPassword };
// // //     let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// // //     await userModel.create(newUser);

// // //     res.status(201).json({ msg: 'User registered successfully' });
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error registering user', error: error.message });
// // //   }
// // // });

// // // // Login Route
// // // app.post('/login', async (req, res) => {
// // //   const { role, email, password } = req.body;

// // //   try {
// // //     let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// // //     if (!userModel) return res.status(400).json({ msg: 'Invalid role' });

// // //     const user = await userModel.findOne({ email });
// // //     if (!user) return res.status(401).json({ msg: `No ${role} found with this email.` });

// // //     const isMatch = await bcrypt.compare(password, user.password);
// // //     if (!isMatch) return res.status(401).json({ msg: 'Invalid password' });

// // //     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
// // //     res.status(200).json({ token, role: user.role, userId: user._id });
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error logging in', error: error.message });
// // //   }
// // // });

// // // // Protected route: Get User Details
// // // app.get('/user-details/:userId', authenticateToken, async (req, res) => {
// // //   const { userId } = req.params;

// // //   try {
// // //     let userModel = req.user.role === 'User' ? User : req.user.role === 'Organizer' ? Organizer : Admin;
// // //     const user = await userModel.findById(userId);
// // //     if (!user) return res.status(404).json({ msg: 'User not found' });

// // //     res.json(user);
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error fetching user details', error: error.message });
// // //   }
// // // });

// // // app.get('/api/users/:email', async (req, res) => {
// // //   const { email } = req.params;
// // //   try {
// // //     const user = await User.findOne({ email });
// // //     if (!user) return res.status(404).json({ msg: 'User not found' });
// // //     res.json(user);
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error fetching user email', error: error.message });
// // //   }
// // // });

// // // app.get('/organizer-details/:id', async (req, res) => {
// // //   const { id } = req.params;
// // //   try {
// // //     const organizer = await Organizer.findById(id);
// // //     if (!organizer) return res.status(404).json({ msg: 'Organizer not found' });
// // //     res.json(organizer);
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error fetching organizer details', error: error.message });
// // //   }
// // // });

// // // app.get('/admin-details/:id', async (req, res) => {
// // //   const { id } = req.params;
// // //   try {
// // //     const admin = await Admin.findById(id);
// // //     if (!admin) return res.status(404).json({ msg: 'Admin not found' });
// // //     res.json(admin);
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error fetching Admin details', error: error.message });
// // //   }
// // // });

// // // // Get All Users (Admin only)
// // // app.get('/all-users', authenticateToken, async (req, res) => {
// // //   if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Access denied' });

// // //   try {
// // //     const users = await User.find();
// // //     const organizers = await Organizer.find();
// // //     const admins = await Admin.find();
// // //     res.json({ users, organizers, admins });
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error fetching users', error: error.message });
// // //   }
// // // });

// // // // Loan Routes
// // // const loanRoutes = require('./routes/LoanRoutes');
// // // app.use('/api/loans', loanRoutes);

// // // // Payment Route for Updating Status
// // // app.put('/api/loans/payment/:loanId/:sno', authenticateToken, upload.single('screenshot'), async (req, res) => {
// // //   const { loanId, sno } = req.params;
// // //   const { transactionId } = req.body;
// // //   const screenshot = req.file ? req.file.path : null;

// // //   try {
// // //     const loan = await Loan.findOneAndUpdate(
// // //       { _id: loanId, 'paymentSchedule.sno': parseInt(sno) },
// // //       {
// // //         $set: {
// // //           'paymentSchedule.$.transactionId': transactionId,
// // //           'paymentSchedule.$.status': 'Done',
// // //           'paymentSchedule.$.screenshot': screenshot,
// // //         },
// // //       }
// // //     );

// // //     if (loan) {
// // //       res.json({ message: 'Payment updated successfully' });
// // //     } else {
// // //       res.status(404).json({ error: 'Loan or payment not found' });
// // //     }
// // //   } catch (error) {
// // //     res.status(500).json({ error: 'Error updating payment status', error: error.message });
// // //   }
// // // });

// // // // Error handling middleware
// // // app.use((error, req, res, next) => {
// // //   if (error instanceof multer.MulterError) {
// // //     if (error.code === 'LIMIT_FILE_SIZE') {
// // //       return res.status(400).json({
// // //         message: 'File size is too large. Maximum size is 5MB'
// // //       });
// // //     }
// // //   }
// // //   res.status(500).json({
// // //     message: error.message || 'An unknown error occurred'
// // //   });
// // // });

// // // // Start server
// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const cors = require('cors');
// // // const bodyParser = require('body-parser');
// // // const bcrypt = require('bcryptjs');
// // // const jwt = require('jsonwebtoken');
// // // const multer = require('multer');
// // // const path = require('path');
// // // const fs = require('fs');
// // // require('dotenv').config();

// // // const app = express();

// // // // MongoDB URI
// // // const mongoURI = process.env.MONGO_URI;
// // // mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
// // //   .then(() => console.log('MongoDB connected'))
// // //   .catch((err) => console.error('MongoDB connection error:', err));

// // // // Middleware
// // // app.use(cors());
// // // app.use(bodyParser.json());
// // // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // // JWT Secret
// // // const JWT_SECRET = process.env.JWT_SECRET;

// // // // JWT Authentication Middleware
// // // const authenticateToken = (req, res, next) => {
// // //   const token = req.headers['authorization']?.split(' ')[1];
// // //   if (!token) return res.sendStatus(401);

// // //   jwt.verify(token, JWT_SECRET, (err, user) => {
// // //     if (err) return res.sendStatus(403);
// // //     req.user = user;
// // //     next();
// // //   });
// // // };

// // // // User Schema and Models
// // // const UserSchema = new mongoose.Schema({
// // //   role: { type: String, required: true },
// // //   email: { type: String, required: true, unique: true },
// // //   firstName: { type: String, required: true },
// // //   lastName: { type: String, required: true },
// // //   userId: { type: String, required: true, unique: true },
// // //   mobileNumber: { type: String, required: true },
// // //   address: { type: String, required: true },
// // //   password: { type: String, required: true },
// // // });

// // // const User = mongoose.model('User', UserSchema);
// // // const Organizer = mongoose.model('Organizer', UserSchema);
// // // const Admin = mongoose.model('Admin', UserSchema);

// // // // Multer setup for file uploads
// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => {
// // //     const uploadDir = './uploads';
// // //     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// // //     cb(null, uploadDir);
// // //   },
// // //   filename: (req, file, cb) => {
// // //     cb(null, `${Date.now()}-${file.originalname}`);
// // //   },
// // // });
// // // const upload = multer({ storage });

// // // // Role validation function
// // // const validateRole = (role) => ['User', 'Organizer', 'Admin'].includes(role);

// // // // Routes
// // // app.post('/signup', async (req, res) => {
// // //   const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

// // //   try {
// // //     if (!validateRole(role)) return res.status(400).json({ msg: 'Invalid role' });
// // //     if (!/^\d{10}$/.test(mobileNumber)) return res.status(400).json({ msg: 'Invalid phone number. Must be 10 digits.' });
// // //     if (!/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email)) return res.status(400).json({ msg: 'Please use a valid Gmail address.' });

// // //     const hashedPassword = await bcrypt.hash(password, 10);
// // //     const newUser = { role, email, firstName, lastName, userId, mobileNumber, address, password: hashedPassword };
// // //     const userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// // //     await userModel.create(newUser);

// // //     res.status(201).json({ msg: 'User registered successfully' });
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error registering user', error: error.message });
// // //   }
// // // });

// // // app.post('/login', async (req, res) => {
// // //   const { role, email, password } = req.body;

// // //   try {
// // //     const userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// // //     if (!userModel) return res.status(400).json({ msg: 'Invalid role' });

// // //     const user = await userModel.findOne({ email });
// // //     if (!user) return res.status(401).json({ msg: `No ${role} found with this email.` });

// // //     const isMatch = await bcrypt.compare(password, user.password);
// // //     if (!isMatch) return res.status(401).json({ msg: 'Invalid password' });

// // //     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
// // //     res.status(200).json({ token, role: user.role, userId: user._id });
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error logging in', error: error.message });
// // //   }
// // // });

// // // // Protected routes
// // // app.get('/user-details/:userId', authenticateToken, async (req, res) => {
// // //   const { userId } = req.params;

// // //   try {
// // //     const userModel = req.user.role === 'User' ? User : req.user.role === 'Organizer' ? Organizer : Admin;
// // //     const user = await userModel.findById(userId);
// // //     if (!user) return res.status(404).json({ msg: 'User not found' });

// // //     res.json(user);
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error fetching user details', error: error.message });
// // //   }
// // // });

// // // app.get('/all-users', authenticateToken, async (req, res) => {
// // //   if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Access denied' });

// // //   try {
// // //     const users = await User.find();
// // //     const organizers = await Organizer.find();
// // //     const admins = await Admin.find();
// // //     res.json({ users, organizers, admins });
// // //   } catch (error) {
// // //     res.status(500).json({ msg: 'Error fetching users', error: error.message });
// // //   }
// // // });

// // // // Start server
// // // const PORT = process.env.PORT;
// // // app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');
// // const { body, validationResult } = require('express-validator');
// // require('dotenv').config();

// // const app = express();

// // // Import models
// // const PersonalDetails = require('./models/PersonalDetails');
// // const User = require('./models/User');
// // const Organizer = require('./models/Organizer');
// // const Admin = require('./models/Admin');
// // const Loan = require('./models/Loan'); // Import Loan model if needed

// // // MongoDB URI
// // const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-hive-data';
// // mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('MongoDB connected'))
// //   .catch((err) => console.error('MongoDB connection error:', err));

// // // Middleware
// // app.use(cors());
// // app.use(bodyParser.json());
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// // // JWT Secret
// // const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// // // Multer setup for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const uploadDir = './uploads';
// //     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// //     cb(null, uploadDir);
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${Date.now()}-${file.originalname}`);
// //   },
// // });

// // const upload = multer({ 
// //   storage,
// //   limits: {
// //     fileSize: 5 * 1024 * 1024 // 5MB limit
// //   },
// //   fileFilter: (req, file, cb) => {
// //     const allowedTypes = /jpeg|jpg|png|pdf/;
// //     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// //     const mimetype = allowedTypes.test(file.mimetype);
    
// //     if (extname && mimetype) {
// //       return cb(null, true);
// //     }
// //     cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
// //   }
// // });

// // // JWT Authentication Middleware
// // const authenticateToken = (req, res, next) => {
// //   const token = req.headers['authorization']?.split(' ')[1];
// //   if (!token) return res.sendStatus(401);

// //   jwt.verify(token, JWT_SECRET, (err, user) => {
// //     if (err) return res.sendStatus(403);
// //     req.user = user;
// //     next();
// //   });
// // };

// // // Validation middleware for personal details
// // const validatePersonalDetails = [
// //   body('email').isEmail().normalizeEmail(),
// //   body('phoneNumber').matches(/^\+?[\d\s-]{10,}$/),
// //   body('dateOfBirth').isDate(),
// //   body('password').isLength({ min: 8 })
// //     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
// //     .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
// //   body('termsAccepted').equals('true').withMessage('Terms must be accepted'),
// //   body('idNumber').notEmpty().trim(),
// //   body('username').isLength({ min: 4 }).trim(),
// // ];

// // // Personal Details Route
// // app.post('/api/personal-details', 
// //   upload.single('idDocument'),
// //   validatePersonalDetails,
// //   async (req, res) => {
// //     try {
// //       const errors = validationResult(req);
// //       if (!errors.isEmpty()) {
// //         return res.status(400).json({ errors: errors.array() });
// //       }

// //       if (!req.file) {
// //         return res.status(400).json({ message: 'ID document is required' });
// //       }

// //       const hashedPassword = await bcrypt.hash(req.body.password, 10);

// //       const personalDetails = new PersonalDetails({
// //         ...req.body,
// //         password: hashedPassword,
// //         idDocumentPath: req.file.path
// //       });

// //       await personalDetails.save();

// //       res.status(201).json({
// //         message: 'Personal details saved successfully',
// //         userId: personalDetails._id
// //       });

// //     } catch (error) {
// //       console.error('Error saving personal details:', error);
      
// //       if (error.code === 11000) {
// //         return res.status(400).json({
// //           message: 'Email or username already exists'
// //         });
// //       }

// //       res.status(500).json({
// //         message: 'Error saving personal details',
// //         error: error.message
// //       });
// //     }
// // });

// // // Signup Route
// // app.post('/signup', async (req, res) => {
// //   const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

// //   try {
// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const newUser = { role, email, firstName, lastName, userId, mobileNumber, address, password: hashedPassword };
// //     let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// //     await userModel.create(newUser);

// //     res.status(201).json({ msg: 'User registered successfully' });
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error registering user', error: error.message });
// //   }
// // });

// // // Login Route
// // app.post('/login', async (req, res) => {
// //   const { role, email, password } = req.body;

// //   try {
// //     let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// //     const user = await userModel.findOne({ email });
// //     if (!user) return res.status(401).json({ msg: `No ${role} found with this email.` });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ msg: 'Invalid password' });

// //     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
// //     res.status(200).json({ token, role: user.role, userId: user._id });
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error logging in', error: error.message });
// //   }
// // });

// // // Protected route: Get User Details
// // app.get('/user-details/:userId', authenticateToken, async (req, res) => {
// //   const { userId } = req.params;

// //   try {
// //     let userModel = req.user.role === 'User' ? User : req.user.role === 'Organizer' ? Organizer : Admin;
// //     const user = await userModel.findById(userId);
// //     if (!user) return res.status(404).json({ msg: 'User not found' });

// //     res.json(user);
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error fetching user details', error: error.message });
// //   }
// // });

// // app.get('/organizer-details/:id', async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     const organizer = await Organizer.findById(id);
// //     if (!organizer) return res.status(404).json({ msg: 'Organizer not found' });
// //     res.json(organizer);
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error fetching organizer details', error: error.message });
// //   }
// // });

// // app.get('/admin-details/:id', async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     const admin = await Admin.findById(id);
// //     if (!admin) return res.status(404).json({ msg: 'Admin not found' });
// //     res.json(admin);
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error fetching Admin details', error: error.message });
// //   }
// // });


// // // Loan Routes
// // const loanRoutes = require('./routes/LoanRoutes');
// // app.use('/api/loans', loanRoutes);

// // // Payment Route
// // app.put('/api/loans/payment/:loanId/:sno', authenticateToken, upload.single('screenshot'), async (req, res) => {
// //   const { loanId, sno } = req.params;
// //   const { transactionId } = req.body;
// //   const screenshot = req.file ? req.file.path : null;

// //   try {
// //     const loan = await Loan.findOneAndUpdate(
// //       { _id: loanId, 'paymentSchedule.sno': parseInt(sno) },
// //       {
// //         $set: {
// //           'paymentSchedule.$.transactionId': transactionId,
// //           'paymentSchedule.$.status': 'Done',
// //           'paymentSchedule.$.screenshot': screenshot,
// //         },
// //       }
// //     );

// //     if (loan) {
// //       res.json({ message: 'Payment updated successfully' });
// //     } else {
// //       res.status(404).json({ error: 'Loan or payment not found' });
// //     }
// //   } catch (error) {
// //     res.status(500).json({ error: 'Error updating payment status', error: error.message });
// //   }
// // });

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// const app = express();

// // MongoDB URI
// const mongoURI = process.env.MONGO_URI || 'finance-hive-data';
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// // JWT Secret
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// // JWT Authentication Middleware
// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// // User Schema and Models
// const UserSchema = new mongoose.Schema({
//   role: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   userId: { type: String, required: true, unique: true },
//   mobileNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model('User', UserSchema);
// const Organizer = mongoose.model('Organizer', UserSchema);
// const Admin = mongoose.model('Admin', UserSchema);

// // Multer setup for file uploads (screenshots)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = './uploads';
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // Role validation function
// const validateRole = (role) => ['User', 'Organizer', 'Admin'].includes(role);

// // Signup Route
// app.post('/signup', async (req, res) => {
//   const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

//   try {
//     if (!validateRole(role)) return res.status(400).json({ msg: 'Invalid role' });
//     if (!/^\d{10}$/.test(mobileNumber)) return res.status(400).json({ msg: 'Invalid phone number. Must be 10 digits.' });
//     if (!/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email)) return res.status(400).json({ msg: 'Please use a valid Gmail address.' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = { role, email, firstName, lastName, userId, mobileNumber, address, password: hashedPassword };
//     let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
//     await userModel.create(newUser);

//     res.status(201).json({ msg: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Error registering user', error: error.message });
//   }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//   const { role, email, password } = req.body;

//   try {
//     let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
//     if (!userModel) return res.status(400).json({ msg: 'Invalid role' });

//     const user = await userModel.findOne({ email });
//     if (!user) return res.status(401).json({ msg: `No ${role} found with this email.` });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ msg: 'Invalid password' });

//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token, role: user.role, userId: user._id });
//   } catch (error) {
//     res.status(500).json({ msg: 'Error logging in', error: error.message });
//   }
// });

// // Protected route: Get User Details
// app.get('/user-details/:userId', authenticateToken, async (req, res) => {
//   const { userId } = req.params;

//   try {
//     let userModel = req.user.role === 'User' ? User : req.user.role === 'Organizer' ? Organizer : Admin;
//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching user details', error: error.message });
//   }
// });

// app.get('/api/users/:email', async (req, res) => {
//   const { email } = req.params;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ msg: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching user email', error: error.message });
//   }
// });

// app.get('/organizer-details/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const organizer = await Organizer.findById(id);
//     if (!organizer) return res.status(404).json({ msg: 'Organizer not found' });
//     res.json(organizer);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching organizer details', error: error.message });
//   }
// });

// app.get('/admin-details/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const admin = await Organizer.findById(id);
//     if (!admin) return res.status(404).json({ msg: 'Admin not found' });
//     res.json(admin);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching Admin details', error: error.message });
//   }
// });


// // Get All Users (Admin only)
// app.get('/all-users', authenticateToken, async (req, res) => {
//   if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Access denied' });

//   try {
//     const users = await User.find();
//     const organizers = await Organizer.find();
//     const admins = await Admin.find();
//     res.json({ users, organizers, admins });
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching users', error: error.message });
//   }
// });

// const personalDetailsRoutes = require('./routes/PersonalDetailsRoutes');

// // Use PersonalDetails routes
// app.use('/api/personal-details', personalDetailsRoutes);


// // Loan Routes
// const loanRoutes = require('./routes/LoanRoutes');
// app.use('/api/loans', loanRoutes);

// // Payment Route for Updating Status
// app.put('/api/loans/payment/:loanId/:sno', authenticateToken, upload.single('screenshot'), async (req, res) => {
//   const { loanId, sno } = req.params;
//   const { transactionId } = req.body;
//   const screenshot = req.file ? req.file.path : null;

//   try {
//     const loan = await Loan.findOneAndUpdate(
//       { _id: loanId, 'paymentSchedule.sno': parseInt(sno) },
//       {
//         $set: {
//           'paymentSchedule.$.transactionId': transactionId,
//           'paymentSchedule.$.status': 'Done',
//           'paymentSchedule.$.screenshot': screenshot,
//         },
//       }
//     );

//     if (loan) {
//       res.json({ message: 'Payment updated successfully' });
//     } else {
//       res.status(404).json({ error: 'Loan or payment not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating payment status', error: error.message });
//   }
// });

// // Start server
// const PORT = process.env.PORT ;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));


// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');
// // require('dotenv').config();

// // const app = express();

// // // MongoDB URI
// // const mongoURI = process.env.MONGO_URI;
// // mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('MongoDB connected'))
// //   .catch((err) => console.error('MongoDB connection error:', err));

// // // Middleware
// // app.use(cors());
// // app.use(bodyParser.json());
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // JWT Secret
// // const JWT_SECRET = process.env.JWT_SECRET;

// // // JWT Authentication Middleware
// // const authenticateToken = (req, res, next) => {
// //   const token = req.headers['authorization']?.split(' ')[1];
// //   if (!token) return res.sendStatus(401);

// //   jwt.verify(token, JWT_SECRET, (err, user) => {
// //     if (err) return res.sendStatus(403);
// //     req.user = user;
// //     next();
// //   });
// // };

// // // User Schema and Models
// // const UserSchema = new mongoose.Schema({
// //   role: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   firstName: { type: String, required: true },
// //   lastName: { type: String, required: true },
// //   userId: { type: String, required: true, unique: true },
// //   mobileNumber: { type: String, required: true },
// //   address: { type: String, required: true },
// //   password: { type: String, required: true },
// // });

// // const User = mongoose.model('User', UserSchema);
// // const Organizer = mongoose.model('Organizer', UserSchema);
// // const Admin = mongoose.model('Admin', UserSchema);

// // // Multer setup for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const uploadDir = './uploads';
// //     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// //     cb(null, uploadDir);
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${Date.now()}-${file.originalname}`);
// //   },
// // });
// // const upload = multer({ storage });

// // // Role validation function
// // const validateRole = (role) => ['User', 'Organizer', 'Admin'].includes(role);

// // // Routes
// // app.post('/signup', async (req, res) => {
// //   const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

// //   try {
// //     if (!validateRole(role)) return res.status(400).json({ msg: 'Invalid role' });
// //     if (!/^\d{10}$/.test(mobileNumber)) return res.status(400).json({ msg: 'Invalid phone number. Must be 10 digits.' });
// //     if (!/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email)) return res.status(400).json({ msg: 'Please use a valid Gmail address.' });

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const newUser = { role, email, firstName, lastName, userId, mobileNumber, address, password: hashedPassword };
// //     const userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// //     await userModel.create(newUser);

// //     res.status(201).json({ msg: 'User registered successfully' });
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error registering user', error: error.message });
// //   }
// // });

// // app.post('/login', async (req, res) => {
// //   const { role, email, password } = req.body;

// //   try {
// //     const userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
// //     if (!userModel) return res.status(400).json({ msg: 'Invalid role' });

// //     const user = await userModel.findOne({ email });
// //     if (!user) return res.status(401).json({ msg: `No ${role} found with this email.` });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ msg: 'Invalid password' });

// //     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
// //     res.status(200).json({ token, role: user.role, userId: user._id });
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error logging in', error: error.message });
// //   }
// // });

// // // Protected routes
// // app.get('/user-details/:userId', authenticateToken, async (req, res) => {
// //   const { userId } = req.params;

// //   try {
// //     const userModel = req.user.role === 'User' ? User : req.user.role === 'Organizer' ? Organizer : Admin;
// //     const user = await userModel.findById(userId);
// //     if (!user) return res.status(404).json({ msg: 'User not found' });

// //     res.json(user);
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error fetching user details', error: error.message });
// //   }
// // });

// // app.get('/all-users', authenticateToken, async (req, res) => {
// //   if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Access denied' });

// //   try {
// //     const users = await User.find();
// //     const organizers = await Organizer.find();
// //     const admins = await Admin.find();
// //     res.json({ users, organizers, admins });
// //   } catch (error) {
// //     res.status(500).json({ msg: 'Error fetching users', error: error.message });
// //   }
// // });

// // // Start server
// // const PORT = process.env.PORT;
// // app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const userRoutes = require('./routes/userRoutes');
// MongoDB URI
const mongoURI = process.env.MONGO_URI || 'finance-hive-data';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON data

// Use the user routes
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

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
});

// Check if models are already defined to avoid overwriting
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', UserSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', UserSchema);

// Multer setup for file uploads (screenshots)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Role validation function
const validateRole = (role) => ['User', 'Organizer', 'Admin'].includes(role);

// Signup Route
app.post('/signup', async (req, res) => {
  const { role, email, firstName, lastName, userId, mobileNumber, address, password } = req.body;

  try {
    if (!validateRole(role)) return res.status(400).json({ msg: 'Invalid role' });
    if (!/^\d{10}$/.test(mobileNumber)) return res.status(400).json({ msg: 'Invalid phone number. Must be 10 digits.' });
    if (!/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email)) return res.status(400).json({ msg: 'Please use a valid Gmail address.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { role, email, firstName, lastName, userId, mobileNumber, address, password: hashedPassword };
    let userModel = role === 'User' ? User : role === 'Organizer' ? Organizer : Admin;
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

// Loan Routes
const loanRoutes = require('./routes/LoanRoutes');
app.use('/api/loans', loanRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
