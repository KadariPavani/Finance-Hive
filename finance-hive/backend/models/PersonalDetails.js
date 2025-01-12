const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personalDetailsSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  idType: { type: String, required: true },
  issuingAuthority: { type: String, required: true },
  idNumber: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  idDocument: { type: String, required: true }, // Path to the uploaded file
  occupation: { type: String, required: false },
  employerName: { type: String, required: false },
  employerIdProof: { type: String, required: false },
  monthlyIncome: { type: String, required: false },
  sourceOfIncome: { type: String, required: false },
  incomeProof: { type: String, required: false },
  addressProof: { type: String, required: false },
  accountType: { type: String, required: false },
  accountNumber: { type: String, required: false },
  bankName: { type: String, required: false },
  branchName: { type: String, required: false },
  ifscCode: { type: String, required: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  securityQuestion1: { type: String, required: true },
  securityAnswer1: { type: String, required: true },
  securityQuestion2: { type: String, required: true },
  securityAnswer2: { type: String, required: true },
  maritalStatus: { type: String, required: false },
  numberOfDependents: { type: Number, required: false },
  educationLevel: { type: String, required: false },
  termsAccepted: { type: Boolean, required: true },
});

const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);
module.exports = PersonalDetails;
