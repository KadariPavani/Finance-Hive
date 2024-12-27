const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Payment = require('../models/paymentSchema');
// Set up multer to save uploaded files in the 'payment_images' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, 'payment_images');  // Ensure absolute path
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true }); // Create folder if it doesn't exist
    }
    cb(null, folderPath);  // Use the folder path here
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename based on timestamp
  },
});

const upload = multer({ storage });
// POST route to save/update loan details
router.post('/', async (req, res) => {
  const {
    loanAmount,
    loanPurpose,
    loanTenure, // Contains both value and type (e.g., "12 months" or "2 years")
    interestRate,
    repaymentFrequency,
    remarks,
    email, // Extract email from the request body
    organization
  } = req.body;

  try {
    // Extract loan tenure value and type (e.g., "months" or "years")
    const [tenureValue, tenureType] = loanTenure.split(' '); // Separate value and type

    // Convert loan tenure to months
    const loanTenureInMonths = tenureType === 'years' ? parseInt(tenureValue) * 12 : parseInt(tenureValue);

    // Calculate monthly interest rate
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;

    // Check if a loan already exists for the user (use email as identifier)
    let loan = await Loan.findOne({ email });

    if (!loan) {
      // If no loan exists, create a new one
      loan = new Loan({
        loanAmount,
        loanPurpose,
        loanTenure: `${tenureValue} ${tenureType}`, // Save the original format (e.g., "2 years")
        interestRate,
        repaymentFrequency,
        remarks,
        email,
        organization // Save the email
      });
    } else {
      // If a loan exists, update the existing loan details
      loan.loanAmount = loanAmount;
      loan.loanPurpose = loanPurpose;
      loan.loanTenure = `${tenureValue} ${tenureType}`;
      loan.interestRate = interestRate;
      loan.repaymentFrequency = repaymentFrequency;
      loan.remarks = remarks;
      loan.organization = organization; // Update organization
    }

    // Calculate monthly payment using the amortization formula
    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTenureInMonths));
    const paymentSchedule = [];
    const startDate = new Date(); // Date when the loan is submitted

    // Generate payment schedule based on the repayment frequency
    let numberOfPayments;

    if (tenureType === 'months') {
      // If tenure is in months, create monthly payments
      numberOfPayments = loanTenureInMonths;
    } else {
      // If tenure is in years, determine the number of payments based on frequency
      if (repaymentFrequency === 'monthly') {
        numberOfPayments = loanTenureInMonths; // 12 months per year
      } else if (repaymentFrequency === 'quarterly') {
        numberOfPayments = loanTenureInMonths / 3; // Every 3 months
      } else if (repaymentFrequency === 'annually') {
        numberOfPayments = loanTenureInMonths / 12; // Every 12 months
      }
    }

    // Generate the payment schedule
    for (let i = 0; i < numberOfPayments; i++) {
      const paymentDate = new Date(startDate);
      // Adjust payment date based on frequency
      if (tenureType === 'months' || repaymentFrequency === 'monthly') {
        paymentDate.setMonth(paymentDate.getMonth() + i); // Increment month
      } else if (repaymentFrequency === 'quarterly') {
        paymentDate.setMonth(paymentDate.getMonth() + (i * 3)); // Increment by 3 months
      } else if (repaymentFrequency === 'annually') {
        paymentDate.setFullYear(paymentDate.getFullYear() + i); // Increment by 1 year
      }

      paymentSchedule.push({
        sno: i + 1,
        date: paymentDate.toLocaleDateString(), // Format date as MM/DD/YYYY
        amount: (monthlyPayment * (repaymentFrequency === 'quarterly' ? 3 : repaymentFrequency === 'annually' ? 12 : 1)).toFixed(2), // Adjust amount based on frequency
        status: 'Pay now' // Default status
      });
    }

    loan.paymentSchedule = paymentSchedule; // Save the payment schedule in the loan document
    await loan.save();

    res.json({ message: 'Loan request submitted/updated successfully!', loanId: loan._id });
  } catch (error) {
    console.error('Error submitting/updating loan request:', error);
    res.status(500).json({ error: 'Error submitting/updating loan request' });
  }
});

