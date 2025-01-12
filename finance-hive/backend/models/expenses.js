const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  income: { type: Number, required: true },
  food: { type: Number, required: true },
  rent: { type: Number, required: true },
  bills: { type: Number, required: true },
  insurance: { type: Number, required: true },
});

module.exports = mongoose.model('Expenses', expensesSchema);
