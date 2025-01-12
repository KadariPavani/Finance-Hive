import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const PaymentsSection = () => {
  const [payments, setPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setPaymentError('Authorization token is missing.');
      setPaymentLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setPaymentError(err.response?.data?.msg || 'Error fetching payment data');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId, email) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setDeleteLoading(true);
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:5000/payments/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { email }
      });

      setPayments(prevPayments => 
        prevPayments.filter(payment => payment._id !== transactionId)
      );

      alert('Transaction deleted successfully');
    } catch (err) {
      setDeleteError('Failed to delete transaction');
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <section style={styles.section}>
      <h3 style={styles.title}>Payment Transactions</h3>
      
      {deleteError && (
        <div style={styles.errorMessage}>{deleteError}</div>
      )}
      
      {paymentLoading ? (
        <p>Loading payment data...</p>
      ) : paymentError ? (
        <p style={{ color: 'red' }}>{paymentError}</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Organization</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Transaction ID</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id || index} style={styles.tr}>
                  <td style={styles.td}>{payment.date}</td>
                  <td style={styles.td}>{payment.organization}</td>
                  <td style={styles.td}>{payment.email}</td>
                  <td style={styles.td}>${payment.amount}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: payment.status === 'Completed' ? '#4ade80' : '#ff9494',
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={styles.td}>{payment.transactionId}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDeleteTransaction(payment._id, payment.email)}
                      disabled={deleteLoading}
                      style={styles.deleteButton}
                      title="Delete transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const styles = {
  section: {
    marginTop: '80px',
    padding: '24px',
    backgroundColor: 'rgb(247, 221, 255)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginRight: '15px',
    marginLeft: '15px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
    textAlign: 'center'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: '#ffffff',
  },
  th: {
    padding: '16px 24px',
    backgroundColor: '#9b59b6',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'left',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    transition: 'background-color 0.2s ease',
    '&:first-child': {
      borderTopLeftRadius: '8px',
    },
    '&:last-child': {
      borderTopRightRadius: '8px',
    },
  },
  tr: {
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  td: {
    padding: '16px 24px',
    color: '#4a5568',
    fontSize: '14px',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    display: 'inline-block',
  },
  deleteButton: {
    padding: '8px',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#ef4444',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(239, 68, 68, 0.1)',
      transform: 'scale(1.1)'
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  errorMessage: {
    padding: '12px',
    margin: '0 0 20px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center'
  }
};

export default PaymentsSection;