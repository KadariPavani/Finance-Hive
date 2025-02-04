const mongoose = require('mongoose');
// controllers/paymentController.js
const { calculateEMI, generatePaymentSchedule } = require('../utils/calculatePayments');
const UserPayment = require('../models/UserPayment');

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
// Update Payment Details (EMI and Status)
exports.updatePaymentDetails = async (req, res) => {
  try {
    const { userId, serialNo } = req.params;
    const { emiAmount, status } = req.body;

    const userPayment = await UserPayment.findById(userId);
    const paymentIndex = userPayment.paymentSchedule.findIndex(
      p => p.serialNo === Number(serialNo)
    );

    // Update payment details
    const payment = userPayment.paymentSchedule[paymentIndex];
    if (emiAmount) payment.emiAmount = emiAmount;
    if (status) payment.status = status;

    // Recalculate balances starting from previous payment
    let currentBalance = paymentIndex > 0 
      ? userPayment.paymentSchedule[paymentIndex - 1].balance
      : userPayment.amountBorrowed;

    for (let i = paymentIndex; i < userPayment.paymentSchedule.length; i++) {
      const p = userPayment.paymentSchedule[i];
      
      if (!p.locked) {
        const monthlyInterest = currentBalance * (userPayment.interest / 100) / 12;
        const principal = p.emiAmount - monthlyInterest;
        
        // Ensure principal doesn't exceed remaining balance
        p.principal = Math.min(principal, currentBalance);
        p.interest = p.emiAmount - p.principal;
        p.balance = currentBalance - p.principal;

        // Update for next iteration
        currentBalance = p.balance;
        
        // Auto-lock paid payments
        if (p.status === 'PAID') p.locked = true;

        // Check if balance is zero or negative after this payment
        if (currentBalance <= 0) {
          // Set remaining payments to zero and PAID
          for (let j = i + 1; j < userPayment.paymentSchedule.length; j++) {
            const remainingP = userPayment.paymentSchedule[j];
            remainingP.emiAmount = 0;
            remainingP.principal = 0;
            remainingP.interest = 0;
            remainingP.balance = 0;
            remainingP.status = 'PAID';
            remainingP.locked = true;
          }
          break; // Exit the loop as no more payments needed
        }
      }
    }

    await userPayment.save();
    res.json({ 
      schedule: userPayment.paymentSchedule,
      amountBorrowed: userPayment.amountBorrowed 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment' });
  }
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