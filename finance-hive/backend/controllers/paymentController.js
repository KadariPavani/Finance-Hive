
// controllers/paymentController.js
const { calculateEMI, generatePaymentSchedule } = require('../utils/calculatePayments');
const UserPayment = require('../models/UserPayment');
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

    // Save payment schedule to database
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