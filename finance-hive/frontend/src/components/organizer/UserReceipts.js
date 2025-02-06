// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Loader2 } from 'lucide-react';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   timeout: 10000,
// });

// const UserReceipts = () => {
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchReceipts = async () => {
//       try {
//         const response = await api.get('/user/receipts');
//         setReceipts(response.data.receipts);
//       } catch (error) {
//         setError(error.response?.data?.message || 'Failed to load receipts');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReceipts();
//   }, []);

//   const formatCurrency = (amount) => 
//     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

//   const formatDate = (date) => 
//     new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

//   if (loading) return <div>Loading receipts...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="user-receipts">
//       <h2>Payment Receipts</h2>
//       <div className="receipts-grid">
//         {receipts.map(receipt => (
//           <div key={receipt._id} className="receipt-card">
//             <div className="receipt-header">
//               <span>Receipt #: {receipt.receiptNumber}</span>
//               <span>{formatDate(receipt.paymentDate)}</span>
//             </div>
//             <div className="receipt-body">
//               <p>Amount: {formatCurrency(receipt.amount)}</p>
//               <p>EMI Number: {receipt.serialNo}</p>
//               <p>Payment Method: {receipt.paymentMethod}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserReceipts;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import './UserReceipts.css';
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

const UserReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await api.get('/user/receipts');
        setReceipts(response.data.receipts);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load receipts');
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  const translations = {
    en: {
      receiptTitle: "Payment Receipt",
      receiptNo: "Receipt #",
      date: "Date",
      amount: "Amount",
      emiNo: "EMI Number",
      paymentMethod: "Payment Method",
    },
    hi: {
      receiptTitle: "भुगतान रसीद",
      receiptNo: "रसीद संख्या",
      date: "तारीख",
      amount: "राशि",
      emiNo: "ईएमआई संख्या",
      paymentMethod: "भुगतान का तरीका",
    },
    te: {
      receiptTitle: "చెల్లింపు రసీదు",
      receiptNo: "రసీదు #",
      date: "తేదీ",
      amount: "మొత్తం",
      emiNo: "ఈఎంఐ నంబర్",
      paymentMethod: "చెల్లింపు విధానం",
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="loading">Loading receipts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <img src="/logo.png" alt="Company Logo" className="logo" />
        <h2>{translations[language].receiptTitle}</h2>
        <select onChange={(e) => setLanguage(e.target.value)} className="language-selector">
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>

      <div className="receipts-grid">
        {receipts.map(receipt => (
          <div key={receipt._id} className="receipt-card">
            <div className="receipt-header">
              <span>{translations[language].receiptNo}: {receipt.receiptNumber}</span>
              <span>{translations[language].date}: {formatDate(receipt.paymentDate)}</span>
            </div>
            <div className="receipt-body">
              <p>{translations[language].amount}: {formatCurrency(receipt.amount)}</p>
              <p>{translations[language].emiNo}: {receipt.serialNo}</p>
              <p>{translations[language].paymentMethod}: {receipt.paymentMethod}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReceipts;
