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



// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   amountBorrowed: { type: Number, required: true },
//   tenure: { type: String, required: true },
//   interest: { type: Number, required: true },
//   addedAt: { type: Date, default: Date.now },
// });

// const userPaymentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   loginCredentials: {
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   },
//   payments: [paymentSchema], // Array to store multiple payment records
//   organizer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Organizer", // assuming you have an "Organizer" model
//     required: true,
//   },
// });

// module.exports = mongoose.model("UserPayment", userPaymentSchema);


// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   amountBorrowed: { type: Number, required: true },
//   tenure: { type: String, required: true },
//   interest: { type: Number, required: true },
//   addedAt: { type: Date, default: Date.now },
// });

// const userPaymentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   loginCredentials: {
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   },
//   payments: [paymentSchema], // Array to store multiple payment records
// });

// module.exports = mongoose.model("UserPayment", userPaymentSchema);


// In models/UserPaymentModel.js
// const mongoose = require("mongoose");

// const userPaymentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
//   password: { type: String, required: true },
//   amountBorrowed: { type: Number, required: true },
//   tenure: { type: Number, required: true },
//   interest: { type: Number, required: true },
//   organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Reference to the organizer
// }, { timestamps: true });

// module.exports = mongoose.model("UserPayment", userPaymentSchema);


// const mongoose = require("mongoose");

// const userPaymentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
//   password: { type: String, required: true },
//   amountBorrowed: { type: Number, required: true },
//   tenure: { type: Number, required: true },
//   interest: { type: Number, required: true },
//   organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   loginCredentials: {
//     username: {
//       type: String,
//       required: [true, "Username is required"],  // Ensure username is always present
//       unique: true, // Make sure username is unique
//     },
//     password: {
//       type: String,
//       required: true,
//     }
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("UserPayment", userPaymentSchema);
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userPaymentSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     mobileNumber: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     amountBorrowed: { type: Number, required: true },
//     tenure: { type: Number, required: true },
//     interest: { type: Number, required: true },
//     organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     loginCredentials: {
//       username: {
//         type: String,
//         required: [true, "Username is required"],
//         unique: true, // Must be unique
//       },
//       password: { type: String, required: true },
//     },
//   },
//   { timestamps: true }
// );

// // Hash passwords before saving
// userPaymentSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   console.log("Pre-save Hook: Hashing password for user:", this.name);
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);

//   console.log("Pre-save Hook: Generated hash:", this.password);
//   next();
// });

// // Add comparePassword method to the schema
// userPaymentSchema.methods.comparePassword = async function (enteredPassword) {
//   const passwordMatch = await bcrypt.compare(enteredPassword, this.password);
//   const loginCredentialsPasswordMatch = await bcrypt.compare(enteredPassword, this.loginCredentials.password);

//   return passwordMatch || loginCredentialsPasswordMatch;  // Return true if either matches
// };

// module.exports = mongoose.model("UserPayment", userPaymentSchema);

// const mongoose = require("mongoose");

// const userPaymentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   amountBorrowed: { type: Number, required: true },
//   tenure: { type: Number, required: true },
//   interest: { type: Number, required: true },
//   organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   loginCredentials: {
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   },
// });


// module.exports = mongoose.model("UserPayment", userPaymentSchema);


const mongoose = require('mongoose');

const paymentScheduleSchema = new mongoose.Schema({
  serialNo: Number,
  paymentDate: Date,
  paidDate: {
    type: Date,
    default: null
  },
  emiAmount: Number,
  principal: Number,
  interest: Number,
  balance: Number,
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  },
  locked: {
    type: Boolean,
    default: false
  }
});

const userPaymentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  mobileNumber: String,
  password: String,
  amountBorrowed: Number,
  tenure: Number,
  interest: Number,
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  monthlyEMI: Number,
  paymentSchedule: [paymentScheduleSchema],
  loginCredentials: {
    username: String,
    password: String
  }
}, { timestamps: true });

module.exports = mongoose.model('UserPayment', userPaymentSchema);