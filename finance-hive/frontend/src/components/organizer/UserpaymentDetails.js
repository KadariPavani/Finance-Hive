import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X } from 'lucide-react';
import './UserPaymentDetails.css';
import { generateReceiptPDF } from './pdfService';
import Modal from '../Modal/Modal';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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

      setUserData(response.data);
      setPaymentSchedule(response.data.paymentSchedule || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load payment details');
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handlePaymentUpdate = async (serialNo, field, value) => {
    if (updateInProgress[serialNo]) return;

    try {
      setUpdateInProgress(prev => ({ ...prev, [serialNo]: true }));

      // Find the current payment details
      const payment = paymentSchedule.find(p => p.serialNo === serialNo);
      
      // Optimistic update
      const updatedPaymentSchedule = paymentSchedule.map(p =>
        p.serialNo === serialNo ? { ...p, [field]: value } : p
      );
      setPaymentSchedule(updatedPaymentSchedule);

      const response = await api.patch(`/payment/${userId}/${serialNo}`, {
        [field]: field === 'emiAmount' ? Number(value) : value,
      });

      if (response.status === 200 || response.data.success) {
        await fetchUserData();
        setIsSuccess(true);
        
        // Set different messages based on the type of update
        if (field === 'status' && value === 'PAID') {
          setModalMessage(`Amount of ${formatCurrency(payment.emiAmount)} repayment successfully completed!`);
          setShowModal(true);
        } else if (field === 'emiAmount') {
          // Don't show modal for EMI amount updates
          setShowModal(false);
        }
      } else {
        throw new Error('Backend update failed');
      }
    } catch (error) {
      setIsSuccess(false);
      setModalMessage('Update failed. Please try again.');
      setError('Update failed. Reverting changes...');
      fetchUserData();
      setShowModal(true);
    } finally {
      setUpdateInProgress(prev => ({ ...prev, [serialNo]: false }));
      setEditingEmi({ serialNo: null, value: '' });
    }
  };

  const handleDownloadReceipt = (receipt) => {
    generateReceiptPDF({
      ...receipt,
      user: userData,
    });
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

  const renderEmiAmount = (payment) => {
    if (payment.status === 'PAID') {
      return <span>{formatCurrency(payment.emiAmount)}</span>;
    }

    return editingEmi.serialNo === payment.serialNo ? (
      <input
        type="number"
        value={editingEmi.value}
        onChange={(e) => setEditingEmi({ ...editingEmi, value: e.target.value })}
        onBlur={() => handlePaymentUpdate(payment.serialNo, 'emiAmount', editingEmi.value)}
        onKeyPress={(e) =>
          e.key === 'Enter' &&
          handlePaymentUpdate(payment.serialNo, 'emiAmount', editingEmi.value)
        }
        autoFocus
      />
    ) : (
      <span
        onClick={() =>
          setEditingEmi({
            serialNo: payment.serialNo,
            value: payment.emiAmount,
          })
        }
        className="editable-amount"
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
                          onChange={(e) => {
                            if (e.target.value === 'PAID') {
                              handlePaymentUpdate(payment.serialNo, 'status', e.target.value);
                            }
                          }}
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