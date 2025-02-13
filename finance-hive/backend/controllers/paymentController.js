const mongoose = require('mongoose');
// controllers/paymentController.js
const { calculateEMI, generatePaymentSchedule } = require('../utils/calculatePayments');
const UserPayment = require('../models/UserPayment');
const { createNotification } = require('./notificationController');
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// Create or Fetch the Payment Schedule for a User
exports.createPaymentSchedule = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPayment = await UserPayment.findById(userId);
    
    if (!userPayment) {
      return res.status(404).json({ message: "User payment details not found" });
    }

    const startDate = new Date();
    const schedule = generatePaymentSchedule(
      userPayment.amountBorrowed,
      userPayment.tenure,
      userPayment.interest,
      startDate
    );

    // Save payment schedule to the database
    userPayment.paymentSchedule = schedule;
    userPayment.monthlyEMI = schedule[0].emiAmount;
    await userPayment.save();

    res.status(200).json({
      message: "Payment schedule created successfully",
      schedule,
      monthlyEMI: schedule[0].emiAmount
    });
  } catch (error) {
    console.error("Error creating payment schedule:", error);
    res.status(500).json({ message: "Error creating payment schedule" });
  }
};

// Update Payment Details (EMI and Status)
// exports.updatePaymentDetails = async (req, res) => {
//   try {
//     const { userId, serialNo } = req.params;
//     const { emiAmount, status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'Invalid user ID' });
//     }

//     const userPayment = await UserPayment.findById(userId);
//     if (!userPayment) {
//       return res.status(404).json({ message: "User payment details not found" });
//     }

//     // Find the payment by serialNo
//     const payment = userPayment.paymentSchedule.find(
//       p => p.serialNo === Number(serialNo)
//     );

//     if (!payment) {
//       return res.status(404).json({ message: "Payment schedule entry not found" });
//     }

//     // Update the EMI amount if provided
//     if (emiAmount) {
//       const newEmiAmount = Number(emiAmount);
//       const difference = newEmiAmount - payment.emiAmount;

//       // Update the current payment's EMI
//       payment.emiAmount = newEmiAmount;

//       // Adjust the last payment's EMI to maintain the total balance
//       const lastPayment = userPayment.paymentSchedule[userPayment.paymentSchedule.length - 1];
//       lastPayment.emiAmount -= difference;
//     }

//     let receipt = null;

//     // Update the status if provided
//     if (status) {
//       payment.status = status;

//       if (status === 'PAID') {
//         payment.paidDate = new Date();

//         // Generate receipt
//         receipt = {
//           receiptNumber: `RCPT-${Date.now()}-${payment.serialNo}`,
//           paymentDate: new Date(),
//           amount: payment.emiAmount,
//           serialNo: payment.serialNo
//         };

//         // Add receipt to user's receipts
//         userPayment.receipts.push(receipt);

//         // Send notifications
//         await Promise.all([
//           createNotification(
//             userPayment._id,
//             'Payment Receipt Generated',
//             `Payment of ${formatCurrency(payment.emiAmount)} for EMI ${payment.serialNo} is completed.`,
//             'PAYMENT',
//             { receipt }
//           ),
//           sendPaymentEmail(userPayment, payment, receipt),
//           sendPaymentSMS(userPayment, payment, receipt)
//         ]);

//         // Lock the payment to prevent further edits
//         payment.locked = true;
//       } else {
//         payment.paidDate = null;
//         payment.locked = false; // Unlock the payment if status is changed from PAID
//       }
//     }

//     await userPayment.save();

//     res.json({
//       schedule: userPayment.paymentSchedule,
//       amountBorrowed: userPayment.amountBorrowed,
//       receipt
//     });

//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({
//       message: 'Error updating payment',
//       error: error.message
//     });
//   }
// };

