// const mongoose = require('mongoose');

// const userPaymentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       'Please fill a valid email address',
//     ],
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     validate: {
//       validator: function (v) {
//         return /^[0-9]{10}$/.test(v);
//       },
//       message: 'Please enter a valid 10-digit mobile number',
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: [8, 'Password must be at least 8 characters long'],
//   },
//   amountBorrowed: {
//     type: Number,
//     required: true,
//   },
//   tenure: {
//     type: String,
//     required: true,
//   },
//   interest: {
//     type: Number,
//     required: true,
//   },
// }, { timestamps: true });

// // Pre-save hook for password hashing
// userPaymentSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const bcrypt = require('bcryptjs');
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

// // Method to check password
// userPaymentSchema.methods.comparePassword = async function (candidatePassword) {
//   const bcrypt = require('bcryptjs');
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('UserPayment', userPaymentSchema);





// const mongoose = require('mongoose');

// const userPaymentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   loginCredentials: {
//     username: { type: String, required: true, unique: true }, // Ensure uniqueness
//     password: { type: String, required: true },
//   },
//   amountBorrowed: { type: Number, required: true },
//   tenure: { type: String, required: true },
//   interest: { type: Number, required: true },
// },
// { timestamps: true });

// // Pre-save hook for password hashing
// userPaymentSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const bcrypt = require('bcryptjs');
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

// // Method to check password
// userPaymentSchema.methods.comparePassword = async function (candidatePassword) {
//   const bcrypt = require('bcryptjs');
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('UserPayment', userPaymentSchema);




const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amountBorrowed: { type: Number, required: true },
  tenure: { type: String, required: true },
  interest: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

const userPaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  loginCredentials: {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  payments: [paymentSchema], // Array to store multiple payment records
});

module.exports = mongoose.model("UserPayment", userPaymentSchema);
