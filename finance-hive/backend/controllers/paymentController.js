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
exports.updatePaymentDetails = async (req, res) => {
  try {
    const { userId, serialNo } = req.params;
    const { emiAmount, status } = req.body;

    // Find the user payment document
    const userPayment = await UserPayment.findById(userId);
    if (!userPayment) {
      return res.status(404).json({ message: 'User payment not found' });
    }

    // Find the specific payment
    const paymentIndex = userPayment.paymentSchedule.findIndex(
      p => p.serialNo === Number(serialNo)
    );
    if (paymentIndex === -1) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment details
    const payment = userPayment.paymentSchedule[paymentIndex];
    if (emiAmount) payment.emiAmount = emiAmount;
    if (status) payment.status = status;

    // Recalculate entire schedule from the modified payment onward
    let currentBalance = paymentIndex === 0 
      ? userPayment.amountBorrowed
      : userPayment.paymentSchedule[paymentIndex - 1].balance;

    for (let i = paymentIndex; i < userPayment.paymentSchedule.length; i++) {
      const p = userPayment.paymentSchedule[i];
      
      // Only recalculate if payment is not locked
      if (!p.locked) {
        p.interest = currentBalance * (userPayment.interest / 100) / 12;
        p.principal = payment.emiAmount - p.interest;
        p.balance = currentBalance - p.principal;
        
        // Prevent negative balance
        if (p.balance < 0) {
          p.principal += p.balance;
          p.balance = 0;
        }
        
        currentBalance = p.balance;
      }
    }

    await userPayment.save();
    res.json({ 
      message: 'Payment updated successfully',
      schedule: userPayment.paymentSchedule 
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Server error' });
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