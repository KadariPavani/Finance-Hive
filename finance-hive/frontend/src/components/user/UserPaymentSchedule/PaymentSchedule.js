import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './PaymentSchedule.css';
import { Link } from 'react-router-dom';
import { Pie, Line, Doughnut } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 5, // Example interest rate, adjust as necessary
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: 'N/A',
    organization: 'N/A',
  });
  const [userTransactionId, setUserTransactionId] = useState(''); // Add a state for the transaction ID
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch the loan details and payment schedule based on loanId
  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);

          // Save to localStorage for fallback
          localStorage.setItem('payments', JSON.stringify(paymentSchedule));
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        //       setError('Unable to fetch payment schedule. Please try again later.');

        // Load from localStorage as a fallback
        const cachedPayments = localStorage.getItem('payments');
        if (cachedPayments) {
          const parsedPayments = JSON.parse(cachedPayments);
          setPayments(parsedPayments);
          calculateLoanDetails(parsedPayments);
        }
      }
    };

    fetchPaymentSchedule();
  }, [loanId]);




  const calculateLoanDetails = (payments) => {
    const totalAmount = payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
    const completedTransactions = payments.filter(payment => payment.status === 'Done').length;
    const pendingTransactions = payments.length - completedTransactions;
    const nextPayableDate = payments.find(payment => payment.status === 'Pay now')?.date || 'N/A';

    setLoanDetails({
      totalAmount: totalAmount.toFixed(2),
      interestRate: loanDetails.interestRate,
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const getTotalPaidAmount = () => {
    return payments
      .filter(payment => payment.status === 'Done')
      .reduce((acc, payment) => acc + parseFloat(payment.amount), 0)
      .toFixed(2);
  };

  const getMoneyTakenFromOrganization = () => {
    return loanDetails.totalAmount;
  };

  const getInterest = () => {
    const totalPaid = parseFloat(getTotalPaidAmount());
    const interest = (totalPaid * loanDetails.interestRate) / 100;
    return interest.toFixed(2);
  };

  const getBalance = () => {
    const totalPaid = parseFloat(getTotalPaidAmount());
    const balance = loanDetails.totalAmount - totalPaid;
    return balance.toFixed(2);
  };


  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    // Check if both the screenshot and transaction ID are provided
    if (!screenshot || !userTransactionId) {
      alert('Please upload the payment screenshot and enter the transaction ID.');
      return;
    }
  
    try {
      // Create FormData to send the file and other details
      const formData = new FormData();
      formData.append('transactionId', userTransactionId);
      formData.append('screenshot', screenshot);
  
      // Update the payment status in the state
      const updatedPayments = payments.map(payment =>
        payment.sno === currentPayment.sno
          ? { ...payment, status: 'Done', transactionId: userTransactionId }
          : payment
      );
  
      // Set the updated payments data to state
      setPayments(updatedPayments);
  
      // Recalculate loan details based on updated payments
      calculateLoanDetails(updatedPayments);
  
      // Send the updated payment details (along with the screenshot) to the backend
      const response = await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Save the updated payments data to localStorage as a fallback
      localStorage.setItem('payments', JSON.stringify(updatedPayments));
  
      // Close the payment modal and show success message
      setShowPaymentModal(false);
      setPaymentSuccess(true);
  
      alert(`Payment for S.No ${currentPayment.sno} completed with Transaction ID: ${userTransactionId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Payment processing failed. Please try again.');
    }
  };
  
  

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshot(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;


  // Add these helper functions at the top of your component
  const formatDate = (dateString) => {
    try {
      // Assuming dateString is in format like "2024-01-15" or similar
      const date = new Date(dateString);
      return date.toLocaleString('default', { month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

  const calculateMaxAmount = (payments) => {
    const maxAmount = Math.max(...payments.map(p => parseFloat(p.amount)));
    // Round up to nearest thousand for nice y-axis values
    return Math.ceil(maxAmount / 1000) * 1000;
  };

  const generateYAxisLabels = (maxAmount) => {
    const steps = 5;
    const labels = [];
    for (let i = steps; i >= 0; i--) {
      labels.push((maxAmount * i) / steps);
    }
    return labels;
  };
// Pie Chart Data
const pieChartData = {
  labels: ['Completed Transactions', 'Pending Transactions'],
  datasets: [
    {
      data: [loanDetails.completedTransactions, loanDetails.pendingTransactions],
      backgroundColor: ['#6366f1', '#e2e8f0'],
      hoverBackgroundColor: ['#4f46e5', '#cbd5e1'],
    },
  ],
};

// Line Chart Data
const lineChartData = {
  labels: payments.map(payment => payment.date),
  datasets: [
    {
      label: 'Payment Amount',
      data: payments.map(payment => parseFloat(payment.amount)),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 2,
    },
  ],
};

// Donut Chart Data
const totalPaid = payments.filter(payment => payment.status === 'Done').reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
const balance = loanDetails.totalAmount - totalPaid;

const donutChartData = {
  labels: ['Total Paid', 'Balance'],
  datasets: [
    {
      data: [totalPaid, balance],
      backgroundColor: ['#6366f1', '#e2e8f0'],
      hoverBackgroundColor: ['#4f46e5', '#cbd5e1'],
    },
  ],
};

  return (
<div className="ps-schedule-container">
  {/* Cards displaying required data */}
  <div className="ps-analytics-container">
    <div className="ps-analytics-card ps-money-taken">
      <h3>Money Payable</h3>
      <p>₹{getMoneyTakenFromOrganization()}</p>
    </div>
    <div className="ps-analytics-card ps-total-paid">
      <h3>Total Amount Paid</h3>
      <p>₹{getTotalPaidAmount()}</p>
    </div>
    <div className="ps-analytics-card ps-interest">
      <h3>Interest</h3>
      <p>₹1</p>
    </div>
    <div className="ps-analytics-card ps-balance">
      <h3>Balance</h3>
      <p>₹{getBalance()}</p>
    </div>
  </div>

  {error && <p className="ps-error-message">{error}</p>}
  {/* Bar Graph Section */}

  <h2>Payment Schedule</h2>

  <div className="ps-bar-graph-container">
    <div className="ps-graph-header">
      <span className="ps-graph-title">Payment Timeline</span>
      <div className="ps-graph-total">
        Total Payable: ₹{loanDetails.totalAmount}
      </div>
    </div>
    <div className="ps-bar-graph">
      <div className="ps-y-axis">
        {generateYAxisLabels(calculateMaxAmount(payments)).map((value, index) => (
          <span key={index}>${value.toLocaleString()}</span>
        ))}
      </div>
      {payments.map((payment, index) => {
        const amount = parseFloat(payment.amount);
        const maxAmount = calculateMaxAmount(payments);
        const height = (amount / maxAmount) * 180;

        // Using the same date format as shown in the table
        return (
          <div className="ps-bar-container" key={payment.sno}>
            <div className="ps-bar-value">₹{amount.toLocaleString()}</div>
            <div
              className={`ps-bar ₹{payment.status === 'Done' ? 'ps-active' : ''}`}
              style={{
                height: `${height}px`,
                backgroundColor: payment.status === 'Done' ? '#6366f1' : '#e2e8f0'
              }}
            />
            <div className="ps-bar-label">{payment.date}</div>
          </div>
        );
      })}
    </div>
  </div>



  <div className="ps-table-container">
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Transaction ID</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.sno}>
            <td>{payment.sno}</td>
            <td>{payment.date}</td>
            <td>₹{payment.amount}</td>
            <td>
              {payment.status === 'Pay now' ? (
                <button onClick={() => handlePayNow(payment)}>Pay Now</button>
              ) : (
                'Done'
              )}
            </td>
            <td>{payment.transactionId || '--'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Payment Modal */}
  {showPaymentModal && (
  <div className="ps-payment-modal">
    <h3>Payment for S.No {currentPayment.sno}</h3>
    <p>Amount: ₹{currentPayment.amount}</p>

    <QRCodeCanvas
      value={`upi://pay?pa=96660741389@ibl&pn=YourName&am=${currentPayment.amount}&cu=INR`}
      size={200}
    />
    <p>Scan QR to pay to: <strong>{loanDetails.organization}</strong></p>

    <p>Enter Transaction ID:</p>
    <input
      type="text"
      placeholder="Transaction ID"
      value={userTransactionId}
      onChange={(e) => setUserTransactionId(e.target.value)}
    />

    <p>Upload Payment Screenshot:</p>
    <input type="file" onChange={handleScreenshotUpload} accept="image/*" />

    <button  className='payment-button' onClick={handlePaymentConfirmation}>Confirm Payment</button>
    <button  className='payment-button' onClick={() => setShowPaymentModal(false)}>Cancel</button>
  </div>
)}

  {/* Progress Indicator and Loan Details */}
  <div className="ps-details-container">
    <div className="ps-progress-indicator">
      <svg width="120" height="60">
        <defs>
          <linearGradient id="ps-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path fill="none" stroke="#ddd" strokeWidth="10" d={`M 10,60 A 50,50 0 0,1 110,60`} />
        <path
          fill="none"
          stroke="url(#ps-gradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          d={`M 10,60 A 50,50 0 0,1 110,60`}
        />
        <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
          {Math.round(progress)}%
        </text>
      </svg>
      <p>Profit-Plan Fulfillment</p>
    </div>

    <div className="ps-loan-details">
      <p><strong>Total Amount:</strong> ₹{loanDetails.totalAmount}</p>
      <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
      <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
      <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
      <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
    </div>
  </div>
  <div className="ps-chart-container">
    <div className="ps-chart">
      <h3>Transaction Status</h3>
      <Pie data={pieChartData} />
    </div>

    <div className="ps-chart">
      <h3>Payment Timeline</h3>
      <Line data={lineChartData} />
    </div>

    <div className="ps-chart">
      <h3>Total Paid vs Balance</h3>
      <Doughnut data={donutChartData} />
    </div>
  </div>

</div>

  );
};

export default PaymentSchedule;

