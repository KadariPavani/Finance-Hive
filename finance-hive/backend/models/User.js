// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     validate: {
//       validator: function(v) {
//         return /^[0-9]{10}$/.test(v);
//       },
//       message: 'Please enter a valid 10-digit mobile number'
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: [8, 'Password must be at least 8 characters long']
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'user', 'organizer'],
//     required: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastLogin: {
//     type: Date
//   }
// }, { timestamps: true });

// // Pre-save hook for password hashing
// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const bcrypt = require('bcryptjs');
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

// // Method to check password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   const bcrypt = require('bcryptjs');
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "organizer", "user"], required: true },
//   isActive: { type: Boolean, default: true },
//   lastLogin: { type: Date, default: null },
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   console.log("Pre-save Hook: Hashing password for user:", this.name);
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);

//   console.log("Pre-save Hook: Generated hash:", this.password);
//   next();
// });


// // Add comparePassword method to the schema
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);
// module.exports = User;


// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "organizer", "user"], required: true },
//   isActive: { type: Boolean, default: true },
//   lastLogin: { type: Date, default: null },
// });

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   // Generate and save hash
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);

//   next();
// });

// // Add a method to compare passwords
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);
// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "organizer", "user"], required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
});

// No need to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if the password hasn't changed
  next();
});

module.exports = mongoose.model("User", userSchema);
