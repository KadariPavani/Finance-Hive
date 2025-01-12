// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './savings.css';

// const SavingsForm = () => {
//   const [formData, setFormData] = useState({
//     savingsName: '',
//     monthlySavingAmount: '',
//     savingDayAndDate: '',
//     interest: '',
//     totalNeededSavingsAmount: '',
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [savingsPlans, setSavingsPlans] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { savingsName, monthlySavingAmount, savingDayAndDate, interest, totalNeededSavingsAmount } = formData;
//     if (!savingsName || !monthlySavingAmount || !savingDayAndDate || !interest || !totalNeededSavingsAmount) {
//       setError('All fields are required!');
//       return;
//     }

//     try {
//       const formDataToSubmit = {
//         ...formData,
//         savingDayAndDate: new Date(formData.savingDayAndDate),
//       };

//       const response = await axios.post('http://localhost:5000/api/savings/submit', formDataToSubmit);
//       setMessage(response.data.message);
//       setError('');
//       setFormData({
//         savingsName: '',
//         monthlySavingAmount: '',
//         savingDayAndDate: '',
//         interest: '',
//         totalNeededSavingsAmount: '',
//       });
//       fetchSavingsPlans();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error occurred.');
//       setMessage('');
//     }
//   };

//   const fetchSavingsPlans = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/savings');
//       setSavingsPlans(response.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const populateForm = (plan) => {
//     setFormData({
//       savingsName: plan.savingsName,
//       monthlySavingAmount: plan.monthlySavingAmount,
//       savingDayAndDate: plan.savingDayAndDate ? new Date(plan.savingDayAndDate).toISOString().split('T')[0] : '',
//       interest: plan.interest,
//       totalNeededSavingsAmount: plan.totalNeededSavingsAmount,
//     });
//   };

//   const handleUpdate = async (id) => {
//     if (!id) {
//       setError('Invalid savings plan ID');
//       return;
//     }

//     try {
//       const formDataToUpdate = {
//         ...formData,
//         savingDayAndDate: new Date(formData.savingDayAndDate),
//       };

//       const response = await axios.put(`http://localhost:5000/api/savings/${id}`, formDataToUpdate);
//       setMessage(response.data.message);
//       setError('');
//       fetchSavingsPlans();
//       setFormData({
//         savingsName: '',
//         monthlySavingAmount: '',
//         savingDayAndDate: '',
//         interest: '',
//         totalNeededSavingsAmount: '',
//       });
//     } catch (err) {
//       console.error('Error updating savings plan:', err);
//       setError(err.response?.data?.message || 'Error occurred while updating the savings plan.');
//       setMessage('');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/savings/${id}`);
//       setMessage(response.data.message);
//       setError('');
//       fetchSavingsPlans();
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while deleting the savings plan.');
//       setMessage('');
//     }
//   };

//   useEffect(() => {
//     fetchSavingsPlans();
//   }, []);

//   return (
//     <div className="savings-container">
//       <h2 className="savings-title">Savings Plan</h2>
//       {message && <p className="savings-message savings-message-success">{message}</p>}
//       {error && <p className="savings-message savings-message-error">{error}</p>}

