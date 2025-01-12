// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Transactions.css';

// const TransactionForm = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     transactionId: '',
//     amount: '',
//     purpose: '',
//     status: 'credited',
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [transactions, setTransactions] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { username, email, transactionId, amount, purpose, status } = formData;
//     if (!username || !email || !transactionId || !amount || !purpose || !status) {
//       setError('All fields are required!');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/transactions/submit', formData);
//       setMessage(response.data.message);
//       setError('');
//       setFormData({
//         username: '',
//         email: '',
//         transactionId: '',
//         amount: '',
//         purpose: '',
//         status: 'credited',
//       });
//       fetchTransactions();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error occurred.');
//     }
//   };

//   const fetchTransactions = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/transactions');
//       setTransactions(response.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const populateForm = (transaction) => {
//     setFormData({
//       username: transaction.username,
//       email: transaction.email,
//       transactionId: transaction.transactionId,
//       amount: transaction.amount,
//       purpose: transaction.purpose,
//       status: transaction.status,
//     });
//   };

//   const handleUpdate = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/api/transactions/${id}`, formData);
//       setMessage(response.data.message);
//       setError('');
//       fetchTransactions();
//       setFormData({
//         username: '',
//         email: '',
//         transactionId: '',
//         amount: '',
//         purpose: '',
//         status: 'credited',
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while updating the transaction.');
//       setMessage('');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/transactions/${id}`);
//       setMessage(response.data.message);
//       setError('');
//       fetchTransactions();
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while deleting the transaction.');
//       setMessage('');
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   return (
//     <div className="unique-transaction-container">
//       <h2>Transaction Form</h2>
//       {message && <p className="unique-transaction-message">{message}</p>}
//       {error && <p className="unique-transaction-error">{error}</p>}

//       <div className="unique-transaction-content">
//         {/* Form Section */}
//         <div className="unique-transaction-form">
//           <h3>Add / Edit Transaction</h3>
//           <form onSubmit={handleSubmit}>
//             {['username', 'email', 'transactionId', 'amount', 'purpose'].map((field) => (
//               <div className="unique-transaction-form-group" key={field}>
//                 <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
//                 <input
//                   type={field === 'amount' ? 'number' : 'text'}
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             ))}
//             <div className="unique-transaction-form-group">
//               <label>Status:</label>
//               <select name="status" value={formData.status} onChange={handleChange}>
//                 <option value="credited">Credited</option>
//                 <option value="debited">Debited</option>
//               </select>
//             </div>
//             <button type="submit" className="unique-transaction-submit-btn">Add Transaction</button>
//           </form>
//         </div>

