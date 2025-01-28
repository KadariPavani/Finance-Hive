// utils/calculatePayments.js

const calculateEMI = (principal, tenure, interestRate) => {
  const monthlyInterestRate = interestRate / (100 * 12);
  const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) / 
              (Math.pow(1 + monthlyInterestRate, tenure) - 1);
  return Math.round(emi * 100) / 100;
};

const generatePaymentSchedule = (principal, tenure, interestRate, startDate) => {
  const emi = calculateEMI(principal, tenure, interestRate);
  const schedule = [];
  let balance = principal;
  let paymentDate = new Date(startDate);

  for (let i = 1; i <= tenure; i++) {
    const monthlyInterest = (balance * interestRate) / (100 * 12);
    const monthlyPrincipal = emi - monthlyInterest;
    balance -= monthlyPrincipal;

    schedule.push({
      serialNo: i,
      paymentDate: new Date(paymentDate),
      emiAmount: emi,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      balance: Math.max(0, balance),
      status: 'PENDING'
    });

    paymentDate.setMonth(paymentDate.getMonth() + 1);
  }

  return schedule;
};

module.exports = { calculateEMI, generatePaymentSchedule };