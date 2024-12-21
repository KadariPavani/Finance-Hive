import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import '../user/PaymentSchedule.css';
import { Link } from 'react-router-dom';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 5, // Example interest rate, adjust as necessary
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: 'N/A',
  });
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

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!screenshot) {
      alert('Please upload the payment screenshot.');
      return;
    }

    try {
      const transactionId = `TXN${Math.floor(Math.random() * 1000000000)}`;

      const updatedPayments = payments.map(payment =>
        payment.sno === currentPayment.sno
          ? { ...payment, status: 'Done', transactionId }
          : payment
      );

      setPayments(updatedPayments);
      calculateLoanDetails(updatedPayments);

      // Update backend
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
        transactionId,
        screenshot,
      });

      // Save to localStorage as well
      localStorage.setItem('payments', JSON.stringify(updatedPayments));

      setShowPaymentModal(false);
      setPaymentSuccess(true);

      alert(`Payment for S.No ${currentPayment.sno} completed with Transaction ID: ${transactionId}`);
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

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="table-container">
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
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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
        <div className="payment-modal">
          <h3>Payment for S.No {currentPayment.sno}</h3>
          <p>Amount: ${currentPayment.amount}</p>

          <QRCodeCanvas 
            value={`upi://pay?pa=96660741389@ibl&pn=YourName&am=${currentPayment.amount}&cu=INR`}
            size={200}
          />
          <p>Scan QR code to pay</p>

          <p>Upload Payment Screenshot:</p>
          <input type="file" onChange={handleScreenshotUpload} accept="image/*" />

          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      {/* Progress Indicator and Loan Details */}
      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill="none" stroke="#ddd" strokeWidth="10" d={`M 10,60 A 50,50 0 0,1 110,60`} />
            <path
              fill="none"
              stroke="url(#gradient)"
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

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
      <p><Link to="/user-dashboard/{userId}">back</Link></p>
    </div>
  );
};

export default PaymentSchedule;


