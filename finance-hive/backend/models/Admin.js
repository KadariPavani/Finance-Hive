const mongoose = require('mongoose');

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

// Check if the model already exists
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

module.exports = Admin;