// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// Submit new notification
router.post('/submit-notification', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({
      success: true,
      message: 'Notification submitted successfully',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all notifications
router.get('/get-notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get notification by ID
router.get('/notification/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;