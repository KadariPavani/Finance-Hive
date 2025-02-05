// // // routes/payment.routes.js
// // const express = require('express');
// // const router = express.Router();
// // const auth = require('../middleware/auth');
// // const User = require('../models/User');

// // // Update payment schedule item
// // router.put('/payment-schedule/:userId/:paymentId', auth, async (req, res) => {
// //   try {
// //     const { userId, paymentId } = req.params;
// //     const updates = req.body;

// //     // Find user and update the specific payment in the schedule
// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     // Find and update the specific payment
// //     const paymentIndex = user.paymentSchedule.findIndex(
// //       payment => payment._id.toString() === paymentId
// //     );

// //     if (paymentIndex === -1) {
// //       return res.status(404).json({ message: 'Payment not found' });
// //     }

// //     // Update the payment
// //     user.paymentSchedule[paymentIndex] = {
// //       ...user.paymentSchedule[paymentIndex],
// //       ...updates,
// //       paymentDate: new Date(updates.paymentDate)
// //     };

// //     await user.save();

// //     res.json({ 
// //       message: 'Payment schedule updated successfully',
// //       payment: user.paymentSchedule[paymentIndex]
// //     });

// //   } catch (error) {
// //     console.error('Error updating payment schedule:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // module.exports = router;


// // In your routes file (e.g., routes/paymentRoutes.js)
// const express = require('express');
// const router = express.Router();
// const paymentController = require('../controllers/paymentController');
// const authMiddleware = require('../middleware/auth');
// router.patch('/payment/:userId/:serialNo', paymentController.updatePaymentDetails);

// // Route for fetching payment schedule
// router.get('/payment-schedule/:userId', paymentController.createPaymentSchedule);
// // router.put('/payment-schedule/:userId/:serialNo', paymentController.updatePaymentDetails);
// router.get('/user/:userId', authMiddleware, async (req, res) => {
//   try {
//     const user = await UserPayment.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Error fetching user data' });
//   }
// });
// module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');
const UserPayment = require('../models/UserPayment'); // Add this import

// Payment update route
router.patch('/payment/:userId/:serialNo', paymentController.updatePaymentDetails);

// Payment schedule route
router.get('/payment-schedule/:userId', paymentController.createPaymentSchedule);

// User details route
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await UserPayment.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

router.patch('/:userId/:serialNo', paymentController.updatePaymentDetails);

// Route to get all users with payments
router.get('/users/:organizerId', paymentController.getAllUsersWithPayments);

module.exports = router;