/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import for QR code generation
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
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
      interestRate: 5, // Example interest rate, adjust as necessary
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!upiId || !transactionId) {
      alert('Please enter your UPI ID and Transaction ID.');
      return;
    }

    try {
      const updatedPayments = payments.map(payment => {
        if (payment.sno === currentPayment.sno) {
          return { ...payment, status: 'Done', transactionId };
        }
        return payment;
      });

      setPayments(updatedPayments);
      calculateLoanDetails(updatedPayments); 
      setShowPaymentModal(false);
      setPaymentSuccess(true);

      // Update backend with the provided transaction
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
        transactionId,
      });

      alert(`Payment for S.No ${currentPayment.sno} marked as done with Transaction ID: ${transactionId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error processing payment.');
    }
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Amount to be Paid</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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

      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Pay for S.No {currentPayment.sno}</h3>
          <p>Amount to be paid: ${currentPayment.amount}</p>

          <div className="qr-code-placeholder">
            <QRCodeCanvas 
              value={`upi://pay?pa=96660741389@ibl&pn=YourName&am=${currentPayment.amount}&cu=INR`} // Replace "YourName" with the name linked to your UPI ID
              size={200} 
            />
            <p>Scan this QR code to pay</p>
          </div>

          <p>Enter UPI ID:</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI ID"
          />
          <p>Enter Transaction ID:</p>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter Transaction ID"
          />

          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <path
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
              {Math.round(progress)}%
            </text>
          </svg>
          <p>Profit-Plan Fulfilment</p>
        </div>

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;

*/

/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
      }
    };

    fetchPaymentSchedule();
  }, [loanId]);

  const calculateLoanDetails = (payments) => {
    const totalAmount = payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
    const completedTransactions = payments.filter(payment => payment.status === 'Done').length;
    const pendingTransactions = payments.length - completedTransactions;
    const nextPayableDate = payments.find(payment => payment.status === 'Pay now')?.date || 'N/A';

    // Set loan details
    setLoanDetails({
      totalAmount: totalAmount.toFixed(2),
      interestRate: 5, // Example interest rate, adjust as necessary
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!upiId) {
      alert('Please enter your UPI ID or scan the QR code.');
      return;
    }

    try {
      // Simulate payment gateway processing
      const mockTransactionId = `TXN${Date.now()}`; // Generate a mock transaction ID for now

      const updatedPayments = payments.map(payment => {
        if (payment.sno === currentPayment.sno) {
          return { ...payment, status: 'Done', transactionId: mockTransactionId };
        }
        return payment;
      });

      setPayments(updatedPayments);
      calculateLoanDetails(updatedPayments); // Update loan details after payment
      setTransactionId(mockTransactionId);
      setShowPaymentModal(false);
      setPaymentSuccess(true);

      // Update the status and transaction ID in the backend
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
        transactionId: mockTransactionId,
      });

      alert(`Payment for S.No ${currentPayment.sno} marked as done with Transaction ID: ${mockTransactionId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error processing payment.');
    }
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Amount to be Paid</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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

      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Pay for S.No {currentPayment.sno}</h3>
          <p>Amount to be paid: ${currentPayment.amount}</p>
          <p>Enter UPI ID or Scan QR Code:</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI ID"
          />
          <div className="qr-code-placeholder">
            <img src="/path/to/your/qr-code-image.png" alt="Hone Pay QR Code" style={{ width: '200px' }} />
            <p>Scan this QR code to pay</p>
          </div>
          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <path
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
              {Math.round(progress)}%
            </text>
          </svg>
          <p>Profit-Plan Fulfilment</p>
        </div>

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
*/
/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import for QR code generation
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
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
      interestRate: 5, // Example interest rate, adjust as necessary
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!upiId) {
      alert('Please enter your UPI ID or scan the QR code.');
      return;
    }

    try {
      // Simulate a transaction ID for now
      const mockTransactionId = `TXN${Date.now()}`; 

      const updatedPayments = payments.map(payment => {
        if (payment.sno === currentPayment.sno) {
          return { ...payment, status: 'Done', transactionId: mockTransactionId };
        }
        return payment;
      });

      setPayments(updatedPayments);
      calculateLoanDetails(updatedPayments); 
      setTransactionId(mockTransactionId);
      setShowPaymentModal(false);
      setPaymentSuccess(true);

      // Update backend with the mock transaction
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
        transactionId: mockTransactionId,
      });

      alert(`Payment for S.No ${currentPayment.sno} marked as done with Transaction ID: ${mockTransactionId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error processing payment.');
    }
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Amount to be Paid</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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

      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Pay for S.No {currentPayment.sno}</h3>
          <p>Amount to be paid: ${currentPayment.amount}</p>

          <div className="qr-code-placeholder">
            <QRCodeCanvas 
              value={`upi://pay?pa=upi@bank&pn=PayeeName&mc=&tid=${transactionId}&tr=12345&tn=Test Payment&am=${currentPayment.amount}&cu=INR`} 
              size={200} 
            />
            <p>Scan this QR code to pay</p>
          </div>

          <p>Enter UPI ID or Scan QR Code:</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI ID"
          />
          
          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <path
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
              {Math.round(progress)}%
            </text>
          </svg>
          <p>Profit-Plan Fulfilment</p>
        </div>

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
 */

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
      }
    };

    fetchPaymentSchedule();
  }, [loanId]);

  const handlePayment = async (sno) => {
    try {
      const updatedPayments = payments.map(payment => {
        if (payment.sno === sno && payment.status === 'Pay now') {
          return { ...payment, status: 'Done' }; // Update status locally
        }
        return payment;
      });

      setPayments(updatedPayments);

      // Update the status in the backend
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${sno}`);
      alert(`Payment for S.No ${sno} marked as done.`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error marking payment as done.');
    }
  };

  return (
    <div>
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Amount to be Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.sno}>
              <td>{payment.sno}</td>
              <td>{payment.date}</td>
              <td>${payment.amount}</td>
              <td>
                {payment.status === 'Pay now' ? (
                  <button onClick={() => handlePayment(payment.sno)}>Pay Now</button>
                ) : (
                  'Done'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSchedule;

*/

/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/${loanId}`);
        const loanData = response.data;

        if (loanData) {
          generatePaymentSchedule(loanData);
        }
      } catch (error) {
        console.error('Error fetching loan data:', error);
      }
    };

    fetchLoanData();
  }, [loanId]);

  const generatePaymentSchedule = (loanData) => {
    const { loanAmount, interestRate, loanTenure } = loanData;
    const tenureMonths = parseInt(loanTenure.split(' ')[0]) * (loanTenure.includes('years') ? 12 : 1);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;

    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenureMonths));

    const schedule = [];
    const startDate = new Date(); // Assuming the payment starts from the submission date

    for (let i = 0; i < tenureMonths; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i); // Increment by month
      
      schedule.push({
        sno: i + 1,
        date: paymentDate.toLocaleDateString(),
        amount: monthlyPayment.toFixed(2),
        status: 'Pay now',
      });
    }

    setPayments(schedule);
  };

  const handlePayment = async (sno) => {
    try {
      const updatedPayments = payments.map(payment => {
        if (payment.sno === sno && payment.status === 'Pay now') {
          return { ...payment, status: 'Done' }; // Update status
        }
        return payment;
      });

      setPayments(updatedPayments);

      // Optionally update the status in the backend
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${sno}`);
      alert(`Payment for S.No ${sno} marked as done.`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error marking payment as done.');
    }
  };

  return (
    <div>
      <h2>Payment Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Amount to be Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.sno}>
              <td>{payment.sno}</td>
              <td>{payment.date}</td>
              <td>${payment.amount}</td>
              <td>
                {payment.status === 'Pay now' ? (
                  <button onClick={() => handlePayment(payment.sno)}>Pay Now</button>
                ) : (
                  'Done'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSchedule;


*/
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './PaymentSchedule.css'; // Update path if necessary

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
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
      interestRate: 5, // Example interest rate, adjust as necessary
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!screenshot) {
        setError('Please upload the payment screenshot.');
        return;
    }

    try {
        const simulatedTransactionId = `TXN${Math.floor(Math.random() * 1000000000)}`;

        const updatedPayments = payments.map(payment => {
            if (payment.sno === currentPayment.sno) {
                return { ...payment, status: 'Done', transactionId: simulatedTransactionId };
            }
            return payment;
        });

        setPayments(updatedPayments);
        calculateLoanDetails(updatedPayments);
        setShowPaymentModal(false);
        setPaymentSuccess(true);

        await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
            transactionId: simulatedTransactionId,
            screenshot,
        });

        alert(`Payment for S.No ${currentPayment.sno} marked as done with Transaction ID: ${simulatedTransactionId}`);
    } catch (error) {
        console.error('Error updating payment status:', error);
        setError('Error processing payment. Please try again later.');
    }
};


  const handleScreenshotUpload = (event) => {
    setScreenshot(event.target.files[0]); // Assuming a single file upload
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Amount to be Paid</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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

      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Pay for S.No {currentPayment.sno}</h3>
          <p>Amount to be paid: ${currentPayment.amount}</p>

          <div className="qr-code-placeholder">
            <QRCodeCanvas 
              value={`upi://pay?pa=96660741389@ibl&pn=YourName&am=${currentPayment.amount}&cu=INR`} // Replace "YourName" with the name linked to your UPI ID
              size={200} 
            />
            <p>Scan this QR code to pay</p>
          </div>

          <p>Upload Payment Screenshot:</p>
          <input
            type="file"
            onChange={handleScreenshotUpload}
            accept="image/*" // Allow image files
          />

          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <path
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
              {Math.round(progress)}%
            </text>
          </svg>
          <p>Profit-Plan Fulfilment</p>
        </div>

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;

*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import for QR code generation
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
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
      interestRate: 5, // Example interest rate, adjust as necessary
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!upiId || !transactionId) {
      alert('Please enter your UPI ID and Transaction ID.');
      return;
    }

    try {
      const updatedPayments = payments.map(payment => {
        if (payment.sno === currentPayment.sno) {
          return { ...payment, status: 'Done', transactionId };
        }
        return payment;
      });

      setPayments(updatedPayments);
      calculateLoanDetails(updatedPayments); 
      setShowPaymentModal(false);
      setPaymentSuccess(true);

      // Update backend with the provided transaction
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
        transactionId,
      });

      alert(`Payment for S.No ${currentPayment.sno} marked as done with Transaction ID: ${transactionId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error processing payment.');
    }
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Amount to be Paid</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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

      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Pay for S.No {currentPayment.sno}</h3>
          <p>Amount to be paid: ${currentPayment.amount}</p>

          <div className="qr-code-placeholder">
            <QRCodeCanvas 
              value={`upi://pay?pa=96660741389@ibl&pn=YourName&am=${currentPayment.amount}&cu=INR`} // Replace "YourName" with the name linked to your UPI ID
              size={200} 
            />
            <p>Scan this QR code to pay</p>
          </div>

          <p>Enter UPI ID:</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI ID"
          />
          <p>Enter Transaction ID:</p>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter Transaction ID"
          />

          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <path
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
              {Math.round(progress)}%
            </text>
          </svg>
          <p>Profit-Plan Fulfilment</p>
        </div>

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;

*/

/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
      }
    };

    fetchPaymentSchedule();
  }, [loanId]);

  const calculateLoanDetails = (payments) => {
    const totalAmount = payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
    const completedTransactions = payments.filter(payment => payment.status === 'Done').length;
    const pendingTransactions = payments.length - completedTransactions;
    const nextPayableDate = payments.find(payment => payment.status === 'Pay now')?.date || 'N/A';

    // Set loan details
    setLoanDetails({
      totalAmount: totalAmount.toFixed(2),
      interestRate: 5, // Example interest rate, adjust as necessary
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!upiId) {
      alert('Please enter your UPI ID or scan the QR code.');
      return;
    }

    try {
      // Simulate payment gateway processing
      const mockTransactionId = `TXN${Date.now()}`; // Generate a mock transaction ID for now

      const updatedPayments = payments.map(payment => {
        if (payment.sno === currentPayment.sno) {
          return { ...payment, status: 'Done', transactionId: mockTransactionId };
        }
        return payment;
      });

      setPayments(updatedPayments);
      calculateLoanDetails(updatedPayments); // Update loan details after payment
      setTransactionId(mockTransactionId);
      setShowPaymentModal(false);
      setPaymentSuccess(true);

      // Update the status and transaction ID in the backend
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
        transactionId: mockTransactionId,
      });

      alert(`Payment for S.No ${currentPayment.sno} marked as done with Transaction ID: ${mockTransactionId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error processing payment.');
    }
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Amount to be Paid</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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

      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Pay for S.No {currentPayment.sno}</h3>
          <p>Amount to be paid: ${currentPayment.amount}</p>
          <p>Enter UPI ID or Scan QR Code:</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI ID"
          />
          <div className="qr-code-placeholder">
            <img src="/path/to/your/qr-code-image.png" alt="Hone Pay QR Code" style={{ width: '200px' }} />
            <p>Scan this QR code to pay</p>
          </div>
          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <path
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
              {Math.round(progress)}%
            </text>
          </svg>
          <p>Profit-Plan Fulfilment</p>
        </div>

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
*/
/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import for QR code generation
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loanDetails, setLoanDetails] = useState({
    totalAmount: 0,
    interestRate: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    nextPayableDate: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
          calculateLoanDetails(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
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
      interestRate: 5, // Example interest rate, adjust as necessary
      completedTransactions,
      pendingTransactions,
      nextPayableDate,
    });
  };

  const handlePayNow = (payment) => {
    setCurrentPayment(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!upiId) {
      alert('Please enter your UPI ID or scan the QR code.');
      return;
    }

    try {
      // Simulate a transaction ID for now
      const mockTransactionId = `TXN${Date.now()}`; 

      const updatedPayments = payments.map(payment => {
        if (payment.sno === currentPayment.sno) {
          return { ...payment, status: 'Done', transactionId: mockTransactionId };
        }
        return payment;
      });

      setPayments(updatedPayments);
      calculateLoanDetails(updatedPayments); 
      setTransactionId(mockTransactionId);
      setShowPaymentModal(false);
      setPaymentSuccess(true);

      // Update backend with the mock transaction
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${currentPayment.sno}`, {
        transactionId: mockTransactionId,
      });

      alert(`Payment for S.No ${currentPayment.sno} marked as done with Transaction ID: ${mockTransactionId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error processing payment.');
    }
  };

  const totalPayments = payments.length;
  const completedPayments = loanDetails.completedTransactions;
  const progress = totalPayments ? (completedPayments / totalPayments) * 100 : 0;

  const radius = 50;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="schedule-container">
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Amount to be Paid</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.sno}>
                <td>{payment.sno}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
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

      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Pay for S.No {currentPayment.sno}</h3>
          <p>Amount to be paid: ${currentPayment.amount}</p>

          <div className="qr-code-placeholder">
            <QRCodeCanvas 
              value={`upi://pay?pa=upi@bank&pn=PayeeName&mc=&tid=${transactionId}&tr=12345&tn=Test Payment&am=${currentPayment.amount}&cu=INR`} 
              size={200} 
            />
            <p>Scan this QR code to pay</p>
          </div>

          <p>Enter UPI ID or Scan QR Code:</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI ID"
          />
          
          <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
        </div>
      )}

      <div className="details-container">
        <div className="progress-indicator">
          <svg width="120" height="60">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <path
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              d={`M 10,60 A 50,50 0 0,1 110,60`}
            />
            <text x="60" y="30" textAnchor="middle" dy=".35em" fontSize="16" fill="#000">
              {Math.round(progress)}%
            </text>
          </svg>
          <p>Profit-Plan Fulfilment</p>
        </div>

        <div className="loan-details">
          <p><strong>Total Amount:</strong> ${loanDetails.totalAmount}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
          <p><strong>Completed Transactions:</strong> {loanDetails.completedTransactions}</p>
          <p><strong>Pending Transactions:</strong> {loanDetails.pendingTransactions}</p>
          <p><strong>Next Payable Date:</strong> {loanDetails.nextPayableDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
 */

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../user/PaymentSchedule.css';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/schedule/${loanId}`);
        const paymentSchedule = response.data;

        if (paymentSchedule && Array.isArray(paymentSchedule)) {
          setPayments(paymentSchedule);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
        setError('Error fetching payment schedule.');
      }
    };

    fetchPaymentSchedule();
  }, [loanId]);

  const handlePayment = async (sno) => {
    try {
      const updatedPayments = payments.map(payment => {
        if (payment.sno === sno && payment.status === 'Pay now') {
          return { ...payment, status: 'Done' }; // Update status locally
        }
        return payment;
      });

      setPayments(updatedPayments);

      // Update the status in the backend
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${sno}`);
      alert(`Payment for S.No ${sno} marked as done.`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error marking payment as done.');
    }
  };

  return (
    <div>
      <h2>Payment Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Amount to be Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.sno}>
              <td>{payment.sno}</td>
              <td>{payment.date}</td>
              <td>${payment.amount}</td>
              <td>
                {payment.status === 'Pay now' ? (
                  <button onClick={() => handlePayment(payment.sno)}>Pay Now</button>
                ) : (
                  'Done'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSchedule;

*/

/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentSchedule = ({ loanId }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/${loanId}`);
        const loanData = response.data;

        if (loanData) {
          generatePaymentSchedule(loanData);
        }
      } catch (error) {
        console.error('Error fetching loan data:', error);
      }
    };

    fetchLoanData();
  }, [loanId]);

  const generatePaymentSchedule = (loanData) => {
    const { loanAmount, interestRate, loanTenure } = loanData;
    const tenureMonths = parseInt(loanTenure.split(' ')[0]) * (loanTenure.includes('years') ? 12 : 1);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;

    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenureMonths));

    const schedule = [];
    const startDate = new Date(); // Assuming the payment starts from the submission date

    for (let i = 0; i < tenureMonths; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i); // Increment by month
      
      schedule.push({
        sno: i + 1,
        date: paymentDate.toLocaleDateString(),
        amount: monthlyPayment.toFixed(2),
        status: 'Pay now',
      });
    }

    setPayments(schedule);
  };

  const handlePayment = async (sno) => {
    try {
      const updatedPayments = payments.map(payment => {
        if (payment.sno === sno && payment.status === 'Pay now') {
          return { ...payment, status: 'Done' }; // Update status
        }
        return payment;
      });

      setPayments(updatedPayments);

      // Optionally update the status in the backend
      await axios.put(`http://localhost:5000/api/loans/payment/${loanId}/${sno}`);
      alert(`Payment for S.No ${sno} marked as done.`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error marking payment as done.');
    }
  };

  return (
    <div>
      <h2>Payment Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Amount to be Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.sno}>
              <td>{payment.sno}</td>
              <td>{payment.date}</td>
              <td>${payment.amount}</td>
              <td>
                {payment.status === 'Pay now' ? (
                  <button onClick={() => handlePayment(payment.sno)}>Pay Now</button>
                ) : (
                  'Done'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSchedule;


*/