import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';
import './UserPaymentDetails.css';
import { generateReceiptPDF } from './pdfService';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateInProgress, setUpdateInProgress] = useState({});
  const [editingEmi, setEditingEmi] = useState({ serialNo: null, value: '' });

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/${userId}`);
      if (!response.data) throw new Error('Invalid server response');
      
      setUserData(response.data);
      setPaymentSchedule(response.data.paymentSchedule || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load payment details');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handlePaymentUpdate = async (serialNo, field, value) => {
    if (updateInProgress[serialNo]) return;
    
    try {
      setUpdateInProgress(prev => ({ ...prev, [serialNo]: true }));
      
      // Optimistic update for immediate UI response
      setPaymentSchedule(prev => prev.map(p => 
        p.serialNo === serialNo ? { ...p, [field]: value } : p
      ));

      await api.patch(`/payment/${userId}/${serialNo}`, { 
        [field]: field === 'emiAmount' ? Number(value) : value 
      });
      
      // Refresh data to get recalculated balances
      await fetchUserData();
    } catch (error) {
      setError('Update failed. Reverting changes...');
      fetchUserData(); // Revert on error
    } finally {
      setUpdateInProgress(prev => ({ ...prev, [serialNo]: false }));
      setEditingEmi({ serialNo: null, value: '' });
    }
  };
  const handleDownloadReceipt = (receipt) => {
    generateReceiptPDF({
      ...receipt,
      user: userData // Pass the user data
    });
  };
  

  const formatDate = useCallback(date => 
    new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), 
  []);

  const formatCurrency = useCallback(amount => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount), 
  []);

  // Calculate total balance to be paid (sum of all pending/overdue EMIs)
  const totalBalanceToPay = paymentSchedule
    .filter(payment => payment.status !== 'PAID')
    .reduce((acc, payment) => acc + payment.emiAmount, 0);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-content">
        <Loader2 className="loading-spinner" />
        <p className="loading-text">Loading payment details...</p>
      </div>
    </div>
  );

  const renderEmiAmount = (payment) => {
    if (payment.status === 'PAID') {
      // For paid payments, just show the amount without edit functionality
      return <span>{formatCurrency(payment.emiAmount)}</span>;
    }

    return editingEmi.serialNo === payment.serialNo ? (
      <input
        type="number"
        value={editingEmi.value}
        onChange={e => setEditingEmi({ ...editingEmi, value: e.target.value })}
        onBlur={() => handlePaymentUpdate(payment.serialNo, 'emiAmount', editingEmi.value)}
        onKeyPress={e => e.key === 'Enter' && 
          handlePaymentUpdate(payment.serialNo, 'emiAmount', editingEmi.value)}
        autoFocus
      />
    ) : (
      <span 
        onClick={() => setEditingEmi({ 
          serialNo: payment.serialNo, 
          value: payment.emiAmount 
        })}
        className="editable-amount"
      >
        {formatCurrency(payment.emiAmount)}
      </span>
    );
  };

  return (
    <div className="user-payment-details">
      <div className="payment-details-container">
        <button onClick={() => navigate('/organizer')} className="back-button">
          <X size={24} />
        </button>

        {error && <div className="error-message">{error}</div>}

        {userData && (
          <div className="payment-details-content">
            <div className="total-balance">
              <h3>Total Balance to Pay: {formatCurrency(totalBalanceToPay)}</h3>
            </div>

            <div className="payment-schedule-table">
{/* In the UserPaymentDetails component, update the payment schedule table */}
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
    {paymentSchedule.map(payment => (
      <tr key={payment.serialNo} className={`payment-row ${payment.status.toLowerCase()}`}>
        <td>{payment.serialNo}</td>
        <td>{formatDate(payment.paymentDate)}</td>
        <td>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</td>
        <td className="emi-amount-cell">
          {renderEmiAmount(payment)}
          {updateInProgress[payment.serialNo] && <Loader2 className="emi-update-loader" />}
        </td>
        <td>
          {updateInProgress[payment.serialNo] ? (
            <div className="balance-updating-indicator" />
          ) : (
            formatCurrency(payment.balance)
          )}
        </td>
        <td>
          <div className="payment-status-container">
            <select
              value={payment.status}
              onChange={e => handlePaymentUpdate(payment.serialNo, 'status', e.target.value)}
              className={`payment-status-select ${payment.status.toLowerCase()}`}
              disabled={updateInProgress[payment.serialNo]}
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
            {updateInProgress[payment.serialNo] && <Loader2 className="payment-status-loader" />}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
          </div>
        )}
      </div>
      <div className="receipts-section">
  <h3>Payment Receipts</h3>
  <div className="receipts-grid">
    {userData.receipts?.map(receipt => (
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

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { X, User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
// import LandingPage from '../home/LandingPage/LandingPage';
// import { Loader2 } from 'lucide-react';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   timeout: 10000
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const UserPaymentDetails = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [paymentSchedule, setPaymentSchedule] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateInProgress, setUpdateInProgress] = useState({});

//   const fetchUserData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
  
//       const userResponse = await api.get(`/user/${userId}`);
//       const userData = userResponse.data;
  
//       if (!userData) {
//         throw new Error("Invalid data received from server");
//       }
  
//       console.log('Fetched user data:', userData); // Debug log
  
//       // Set user data and payment schedule
//       setUserData(userData);
//       setPaymentSchedule(userData.paymentSchedule || []); // Ensure paymentSchedule is set correctly
  
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.response?.data?.message || "Failed to load payment details. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchUserData();
//   }, [fetchUserData]);

// const handleUpdatePayment = async (serialNo, emiAmount, newStatus) => {
//   if (updateInProgress[serialNo]) return;

//   console.log('Starting payment update:', { serialNo, newStatus }); // Debug log

//   try {
//     setUpdateInProgress(prev => ({ ...prev, [serialNo]: true }));
//     setError(null);

//     // Optimistically update the UI
//     setPaymentSchedule(prevSchedule =>
//       prevSchedule.map(payment =>
//         payment.serialNo === serialNo
//           ? { ...payment, status: newStatus }
//           : payment
//       )
//     );

//     const response = await api.patch(
//       `/payment/${userId}/${serialNo}`,
//       {
//         emiAmount: Number(emiAmount),
//         status: newStatus,
//       }
//     );

//     console.log('Server response:', response.data); // Debug log

//     // Update the payment schedule with the response from the server
//     if (response.data?.schedule) {
//       setPaymentSchedule(response.data.schedule);
//     }

//   } catch (error) {
//     console.error("Update failed:", error);
//     setError("Failed to update payment status. Please try again.");
//     // Revert the optimistic update
//     fetchUserData();
//   } finally {
//     setUpdateInProgress(prev => ({ ...prev, [serialNo]: false }));
//   }
// };

//   const formatDate = useCallback((date) => {
//     return new Date(date).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   }, []);

//   const formatCurrency = useCallback((amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   }, []);

//   useEffect(() => {
//     console.log('Current payment schedule:', paymentSchedule); // Debug log
//   }, [paymentSchedule]);

//   const renderPaymentStatus = useCallback((payment) => (
//     <div className="flex items-center gap-2">
//       <select
//         key={`${payment.serialNo}-${payment.status}`} // Force re-render on status change
//         value={payment.status}
//         onChange={(e) => {
//           console.log(`Changing status for payment ${payment.serialNo} from ${payment.status} to ${e.target.value}`);
//           handleUpdatePayment(payment.serialNo, payment.emiAmount, e.target.value);
//         }}
//         className={`p-2 rounded border ${
//           payment.status === 'PAID' 
//             ? 'bg-green-100 border-green-200' 
//             : payment.status === 'OVERDUE'
//               ? 'bg-red-100 border-red-200'
//               : 'bg-white border-gray-200'
//         } ${updateInProgress[payment.serialNo] ? 'opacity-50' : ''}`}
//         disabled={updateInProgress[payment.serialNo]}
//       >
//         <option value="PENDING">Pending</option>
//         <option value="PAID">Paid</option>
//         <option value="OVERDUE">Overdue</option>
//       </select>
//       {updateInProgress[payment.serialNo] && (
//         <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//       )}
//     </div>
//   ), [updateInProgress, handleUpdatePayment]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
//           <p className="mt-2 text-gray-600">Loading payment details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="user-payment-details min-h-screen bg-gray-50">
//       <LandingPage />
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <button onClick={() => navigate('/')} 
//           className="back-btn mb-6 p-2 rounded-full hover:bg-gray-200 transition-colors">
//           <X size={24} />
//         </button>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {userData && paymentSchedule.length > 0 && (
//           <div className="details-container bg-white rounded-lg shadow-md p-6">
//             {/* User info section remains the same */}
//             <div className="payment-schedule overflow-x-auto mt-6">
//               <table className="w-full min-w-[600px]">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-3 text-left">Serial No.</th>
//                     <th className="p-3 text-left">Due Date</th>
//                     <th className="p-3 text-left">EMI Amount</th>
//                     <th className="p-3 text-left">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paymentSchedule.map((payment) => (
//                     <tr 
//                       key={payment.serialNo} 
//                       className={`border-t ${
//                         payment.status === 'PAID' 
//                           ? 'bg-green-50' 
//                           : payment.status === 'OVERDUE' 
//                             ? 'bg-red-50' 
//                             : ''
//                       }`}
//                     >
//                       <td className="p-3">{payment.serialNo}</td>
//                       <td className="p-3">{formatDate(payment.paymentDate)}</td>
//                       <td className="p-3">{formatCurrency(payment.emiAmount)}</td>
//                       <td className="p-3">
//                         {renderPaymentStatus(payment)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserPaymentDetails;

