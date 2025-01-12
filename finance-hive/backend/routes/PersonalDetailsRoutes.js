const express = require('express');
const router = express.Router();
const multer = require('multer');
const PersonalDetails = require('../models/PersonalDetails');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route to handle form submission
router.post('/submit', upload.single('idDocument'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      address,
      idType,
      issuingAuthority,
      idNumber,
      expirationDate,
      occupation,
      employerName,
      employerIdProof,
      monthlyIncome,
      sourceOfIncome,
      incomeProof,
      addressProof,
      accountType,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
      username,
      password,
      securityQuestion1,
      securityAnswer1,
      securityQuestion2,
      securityAnswer2,
      maritalStatus,
      numberOfDependents,
      educationLevel,
      termsAccepted,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First Name, Last Name, and Email are required.' });
    }

    const idDocument = req.file ? req.file.path : null;

    const newDetails = new PersonalDetails({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      address,
      idType,
      issuingAuthority,
      idNumber,
      expirationDate,
      idDocument,
      occupation,
      employerName,
      employerIdProof,
      monthlyIncome,
      sourceOfIncome,
      incomeProof,
      addressProof,
      accountType,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
      username,
      password,
      securityQuestion1,
      securityAnswer1,
      securityQuestion2,
      securityAnswer2,
      maritalStatus,
      numberOfDependents,
      educationLevel,
      termsAccepted,
    });

    await newDetails.save();
    res.status(200).json({ message: 'Form data saved successfully.' });
  } catch (error) {
    console.error('Error saving form data:', error.message);
    res.status(500).json({ error: 'Error saving form data. Please try again.' });
  }
});


// Route to fetch all submitted details (for testing, can be expanded)
router.get('/personal-details/all', async (req, res) => {
  try {
    const allDetails = await PersonalDetails.find();
    res.status(200).json(allDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching form data.' });
  }
});

module.exports = router;
