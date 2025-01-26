const express = require('express');
const { 
  login, 
  seedAdminUser, 
  protect, 
  restrictTo,
  addUser,
  getAllUsers,
  deleteUser

} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/add-user', protect, restrictTo('admin'), addUser);
router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);  // New delete route

module.exports = router;