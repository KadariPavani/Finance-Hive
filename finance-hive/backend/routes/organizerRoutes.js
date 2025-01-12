const express = require('express');
const Organization = require('../models/Organization');

const router = express.Router();

// POST Endpoint to Save Organization Data
router.post('/', async (req, res) => {
  try {
    const newOrganization = new Organization(req.body);
    await newOrganization.save();
    res.status(201).json({ message: 'Organization data saved successfully!' });
  } catch (error) {
    console.error('Error saving organization data:', error);
    res.status(500).json({ message: 'Error saving organization data', error: error.message });
  }
});

// GET Endpoint to Fetch Organization Data
router.get('/', async (req, res) => {
  try {
    const data = await Organization.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching organization data:', error);
    res.status(500).json({ error: 'Failed to fetch organization data.' });
  }
});

module.exports = router;
