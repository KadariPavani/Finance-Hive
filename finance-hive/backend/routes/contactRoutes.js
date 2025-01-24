const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// Define POST route for contact form submission
router.post('/contact', submitContactForm);

module.exports = router;
