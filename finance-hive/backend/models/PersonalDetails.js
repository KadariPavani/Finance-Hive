// // models/PersonalDetails.js
// const mongoose = require('mongoose');

// // Define a schema for personal details
// const personalDetailsSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   dateOfBirth: { type: Date, required: true },
//   gender: { type: String, required: true },
//   email: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   idType: { type: String, required: true },
//   issuingAuthority: { type: String, required: true },
//   idNumber: { type: String, required: true },
//   expirationDate: { type: Date, required: true },
//   occupation: { type: String },
//   employerName: { type: String },
//   employerIdProof: { type: String },
//   monthlyIncome: { type: String },
//   sourceOfIncome: { type: String },
//   incomeProof: { type: String },
//   addressProof: { type: String },
//   accountType: { type: String },
//   accountNumber: { type: String },
//   bankName: { type: String },
//   branchName: { type: String },
//   ifscCode: { type: String },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
//   securityQuestion1: { type: String, required: true },
//   securityAnswer1: { type: String, required: true },
//   securityQuestion2: { type: String, required: true },
//   securityAnswer2: { type: String, required: true },
//   maritalStatus: { type: String },
//   numberOfDependents: { type: String },
//   educationLevel: { type: String },
//   termsAccepted: { type: Boolean, required: true },
//   idDocument: { type: String } // Store the file path or URL
// });

// // Create a model
// const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);

// module.exports = PersonalDetails;


// models/PersonalDetails.js
const mongoose = require('mongoose');

const PersonalDetailsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  idType: { type: String, required: true },
  issuingAuthority: { type: String, required: true },
  idNumber: { type: String, required: true },
  expirationDate: { type: String, required: true },
  occupation: { type: String },
  employerName: { type: String },
  employerIdProof: { type: String },
  monthlyIncome: { type: String },
  sourceOfIncome: { type: String },
  incomeProof: { type: String },
  addressProof: { type: String },
  accountType: { type: String },
  accountNumber: { type: String },
  bankName: { type: String },
  branchName: { type: String },
  ifscCode: { type: String },
  username: { type: String, required: true },
  password: { type: String, required: true },
  securityQuestion1: { type: String, required: true },
  securityAnswer1: { type: String, required: true },
  securityQuestion2: { type: String, required: true },
  securityAnswer2: { type: String, required: true },
  maritalStatus: { type: String },
  numberOfDependents: { type: String },
  educationLevel: { type: String },
  termsAccepted: { type: Boolean, required: true },
  idDocument: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('PersonalDetails', PersonalDetailsSchema);
