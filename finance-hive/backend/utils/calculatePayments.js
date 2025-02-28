// utils/calculatePayments.js

const calculateEMI = (principal, tenure, interestRate) => {
  const monthlyInterestRate = interestRate / (100 * 12);
  const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) / 
              (Math.pow(1 + monthlyInterestRate, tenure) - 1);
  return Number(emi.toFixed(2));
};

const generatePaymentSchedule = (amountBorrowed, tenure, interest, startDate, startSerialNo = 1) => {
  const paymentSchedule = [];
  const totalAmount = Number((amountBorrowed * (1 + (interest * tenure / 1200))).toFixed(2));
  const monthlyEMI = calculateEMI(amountBorrowed, tenure, interest);
  let remainingAmount = totalAmount;

  for (let i = 0; i < tenure; i++) {
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    const emiAmount = i === tenure - 1 ? remainingAmount : monthlyEMI;

    paymentSchedule.push({
      serialNo: startSerialNo + i,
      paymentDate,
      emiAmount: Number(emiAmount.toFixed(2)),
      balance: Number((remainingAmount - emiAmount).toFixed(2)),
      status: 'PENDING',
      locked: false,
    });

    remainingAmount -= emiAmount;
  }

  return paymentSchedule;
};

module.exports = { calculateEMI, generatePaymentSchedule };