// GET route to retrieve payment schedule by loanId (for a specific user)
router.get('/schedule/:loanId', async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan.paymentSchedule); // Return the saved payment schedule
  } catch (error) {
    console.error('Error generating payment schedule:', error);
    res.status(500).json({ error: 'Error generating payment schedule' });
  }
});
router.get('/payment-schedule', async (req, res) => {
  try {
    const loans = await Loan.find();
    res.json(loans.map(loan => loan.paymentSchedule));
  } catch (error) {
    console.error('Error fetching payment schedules:', error);
    res.status(500).json({ error: 'Error fetching payment schedules' });
  }
});

// // PUT route to update payment status with transaction ID and upload screenshot
// router.put('/payment-schedule/:loanId/:sno', upload.single('screenshot'), async (req, res) => {
//   const { loanId, sno } = req.params;
//   const { transactionId } = req.body;

//   try {
//     const loan = await Loan.findById(loanId);
//     if (!loan) {
//       return res.status(404).json({ error: 'Loan not found' });
//     }

//     // Find the payment in the schedule and update its status
//     const paymentIndex = loan.paymentSchedule.findIndex(payment => payment.sno === parseInt(sno));
//     if (paymentIndex > -1) {
//       loan.paymentSchedule[paymentIndex].status = 'Done'; // Update status
//       loan.paymentSchedule[paymentIndex].transactionId = transactionId; // Add transaction ID
//       loan.paymentSchedule[paymentIndex].screenshotPath = req.file ? req.file.path : null; // Save screenshot file path

//       await loan.save(); // Save the loan with updated payment status
//       return res.status(200).json({ message: 'Payment status updated successfully', payment: loan.paymentSchedule[paymentIndex] });
//     } else {
//       return res.status(404).json({ error: 'Payment not found' });
//     }
//   } catch (error) {
//     console.error('Error updating payment status:', error);
//     res.status(500).json({ error: 'Error updating payment status' });
//   }
// });
// Your existing PUT route for updating the payment status (file upload)

// PUT route for updating payment status with file upload
// PUT route for updating payment status with file upload
router.put('/payment-schedule/:loanId/:sno', upload.single('screenshot'), async (req, res) => {
  const { loanId, sno } = req.params;
  const { transactionId } = req.body;

  console.log('Uploaded file details:', req.file);  // Log for debugging

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Find the payment in the schedule and update its status
    const paymentIndex = loan.paymentSchedule.findIndex(payment => payment.sno === parseInt(sno));
    if (paymentIndex > -1) {
      loan.paymentSchedule[paymentIndex].status = 'Done';  // Update status
      loan.paymentSchedule[paymentIndex].transactionId = transactionId;  // Add transaction ID
      loan.paymentSchedule[paymentIndex].screenshotPath = req.file ? req.file.path : null;  // Save screenshot path

      console.log('Updated payment details:', loan.paymentSchedule[paymentIndex]);

      await loan.save();  // Save the loan with updated payment status
      return res.status(200).json({ message: 'Payment status updated successfully', payment: loan.paymentSchedule[paymentIndex] });
    } else {
      return res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
});

// POST route to test file upload (for debugging purposes)
router.post('/upload-test', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log('Uploaded file:', req.file);
  res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
});


