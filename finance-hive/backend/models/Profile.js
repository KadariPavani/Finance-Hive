const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  loanTaken: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;