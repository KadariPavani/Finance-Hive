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

/*

const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate loan with a user
  loanAmount: { type: Number, required: true }, // Loan amount is required
  loanPurpose: { type: String, required: true }, // Loan purpose is required
  loanTenure: { type: String, required: true }, // Loan tenure is required
  interestRate: { type: Number, required: true }, // Interest rate is required
  repaymentFrequency: { type: String, required: true }, // Repayment frequency is required
  remarks: { type: String }, // Remarks are optional
  paymentSchedule: [
    {
      sno: { type: Number, required: true }, // Schedule number is required
      date: { type: String, required: true }, // Date is required
      amount: { type: String, required: true }, // Amount is required
      status: { type: String, required: true }, // Status is required
      transactionId: { type: String, default: null }, // Transaction ID, default is null
      screenshotPath: { type: String, default: null } // Screenshot path, default is null
    }
  ]
});

module.exports = mongoose.model('Loan', LoanSchema);
*/

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