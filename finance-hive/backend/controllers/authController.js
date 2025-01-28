const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserPayment = require("../models/UserPayment");

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

// Middleware for authentication

// exports.protect = async (req, res, next) => {
//   try {
//     // Check if Authorization header exists
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       console.error('No Authorization header');
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     // Extract token
//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       console.error('Token not found in Authorization header');
//       return res.status(401).json({ message: 'Token not found' });
//     }

//     // Verify token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (verifyError) {
//       console.error('Token verification error:', verifyError.message);
//       return res.status(401).json({ message: 'Invalid token' });
//     }

//     // Check if user exists
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//       console.error('User not found for token');
//       return res.status(401).json({ message: 'User no longer exists' });
//     }

//     // Attach user to request
//     req.user = currentUser;
//     next();
//   } catch (error) {
//     console.error('Protection middleware error:', error);
//     res.status(500).json({ message: 'Authentication error', error: error.message });
//   }
// };

// In middleware/auth.js

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

// exports.addUser = async (req, res) => {
//   try {
//     const { name, email, mobileNumber, password, role } = req.body;

//     // Detailed input validation
//     console.log('Received add user request:', { name, email, mobileNumber, role });

//     // Validate all fields
//     if (!name || !email || !mobileNumber || !password || !role) {
//       return res.status(400).json({ 
//         message: 'All fields are required',
//         missingFields: {
//           name: !name,
//           email: !email,
//           mobileNumber: !mobileNumber,
//           password: !password,
//           role: !role
//         }
//       });
//     }

//     // Role validation
//     if (!['admin', 'organizer'].includes(role)) {
//       return res.status(400).json({ message: 'Invalid role' });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({
//       $or: [
//         { email },
//         { mobileNumber }
//       ]
//     });

//     if (existingUser) {
//       return res.status(400).json({ 
//         message: 'User with this email or mobile number already exists',
//         existingField: existingUser.email === email ? 'email' : 'mobileNumber'
//       });
//     }

//     // Create and save new user
//     const newUser = new User({
//       name,
//       email,
//       mobileNumber,
//       password,
//       role
//     });

//     await newUser.save();

//     res.status(201).json({ 
//       message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully`,
//       user: {
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role
//       }
//     });
//   } catch (error) {
//     console.error('Full user creation error:', error);
    
//     // Handle specific mongoose validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ 
//         message: 'Validation Error', 
//         errors: validationErrors 
//       });
//     }

//     res.status(500).json({ 
//       message: 'Error adding user', 
//       error: error.message 
//     });
//   }
// };


// Email configuration


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Admin controller for adding admin/organizer users
// In your user creation controller (for creating organizers)
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

// Modified login controller with additional logging
// exports.login = async (req, res) => {
//   try {
//     const { mobileNumber, password } = req.body;
//     console.log("\n=== Login Attempt ===");
//     console.log("Mobile Number:", mobileNumber);

//     // Find user with more detailed logging
//     const user = await User.findOne({ mobileNumber });
//     if (user) {
//       console.log("\nUser details:", {
//         _id: user._id,
//         name: user.name,
//         role: user.role,
//         isActive: user.isActive,
//         hashedPasswordLength: user.password?.length
//       });

//       // Check if user is active
//       if (!user.isActive) {
//         console.log("User account is inactive");
//         return res.status(403).json({ message: "Account is not active" });
//       }

//       // Test password comparison
//       const isMatch = await bcrypt.compare(password, user.password);
//       console.log("Password comparison result:", isMatch);

//       if (isMatch) {
//         // Update last login
//         user.lastLogin = new Date();
//         await user.save();

//         const token = jwt.sign(
//           {
//             id: user._id,
//             role: user.role,
//             name: user.name,
//             email: user.email,
//           },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );

//         return res.json({
//           token,
//           role: user.role,
//           name: user.name,
//           email: user.email,
//           redirect: `/${user.role}`,
//         });
//       }
//     }

//     // If we get here, either user wasn't found or password didn't match
//     console.log("Authentication failed");
//     return res.status(401).json({ message: "Invalid credentials" });

//   } catch (error) {
//     console.error("\nError during login:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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




//   try {
//     const { id } = req.params;
//     const { name, email, mobileNumber, role, isActive } = req.body;

//     // Find user by ID
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user fields
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (mobileNumber) user.mobileNumber = mobileNumber;
//     if (role) user.role = role;
//     if (isActive !== undefined) user.isActive = isActive;

//     await user.save();

//     res.status(200).json({ 
//       message: 'User updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         isActive: user.isActive
//       }
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ 
//       message: 'Error updating user', 
//       error: error.message 
//     });
//   }
// };

// exports.deleteUser = async (req, res) => {


//   try {
//     const { id } = req.params;

//     // Find and delete user
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ 
//       message: 'User deleted successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ 
//       message: 'Error deleting user', 
//       error: error.message 
//     });
//   }
// };




// Add user and send email


// exports.addUserAndSendEmail = async (req, res) => {
//   try {
//     const { name, email, mobileNumber, password, amountBorrowed, tenure, interest } = req.body;

//     // Check if the user already exists
//     const existingUser = await UserPayment.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists." });
//     }

//     // Create user
//     const newUser = await UserPayment.create({
//       name,
//       email,
//       mobileNumber,
//       password,
//       amountBorrowed,
//       tenure,
//       interest,
//     });

