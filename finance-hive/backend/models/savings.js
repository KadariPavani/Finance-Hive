const mongoose = require('mongoose');

// Define the schema for a Savings plan
const savingsSchema = new mongoose.Schema(
  {
    savingsName: {
      type: String,
      required: true,
      trim: true,
    },
    monthlySavingAmount: {
      type: Number,
      required: true,
      min: 0, // Prevent negative savings amounts
    },
    savingDayAndDate: {
      type: Date, // Store as an actual Date
      required: true,
    },
    interest: {
      type: Number,
      required: true,
      min: 0, // Prevent negative interest
    },
    totalNeededSavingsAmount: {
      type: Number,
      required: true,
      min: 0, // Prevent negative total savings
    },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Create a model from the schema
const Savings = mongoose.model('Savings', savingsSchema);

module.exports = Savings;