//         {/* Table Section */}
//         <div className="unique-transaction-table">
//           <h2>Transaction List</h2>
//           <div className="unique-transaction-table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   {['Username', 'Email', 'Transaction ID', 'Amount', 'Purpose', 'Status', 'Actions'].map(
//                     (header) => <th key={header}>{header}</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map((transaction) => (
//                   <tr key={transaction._id}>
//                     {['username', 'email', 'transactionId', 'amount', 'purpose', 'status'].map((key) => (
//                       <td key={key}>{transaction[key]}</td>
//                     ))}
//                     <td>
//                       <button onClick={() => populateForm(transaction)}>✏️</button>
//                       <button onClick={() => handleUpdate(transaction._id)}>🔄</button>
//                       <button onClick={() => handleDelete(transaction._id)}>❌</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionForm;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    transactionId: '',
    amount: '',
    purpose: '',
    status: 'credited',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Define handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, transactionId, amount, purpose, status } = formData;
    if (!username || !email || !transactionId || !amount || !purpose || !status) {
      setError('All fields are required!');
      return;
    }

    console.log('Form Data:', formData);  // For debugging

    try {
      const response = await axios.post('http://localhost:5000/api/transactions/submit', formData);
      setMessage(response.data.message);
      setError('');
      setFormData({
        username: '',
        email: '',
        transactionId: '',
        amount: '',
        purpose: '',
        status: 'credited',
      });
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred.');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const populateForm = (transaction) => {
    setFormData({
      username: transaction.username,
      email: transaction.email,
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      purpose: transaction.purpose,
      status: transaction.status,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/transactions/${id}`, formData);
      setMessage(response.data.message);
      setError('');
      fetchTransactions();
      setFormData({
        username: '',
        email: '',
        transactionId: '',
        amount: '',
        purpose: '',
        status: 'credited',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the transaction.');
      setMessage('');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      setMessage(response.data.message);
      setError('');
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the transaction.');
      setMessage('');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    // <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
    //   <h2>Transaction Form</h2>
    //   {message && <p style={{ color: 'green' }}>{message}</p>}
    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    //   <form onSubmit={handleSubmit}>
    //     {/* Form fields */}
    //     <div style={{ marginBottom: '10px' }}>
    //       <label>Username:</label>
    //       <input
    //         type="text"
    //         name="username"
    //         value={formData.username}
    //         onChange={handleChange}
    //         required
    //         style={{ width: '100%', padding: '8px' }}
    //       />
    //     </div>
    //     <div style={{ marginBottom: '10px' }}>
    //       <label>Email:</label>
    //       <input
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         required
    //         style={{ width: '100%', padding: '8px' }}
    //       />
    //     </div>
    //     <div style={{ marginBottom: '10px' }}>
    //       <label>Transaction ID:</label>
    //       <input
    //         type="text"
    //         name="transactionId"
    //         value={formData.transactionId}
    //         onChange={handleChange}
    //         required
    //         style={{ width: '100%', padding: '8px' }}
    //       />
    //     </div>
    //     <div style={{ marginBottom: '10px' }}>
    //       <label>Amount:</label>
    //       <input
    //         type="number"
    //         name="amount"
    //         value={formData.amount}
    //         onChange={handleChange}
    //         required
    //         style={{ width: '100%', padding: '8px' }}
    //       />
    //     </div>
    //     <div style={{ marginBottom: '10px' }}>
    //       <label>Purpose:</label>
    //       <input
    //         type="text"
    //         name="purpose"
    //         value={formData.purpose}
    //         onChange={handleChange}
    //         required
    //         style={{ width: '100%', padding: '8px' }}
    //       />
    //     </div>
    //     <div style={{ marginBottom: '10px' }}>
    //       <label>Status:</label>
    //       <select name="status" value={formData.status} onChange={handleChange}>
    //         <option value="credited">Credited</option>
    //         <option value="debited">Debited</option>
    //       </select>
    //     </div>

    //     <button type="submit">Add Transaction</button>
    //   </form>

    //   <h3>Transaction List</h3>
    //   <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
    //     <thead>
    //       <tr>
    //         <th>Username</th>
    //         <th>Email</th>
    //         <th>Transaction ID</th>
    //         <th>Amount</th>
    //         <th>Purpose</th>
    //         <th>Status</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {transactions.map((transaction) => (
    //         <tr key={transaction._id}>
    //           <td>{transaction.username}</td>
    //           <td>{transaction.email}</td>
    //           <td>{transaction.transactionId}</td>
    //           <td>{transaction.amount}</td>
    //           <td>{transaction.purpose}</td>
    //           <td>{transaction.status}</td>
    //           <td>
    //             <button onClick={() => populateForm(transaction)}>Edit</button>
    //             <button onClick={() => handleUpdate(transaction._id)}>Update</button>
    //             <button onClick={() => handleDelete(transaction._id)}>Delete</button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>

//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//   <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Transaction Form</h2>
//   {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
//   {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

//   <div
//     style={{
//       display: 'flex',
//       flexDirection: 'row',
//       gap: '20px',
//       alignItems: 'flex-start',
//       justifyContent: 'space-between',
//     }}
//   >
//     {/* Form Section */}
//     <div
//       style={{
//         flex: 1,
//         background: '#f9f9f9',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         height: '620px',
//         overflowY: 'auto',
//       }}
//     >
//       <h3 style={{ marginBottom: '15px' }}>Add / Edit Transaction</h3>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Username:</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               marginTop: '5px',
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               marginTop: '5px',
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Transaction ID:</label>
//           <input
//             type="text"
//             name="transactionId"
//             value={formData.transactionId}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               marginTop: '5px',
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Amount:</label>
//           <input
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               marginTop: '5px',
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Purpose:</label>
//           <input
//             type="text"
//             name="purpose"
//             value={formData.purpose}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               marginTop: '5px',
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Status:</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             style={{
//               width: '100%',
//               padding: '10px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               marginTop: '5px',
//             }}
//           >
//             <option value="credited">Credited</option>
//             <option value="debited">Debited</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           style={{
//             width: '100%',
//             background: '#007BFF',
//             color: '#fff',
//             border: 'none',
//             padding: '10px 0',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           Add Transaction
//         </button>
//       </form>
//     </div>

//     {/* Table Section */}
//     <div
//       style={{
//         flex: 2,
//         background: '#f9f9f9',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         height: '620px',
//         overflowY: 'auto',
//       }}
//     >
//       <h3 style={{ marginBottom: '15px' }}>Transaction List</h3>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th
//               style={{
//                 textAlign: 'left',
//                 padding: '10px',
//                 borderBottom: '1px solid #ddd',
//                 background: '#f1f1f1',
//               }}
//             >
//               Username
//             </th>
//             <th
//               style={{
//                 textAlign: 'left',
//                 padding: '10px',
//                 borderBottom: '1px solid #ddd',
//                 background: '#f1f1f1',
//               }}
//             >
//               Email
//             </th>
//             <th
//               style={{
//                 textAlign: 'left',
//                 padding: '10px',
//                 borderBottom: '1px solid #ddd',
//                 background: '#f1f1f1',
//               }}
//             >
//               Transaction ID
//             </th>
//             <th
//               style={{
//                 textAlign: 'left',
//                 padding: '10px',
//                 borderBottom: '1px solid #ddd',
//                 background: '#f1f1f1',
//               }}
//             >
//               Amount
//             </th>
//             <th
//               style={{
//                 textAlign: 'left',
//                 padding: '10px',
//                 borderBottom: '1px solid #ddd',
//                 background: '#f1f1f1',
//               }}
//             >
//               Purpose
//             </th>
//             <th
//               style={{
//                 textAlign: 'left',
//                 padding: '10px',
//                 borderBottom: '1px solid #ddd',
//                 background: '#f1f1f1',
//               }}
//             >
//               Status
//             </th>
//             <th
//               style={{
//                 textAlign: 'left',
//                 padding: '10px',
//                 borderBottom: '1px solid #ddd',
//                 background: '#f1f1f1',
//               }}
//             >
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction) => (
//             <tr key={transaction._id}>
//               <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.username}</td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.email}</td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.transactionId}</td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.amount}</td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.purpose}</td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.status}</td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
//                 <button style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => populateForm(transaction)}>
//                   ✏️
//                 </button>
//                 <button style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => handleUpdate(transaction._id)}>
//                   🔄
//                 </button>
//                 <button style={{ cursor: 'pointer' }} onClick={() => handleDelete(transaction._id)}>
//                   ❌
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// </div>

<div
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    background: "#fff", // Predominantly white
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#4b39bf" }}>Transaction Form</h2>
  {message && <p style={{ color: "#4b39bf", textAlign: "center", fontWeight: "bold" }}>{message}</p>}
  {error && <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>}

  <div
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "20px",
      justifyContent: "space-between",
    }}
  >
    {/* Form Section */}
    <div
      style={{
        flex: "1 1 100%",
        background: "#fff",
        border: "1px solid #4b39bf",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxWidth: "100%",
        minWidth: "300px",
        color: "#000",
      }}
    >
      <h3 style={{ marginBottom: "15px", color: "#4b39bf" }}>Add / Edit Transaction</h3>
      <form onSubmit={handleSubmit}>
        {["username", "email", "transactionId", "amount", "purpose"].map((field) => (
          <div style={{ marginBottom: "15px" }} key={field}>
            <label style={{ fontWeight: "bold", color: "#000" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type={field === "amount" ? "number" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #4b39bf",
                borderRadius: "8px",
                marginTop: "5px",
                backgroundColor: "#fff",
                color: "#000",
              }}
            />
          </div>
        ))}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold", color: "#000" }}>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #4b39bf",
              borderRadius: "8px",
              marginTop: "5px",
              backgroundColor: "#fff",
              color: "#000",
            }}
          >
            <option value="credited">Credited</option>
            <option value="debited">Debited</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            background: "#4b39bf",
            color: "#fff",
            border: "none",
            padding: "12px 0",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add Transaction
        </button>
      </form>
    </div>

    {/* Table Section */}
    <div
      style={{
        flex: "2 1 100%",
        background: "#fff",
        border: "1px solid #4b39bf",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxWidth: "100%",
        minWidth: "300px",
        color: "#000",
      }}
    >
      <h3 style={{ marginBottom: "15px", color: "#4b39bf" }}>Transaction List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Username", "Email", "Transaction ID", "Amount", "Purpose", "Status", "Actions"].map(
              (header) => (
                <th
                  key={header}
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "2px solid #4b39bf",
                    color: "#000",
                  }}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              {["username", "email", "transactionId", "amount", "purpose", "status"].map((key) => (
                <td
                  key={key}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #4b39bf",
                    backgroundColor: "#fff",
                    color: "#000",
                  }}
                >
                  {transaction[key]}
                </td>
              ))}
              <td style={{ padding: "10px", borderBottom: "1px solid #4b39bf" }}>
                <button
                  style={{
                    marginRight: "5px",
                    cursor: "pointer",
                    padding: "5px",
                    border: "none",
                    background: "#4b39bf",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                  onClick={() => populateForm(transaction)}
                >
                  ✏️
                </button>
                <button
                  style={{
                    marginRight: "5px",
                    cursor: "pointer",
                    padding: "5px",
                    border: "none",
                    background: "#4b39bf",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                  onClick={() => handleUpdate(transaction._id)}
                >
                  🔄
                </button>
                <button
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    border: "none",
                    background: "#4b39bf",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                  onClick={() => handleDelete(transaction._id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>



  );
};

export default TransactionForm;