//     // Send email with credentials
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your Finance Hive Credentials",
//       text: `Hello ${name},\n\nYour account has been created. Here are your credentials:\n\nMobile Number: ${mobileNumber}\nPassword: ${password}\n\nPlease log in to your account to view your details.\n\nThanks,\nFinance Hive Team`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({ message: "User added and email sent successfully." });
//   } catch (error) {
//     console.error("Error adding user:", error);
//     res.status(500).json({ message: "Error adding user." });
//   }
// };

// Get user details by ID (for User Dashboard)
exports.getUserById = async (req, res) => {
  try {
    // Fetch user details from UserPayment by userId
    const user = await UserPayment.findOne({ userId: req.user.id }).populate("organizerId", "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return user details and associated payment info
    res.status(200).json({
      data: {
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        payments: [
          {
            amountBorrowed: user.amountBorrowed,
            tenure: user.tenure,
            interest: user.interest,
          },
        ],
        organizer: user.organizerId, // Optional: Include organizer info if needed
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details." });
  }
};

// exports.getUsersByOrganizer = async (req, res) => {
//   try {
//     const organizerId = req.user.id; // Assuming organizer ID is available in the token payload
//     const users = await UserPayment.find();

//     res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ success: false, message: "Error fetching users." });
//   }
// };
// exports.getUsersByOrganizer = async (req, res) => {
//   try {
//     // Fetch all users added by the organizer
//     const users = await UserPayment.find({}).select("name email mobileNumber amountBorrowed tenure interest");

//     if (users.length === 0) {
//       return res.status(404).json({ message: "No users found." });
//     }

//     res.status(200).json({ users });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Error fetching users." });
//   }
// };

// exports.addUserAndSendEmail = async (req, res) => {
//   try {
//     const { name, email, mobileNumber, password, amountBorrowed, tenure, interest } = req.body;

//     // Check if the user already exists
//     let user = await UserPayment.findOne({ email });

//     if (user) {
//       // If the user exists, append the new payment details to their record
//       user.payments.push({
//         amountBorrowed,
//         tenure,
//         interest,
//         addedAt: new Date(), // Optional field to track when the payment was added
//       });

//       // Save the updated user document
//       await user.save();

//       return res.status(200).json({
//         message: "Existing user found. Payment details appended successfully.",
//       });
//     }

//     // If user doesn't exist, create a new user record
//     const newUser = await UserPayment.create({
//       name,
//       email,
//       mobileNumber,
//       loginCredentials: {
//         username: mobileNumber,
//         password, // Plain password for email; hashing happens in the pre-save hook
//       },
//       payments: [
//         {
//           amountBorrowed,
//           tenure,
//           interest,
//           addedAt: new Date(),
//         },
//       ],
//     });

//     // Send email with credentials
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your Finance Hive Credentials",
//       text: `Hello ${name},\n\nYour account has been created. Here are your credentials:\n\nUsername (Mobile Number): ${mobileNumber}\nPassword: ${password}\n\nPlease log in to your account to view your details.\n\nThanks,\nFinance Hive Team`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({ message: "New user added and email sent successfully." });
//   } catch (error) {
//     console.error("Error adding or updating user:", error);
//     res.status(500).json({ message: "Error processing user." });
//   }
// };
const bcrypt = require("bcryptjs");


exports.addUserAndSendEmail = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, amountBorrowed, tenure, interest, role } = req.body;

    // Ensure role is provided and default to "user" if not
    const userRole = role === 'organizer' || role === 'admin' ? role : 'user';

    // Create User in User collection without hashing
    const user = new User({
      name,
      email,
      mobileNumber,
      password, // Store plain password
      role: userRole,
    });
    await user.save();

    // Create UserPayment record with plain password
    const userPayment = new UserPayment({
      _id: user._id,
      name,
      email,
      mobileNumber,
      password, // Store plain password
      amountBorrowed,
      tenure,
      interest,
      organizerId: req.user.id,
      loginCredentials: {
        username: mobileNumber,
        password, // Store plain password
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
      text: `Hello ${name},\n\nWelcome to our platform! You have been successfully added as a ${userRole}.\n\nYour login credentials are:\n\nMobile Number: ${mobileNumber}\nPassword: ${password}\n\nThank you for joining us!`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(201).json({ message: "User added successfully and email sent!" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Error adding user.", error: error.message });
  }
};






exports.createUserAndPayment = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, amountBorrowed, tenure, interest } = req.body;

    // Hash the password once
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      mobileNumber,
      password: hashedPassword, // Store hashed password
      role: "organizer", // Example role
    });

    // Create user payment with the same hashed password
    const userPayment = await UserPayment.create({
      name,
      email,
      mobileNumber,
      password: hashedPassword, // Use the same hashed password
      amountBorrowed,
      tenure,
      interest,
      organizerId: user._id,
      loginCredentials: {
        username: email,
        password: hashedPassword, // Use the same hashed password
      },
    });

    res.status(201).json({ message: "User and payment created successfully.", user, userPayment });
  } catch (error) {
    console.error("Error creating user and payment:", error);
    res.status(500).json({ message: "Error creating user and payment.", error: error.message });
  }
};


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

// exports.getUserDetails = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming user ID is in the token payload
//     const user = await UserPayment.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     res.status(500).json({ success: false, message: "Error fetching user details." });
//   }
// };


// exports.updateUser = async (req, res) => {

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
  

// Login User

exports.userLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Find the user by mobile number
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Direct password comparison
    if (password === user.password) {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login.", error: error.message });
  }
};