const express = require('express');
const Expenses = require('../models/expenses'); // Assuming a MongoDB model is set up
const router = express.Router();

router.post('/submit', async (req, res) => {
  console.log('Incoming request:', req.body);

  const { username, email, income, food, rent, bills, insurance } = req.body;
  if (!username || !email || !income || !food || !rent || !bills || !insurance) {
      console.error('Validation failed. Missing fields:', req.body);
      return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
      const newExpense = new Expenses({ username, email, income, food, rent, bills, insurance });
      await newExpense.save();
      res.status(201).json({ message: 'Expense added successfully!', data: newExpense });
  } catch (error) {
      console.error('Error saving expense:', error);
      res.status(500).json({ message: 'Error adding expense', error });
  }
});

// GET: Fetch all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expenses.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

// PUT: Update an existing expense
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, income, food, rent, bills, insurance } = req.body;

  // Validate request data
  if (!username || !email || !income || !food || !rent || !bills || !insurance) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const updatedExpense = await Expenses.findByIdAndUpdate(
      id,
      { username, email, income, food, rent, bills, insurance },
      { new: true, runValidators: true } // Ensures updated data is validated
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense updated successfully!', data: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Error updating expense', error });
  }
});

// DELETE: Delete an expense
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expenses.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully!' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense', error });
  }
});

module.exports = router;
