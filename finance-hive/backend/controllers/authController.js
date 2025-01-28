const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserPayment = require("../models/UserPayment");
const bcrypt = require("bcryptjs");
const { calculateEMI, generatePaymentSchedule } = require('../utils/calculatePayments');

exports.login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    console.log("\n=== Login Attempt ===");
    console.log("Mobile Number:", mobileNumber);

    // Find user with detailed logging
    const user = await User.findOne({ mobileNumber });
    if (user) {
      console.log("\nUser found:", {
        _id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      });

      // Check if user is active
      if (!user.isActive) {
        console.log("User account is inactive");
        return res.status(403).json({ message: "Account is not active" });
      }

      // Direct password comparison
      if (password === user.password) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.json({
          token,
          role: user.role,
          name: user.name,
          email: user.email,
          redirect: `/${user.role}`,
        });
      }
    }

    // If we get here, either user wasn't found or password didn't match
    console.log("Authentication failed");
    return res.status(401).json({ message: "Invalid credentials" });

  } catch (error) {
    console.error("\nError during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Seed initial admin user
exports.seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ 
      email: 'admin@financehive.com'
    });

    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Finance Hive Admin',
        email: 'admin@financehive.com',
        mobileNumber: '9999999999',
        password: 'admin@fh',
        role: 'admin'
      });

      await adminUser.save();
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;  // Attach user info to the request for further use
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Role-based authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Admin controller for adding admin/organizer users
exports.addUser = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, role } = req.body;

    console.log("\n=== Creating New User ===");
    console.log("Role:", role);
    console.log("Mobile Number:", mobileNumber);

    // Create new user without hashing the password
    const newUser = new User({
      name,
      email,
      mobileNumber,
      password, // Directly storing the plain text password
      role,
      isActive: true
    });

    // Save the user
    await newUser.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Finance Hive Account Credentials',
      html: `
        <h2>Welcome to Finance Hive</h2>
        <p>Your account has been created with the following credentials:</p>
        <p>UserID (Mobile Number): ${mobileNumber}</p>
        <p>Password: ${password}</p>
        <p>Please login and change your password.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully`,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('\nUser creation error:', error);
    res.status(500).json({ 
      message: 'Error adding user', 
      error: error.message 
    });
  }
};


// Get all users (admin and organizer)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      role: { $in: ['admin', 'organizer'] } 
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Error retrieving users', 
      error: error.message 
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'No user found with that ID' 
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Get user details by ID (for User Dashboard)

// Update the getUserById controller to include payment schedule
exports.getUserById = async (req, res) => {
  try {
    const user = await UserPayment.findOne({ _id: req.user.id }).populate("organizerId", "name email");
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If payment schedule doesn't exist, generate it
    if (!user.paymentSchedule || user.paymentSchedule.length === 0) {
      const startDate = new Date();
      const schedule = generatePaymentSchedule(
        user.amountBorrowed,
        user.tenure,
        user.interest,
        startDate
      );
      user.paymentSchedule = schedule;
      user.monthlyEMI = schedule[0].emiAmount;
      await user.save();
    }

    res.status(200).json({
      data: {
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        amountBorrowed: user.amountBorrowed,
        tenure: user.tenure,
        interest: user.interest,
        monthlyEMI: user.monthlyEMI,
        paymentSchedule: user.paymentSchedule,
        organizer: user.organizerId
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details." });
  }
};





exports.addUserAndSendEmail = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, amountBorrowed, tenure, interest, role } = req.body;

    // Ensure role is provided and default to "user" if not
    const userRole = role === 'organizer' || role === 'admin' ? role : 'user';

    // Create User in User collection
    const user = new User({
      name,
      email,
      mobileNumber,
      password,
      role: userRole,
    });
    await user.save();

    // Generate payment schedule
    const startDate = new Date();
    const paymentSchedule = generatePaymentSchedule(
      amountBorrowed,
      tenure,
      interest,
      startDate
    );

    // Calculate monthly EMI
    const monthlyEMI = calculateEMI(amountBorrowed, tenure, interest);

    // Create UserPayment record with payment schedule
    const userPayment = new UserPayment({
      _id: user._id,
      name,
      email,
      mobileNumber,
      password,
      amountBorrowed,
      tenure,
      interest,
      organizerId: req.user.id,
      monthlyEMI,
      paymentSchedule,
      loginCredentials: {
        username: mobileNumber,
        password,
      },
    });
    await userPayment.save();

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to ${userRole === 'organizer' ? 'Organizer' : 'User'} Portal`,
      text: `Hello ${name},\n\nWelcome to our platform! You have been successfully added as a ${userRole}.\n\nYour login credentials are:\n\nMobile Number: ${mobileNumber}\nPassword: ${password}\n\nMonthly EMI: ₹${monthlyEMI}\n\nThank you for joining us!`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(201).json({ 
      message: "User added successfully and email sent!",
      user: userPayment
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Error adding user.", error: error.message });
  }
};





// exports.createUserAndPayment = async (req, res) => {
//    try {
//     const { name, email, mobileNumber, password, amountBorrowed, tenure, interest } = req.body;

//     // Hash the password once
//     const hashedPassword = await hashPassword(password);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       mobileNumber,
//       password: hashedPassword, // Store hashed password
//       role: "organizer", // Example role
//     });

//     // Create user payment with the same hashed password
//     const userPayment = await UserPayment.create({
//       name,
//       email,
//       mobileNumber,
//       password: hashedPassword, // Use the same hashed password
//       amountBorrowed,
//       tenure,
//       interest,
//       organizerId: user._id,
//       loginCredentials: {
//         username: email,
//         password: hashedPassword, // Use the same hashed password
//       },
//     });

//     res.status(201).json({ message: "User and payment created successfully.", user, userPayment });
//   } catch (error) {
//     console.error("Error creating user and payment:", error);
//     res.status(500).json({ message: "Error creating user and payment.", error: error.message });
//   }
// };


// In controllers/authController.js
exports.getUsersByOrganizer = async (req, res) => {
  try {
    const organizerId = req.user.id;  // Get the organizer's ID from the authenticated user
    const users = await UserPayment.find({ organizerId }).select("name email mobileNumber amountBorrowed tenure interest");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users." });
  }
};

  exports.getUserDetails = async (req, res) => {
    try {
      const userId = req.user.id; // User ID from authenticated token
  
      // Find user details in `UserPayment` collection using the same `_id`
      const userDetails = await UserPayment.findById(userId);
      if (!userDetails) {
        return res.status(404).json({ message: "User details not found." });
      }
  
      res.status(200).json({ data: userDetails });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Error fetching user details." });
    }
  };
  

// // Login User

// exports.userLogin = async (req, res) => {
//   try {
//     const { mobileNumber, password } = req.body;

//     // Find the user by mobile number
//     const user = await User.findOne({ mobileNumber });
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Direct password comparison
//     if (password === user.password) {
//       // Generate JWT token
//       const token = jwt.sign(
//         { id: user._id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       res.status(200).json({
//         message: "Login successful.",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           mobileNumber: user.mobileNumber,
//           role: user.role,
//         },
//       });
//     } else {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ message: "Error during login.", error: error.message });
//   }
// };