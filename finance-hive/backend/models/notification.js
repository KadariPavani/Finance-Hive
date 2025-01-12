// models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  transactionId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  verification: {
    type: String,
    required: true,
    enum: ['Done', 'Not Done'],
    default: 'Not Done'
  },
  organization:{
    type: String,
    required: true,
    enum:['khub','gcc','tm'],
    default :'khub'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);