// const express = require('express');
// const bcrypt = require('bcryptjs');
// const multer = require('multer');
// const fs = require('fs');
// const PersonalDetails = require('../models/PersonalDetails');

// const router = express.Router();

// // Multer setup for multiple file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = './uploads';
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // Personal Details Route (Handle multiple file uploads)
// router.post('/submit', upload.fields([
//   { name: 'idDocument', maxCount: 1 },
//   { name: 'employerIdProof', maxCount: 1 },
//   { name: 'incomeProof', maxCount: 1 },
//   { name: 'addressProof', maxCount: 1 },
// ]), async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       dateOfBirth,
//       gender,
//       email,
//       phoneNumber,
//       address,
//       idType,
//       issuingAuthority,
//       idNumber,
//       expirationDate,
//       occupation,
//       employerName,
//       monthlyIncome,
//       sourceOfIncome,
//       accountType,
//       accountNumber,
//       bankName,
//       branchName,
//       ifscCode,
//       username,
//       password,
//       securityQuestion1,
//       securityAnswer1,
//       securityQuestion2,
//       securityAnswer2,
//       maritalStatus,
//       numberOfDependents,
//       educationLevel,
//       termsAccepted,
//     } = req.body;

//     // Uploaded files
//     const idDocument = req.files.idDocument?.[0]?.path;
//     const employerIdProof = req.files.employerIdProof?.[0]?.path;
//     const incomeProof = req.files.incomeProof?.[0]?.path;
//     const addressProof = req.files.addressProof?.[0]?.path;

//     if (!termsAccepted) {
//       return res.status(400).json({ msg: 'You must accept the terms and conditions' });
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save data to database
//     const newPersonalDetails = new PersonalDetails({
//       firstName,
//       lastName,
//       dateOfBirth,
//       gender,
//       email,
//       phoneNumber,
//       address,
//       idType,
//       issuingAuthority,
//       idNumber,
//       expirationDate,
//       occupation,
//       employerName,
//       employerIdProof,
//       monthlyIncome,
//       sourceOfIncome,
//       incomeProof,
//       addressProof,
//       accountType,
//       accountNumber,
//       bankName,
//       branchName,
//       ifscCode,
//       username,
//       password: hashedPassword, // Store hashed password
//       securityQuestion1,
//       securityAnswer1,
//       securityQuestion2,
//       securityAnswer2,
//       maritalStatus,
//       numberOfDependents,
//       educationLevel,
//       idDocument,
//     });

//     await newPersonalDetails.save();
//     res.status(201).json({ msg: 'Personal details submitted successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Error submitting details', error: error.message });
//   }
// });

// // Get Personal Details by Email
// router.get('/:email', async (req, res) => {
//   const { email } = req.params;
//   try {
//     const personalDetails = await PersonalDetails.findOne({ email });
//     if (!personalDetails) return res.status(404).json({ msg: 'Details not found' });
//     res.json(personalDetails);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching details', error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const PersonalDetails = require('../models/PersonalDetails');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/api/personal-details', upload.single('idDocument'), async (req, res) => {
  try {
    const { body, file } = req;

    const newDetails = new PersonalDetails({
      ...body,
      idDocument: file?.path,
    });

    await newDetails.save();
    res.status(201).json({ message: 'Details saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving details', details: error.message });
  }
});

module.exports = router;
