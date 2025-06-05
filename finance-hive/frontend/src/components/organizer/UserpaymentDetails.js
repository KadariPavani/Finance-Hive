import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X } from 'lucide-react';
import './UserPaymentDetails.css';
import { generateReceiptPDF } from './pdfService';
import Modal from '../Modal/Modal';

import config from '../../config';

const api = axios.create({
  baseURL: `${config.API_URL}/api`,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const UserPaymentDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const [error, setError] = useState(null);
  const [updateInProgress, setUpdateInProgress] = useState({});
  const [editingEmi, setEditingEmi] = useState({ serialNo: null, value: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get(`/user/${userId}`);
      if (!response.data) throw new Error('Invalid server response');

      // Sort payment schedule by date
      const sortedSchedule = response.data.paymentSchedule?.sort((a, b) => {
        return new Date(a.paymentDate) - new Date(b.paymentDate);
      }) || [];

      // Get today's date and next month's date (same day)
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

      // Ensure first payment is next month (same day as today)
      if (sortedSchedule.length > 0) {
        const firstPaymentDate = new Date(sortedSchedule[0].paymentDate);
        if (firstPaymentDate < nextMonth) {
          sortedSchedule.forEach((payment, index) => {
            const paymentDate = new Date(nextMonth);
            paymentDate.setMonth(nextMonth.getMonth() + index);
            payment.paymentDate = paymentDate.toISOString();
          });
        }
      }

      setUserData({
        ...response.data,
        paymentSchedule: sortedSchedule
      });
      setPaymentSchedule(sortedSchedule);
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.message || 'Failed to load payment details');
      setModalMessage('Error refreshing payment details');
      setShowModal(true);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handlePaymentUpdate = async (serialNo, field, value) => {
    if (updateInProgress[serialNo]) return;

    try {
      setUpdateInProgress(prev => ({ ...prev, [serialNo]: true }));

      if (field === 'emiAmount') {
        const newEmiAmount = Number(value);
        
        // Basic validation
        if (isNaN(newEmiAmount) || newEmiAmount <= 0) {
          throw new Error('Invalid EMI amount');
        }

        const currentIndex = paymentSchedule.findIndex(p => p.serialNo === serialNo);
        
        // Ensure payment date is next month or later
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        const paymentDate = new Date(paymentSchedule[currentIndex].paymentDate);
        
        if (paymentDate < nextMonth) {
          setIsSuccess(false);
          setModalMessage('Payments can only start from next month');
          setShowModal(true);
          return;
        }

        // Calculate total paid amount
        const paidAmount = paymentSchedule
          .slice(0, currentIndex)
          .reduce((acc, p) => acc + (p.status === 'PAID' ? p.emiAmount : 0), 0);
        
        // Calculate total amount with interest
        const totalAmountWithInterest = Number(
          (userData.amountBorrowed * (1 + (userData.interest * userData.tenure / 1200))).toFixed(2)
        );

        // Calculate total remaining amount including interest
        const totalRemainingAmount = Number((totalAmountWithInterest - paidAmount).toFixed(2));

        // Validate if new amount exceeds total remaining with interest
        if (newEmiAmount > totalRemainingAmount) {
          setIsSuccess(false);
          setModalMessage(`Amount cannot exceed remaining balance of ${formatCurrency(totalRemainingAmount)}`);
          setShowModal(true);
          return;
        }

        // Send update to backend
        const response = await api.patch(`/payment/${userId}/${serialNo}`, {
          emiAmount: newEmiAmount,
          isLastPaymentAdjustment: currentIndex !== paymentSchedule.length - 1
        });

        if (response.data && response.data.schedule) {
          setPaymentSchedule(response.data.schedule);
          
          setIsSuccess(true);
          setModalMessage('Payment amount updated successfully');
          setShowModal(true);
          await fetchUserData(); // Refresh data to get updated schedule
        } else {
          throw new Error('Invalid response from server');
        }
      } else if (field === 'status') {
        const response = await api.patch(`/payment/${userId}/${serialNo}`, {
          status: value
        });

        if (response.data && response.data.schedule) {
          setPaymentSchedule(response.data.schedule);
          setIsSuccess(true);
          setModalMessage(`Payment status updated to ${value}`);
          setShowModal(true);
          await fetchUserData();
        }
      }

    } catch (error) {
      console.error('Update error:', error);
      setIsSuccess(false);
      setModalMessage(error.response?.data?.message || 'Update failed. Please try again.');
      setShowModal(true);
    } finally {
      setUpdateInProgress(prev => ({ ...prev, [serialNo]: false }));
      setEditingEmi({ serialNo: null, value: '' });
    }
  };

  // Add a helper function to calculate remaining balance
  const calculateRemainingBalance = (currentIndex) => {
    const previousPayments = paymentSchedule
      .slice(0, currentIndex)
      .reduce((acc, p) => acc + (p.status === 'PAID' ? p.emiAmount : 0), 0);
    return userData.amountBorrowed - previousPayments;
  };

  const handleDownloadReceipt = (receipt) => {
    generateReceiptPDF({
      ...receipt,
      user: userData,
    });
  };

  const handleStatusChange = async (payment, newStatus) => {
    try {
      if (newStatus === 'PAID') {
        const currentIndex = paymentSchedule.findIndex(p => p.serialNo === payment.serialNo);
        
        // First update the current payment
        const response = await api.patch(`/payment/${userId}/${payment.serialNo}`, {
          status: newStatus,
          autoUpdateZeroPayments: true // Add this flag to handle zero-amount payments
        });

        if (response.data && response.data.schedule) {
          setPaymentSchedule(response.data.schedule);
          setIsSuccess(true);
          setModalMessage('Payment status updated successfully');
          setShowModal(true);
          await fetchUserData();
        }
      } else {
        // For non-PAID status changes
        handlePaymentUpdate(payment.serialNo, 'status', newStatus);
      }
    } catch (error) {
      console.error('Status update error:', error);
      setIsSuccess(false);
      setModalMessage(error.response?.data?.message || 'Update failed');
      setShowModal(true);
    }
  };

  const formatDate = useCallback(
    (date) =>
      new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  const formatCurrency = useCallback(
    (amount) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount),
    []
  );

  const totalBalanceToPay = paymentSchedule
    .filter((payment) => payment.status !== 'PAID')
    .reduce((acc, payment) => acc + payment.emiAmount, 0);

  // Update renderEmiAmount to show correct maximum amount
  const renderEmiAmount = (payment) => {
    if (payment.locked || payment.status === 'PAID') {
      return <span>{formatCurrency(payment.emiAmount)}</span>;
    }

    const currentIndex = paymentSchedule.findIndex(p => p.serialNo === payment.serialNo);
    
    // Calculate total paid amount
    const paidAmount = paymentSchedule
      .slice(0, currentIndex)
      .reduce((acc, p) => acc + (p.status === 'PAID' ? p.emiAmount : 0), 0);
    
    // Calculate total amount with interest
    const totalAmountWithInterest = Number(
      (userData.amountBorrowed * (1 + (userData.interest * userData.tenure / 1200))).toFixed(2)
    );
    
    // Calculate max amount including interest
    const maxAmount = Number((totalAmountWithInterest - paidAmount).toFixed(2));

    return editingEmi.serialNo === payment.serialNo ? (
      <div className="emi-input-container">
        <input
          type="number"
          value={editingEmi.value}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || (Number(value) >= 0 && Number(value) <= maxAmount)) {
              setEditingEmi({ ...editingEmi, value });
            }
          }}
          onBlur={() => {
            if (editingEmi.value !== '') {
              handlePaymentUpdate(payment.serialNo, 'emiAmount', editingEmi.value);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && editingEmi.value !== '') {
              handlePaymentUpdate(payment.serialNo, 'emiAmount', editingEmi.value);
            }
          }}
          autoFocus
          min="0"
          max={maxAmount}
          step="any"
        />
        <small className="remaining-balance-hint">
          Max: {formatCurrency(maxAmount)}
        </small>
      </div>
    ) : (
      <span
        onClick={() =>
          setEditingEmi({
            serialNo: payment.serialNo,
            value: payment.emiAmount.toString()
          })
        }
        className="editable-amount"
        title={`Maximum allowed: ${formatCurrency(maxAmount)}`}
      >
        {formatCurrency(payment.emiAmount)}
      </span>
    );
  };

  if (!userData) return null;

  return (
    <div className="user-payment-details">
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
        isError={!isSuccess}
      />
      <div className="payment-details-container">
        <button onClick={() => navigate('/organizer')} className="back-button">
          <X size={24} />
        </button>

        {error && <div className="error-message">{error}</div>}

        <div className="payment-details-content">
          <div className="total-balance">
            <h3>Total Balance to Pay: {formatCurrency(totalBalanceToPay)}</h3>
          </div>

          <div className="payment-schedule-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Payable Amount</th>
                  <th>Remaining Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((payment) => (
                  <tr
                    key={payment.serialNo}
                    className={`payment-row ${payment.status.toLowerCase()}`}
                  >
                    <td>{payment.serialNo}</td>
                    <td>{formatDate(payment.paymentDate)}</td>
                    <td>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</td>
                    <td className="emi-amount-cell">
                      {renderEmiAmount(payment)}
                    </td>
                    <td>{formatCurrency(payment.balance)}</td>
                    <td>
                      <div className="payment-status-container">
                        <select
                          value={payment.status}
                          onChange={(e) => handleStatusChange(payment, e.target.value)}
                          className={`payment-status-select ${payment.status.toLowerCase()}`}
                          disabled={updateInProgress[payment.serialNo]}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PAID">Paid</option>
                          <option value="OVERDUE">Overdue</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="receipts-section">
        <h3>Payment Receipts</h3>
        <div className="receipts-grid">
          {userData.receipts?.map((receipt) => (
            <div key={receipt.receiptNumber} className="receipt-card">
              <div className="receipt-header">
                <span className="receipt-number">{receipt.receiptNumber}</span>
                <span className="receipt-date">
                  {formatDate(receipt.paymentDate)}
                </span>
              </div>
              <div className="receipt-body">
                <p>EMI Number: {receipt.serialNo}</p>
                <p>Amount: {formatCurrency(receipt.amount)}</p>
                <p>Payment Method: {receipt.paymentMethod}</p>
              </div>
              <button 
                onClick={() => handleDownloadReceipt(receipt)}
                className="download-btn"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPaymentDetails;

