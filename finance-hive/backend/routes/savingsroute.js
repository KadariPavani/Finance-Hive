const express = require('express');
const Savings = require('../models/savings'); // Adjust the path to your model
const router = express.Router();

// 1. Add a new savings plan
router.post('/submit', async (req, res) => {
  console.log('Incoming request:', req.body);

  const { savingsName, monthlySavingAmount, savingDayAndDate, interest, totalNeededSavingsAmount } = req.body;

  // Validate the required fields
  if (!savingsName || !monthlySavingAmount || !savingDayAndDate || !interest || !totalNeededSavingsAmount) {
    console.error('Validation failed. Missing fields:', req.body);
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Ensure savingDayAndDate is a valid date
  const date = new Date(savingDayAndDate);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ message: 'Invalid date format for savingDayAndDate.' });
  }

  try {
    const newSavings = new Savings({ 
      savingsName, 
      monthlySavingAmount, 
      savingDayAndDate: date, // Save as a Date object
      interest, 
      totalNeededSavingsAmount 
    });
    await newSavings.save();
    res.status(201).json({ message: 'Savings plan added successfully!', data: newSavings });
  } catch (error) {
    console.error('Error saving savings plan:', error);
    res.status(500).json({ message: 'Error adding savings plan', error });
  }
});

// 2. Fetch all savings plans
router.get('/', async (req, res) => {
  try {
    const savingsPlans = await Savings.find().sort({ createdAt: -1 });
    res.json(savingsPlans);
  } catch (error) {
    console.error('Error fetching savings plans:', error);
    res.status(500).json({ message: 'Error fetching savings plans', error });
  }
});

// 3. Update an existing savings plan
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { savingsName, monthlySavingAmount, savingDayAndDate, interest, totalNeededSavingsAmount } = req.body;

  // Validate request data
  if (!savingsName || !monthlySavingAmount || !savingDayAndDate || !interest || !totalNeededSavingsAmount) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Ensure savingDayAndDate is a valid date
  const date = new Date(savingDayAndDate);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ message: 'Invalid date format for savingDayAndDate.' });
  }

  try {
    const updatedSavings = await Savings.findByIdAndUpdate(
      id,
      { 
        savingsName, 
        monthlySavingAmount, 
        savingDayAndDate: date, // Update as a Date object
        interest, 
        totalNeededSavingsAmount 
      },
      { new: true, runValidators: true } // Ensures updated data is validated
    );
    if (!updatedSavings) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }
    res.json({ message: 'Savings plan updated successfully!', data: updatedSavings });
  } catch (error) {
    console.error('Error updating savings plan:', error);
    res.status(500).json({ message: 'Error updating savings plan', error });
  }
});

// 4. Delete a savings plan
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSavings = await Savings.findByIdAndDelete(id);
    if (!deletedSavings) {
      return res.status(404).json({ message: 'Savings plan not found' });
    }
    res.json({ message: 'Savings plan deleted successfully!' });
  } catch (error) {
    console.error('Error deleting savings plan:', error);
    res.status(500).json({ message: 'Error deleting savings plan', error });
  }
});

module.exports = router;
