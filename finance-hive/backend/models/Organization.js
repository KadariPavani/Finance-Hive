const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  organizationName: { type: String, required: true },
  organizationMail: { type: String, required: true },
  date: { type: String, required: true },
  moneyGiven: { type: Number, required: true },
  status: { type: String, required: true },
  amountAtOrganization: { type: Number, required: true },
  amountGivenMonthly: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  interest: { type: Number, required: true },
});

module.exports = mongoose.model('Organization', OrganizationSchema);
