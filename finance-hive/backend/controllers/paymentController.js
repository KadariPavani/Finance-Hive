
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

    const userPayment = await UserPayment.findById(userId);
    if (!userPayment) {
      return res.status(404).json({ message: "User payment details not found" });
    }

    const schedule = userPayment.paymentSchedule.find(s => s.serialNo === Number(serialNo));
    if (!schedule) {
      return res.status(404).json({ message: "Payment schedule entry not found" });
    }

    let remainingBalance = userPayment.amountBorrowed;
    let updatedSchedule = [...userPayment.paymentSchedule];

    // Update the EMI for the current row if EMI amount is provided
    if (emiAmount) {
      schedule.emiAmount = emiAmount;
    }

    // Calculate the extra amount paid (if any) for this payment
    let extraPayment = 0;
    if (emiAmount && schedule.emiAmount < emiAmount) {
      extraPayment = emiAmount - schedule.emiAmount;  // Extra amount paid
    }

    // Recalculate the balance for the current row and future rows
    for (let i = serialNo - 1; i < updatedSchedule.length; i++) {
      let currentPayment = updatedSchedule[i];

      // If it's the current row being updated, adjust the EMI
      if (i === serialNo - 1 && emiAmount) {
        currentPayment.emiAmount = emiAmount;
      }

      // Subtract the EMI from the remaining balance
      remainingBalance -= currentPayment.emiAmount;

      // If extraPayment exists, reduce it from the principal (balance)
      if (extraPayment > 0) {
        remainingBalance -= extraPayment;
        extraPayment = 0;  // Reset extra payment after it's applied to the balance
      }

      // Ensure that the balance does not go negative
      remainingBalance = Math.max(remainingBalance, 0);

      // Update the remaining balance for the future payments
      currentPayment.balance = remainingBalance;

      // Adjust EMI dynamically for future payments (spread the remaining balance across the remaining payments)
      if (i === updatedSchedule.length - 1 && remainingBalance > 0) {
        // Adjust the last row to make sure the balance reaches 0
        currentPayment.emiAmount += remainingBalance;
        currentPayment.balance = 0;  // The last payment will settle the remaining balance
      }
    }

    // If status is updated, update it
    if (status) {
      schedule.status = status;
    }

    // Mark the payment as 'locked' after update to prevent future edits
    schedule.locked = true;

    // Save the updated schedule
    userPayment.paymentSchedule = updatedSchedule;
    await userPayment.save();

    res.status(200).json({ message: "Payment details updated successfully", schedule });
  } catch (error) {
    console.error("Error updating payment details:", error);
    res.status(500).json({ message: "Error updating payment details" });
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