const express = require('express');
const router = express.Router();
const Organizer = require('../models/Organizer');

// Route to get organizer details
router.get('/:organizerId', async (req, res) => {
  const { organizerId } = req.params;

  try {
    const organizer = await Organizer.findById(organizerId);
    if (!organizer) return res.status(404).json({ msg: 'Organizer not found' });

    res.json(organizer);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching organizer details', error: error.message });
  }
});

// Add more routes as needed

module.exports = router;