//       <div className="savings-content">
//         {/* Form Section */}
//         <div className="savings-form-section">
//           <h3 className="savings-section-title">Add / Edit Savings Plan</h3>
//           <form onSubmit={handleSubmit} className="savings-form">
//             <div className="savings-form-group">
//               <label className="savings-form-label">Savings Name:</label>
//               <input
//                 type="text"
//                 name="savingsName"
//                 value={formData.savingsName}
//                 onChange={handleChange}
//                 required
//                 className="savings-input"
//               />
//             </div>
//             <div className="savings-form-group">
//               <label className="savings-form-label">Monthly Saving Amount:</label>
//               <input
//                 type="number"
//                 name="monthlySavingAmount"
//                 value={formData.monthlySavingAmount}
//                 onChange={handleChange}
//                 required
//                 className="savings-input"
//               />
//             </div>
//             <div className="savings-form-group">
//               <label className="savings-form-label">Saving Day and Date:</label>
//               <input
//                 type="date"
//                 name="savingDayAndDate"
//                 value={formData.savingDayAndDate}
//                 onChange={handleChange}
//                 required
//                 className="savings-input"
//               />
//             </div>
//             <div className="savings-form-group">
//               <label className="savings-form-label">Interest (%):</label>
//               <input
//                 type="number"
//                 name="interest"
//                 value={formData.interest}
//                 onChange={handleChange}
//                 required
//                 className="savings-input"
//               />
//             </div>
//             <div className="savings-form-group">
//               <label className="savings-form-label">Total Needed Savings Amount:</label>
//               <input
//                 type="number"
//                 name="totalNeededSavingsAmount"
//                 value={formData.totalNeededSavingsAmount}
//                 onChange={handleChange}
//                 required
//                 className="savings-input"
//               />
//             </div>
//             <button type="submit" className="savings-btn">Add Savings Plan</button>
//           </form>
//         </div>

