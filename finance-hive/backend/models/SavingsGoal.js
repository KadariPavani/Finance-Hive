const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  goalName: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0
  },
  targetDate: {
    type: Date,
    required: true
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
