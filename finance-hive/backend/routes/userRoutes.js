// routes/userRoutes.js
const express = require('express');
const { getUserById } = require('../controllers/userController'); // Import the user controller
const router = express.Router();
const authController = require('../controllers/authController');  // Import the auth controller
// Make sure the route is correct
router.get('/user/:userId', getUserById);
const UserPayment = require('../models/UserPayment');  // Import your UserPayment model

// Route to update payment details
router.patch('/api/payment/:userId/:serialNo', async (req, res) => {
  try {
    const { emiAmount, status } = req.body;  // Extract emiAmount and status from the request body
    const { userId, serialNo } = req.params;  // Extract userId and serialNo from the URL params

    // Find the specific user and payment record to update
    const userPayment = await UserPayment.findOneAndUpdate(
      { userId, "schedule.serialNo": serialNo },  // Search for user and the specific payment schedule
      { 
        $set: { 
          "schedule.$.emiAmount": emiAmount,    // Update the EMI amount
          "schedule.$.status": status           // Update the payment status
        }
      },
      { new: true }  // Return the updated document
    );

    if (!userPayment) {
      return res.status(404).json({ message: "Payment schedule not found." });  // If no record is found
    }

    // Send the updated payment schedule back in the response
    res.json({ message: "Payment details updated successfully", schedule: userPayment.schedule });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Failed to update payment" });  // Error response
  }
});

// Add this to userRoutes.js
router.get('/receipts', authController.protect, async (req, res) => {
  try {
    const userPayment = await UserPayment.findById(req.user.id);
    if (!userPayment) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ receipts: userPayment.receipts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching receipts" });
  }
});


module.exports = router;
