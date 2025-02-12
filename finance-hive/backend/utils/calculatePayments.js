// utils/calculatePayments.js

const calculateEMI = (principal, tenure, interestRate) => {
  const monthlyInterestRate = interestRate / (100 * 12);
  const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) / 
              (Math.pow(1 + monthlyInterestRate, tenure) - 1);
  return Math.round(emi * 100) / 100;
};

const generatePaymentSchedule = (amountBorrowed, tenure, interest, startDate, startSerialNo = 1) => {
  const paymentSchedule = [];
  const monthlyInterestRate = interest / 100 / 12;
  const monthlyEMI = calculateEMI(amountBorrowed, tenure, interest);
  let balance = amountBorrowed;

  for (let i = 0; i < tenure; i++) {
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    const monthlyInterest = balance * monthlyInterestRate;
    const principal = monthlyEMI - monthlyInterest;

    paymentSchedule.push({
      serialNo: startSerialNo + i,
      paymentDate,
      emiAmount: monthlyEMI,
      principal,
      interest: monthlyInterest,
      balance: balance - principal,
      status: 'PENDING',
      locked: false,
    });

    balance -= principal;
  }

  return paymentSchedule;
};

module.exports = { calculateEMI, generatePaymentSchedule };