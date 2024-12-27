// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  organization: { type: String, required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'loans_update', required: true },
  serialNo: { type: Number, required: true },
  paymentDate: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  screenshot: { type: String, required: true }, // Path to stored screenshot
  status: { type: String, default: 'Pending', enum: ['Pending', 'Verified', 'Rejected'] },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
