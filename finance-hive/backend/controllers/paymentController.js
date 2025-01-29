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
    
    console.log("Received update request:", { userId, serialNo, emiAmount, status }); // Add this

    const userPayment = await UserPayment.findById(userId);
    if (!userPayment) {
      console.log("User payment not found for ID:", userId); // Add this
      return res.status(404).json({ message: "User payment details not found" });
    }

    // Find the payment schedule entry
    const paymentIndex = userPayment.paymentSchedule.findIndex(
      s => s.serialNo === parseInt(serialNo)
    );
    
    console.log("Found payment at index:", paymentIndex); // Add this
    
    if (paymentIndex === -1) {
      console.log("Payment schedule entry not found for serial:", serialNo); // Add this
      return res.status(404).json({ message: "Payment schedule entry not found" });
    }

    // Update the payment details
    userPayment.paymentSchedule[paymentIndex].status = status;
    if (emiAmount) {
      userPayment.paymentSchedule[paymentIndex].emiAmount = emiAmount;
    }

    console.log("Saving updated payment schedule"); // Add this
    await userPayment.save();

    console.log("Payment updated successfully"); // Add this
    res.status(200).json({
      message: "Payment details updated successfully",
      schedule: userPayment.paymentSchedule
    });
  } catch (error) {
    console.error("Error in updatePaymentDetails:", error); // Modified this
    res.status(500).json({ message: "Error updating payment details" });
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