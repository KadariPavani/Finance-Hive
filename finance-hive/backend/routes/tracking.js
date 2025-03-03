const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const SavingsGoal = require('../models/SavingsGoal');

// Helper function to get start date based on period
const getStartDate = (period) => {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setMonth(now.getMonth() - 1)); // default to month
  }
 };


// Get statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const userId = req.user.id;
    const startDate = getStartDate(period);

    // Get all transactions for the period
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate }
    });

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
    const expenseCategories = {};

    // Process transactions
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
        // Add to expense categories
        expenseCategories[transaction.category] = (expenseCategories[transaction.category] || 0) + transaction.amount;
      }
    });

    // Get savings goals
    const savingsGoals = await SavingsGoal.find({ userId });
    const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    // Format expense categories for chart
    const expensesByCategory = Object.entries(expenseCategories).map(([category, amount]) => ({
      category,
      amount
    }));

    // Calculate trend data
    const trend = [];
    const dateFormat = { month: 'short', day: 'numeric' };
    
    // Group transactions by date
    const groupedByDate = transactions.reduce((acc, t) => {
      const dateKey = t.date.toLocaleDateString('en-US', dateFormat);
      if (!acc[dateKey]) {
        acc[dateKey] = { income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        acc[dateKey].income += t.amount;
      } else {
        acc[dateKey].expenses += t.amount;
      }
      return acc;
    }, {});

    // Convert grouped data to array format
    Object.entries(groupedByDate).forEach(([date, values]) => {
      trend.push({
        date,
        ...values
      });
    });

    // Sort trend data by date
    trend.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalIncome,
      totalExpenses,
      totalSavings,
      expensesByCategory,
      trend
    });

  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Add income
router.post('/income', auth, async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'income',
      amount: Number(amount),
      category,
      date: new Date(date),
      notes
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error adding income', error: error.message });
  }
});

// Add expense
router.post('/expense', auth, async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'expense',
      amount: Number(amount),
      category,
      date: new Date(date),
      notes
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error: error.message });
  }
});

// Get all savings goals
router.get('/savings', auth, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching savings goals' });
  }
});

// Get single savings goal
router.get('/savings/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching savings goal' });
  }
});

// Create savings goal
router.post('/savings', auth, async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, targetDate, description, category } = req.body;
    const newGoal = new SavingsGoal({
      userId: req.user.id,
      goalName,
      targetAmount,
      currentAmount: currentAmount || 0,
      targetDate,
      description,
      category,
      progress: (currentAmount / targetAmount) * 100,
      status: currentAmount >= targetAmount ? 'Completed' : 'In Progress'
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating savings goal' });
  }
});

// Update savings goal
router.put('/savings/:id', auth, async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, targetDate, description, category } = req.body;
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        goalName,
        targetAmount,
        currentAmount,
        targetDate,
        description,
        category,
        progress: (currentAmount / targetAmount) * 100,
        status: currentAmount >= targetAmount ? 'Completed' : 'In Progress',
        lastUpdated: Date.now()
      },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating savings goal' });
  }
});

// Delete savings goal
router.delete('/savings/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    res.json({ message: 'Savings goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting savings goal' });
  }
});

// Get savings statistics
router.get('/savings-stats', auth, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id });
    const stats = {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.status === 'Completed').length,
      totalSaved: goals.reduce((sum, g) => sum + g.currentAmount, 0),
      totalTarget: goals.reduce((sum, g) => sum + g.targetAmount, 0),
      categoryBreakdown: goals.reduce((acc, g) => {
        acc[g.category] = (acc[g.category] || 0) + g.currentAmount;
        return acc;
      }, {}),
      upcomingDeadlines: goals
        .filter(g => g.status !== 'Completed')
        .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
        .slice(0, 5)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching savings statistics' });
  }
});

module.exports = router;

// // Add transaction (income or expense)
// router.post('/transaction', auth, async (req, res) => {
//   try {
//     const { type, amount, category, date, notes } = req.body;
//     const transaction = new Transaction({
//       userId: req.user.id,
//       type,
//       amount,
//       category,
//       date,
//       notes
//     });
//     await transaction.save();
//     res.json(transaction);
//   } catch (error) {
//     res.status(500).send('Server Error');
//   }
// });

// // Get user's transactions with filtering and pagination
// router.get('/transactions', auth, async (req, res) => {
//   try {
//     const { type, startDate, endDate, category, page = 1, limit = 10 } = req.query;
//     const query = { userId: req.user.id };

//     if (type) query.type = type;
//     if (category) query.category = category;
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) query.date.$gte = new Date(startDate);
//       if (endDate) query.date.$lte = new Date(endDate);
//     }

//     const transactions = await Transaction.find(query)
//       .sort({ date: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const total = await Transaction.countDocuments(query);

//     res.json({
//       transactions,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     res.status(500).send('Server Error');
//   }
// });

