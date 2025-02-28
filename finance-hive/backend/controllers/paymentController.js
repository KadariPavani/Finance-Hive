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

// exports.updatePaymentDetails = async (req, res) => {
//   try {
//     const { userId, serialNo } = req.params;
//     const { emiAmount, status } = req.body;

//     const userPayment = await UserPayment.findById(userId);
//     if (!userPayment) {
//       return res.status(404).json({ message: "User payment details not found" });
//     }

//     const currentIndex = userPayment.paymentSchedule.findIndex(
//       p => p.serialNo === Number(serialNo)
//     );

//     if (currentIndex === -1) {
//       return res.status(404).json({ message: "Payment schedule entry not found" });
//     }

//     const payment = userPayment.paymentSchedule[currentIndex];

//     // Check if payment is locked
//     if (payment.locked) {
//       return res.status(400).json({ message: "Cannot modify a locked payment" });
//     }

//     let receipt = null;

//     // Handle EMI amount update
//     if (emiAmount !== undefined) {
//       const newEmiAmount = Number(parseFloat(emiAmount).toFixed(2));
      
//       // Validate EMI amount
//       if (isNaN(newEmiAmount) || newEmiAmount < 0) {
//         return res.status(400).json({ message: "Invalid EMI amount" });
//       }

//       // Calculate total paid amount up to current payment
//       const paidAmount = userPayment.paymentSchedule
//         .slice(0, currentIndex)
//         .reduce((acc, p) => acc + (p.status === 'PAID' ? Number(p.emiAmount) : 0), 0);
      
//       const totalRemainingAmount = Number((userPayment.amountBorrowed - paidAmount).toFixed(2));

//       // Update current payment
//       payment.emiAmount = newEmiAmount;

//       // Calculate remaining amount after current payment
//       const remainingAfterCurrent = Number((totalRemainingAmount - newEmiAmount).toFixed(2));

//       // Update remaining payments
//       if (currentIndex < userPayment.paymentSchedule.length - 1) {
//         const remainingPayments = userPayment.paymentSchedule.length - currentIndex - 1;
        
//         if (remainingPayments > 0) {
//           let remainingBalance = remainingAfterCurrent;

//           // Update subsequent payments
//           for (let i = currentIndex + 1; i < userPayment.paymentSchedule.length; i++) {
//             const currentPayment = userPayment.paymentSchedule[i];
            
//             if (i === userPayment.paymentSchedule.length - 1) {
//               currentPayment.emiAmount = Number(remainingBalance.toFixed(2));
//             } else {
//               const equalShare = Number((remainingBalance / (userPayment.paymentSchedule.length - i)).toFixed(2));
//               currentPayment.emiAmount = equalShare;
//               remainingBalance -= equalShare;
//             }

//             // Update balance and check if payment should be marked as paid
//             currentPayment.balance = Number(remainingBalance.toFixed(2));
            
//             // Auto-mark as paid if amount and balance are 0
//             if (currentPayment.emiAmount === 0 && currentPayment.balance === 0) {
//               currentPayment.status = 'PAID';
//               currentPayment.paidDate = new Date();
//               currentPayment.locked = true;
//             }
//           }
//         }
//       }

//       // Recalculate balances and check for auto-paid status
//       let runningBalance = userPayment.amountBorrowed;
//       for (let i = 0; i < userPayment.paymentSchedule.length; i++) {
//         const currentPayment = userPayment.paymentSchedule[i];
//         runningBalance = Number((runningBalance - currentPayment.emiAmount).toFixed(2));
//         currentPayment.balance = Math.max(0, runningBalance);

//         // Auto-mark as paid if amount and balance are 0
//         if (currentPayment.emiAmount === 0 && currentPayment.balance === 0 && !currentPayment.locked) {
//           currentPayment.status = 'PAID';
//           currentPayment.paidDate = new Date();
//           currentPayment.locked = true;

//           // Generate receipt for auto-paid payments
//           const autoReceipt = {
//             receiptNumber: `RCPT-${Date.now()}-${currentPayment.serialNo}`,
//             paymentDate: new Date(),
//             amount: 0,
//             serialNo: currentPayment.serialNo
//           };
//           userPayment.receipts.push(autoReceipt);
//         }
//       }
//     }