exports.updatePaymentDetails = async (req, res) => {
  try {
    const { userId, serialNo } = req.params;
    const { emiAmount, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userPayment = await UserPayment.findById(userId);
    if (!userPayment) {
      return res.status(404).json({ message: "User payment details not found" });
    }

    // Find the payment by serialNo
    const payment = userPayment.paymentSchedule.find(
      p => p.serialNo === Number(serialNo)
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment schedule entry not found" });
    }

    // Update the EMI amount if provided
    if (emiAmount) {
      const newEmiAmount = Number(emiAmount);
      const difference = newEmiAmount - payment.emiAmount;

      // Update the current payment's EMI
      payment.emiAmount = newEmiAmount;

      // If the payable amount is greater than or equal to the remaining balance, mark it as PAID
      if (newEmiAmount >= userPayment.amountBorrowed) {
        payment.status = 'PAID';
        payment.paidDate = new Date();
        payment.locked = true;

        // Mark all subsequent payments as PAID and set their EMI amounts to 0
        for (let i = payment.serialNo; i < userPayment.paymentSchedule.length; i++) {
          const subsequentPayment = userPayment.paymentSchedule[i];
          subsequentPayment.emiAmount = 0;
          subsequentPayment.status = 'PAID';
          subsequentPayment.paidDate = new Date();
          subsequentPayment.locked = true;
        }
      } else {
        // Adjust the last payment's EMI to maintain the total balance
        const lastPayment = userPayment.paymentSchedule[userPayment.paymentSchedule.length - 1];
        lastPayment.emiAmount -= difference;
      }
    }

    // Automatically mark any payment as PAID if the EMI amount is negative or less than 1 rupee
    for (const p of userPayment.paymentSchedule) {
      if (p.emiAmount < 1 && p.status !== 'PAID') {
        p.status = 'PAID';
        p.paidDate = new Date();
        p.locked = true;
        p.emiAmount = 0; // Set EMI amount to 0
      }
    }

    let receipt = null;

    // Update the status if provided
    if (status) {
      payment.status = status;

      if (status === 'PAID') {
        payment.paidDate = new Date();

        // Generate receipt
        receipt = {
          receiptNumber: `RCPT-${Date.now()}-${payment.serialNo}`,
          paymentDate: new Date(),
          amount: payment.emiAmount,
          serialNo: payment.serialNo
        };

        // Add receipt to user's receipts
        userPayment.receipts.push(receipt);

        // Send notifications
        await Promise.all([
          createNotification(
            userPayment._id,
            'Payment Receipt Generated',
            `Payment of ${formatCurrency(payment.emiAmount)} for EMI ${payment.serialNo} is completed.`,
            'PAYMENT',
            { receipt }
          ),
          sendPaymentEmail(userPayment, payment, receipt),
          // sendPaymentSMS(userPayment, payment, receipt)
        ]);

        // Lock the payment to prevent further edits
        payment.locked = true;
      } else {
        payment.paidDate = null;
        payment.locked = false; // Unlock the payment if status is changed from PAID
      }
    }

    await userPayment.save();

    res.json({
      schedule: userPayment.paymentSchedule,
      amountBorrowed: userPayment.amountBorrowed,
      receipt
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      message: 'Error updating payment',
      error: error.message
    });
  }
};
// exports.updatePaymentDetails = async (req, res) => {
//   try {
//     const { userId, serialNo } = req.params;
//     const { emiAmount, status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'Invalid user ID' });
//     }

//     const userPayment = await UserPayment.findById(userId);
//     if (!userPayment) {
//       return res.status(404).json({ message: "User payment details not found" });
//     }

//     // Find the payment by serialNo
//     const payment = userPayment.paymentSchedule.find(
//       p => p.serialNo === Number(serialNo)
//     );

//     if (!payment) {
//       return res.status(404).json({ message: "Payment schedule entry not found" });
//     }

//     // Update the EMI amount if provided
//     if (emiAmount) {
//       const newEmiAmount = Number(emiAmount);
//       const difference = newEmiAmount - payment.emiAmount;

//       // Update the current payment's EMI
//       payment.emiAmount = newEmiAmount;

//       // If the payable amount is greater than or equal to the remaining balance, mark it as PAID
//       if (newEmiAmount >= userPayment.amountBorrowed) {
//         payment.status = 'PAID';
//         payment.paidDate = new Date();
//         payment.locked = true;

//         // Mark all subsequent payments as PAID and set their EMI amounts to 0
//         for (let i = payment.serialNo; i < userPayment.paymentSchedule.length; i++) {
//           const subsequentPayment = userPayment.paymentSchedule[i];
//           subsequentPayment.emiAmount = 0;
//           subsequentPayment.status = 'PAID';
//           subsequentPayment.paidDate = new Date();
//           subsequentPayment.locked = true;
//         }
//       } else {
//         // Adjust the last payment's EMI to maintain the total balance
//         const lastPayment = userPayment.paymentSchedule[userPayment.paymentSchedule.length - 1];
//         lastPayment.emiAmount -= difference;
//       }
//     }

//     let receipt = null;

//     // Update the status if provided
//     if (status) {
//       payment.status = status;

//       if (status === 'PAID') {
//         payment.paidDate = new Date();

//         // Generate receipt
//         receipt = {
//           receiptNumber: `RCPT-${Date.now()}-${payment.serialNo}`,
//           paymentDate: new Date(),
//           amount: payment.emiAmount,
//           serialNo: payment.serialNo
//         };

//         // Add receipt to user's receipts
//         userPayment.receipts.push(receipt);

//         // Send notifications
//         await Promise.all([
//           createNotification(
//             userPayment._id,
//             'Payment Receipt Generated',
//             `Payment of ${formatCurrency(payment.emiAmount)} for EMI ${payment.serialNo} is completed.`,
//             'PAYMENT',
//             { receipt }
//           ),
//           sendPaymentEmail(userPayment, payment, receipt),
//           // sendPaymentSMS(userPayment, payment, receipt)
//         ]);

//         // Lock the payment to prevent further edits
//         payment.locked = true;
//       } else {
//         payment.paidDate = null;
//         payment.locked = false; // Unlock the payment if status is changed from PAID
//       }
//     }

//     await userPayment.save();

//     res.json({
//       schedule: userPayment.paymentSchedule,
//       amountBorrowed: userPayment.amountBorrowed,
//       receipt
//     });

//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({
//       message: 'Error updating payment',
//       error: error.message
//     });
//   }
// };


// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR' 
  }).format(amount);
};

