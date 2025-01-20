const mongoose = require('mongoose');

// Loan schema
const loanSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true }, // New field for email
  organization: { type: String, required: true }, // New field for organization
  loanAmount: { type: Number, required: true },
  loanPurpose: { type: String, required: true },
  loanTenure: { type: String, required: true }, // e.g., "1 year", "2 years", "3 months"
  interestRate: { type: Number, default: 1 }, // Fixed interest rate
  repaymentFrequency: { type: String, required: true }, // e.g., monthly, quarterly
  remarks: { type: String, required: false },

  paymentSchedule: [{ // Add this field to store payment schedule
    sno: { type: Number, required: true },
    date: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, default: 'Pay now' }, // Default status
    transactionId: { type: String, default: null }, // New field for transaction ID
    is_verified: { type: Boolean, default: false }, // New field for verification status
  
  }]
});

// Export the Loan model
module.exports = mongoose.model('loans_update', loanSchema);
