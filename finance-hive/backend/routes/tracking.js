const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const SavingsGoal = require('../models/SavingsGoal');

// Add transaction (income or expense)
router.post('/transaction', auth, async (req, res) => {
  try {
    const { type, amount, category, date, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type,
      amount,
      category,
      date,
      notes
    });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Get user's transactions with filtering and pagination
router.get('/transactions', auth, async (req, res) => {
  try {
    const { type, startDate, endDate, category, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Get transaction statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Add savings goal
router.post('/savings', auth, async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, targetDate, description } = req.body;
    const savingsGoal = new SavingsGoal({
      userId: req.user.id,
      goalName,
      targetAmount,
      currentAmount,
      targetDate,
      description
    });
    await savingsGoal.save();
    res.json(savingsGoal);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Get user's savings goals
router.get('/savings', auth, async (req, res) => {
  try {
    const savingsGoals = await SavingsGoal.find({ userId: req.user.id })
      .sort({ targetDate: 1 });
    res.json(savingsGoals);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Update savings goal progress
router.put('/savings/:id', auth, async (req, res) => {
  try {
    const { currentAmount } = req.body;
    const savingsGoal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { currentAmount },
      { new: true }
    );
    res.json(savingsGoal);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});


// In your tracking routes file
router.post('/income', auth, async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'income',
      amount,
      category,
      date,
      notes
    });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});


// Expense endpoint
router.post('/expense', auth, async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'expense',
      amount,
      category,
      date: date || new Date(),
      notes
    });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;