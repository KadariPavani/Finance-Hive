// backend/models/PaymentSchema.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  date: String,
  organization: String,
  email: String,
  amount: String,
  status: String,
  transactionId: String,
});

const Payment = mongoose.model('Payment', paymentSchema, 'payments');

module.exports = Payment; // Ensure it's being exported
