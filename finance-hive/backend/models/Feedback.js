const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    validate: {
      validator: function (email) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(email);
      },
      message: 'Invalid email format'
    },
  },
  feedback: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