router.put('/payment/:loanId/:sno', upload.single('screenshot'), async (req, res) => {
  const { loanId, sno } = req.params;
  const { transactionId } = req.body;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Find the payment in the schedule and update its status
    const paymentIndex = loan.paymentSchedule.findIndex(payment => payment.sno === parseInt(sno));
    if (paymentIndex > -1) {
      loan.paymentSchedule[paymentIndex].status = 'Done'; // Update status
      loan.paymentSchedule[paymentIndex].transactionId = transactionId; // Add transaction ID
      loan.paymentSchedule[paymentIndex].screenshotPath = req.file ? req.file.path : null; // Save screenshot file path

      await loan.save(); // Save the loan with updated payment status
      return res.status(200).json({ message: 'Payment status updated successfully', payment: loan.paymentSchedule[paymentIndex] });
    } else {
      return res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
});

// const transferDonePayments = async () => {
//   try {
//     console.log("Starting to transfer payments...");

//     // Query the loans_update collection for payments with status "Done"
//     const loans = await mongoose.model('loans_update').find({ 
//       'paymentSchedule.status': 'Done' 
//     });

//     console.log(`Found ${loans.length} loans with payment status "Done"`); // Add log here

//     if (loans.length === 0) {
//       console.log('No loans with payment status "Done" found.');
//       return;
//     }

//     // Extract relevant data for payments with "Done" status
//     const payments = loans.flatMap(loan => 
//       loan.paymentSchedule
//         .filter(payment => payment.status === 'Done')
//         .map(payment => ({
//           date: payment.date,
//           organization: loan.organization,
//           email: loan.email,
//           amount: payment.amount,
//           status: payment.status,
//           transactionId: payment.transactionId,
//         }))
//     );

//     console.log('Extracted payments:', payments);  // Log the payments array

//     if (payments.length > 0) {
//       // Insert payments into the payments collection
//       await Payment.insertMany(payments);
//       console.log(`${payments.length} payments with status "Done" have been transferred successfully.`);
//     } else {
//       console.log('No payments with status "Done" found.');
//     }
//   } catch (error) {
//     console.error('Error transferring payments:', error);
//   }
// };

// // Call this function to transfer payments from loans_updates to payments collection
// transferDonePayments();

const transferDonePayments = async () => {
  try {
    // Query the loans_update collection for payments with status "Done"
    const loans = await mongoose.model('loans_update').find({ 
      'paymentSchedule.status': 'Done' 
    });

    // If no loans with payment status "Done" found, exit early
    if (loans.length === 0) {
      return;
    }

    // Extract relevant data for payments with "Done" status
    const payments = loans.flatMap(loan => 
      loan.paymentSchedule
        .filter(payment => payment.status === 'Done')
        .map(payment => ({
          date: payment.date,
          organization: loan.organization,
          email: loan.email,
          amount: payment.amount,
          status: payment.status,
          transactionId: payment.transactionId,
        }))
    );

    // Loop through payments and check for duplicates before insertion
    if (payments.length > 0) {
      for (let payment of payments) {
        // Check if payment with the same transactionId already exists
        const existingPayment = await Payment.findOne({ transactionId: payment.transactionId });

        // If no existing payment is found, insert the payment
        if (!existingPayment) {
          await Payment.create(payment);
        }
      }
    }
  } catch (error) {
    console.error('Error transferring payments:', error);
  }
};

// Call this function to transfer payments from loans_updates to payments collection
transferDonePayments();


// GET route to check user eligibility for loan (pending payments check)
router.get('/users/:email/eligibility', async (req, res) => {
  const { email } = req.params;

  try {
    const loan = await Loan.findOne({ email });
    if (!loan) {
      return res.json({ isEligible: true }); // No loan found, eligible to apply
    }

    // Check if there are pending payments
    const pendingPayments = loan.paymentSchedule.some(payment => payment.status !== 'Done');
    res.json({ isEligible: !pendingPayments }); // Eligible if no pending payments
  } catch (error) {
    console.error('Error checking user eligibility:', error);
    res.status(500).json({ error: 'Error checking eligibility' });
  }
});



module.exports = router;



/*

const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// POST route to save loan details
router.post('/', async (req, res) => {
  const {
    loanAmount,
    loanPurpose,
    loanTenure, // Contains both value and type (e.g., "12 months" or "2 years")
    interestRate,
    repaymentFrequency,
    remarks
  } = req.body;

  try {
    // Extract loan tenure value and type (e.g., "months" or "years")
    const [tenureValue, tenureType] = loanTenure.split(' '); // Separate value and type

    // Convert loan tenure to months
    const loanTenureInMonths = tenureType === 'years' ? parseInt(tenureValue) * 12 : parseInt(tenureValue);
    
    // Calculate monthly interest rate
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;

    const newLoan = new Loan({
      loanAmount,
      loanPurpose,
      loanTenure: `${tenureValue} ${tenureType}`, // Save the original format (e.g., "2 years")
      interestRate,
      repaymentFrequency,
      remarks
    });

    // Calculate monthly payment using the amortization formula
    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTenureInMonths));
    const paymentSchedule = [];
    const startDate = new Date(); // Date when the loan is submitted

    // Generate payment schedule based on the repayment frequency
    let numberOfPayments;

    if (tenureType === 'months') {
      // If tenure is in months, create monthly payments
      numberOfPayments = loanTenureInMonths;
    } else {
      // If tenure is in years, determine the number of payments based on frequency
      if (repaymentFrequency === 'monthly') {
        numberOfPayments = loanTenureInMonths; // 12 months per year
      } else if (repaymentFrequency === 'quarterly') {
        numberOfPayments = loanTenureInMonths / 3; // Every 3 months
      } else if (repaymentFrequency === 'annually') {
        numberOfPayments = loanTenureInMonths / 12; // Every 12 months
      }
    }

    // Generate the payment schedule
    for (let i = 0; i < numberOfPayments; i++) {
      const paymentDate = new Date(startDate);
      // Adjust payment date based on frequency
      if (tenureType === 'months' || repaymentFrequency === 'monthly') {
        paymentDate.setMonth(paymentDate.getMonth() + i); // Increment month
      } else if (repaymentFrequency === 'quarterly') {
        paymentDate.setMonth(paymentDate.getMonth() + (i * 3)); // Increment by 3 months
      } else if (repaymentFrequency === 'annually') {
        paymentDate.setFullYear(paymentDate.getFullYear() + i); // Increment by 1 year
      }

      paymentSchedule.push({
        sno: i + 1,
        date: paymentDate.toLocaleDateString(), // Format date as MM/DD/YYYY
        amount: (monthlyPayment * (repaymentFrequency === 'quarterly' ? 3 : repaymentFrequency === 'annually' ? 12 : 1)).toFixed(2), // Adjust amount based on frequency
        status: 'Pay now' // Default status
      });
    }

    newLoan.paymentSchedule = paymentSchedule; // Save the payment schedule in the loan document
    await newLoan.save();

    res.json({ message: 'Loan request submitted successfully!', loanId: newLoan._id });
  } catch (error) {
    console.error('Error submitting loan request:', error);
    res.status(500).json({ error: 'Error submitting loan request' });
  }
});

// GET route to retrieve payment schedule
router.get('/schedule/:loanId', async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan.paymentSchedule); // Return the saved payment schedule
  } catch (error) {
    console.error('Error generating payment schedule:', error);
    res.status(500).json({ error: 'Error generating payment schedule' });
  }
});

// PUT route to update payment status
router.put('/payment/:loanId/:sno', async (req, res) => {
  const { loanId, sno } = req.params;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Find the payment in the schedule and update its status
    const paymentIndex = loan.paymentSchedule.findIndex(payment => payment.sno === parseInt(sno));
    if (paymentIndex > -1) {
      loan.paymentSchedule[paymentIndex].status = 'Done'; // Update status
      await loan.save(); // Save the loan with updated payment status
      return res.status(200).json({ message: 'Payment status updated successfully' });
    } else {
      return res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
});

module.exports = router;


*/

/*

const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where screenshots are stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage });

// POST route to save loan details
router.post('/', async (req, res) => {
  const {
    loanAmount,
    loanPurpose,
    loanTenure, // Contains both value and type (e.g., "12 months" or "2 years")
    interestRate,
    repaymentFrequency,
    remarks
  } = req.body;

  try {
    // Extract loan tenure value and type (e.g., "months" or "years")
    const [tenureValue, tenureType] = loanTenure.split(' '); // Separate value and type

    // Convert loan tenure to months
    const loanTenureInMonths = tenureType === 'years' ? parseInt(tenureValue) * 12 : parseInt(tenureValue);
    
    // Calculate monthly interest rate
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;

    const newLoan = new Loan({
      loanAmount,
      loanPurpose,
      loanTenure: `${tenureValue} ${tenureType}`, // Save the original format (e.g., "2 years")
      interestRate,
      repaymentFrequency,
      remarks
    });

    // Calculate monthly payment using the amortization formula
    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTenureInMonths));
    const paymentSchedule = [];
    const startDate = new Date(); // Date when the loan is submitted

    // Generate payment schedule based on the repayment frequency
    let numberOfPayments;

    if (tenureType === 'months') {
      // If tenure is in months, create monthly payments
      numberOfPayments = loanTenureInMonths;
    } else {
      // If tenure is in years, determine the number of payments based on frequency
      if (repaymentFrequency === 'monthly') {
        numberOfPayments = loanTenureInMonths; // 12 months per year
      } else if (repaymentFrequency === 'quarterly') {
        numberOfPayments = loanTenureInMonths / 3; // Every 3 months
      } else if (repaymentFrequency === 'annually') {
        numberOfPayments = loanTenureInMonths / 12; // Every 12 months
      }
    }

    // Generate the payment schedule
    for (let i = 0; i < numberOfPayments; i++) {
      const paymentDate = new Date(startDate);
      // Adjust payment date based on frequency
      if (tenureType === 'months' || repaymentFrequency === 'monthly') {
        paymentDate.setMonth(paymentDate.getMonth() + i); // Increment month
      } else if (repaymentFrequency === 'quarterly') {
        paymentDate.setMonth(paymentDate.getMonth() + (i * 3)); // Increment by 3 months
      } else if (repaymentFrequency === 'annually') {
        paymentDate.setFullYear(paymentDate.getFullYear() + i); // Increment by 1 year
      }

      paymentSchedule.push({
        sno: i + 1,
        date: paymentDate.toLocaleDateString(), // Format date as MM/DD/YYYY
        amount: (monthlyPayment * (repaymentFrequency === 'quarterly' ? 3 : repaymentFrequency === 'annually' ? 12 : 1)).toFixed(2), // Adjust amount based on frequency
        status: 'Pay now' // Default status
      });
    }

    newLoan.paymentSchedule = paymentSchedule; // Save the payment schedule in the loan document
    await newLoan.save();

    res.json({ message: 'Loan request submitted successfully!', loanId: newLoan._id });
  } catch (error) {
    console.error('Error submitting loan request:', error);
    res.status(500).json({ error: 'Error submitting loan request' });
  }
});

// GET route to retrieve payment schedule
router.get('/schedule/:loanId', async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan.paymentSchedule); // Return the saved payment schedule
  } catch (error) {
    console.error('Error generating payment schedule:', error);
    res.status(500).json({ error: 'Error generating payment schedule' });
  }
});

// PUT route to update payment status with transaction ID and upload screenshot
router.put('/payment/:loanId/:sno', upload.single('screenshot'), async (req, res) => {
  const { loanId, sno } = req.params;
  const { transactionId } = req.body;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Find the payment in the schedule and update its status
    const paymentIndex = loan.paymentSchedule.findIndex(payment => payment.sno === parseInt(sno));
    if (paymentIndex > -1) {
      loan.paymentSchedule[paymentIndex].status = 'Done'; // Update status
      loan.paymentSchedule[paymentIndex].transactionId = transactionId; // Add transaction ID
      loan.paymentSchedule[paymentIndex].screenshotPath = req.file ? req.file.path : null; // Save screenshot file path

      await loan.save(); // Save the loan with updated payment status
      return res.status(200).json({ message: 'Payment status updated successfully', payment: loan.paymentSchedule[paymentIndex] });
    } else {
      return res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
});

module.exports = router;


/*

const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// POST route to save loan details
router.post('/', async (req, res) => {
  const {
    loanAmount,
    loanPurpose,
    loanTenure, // Contains both value and type (e.g., "12 months" or "2 years")
    interestRate,
    repaymentFrequency,
    remarks
  } = req.body;

  try {
    // Extract loan tenure value and type (e.g., "months" or "years")
    const [tenureValue, tenureType] = loanTenure.split(' '); // Separate value and type

    // Convert loan tenure to months
    const loanTenureInMonths = tenureType === 'years' ? parseInt(tenureValue) * 12 : parseInt(tenureValue);
    
    // Calculate monthly interest rate
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;

    const newLoan = new Loan({
      loanAmount,
      loanPurpose,
      loanTenure: `${tenureValue} ${tenureType}`, // Save the original format (e.g., "2 years")
      interestRate,
      repaymentFrequency,
      remarks
    });

    // Calculate monthly payment using the amortization formula
    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTenureInMonths));
    const paymentSchedule = [];
    const startDate = new Date(); // Date when the loan is submitted

    // Generate payment schedule based on the repayment frequency
    let numberOfPayments;

    if (tenureType === 'months') {
      // If tenure is in months, create monthly payments
      numberOfPayments = loanTenureInMonths;
    } else {
      // If tenure is in years, determine the number of payments based on frequency
      if (repaymentFrequency === 'monthly') {
        numberOfPayments = loanTenureInMonths; // 12 months per year
      } else if (repaymentFrequency === 'quarterly') {
        numberOfPayments = loanTenureInMonths / 3; // Every 3 months
      } else if (repaymentFrequency === 'annually') {
        numberOfPayments = loanTenureInMonths / 12; // Every 12 months
      }
    }

    // Generate the payment schedule
    for (let i = 0; i < numberOfPayments; i++) {
      const paymentDate = new Date(startDate);
      // Adjust payment date based on frequency
      if (tenureType === 'months' || repaymentFrequency === 'monthly') {
        paymentDate.setMonth(paymentDate.getMonth() + i); // Increment month
      } else if (repaymentFrequency === 'quarterly') {
        paymentDate.setMonth(paymentDate.getMonth() + (i * 3)); // Increment by 3 months
      } else if (repaymentFrequency === 'annually') {
        paymentDate.setFullYear(paymentDate.getFullYear() + i); // Increment by 1 year
      }

      paymentSchedule.push({
        sno: i + 1,
        date: paymentDate.toLocaleDateString(), // Format date as MM/DD/YYYY
        amount: (monthlyPayment * (repaymentFrequency === 'quarterly' ? 3 : repaymentFrequency === 'annually' ? 12 : 1)).toFixed(2), // Adjust amount based on frequency
        status: 'Pay now' // Default status
      });
    }

    newLoan.paymentSchedule = paymentSchedule; // Save the payment schedule in the loan document
    await newLoan.save();

    res.json({ message: 'Loan request submitted successfully!', loanId: newLoan._id });
  } catch (error) {
    console.error('Error submitting loan request:', error);
    res.status(500).json({ error: 'Error submitting loan request' });
  }
});

// GET route to retrieve payment schedule
router.get('/schedule/:loanId', async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan.paymentSchedule); // Return the saved payment schedule
  } catch (error) {
    console.error('Error generating payment schedule:', error);
    res.status(500).json({ error: 'Error generating payment schedule' });
  }
});

// PUT route to update payment status
router.put('/payment/:loanId/:sno', async (req, res) => {
  const { loanId, sno } = req.params;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Find the payment in the schedule and update its status
    const paymentIndex = loan.paymentSchedule.findIndex(payment => payment.sno === parseInt(sno));
    if (paymentIndex > -1) {
      loan.paymentSchedule[paymentIndex].status = 'Done'; // Update status
      await loan.save(); // Save the loan with updated payment status
      return res.status(200).json({ message: 'Payment status updated successfully' });
    } else {
      return res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
});

module.exports = router;

*/