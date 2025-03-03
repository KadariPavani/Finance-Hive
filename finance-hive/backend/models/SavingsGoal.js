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
  description: String,
  category: {
    type: String,
    required: true,
    enum: ['Emergency Fund', 'Retirement', 'Education', 'Travel', 'Home', 'Vehicle', 'Wedding', 'Other']
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  contributions: [{
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Calculate progress before saving
savingsGoalSchema.pre('save', function(next) {
  this.progress = (this.currentAmount / this.targetAmount) * 100;
  this.status = this.progress >= 100 ? 'Completed' : this.currentAmount > 0 ? 'In Progress' : 'Not Started';
  next();
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
