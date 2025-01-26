const express = require('express');
const { 
  login, 
  seedAdminUser, 
  protect, 
  restrictTo,
  addUser,
  getAllUsers,
  deleteUser,
  addUserAndSendEmail,
  getUserById
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/add-user', protect, restrictTo('admin'), addUser);
router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);  // New delete route
router.post("/add-user-payment", protect, restrictTo("organizer"), addUserAndSendEmail);
router.get("/user/me", protect, restrictTo("user"), getUserById);
module.exports = router;