const sendPaymentEmail = async (user, payment, receipt) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Payment Receipt - ${receipt.receiptNumber}`,
    html: `
      <h2>Payment Receipt</h2>
      <p>Hello ${user.name},</p>
      <p>Your payment details:</p>
      <ul>
        <li>Receipt Number: ${receipt.receiptNumber}</li>
        <li>Amount: ${formatCurrency(receipt.amount)}</li>
        <li>EMI Number: ${receipt.serialNo}</li>
        <li>Payment Date: ${receipt.paymentDate.toLocaleDateString()}</li>
      </ul>
      <p>Thank you for your payment!</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

const sendPaymentSMS = async (user, payment, receipt) => {
  const message = `Payment of ${formatCurrency(receipt.amount)} received. Receipt No: ${receipt.receiptNumber}. EMI: ${receipt.serialNo}. Date: ${receipt.paymentDate.toLocaleDateString()}`;
  
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: user.mobileNumber
  });
};



// const updatePaymentDetails = async (req, res) => {
//   try {
//     const { userId, serialNo } = req.params;
//     const { emiAmount, status } = req.body;

//     // Your logic to update payment
//     const updatedPayment = await UserPayment.findOneAndUpdate(
//       { userId: mongoose.Types.ObjectId(userId), "payments.serialNo": serialNo },
//       {
//         $set: {
//           "payments.$.emiAmount": emiAmount,
//           "payments.$.status": status,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedPayment) {
//       return res.status(404).send({ message: 'Payment not found or unable to update.' });
//     }

//     res.status(200).send(updatedPayment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error updating payment details' });
//   }
// };











exports.getAllUsersWithPayments = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const users = await UserPayment.find({ organizerId })
      .select('name email mobileNumber amountBorrowed tenure interest monthlyEMI paymentSchedule')
      .sort({ name: 1 });

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};