//         {/* Table Section */}
//         <div className="savings-table-section">
//           <h3 className="savings-section-title">Savings Plans List</h3>
//           <table className="savings-table">
//             <thead>
//               <tr>
//                 <th>Savings Name</th>
//                 <th>Monthly Saving Amount</th>
//                 <th>Saving Day and Date</th>
//                 <th>Interest</th>
//                 <th>Total Needed Amount</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {savingsPlans.map((plan) => (
//                 <tr key={plan._id} className="savings-table-row">
//                   <td>{plan.savingsName}</td>
//                   <td>{plan.monthlySavingAmount}</td>
//                   <td>{new Date(plan.savingDayAndDate).toLocaleDateString()}</td>
//                   <td>{plan.interest}</td>
//                   <td>{plan.totalNeededSavingsAmount}</td>
//                   <td className="savings-actions">
//                     <button
//                       onClick={() => populateForm(plan)}
//                       className="savings-action-btn savings-edit-btn"
//                     >
//                       ✏️
//                     </button>
//                     <button
//                       onClick={() => handleUpdate(plan._id)}
//                       className="savings-action-btn savings-update-btn"
//                     >
//                       🔄
//                     </button>
//                     <button
//                       onClick={() => handleDelete(plan._id)}
//                       className="savings-action-btn savings-delete-btn"
//                     >
//                       ❌
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SavingsForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavingsForm = () => {
  const [formData, setFormData] = useState({
    savingsName: '',
    monthlySavingAmount: '',
    savingDayAndDate: '', // This should be in 'YYYY-MM-DD' format for the date input
    interest: '',
    totalNeededSavingsAmount: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingsPlans, setSavingsPlans] = useState([]);
  const primaryColor = 'rgb(75, 57, 191)'; // Change this to your desired color
  const secondaryColor = '#ecf0f1'; // Optional: Update secondary background color
  const borderColor = '#bdc3c7'; // Optional: Update border color
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { savingsName, monthlySavingAmount, savingDayAndDate, interest, totalNeededSavingsAmount } = formData;
    if (!savingsName || !monthlySavingAmount || !savingDayAndDate || !interest || !totalNeededSavingsAmount) {
      setError('All fields are required!');
      return;
    }

    try {
      // Make sure savingDayAndDate is in Date format when sending to the backend
      const formDataToSubmit = {
        ...formData,
        savingDayAndDate: new Date(formData.savingDayAndDate),
      };
      
      const response = await axios.post('http://localhost:5000/api/savings/submit', formDataToSubmit);
      setMessage(response.data.message);
      setError('');
      setFormData({
        savingsName: '',
        monthlySavingAmount: '',
        savingDayAndDate: '',
        interest: '',
        totalNeededSavingsAmount: '',
      });
      fetchSavingsPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred.');
      setMessage('');
    }
  };

  const fetchSavingsPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/savings');
      setSavingsPlans(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const populateForm = (plan) => {
    setFormData({
      savingsName: plan.savingsName,
      monthlySavingAmount: plan.monthlySavingAmount,
      savingDayAndDate: plan.savingDayAndDate ? new Date(plan.savingDayAndDate).toISOString().split('T')[0] : '', // Format the date as 'YYYY-MM-DD'
      interest: plan.interest,
      totalNeededSavingsAmount: plan.totalNeededSavingsAmount,
    });
  };

  const handleUpdate = async (id) => {
    if (!id) {
      setError('Invalid savings plan ID');
      return;
    }
  
    try {
      // Ensure savingDayAndDate is in the correct format before updating
      const formDataToUpdate = {
        ...formData,
        savingDayAndDate: new Date(formData.savingDayAndDate),
      };

      const response = await axios.put(`http://localhost:5000/api/savings/${id}`, formDataToUpdate);
      setMessage(response.data.message);
      setError('');
      fetchSavingsPlans();
      setFormData({
        savingsName: '',
        monthlySavingAmount: '',
        savingDayAndDate: '',
        interest: '',
        totalNeededSavingsAmount: '',
      });
    } catch (err) {
      console.error('Error updating savings plan:', err);
      setError(err.response?.data?.message || 'Error occurred while updating the savings plan.');
      setMessage('');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/savings/${id}`);
      setMessage(response.data.message);
      setError('');
      fetchSavingsPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the savings plan.');
      setMessage('');
    }
  };

  useEffect(() => {
    fetchSavingsPlans();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: primaryColor }}>Savings Plan</h2>
      {message && <p style={{ color: primaryColor, textAlign: 'center' }}>{message}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
  
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        {/* Form Section */}
        <div
          style={{
            flex: 1,
            background: secondaryColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '620px',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ marginBottom: '15px', color: primaryColor }}>Add / Edit Savings Plan</h3>
          <form onSubmit={handleSubmit}>
            {[
              { name: 'savingsName', label: 'Savings Name', type: 'text' },
              { name: 'monthlySavingAmount', label: 'Monthly Saving Amount', type: 'number' },
              { name: 'savingDayAndDate', label: 'Saving Day and Date', type: 'date' },
              { name: 'interest', label: 'Interest (%)', type: 'number' },
              { name: 'totalNeededSavingsAmount', label: 'Total Needed Savings Amount', type: 'number' },
            ].map(({ name, label, type }) => (
              <div style={{ marginBottom: '15px' }} key={name}>
                <label style={{ color: primaryColor }}>{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '4px',
                    marginTop: '5px',
                  }}
                />
              </div>
            ))}
            <button
              type="submit"
              style={{
                width: '100%',
                background: primaryColor,
                color: '#fff',
                border: 'none',
                padding: '10px 0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Add Savings Plan
            </button>
          </form>
        </div>
  
        {/* Table Section */}
        <div
          style={{
            flex: 2,
            background: secondaryColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '620px',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ marginBottom: '15px', color: primaryColor }}>Savings Plans List</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Savings Name', 'Monthly Saving Amount', 'Saving Day and Date', 'Interest', 'Total Needed Amount', 'Actions'].map(
                  (header) => (
                    <th
                      key={header}
                      style={{
                        textAlign: 'left',
                        padding: '10px',
                        borderBottom: '1px solid #ddd',
                        background: primaryColor,
                        color: '#fff',
                      }}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {savingsPlans.map((plan) => (
                <tr key={plan._id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{plan.savingsName}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{plan.monthlySavingAmount}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    {new Date(plan.savingDayAndDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{plan.interest}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{plan.totalNeededSavingsAmount}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <button style={{ marginRight: '2px', cursor: 'pointer' }} onClick={() => populateForm(plan)}>
                      ✏️
                    </button>
                    <button style={{ cursor: 'pointer' }} onClick={() => handleDelete(plan._id)}>
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

export default SavingsForm;
