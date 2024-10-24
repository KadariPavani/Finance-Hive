const mongoose = require('mongoose');

// Loan schema
const loanSchema = new mongoose.Schema({
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
  }]
});

// Export the Loan model
module.exports = mongoose.model('loan_Form', loanSchema);
/*
const mongoose = require('mongoose');

// Loan schema
const loanSchema = new mongoose.Schema({
  loanAmount: { type: Number, required: true },
  loanPurpose: { type: String, required: true },
  loanTenure: { type: String, required: true }, // e.g., "1 year", "2 years"
  interestRate: { type: Number, default: 1 }, // Fixed interest rate
  repaymentFrequency: { type: String, required: true }, // e.g., monthly, quarterly
  remarks: { type: String, required: false },
  paymentSchedule: [{ // Add this field to store payment schedule
    sno: { type: Number, required: true },
    date: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, default: 'Pay now' }, // Default status
  }]
});

// Export the Loan model
module.exports = mongoose.model('loan_Form', loanSchema);
*/