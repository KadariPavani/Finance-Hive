const mongoose = require('mongoose');

// Define Organizer Schema
const OrganizerSchema = new mongoose.Schema({
  role: { type: String, required: true, default: 'Organizer' }, // Automatically set role as 'Organizer'
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

// Check if the model is already compiled, if so, return that, else compile a new one
const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', OrganizerSchema);

module.exports = Organizer;
