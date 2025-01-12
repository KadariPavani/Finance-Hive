// backend/models/PaymentSchema.js
const mongoose = require('mongoose');

// Check if the model already exists before creating it
const Payment = mongoose.models.Payment || mongoose.model('Payment', new mongoose.Schema({
  date: String,
  organization: String,
  email: String,
  amount: String,
  status: String,
  transactionId: String,
}), 'payments');

module.exports = Payment;