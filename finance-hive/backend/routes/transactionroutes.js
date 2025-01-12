const express = require('express');
const Transaction = require('../models/transactions'); // Assuming a MongoDB model is set up
const router = express.Router();

// 1. Add a new transaction
router.post('/submit', async (req, res) => {
  console.log('Incoming request:', req.body);

  const { username, email, transactionId, amount, purpose, status } = req.body;

  // Validate the required fields
  if (!username || !email || !transactionId || !amount || !purpose || !status) {
      console.error('Validation failed. Missing fields:', req.body);
      return res.status(400).json({ message: 'All fields are required!' });
  }

  // Ensure valid status values
  if (!['credited', 'debited'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status, must be "credited" or "debited"' });
  }

  try {
      const newTransaction = new Transaction({ username, email, transactionId, amount, purpose, status });
      await newTransaction.save();
      res.status(201).json({ message: 'Transaction added successfully!', data: newTransaction });
  } catch (error) {
      console.error('Error saving transaction:', error);
      res.status(500).json({ message: 'Error adding transaction', error });
  }
});

// GET: Fetch all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// PUT: Update an existing transaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, transactionId, amount, purpose, status } = req.body;

  // Validate request data
  if (!username || !email || !transactionId || !amount || !purpose || !status) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Ensure valid status values
  if (!['credited', 'debited'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status, must be "credited" or "debited"' });
  }

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { username, email, transactionId, amount, purpose, status },
      { new: true, runValidators: true } // Ensures updated data is validated
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction updated successfully!', data: updatedTransaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction', error });
  }
});

// DELETE: Delete a transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully!' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

module.exports = router;
