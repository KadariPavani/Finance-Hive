const mongoose = require('mongoose');

// Define the schema for a Transaction
const transactionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensure the transaction ID is unique
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Prevent negative amounts
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['credited', 'debited'], // Only allow 'credited' or 'debited' as values
    },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Create a model from the schema
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
