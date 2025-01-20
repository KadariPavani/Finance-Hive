const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load environment variables from .env file

// Import the Admin model (adjust the path as necessary)
const Admin = require('./models/Admin');
const addAdmin = async () => {
  // Hashing the password for security
  const hashedPassword = await bcrypt.hash('Admin@fh', 10); // Replace with a secure password

  // Define the new admin data
  const newAdmin = new Admin({
    role: 'Admin',
    email: 'MainFHAdmin@gmail.com',  // Replace with the admin email you want
    firstName: 'Admin',
    lastName: '1',
    userId: 'admin1',  // Ensure this userId is unique in your database
    mobileNumber: '9999999999',
    address: '123 Admin Street',
    password: hashedPassword,  // Store the hashed password
  });

  try {
    // Connect to MongoDB using the URI from .env file
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    // Save the new admin data to MongoDB
    await newAdmin.save();
    console.log('Admin added successfully!');
  } catch (err) {
    console.error('Error adding admin:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function to add the admin data
addAdmin();