//     // Handle manual status update
//     if (status) {
//       payment.status = status;

//       if (status === 'PAID') {
//         payment.paidDate = new Date();
//         payment.locked = true;

//         // Generate receipt for manual payment
//         receipt = {
//           receiptNumber: `RCPT-${Date.now()}-${payment.serialNo}`,
//           paymentDate: new Date(),
//           amount: payment.emiAmount,
//           serialNo: payment.serialNo
//         };

//         userPayment.receipts.push(receipt);

//         try {
//           await Promise.all([
//             createNotification(
//               userPayment._id,
//               'Payment Receipt Generated',
//               `Payment of ${payment.emiAmount} for EMI ${payment.serialNo} is completed.`,
//               'PAYMENT',
//               { receipt }
//             ),
//             sendPaymentEmail(userPayment, payment, receipt)
//           ]);
//         } catch (error) {
//           console.error('Notification/Email error:', error);
//         }
//       } else {
//         payment.paidDate = null;
//         payment.locked = false;
//       }
//     }

//     await userPayment.save();

//     res.json({
//       message: "Payment details updated successfully",
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

    // Calculate total amount with interest at the start
    const totalAmountWithInterest = userPayment.paymentSchedule.reduce(
      (acc, p) => acc + Number(p.emiAmount), 
      0
    );

    const currentIndex = userPayment.paymentSchedule.findIndex(
      p => p.serialNo === Number(serialNo)
    );

    if (currentIndex === -1) {
      return res.status(404).json({ message: "Payment schedule entry not found" });
    }

    const payment = userPayment.paymentSchedule[currentIndex];

    // Handle EMI amount update
    if (emiAmount !== undefined) {
      const newEmiAmount = Number(parseFloat(emiAmount).toFixed(2));
      
      // Validate EMI amount
      if (isNaN(newEmiAmount) || newEmiAmount < 0) {
        return res.status(400).json({ message: "Invalid EMI amount" });
      }

      // Calculate total paid amount up to current payment for both principal and interest
      const paidAmountWithInterest = userPayment.paymentSchedule
        .slice(0, currentIndex)
        .reduce((acc, p) => acc + (p.status === 'PAID' ? Number(p.emiAmount) : 0), 0);

      // Calculate proportional principal paid
      const principalRatio = userPayment.amountBorrowed / totalAmountWithInterest;
      const paidPrincipal = paidAmountWithInterest * principalRatio;
      
      // Calculate remaining amounts for both principal and total with interest
      const totalRemainingWithInterest = Number((totalAmountWithInterest - paidAmountWithInterest).toFixed(2));
      const principalRemainingAmount = Number((userPayment.amountBorrowed - paidPrincipal).toFixed(2));

      // Get the maximum allowed amount (minimum of remaining principal and total with interest)
      const maxAllowedAmount = Math.min(principalRemainingAmount, totalRemainingWithInterest);

      // Validate if new amount exceeds maximum allowed
      if (newEmiAmount > maxAllowedAmount) {
        return res.status(400).json({ 
          message: `Amount cannot exceed remaining balance of ${maxAllowedAmount}` 
        });
      }

      // Store old amount for comparison
      const oldAmount = payment.emiAmount;

      // Update current payment
      payment.emiAmount = newEmiAmount;

      // Handle status changes based on amount
      if (oldAmount === 0 && newEmiAmount > 0) {
        // If amount changes from 0 to something, set to PENDING and unlock
        payment.status = 'PENDING';
        payment.locked = false;
        payment.paidDate = null;
      } else if (newEmiAmount === 0) {
        // If amount becomes 0, set to PAID and lock
        payment.status = 'PAID';
        payment.locked = true;
        payment.paidDate = new Date();
      } else if (payment.status === 'PAID' && newEmiAmount !== oldAmount) {
        // If paid amount changes, reset to PENDING
        payment.status = 'PENDING';
        payment.locked = false;
        payment.paidDate = null;
        // Remove the corresponding receipt
        userPayment.receipts = userPayment.receipts.filter(
          r => r.serialNo !== payment.serialNo
        );
      }

      // Calculate remaining amount after current payment
      const remainingAfterCurrent = Number((totalRemainingWithInterest - newEmiAmount).toFixed(2));

      // Update subsequent payments
      if (currentIndex < userPayment.paymentSchedule.length - 1) {
        const remainingPayments = userPayment.paymentSchedule.length - currentIndex - 1;
        
        if (remainingPayments > 0) {
          let remainingBalance = remainingAfterCurrent;

          // Update remaining payments
          for (let i = currentIndex + 1; i < userPayment.paymentSchedule.length; i++) {
            const currentPayment = userPayment.paymentSchedule[i];
            const oldPaymentAmount = currentPayment.emiAmount;
            
            if (i === userPayment.paymentSchedule.length - 1) {
              currentPayment.emiAmount = Number(remainingBalance.toFixed(2));
            } else {
              const equalShare = Number((remainingBalance / (userPayment.paymentSchedule.length - i)).toFixed(2));
              currentPayment.emiAmount = equalShare;
              remainingBalance = Number((remainingBalance - equalShare).toFixed(2));
            }

            // Handle status changes for subsequent payments
            if (oldPaymentAmount === 0 && currentPayment.emiAmount > 0) {
              currentPayment.status = 'PENDING';
              currentPayment.locked = false;
              currentPayment.paidDate = null;
            } else if (currentPayment.emiAmount === 0) {
              currentPayment.status = 'PAID';
              currentPayment.locked = true;
              currentPayment.paidDate = new Date();
            } else if (currentPayment.status === 'PAID' && currentPayment.emiAmount !== oldPaymentAmount) {
              currentPayment.status = 'PENDING';
              currentPayment.locked = false;
              currentPayment.paidDate = null;
              // Remove corresponding receipt
              userPayment.receipts = userPayment.receipts.filter(
                r => r.serialNo !== currentPayment.serialNo
              );
            }
          }
        }
      }

      // Recalculate balances based on total amount with interest
      let runningBalance = totalAmountWithInterest;
      for (let i = 0; i < userPayment.paymentSchedule.length; i++) {
        const currentPayment = userPayment.paymentSchedule[i];
        currentPayment.emiAmount = Number(currentPayment.emiAmount.toFixed(2));
        runningBalance = Number((runningBalance - currentPayment.emiAmount).toFixed(2));
        currentPayment.balance = Math.max(0, runningBalance);
      }
    }

    // Handle manual status update only if payment is not locked
    if (status && !payment.locked) {
      payment.status = status;

      if (status === 'PAID' && payment.emiAmount > 0) { // Only generate receipt for non-zero amounts
        payment.paidDate = new Date();
        payment.locked = true;

        const receipt = {
          receiptNumber: `RCPT-${Date.now()}-${payment.serialNo}`,
          paymentDate: new Date(),
          amount: payment.emiAmount,
          serialNo: payment.serialNo
        };

        userPayment.receipts.push(receipt);

        try {
          await Promise.all([
            createNotification(
              userPayment._id,
              'Payment Receipt Generated',
              `Payment of ${payment.emiAmount} for EMI ${payment.serialNo} is completed.`,
              'PAYMENT',
              { receipt }
            ),
            sendPaymentEmail(userPayment, payment, receipt)
          ]);
        } catch (error) {
          console.error('Notification/Email error:', error);
        }
      }
    }

    await userPayment.save();

    // Final validation against total amount with interest
    const finalTotal = userPayment.paymentSchedule.reduce(
      (acc, p) => acc + p.emiAmount, 
      0
    );

    if (Math.abs(finalTotal - totalAmountWithInterest) > 0.01) {
      throw new Error('Payment schedule validation failed: Total EMI does not match total amount with interest');
    }

    res.json({
      message: "Payment details updated successfully",
      schedule: userPayment.paymentSchedule,
      amountBorrowed: userPayment.amountBorrowed,
      totalAmountWithInterest
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      message: 'Error updating payment',
      error: error.message
    });
  }
};

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

// Helper functions remain the same
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


