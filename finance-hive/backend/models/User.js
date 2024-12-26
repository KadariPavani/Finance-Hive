// // backend/models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   role: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   userId: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

// Check if the model already exists to prevent overwriting
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;