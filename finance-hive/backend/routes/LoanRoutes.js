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

// PUT route to update payment status with transaction ID and upload screenshot
router.put('/payment-schedule/:loanId/:sno', upload.single('screenshot'), async (req, res) => {
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