// // Get transaction statistics
// // tracking.routes.js

// router.get('/statistics', auth, async (req, res) => {
//   try {
//     const { period = 'month' } = req.query;
//     const userId = req.user.id;

//     // Get transactions for the period
//     const startDate = getStartDate(period); // Helper function to calculate start date
    
//     // Fetch transactions
//     const transactions = await Transaction.find({
//       userId,
//       date: { $gte: startDate }
//     });

//     // Calculate totals
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);

//     const totalExpenses = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     // Get savings goals total
//     const savingsGoals = await SavingsGoal.find({ userId });
//     const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

//     // Calculate expenses by category
//     const expensesByCategory = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((acc, t) => {
//         acc[t.category] = (acc[t.category] || 0) + t.amount;
//         return acc;
//       }, {});

//     // Format expenses for chart
//     const expensesChart = Object.entries(expensesByCategory).map(([category, amount]) => ({
//       category,
//       amount
//     }));

//     // Calculate trend data
//     const trend = calculateTrendData(transactions, period); // Helper function to group by date

//     res.json({
//       totalIncome,
//       totalExpenses,
//       totalSavings,
//       expensesByCategory: expensesChart,
//       trend
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching statistics' });
//   }
// });

// // Helper function for trend calculation
// const calculateTrendData = (transactions, period) => {
//   const grouped = transactions.reduce((acc, t) => {
//     const date = formatDate(t.date, period); // Helper to format date based on period
//     if (!acc[date]) {
//       acc[date] = { income: 0, expenses: 0 };
//     }
//     if (t.type === 'income') {
//       acc[date].income += t.amount;
//     } else {
//       acc[date].expenses += t.amount;
//     }
//     return acc;
//   }, {});

//   return Object.entries(grouped).map(([date, values]) => ({
//     date,
//     ...values
//   }));
// };

// // Add savings goal
// router.post('/savings', auth, async (req, res) => {
//   try {
//     const { goalName, targetAmount, currentAmount, targetDate, description } = req.body;
//     const savingsGoal = new SavingsGoal({
//       userId: req.user.id,
//       goalName,
//       targetAmount,
//       currentAmount,
//       targetDate,
//       description
//     });
//     await savingsGoal.save();
//     res.json(savingsGoal);
//   } catch (error) {
//     res.status(500).send('Server Error');
//   }
// });

// // Get user's savings goals
// router.get('/savings', auth, async (req, res) => {
//   try {
//     const savingsGoals = await SavingsGoal.find({ userId: req.user.id })
//       .sort({ targetDate: 1 });
//       res.json(savingsGoals);
//     } catch (error) {
//       res.status(500).send('Server Error');
//     }
//   });
  
//   // Update savings goal progress
//   router.put('/savings/:id', auth, async (req, res) => {
//     try {
//       const { currentAmount } = req.body;
//       const savingsGoal = await SavingsGoal.findOneAndUpdate(
//         { _id: req.params.id, userId: req.user.id },
//         { currentAmount },
//         { new: true }
//       );
//       res.json(savingsGoal);
//     } catch (error) {
//       res.status(500).send('Server Error');
//     }
//   });
  
//   // Delete a savings goal
//   router.delete('/savings/:id', auth, async (req, res) => {
//     try {
//       await SavingsGoal.findOneAndDelete({
//         _id: req.params.id,
//         userId: req.user.id,
//       });
//       res.json({ message: 'Savings goal deleted successfully' });
//     } catch (error) {
//       res.status(500).send('Server Error');
//     }
//   });
  
//   // Add income
//   router.post('/income', auth, async (req, res) => {
//     try {
//       const { amount, category, date, notes } = req.body;
//       const transaction = new Transaction({
//         userId: req.user.id,
//         type: 'income',
//         amount,
//         category,
//         date: date || new Date(),
//         notes,
//       });
//       await transaction.save();
//       res.json(transaction);
//     } catch (error) {
//       console.error('Error saving income:', error);
//       res.status(500).send('Server Error');
//     }
//   });
  
//   // Add expense
//   router.post('/expense', auth, async (req, res) => {
//     try {
//       const { amount, category, date, notes } = req.body;
//       const transaction = new Transaction({
//         userId: req.user.id,
//         type: 'expense',
//         amount,
//         category,
//         date: date || new Date(),
//         notes,
//       });
//       await transaction.save();
//       res.json(transaction);
//     } catch (error) {
//       console.error('Error saving expense:', error);
//       res.status(500).send('Server Error');
//     }
//   });
  
//   // Delete a transaction
//   router.delete('/transaction/:id', auth, async (req, res) => {
//     try {
//       await Transaction.findOneAndDelete({
//         _id: req.params.id,
//         userId: req.user.id,
//       });
//       res.json({ message: 'Transaction deleted successfully' });
//     } catch (error) {
//       res.status(500).send('Server Error');
//     }
//   });
  
//   module.exports = router;
   