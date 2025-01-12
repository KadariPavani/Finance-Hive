// // FinanceForm.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import './FinanceForm.css';

// ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

// const FinanceForm = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     income: '',
//     food: '',
//     rent: '',
//     bills: '',
//     insurance: '',
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [expenses, setExpenses] = useState([]);
//   const [chartData, setChartData] = useState({
//     labels: ['Food', 'Rent', 'Bills', 'Insurance'],
//     datasets: [
//       {
//         label: 'Expense Distribution',
//         data: [0, 0, 0, 0],
//         fill: true,
//         backgroundColor: 'rgba(75, 192, 192, 0.4)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//         tension: 0.4,
//       },
//       {
//         label: 'Total Expenditure',
//         data: [0, 0, 0, 0],
//         fill: false,
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { username, email, income, food, rent, bills, insurance } = formData;
//     if (!username || !email || !income || !food || !rent || !bills || !insurance) {
//       setError('All fields are required!');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/expenses/submit', formData);
//       setMessage(response.data.message);
//       setError('');
//       setFormData({
//         username: '',
//         email: '',
//         income: '',
//         food: '',
//         rent: '',
//         bills: '',
//         insurance: '',
//       });
//       fetchExpenses();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error occurred.');
//     }
//   };

//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/expenses');
//       setExpenses(response.data);
//       updateChartData(response.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateChartData = (expensesData) => {
//     let foodTotal = 0;
//     let rentTotal = 0;
//     let billsTotal = 0;
//     let insuranceTotal = 0;
//     let cumulativeTotal = 0;

//     expensesData.forEach((expense) => {
//       foodTotal += parseFloat(expense.food || 0);
//       rentTotal += parseFloat(expense.rent || 0);
//       billsTotal += parseFloat(expense.bills || 0);
//       insuranceTotal += parseFloat(expense.insurance || 0);
//       cumulativeTotal +=
//         parseFloat(expense.food || 0) +
//         parseFloat(expense.rent || 0) +
//         parseFloat(expense.bills || 0) +
//         parseFloat(expense.insurance || 0);
//     });

//     setChartData({
//       labels: ['Food', 'Rent', 'Bills', 'Insurance'],
//       datasets: [
//         {
//           label: 'Expense Distribution',
//           data: [foodTotal, rentTotal, billsTotal, insuranceTotal],
//           fill: true,
//           backgroundColor: 'rgba(75, 192, 192, 0.4)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1,
//           tension: 0.4,
//         },
//         {
//           label: 'Total Expenditure',
//           data: [cumulativeTotal, cumulativeTotal, cumulativeTotal, cumulativeTotal],
//           fill: false,
//           borderColor: 'rgba(255, 99, 132, 1)',
//           borderWidth: 2,
//           tension: 0.4,
//         },
//       ],
//     });
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   return (
//     <div className="finance-tracker-container">
//       <h2 className="finance-tracker-title">Finance Tracking Form</h2>
//       {message && <p className="finance-tracker-message success">{message}</p>}
//       {error && <p className="finance-tracker-message error">{error}</p>}

//       <form onSubmit={handleSubmit} className="finance-tracker-form">
//         {['username', 'email', 'income', 'food', 'rent', 'bills', 'insurance'].map((field) => (
//           <div className="finance-tracker-form-group" key={field}>
//             <label className="finance-tracker-label">
//               {field.charAt(0).toUpperCase() + field.slice(1)}:
//             </label>
//             <input
//               type={field === 'income' || field === 'food' || field === 'rent' || field === 'bills' || field === 'insurance' ? 'number' : 'text'}
//               name={field}
//               value={formData[field]}
//               onChange={handleChange}
//               required
//               className="finance-tracker-input-field"
//             />
//           </div>
//         ))}
//         <button type="submit" className="finance-tracker-submit-button">
//           Add Expense
//         </button>
//       </form>

//       <div className="finance-tracker-overview">
//         <div className="finance-tracker-chart-container">
//           <h3 className="finance-tracker-chart-title">Expenditure Overview</h3>
//           <Line data={chartData} />
//         </div>
//         <div className="finance-tracker-table-container">
//           <h3 className="finance-tracker-table-title">Expense List</h3>
//           <table className="finance-tracker-expense-table">
//             <thead>
//               <tr>
//                 <th>Username</th>
//                 <th>Email</th>
//                 <th>Income</th>
//                 <th>Food</th>
//                 <th>Rent</th>
//                 <th>Bills</th>
//                 <th>Insurance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {expenses.map((expense) => (
//                 <tr key={expense._id}>
//                   <td>{expense.username}</td>
//                   <td>{expense.email}</td>
//                   <td>{expense.income}</td>
//                   <td>{expense.food}</td>
//                   <td>{expense.rent}</td>
//                   <td>{expense.bills}</td>
//                   <td>{expense.insurance}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinanceForm;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Pie } from 'react-chartjs-2';  // Importing Pie chart component from react-chartjs-2
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// // Register the necessary Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const FinanceForm = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     income: '',
//     food: '',
//     rent: '',
//     bills: '',
//     insurance: '',
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [expenses, setExpenses] = useState([]);
//   const [chartData, setChartData] = useState({
//     labels: ['Food', 'Rent', 'Bills', 'Insurance'],
//     datasets: [
//       {
//         data: [0, 0, 0, 0], // Initial dummy values that will be updated
//         backgroundColor: ['rgba(128, 0, 128, 0.6)', 'rgba(0, 0, 255, 0.6)', 'rgba(75, 0, 130, 0.6)', 'rgba(135, 206, 235, 0.6)'],
//       },
//     ],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { username, email, income, food, rent, bills, insurance } = formData;
//     if (!username || !email || !income || !food || !rent || !bills || !insurance) {
//       setError('All fields are required!');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/expenses/submit', formData);
//       setMessage(response.data.message);
//       setError('');
//       setFormData({
//         username: '',
//         email: '',
//         income: '',
//         food: '',
//         rent: '',
//         bills: '',
//         insurance: '',
//       });
//       fetchExpenses();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error occurred.');
//     }
//   };

//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/expenses');
//       setExpenses(response.data);
//       updateChartData(response.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateChartData = (expensesData) => {
//     let foodTotal = 0;
//     let rentTotal = 0;
//     let billsTotal = 0;
//     let insuranceTotal = 0;

//     expensesData.forEach((expense) => {
//       foodTotal += parseFloat(expense.food || 0);
//       rentTotal += parseFloat(expense.rent || 0);
//       billsTotal += parseFloat(expense.bills || 0);
//       insuranceTotal += parseFloat(expense.insurance || 0);
//     });

//     setChartData({
//       labels: ['Food', 'Rent', 'Bills', 'Insurance'],
//       datasets: [
//         {
//           data: [foodTotal, rentTotal, billsTotal, insuranceTotal],
//           backgroundColor: ['rgba(128, 0, 128, 0.6)', 'rgba(0, 0, 255, 0.6)', 'rgba(75, 0, 130, 0.6)', 'rgba(135, 206, 235, 0.6)'],
//         },
//       ],
//     });
//   };

//   const populateForm = (expense) => {
//     setFormData({
//       username: expense.username,
//       email: expense.email,
//       income: expense.income,
//       food: expense.food,
//       rent: expense.rent,
//       bills: expense.bills,
//       insurance: expense.insurance,
//     });
//   };

//   const handleUpdate = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/api/expenses/${id}`, formData);
//       setMessage(response.data.message);
//       setError('');
//       fetchExpenses();
//       setFormData({
//         username: '',
//         email: '',
//         income: '',
//         food: '',
//         rent: '',
//         bills: '',
//         insurance: '',
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while updating the expense.');
//       setMessage('');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/expenses/${id}`);
//       setMessage(response.data.message);
//       setError('');
//       fetchExpenses();
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while deleting the expense.');
//       setMessage('');
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   return (
//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
//       <h2>Finance Tracking Form</h2>
//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         {/* Form fields */}
//         <div style={{ marginBottom: '10px' }}>
//           <label>Username:</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>Income:</label>
//           <input
//             type="number"
//             name="income"
//             value={formData.income}
//             onChange={handleChange}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>Food:</label>
//           <input
//             type="number"
//             name="food"
//             value={formData.food}
//             onChange={handleChange}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>Rent:</label>
//           <input
//             type="number"
//             name="rent"
//             value={formData.rent}
//             onChange={handleChange}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>Bills:</label>
//           <input
//             type="number"
//             name="bills"
//             value={formData.bills}
//             onChange={handleChange}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label>Insurance:</label>
//           <input
//             type="number"
//             name="insurance"
//             value={formData.insurance}
//             onChange={handleChange}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>

//         <button type="submit">Add Expense</button>
//       </form>

//       {/* Flexbox Layout for Table and Pie Chart */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
//         {/* Pie Chart */}
//         <div style={{ flex: 1, maxWidth: '45%' }}>
//           <h3>Expenditure Distribution</h3>
//           <Pie data={chartData} />
//         </div>

//         {/* Expense Table */}
//         <div style={{ flex: 1, maxWidth: '45%' }}>
//           <h3>Expense List</h3>
//           <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//             <thead>
//               <tr>
//                 <th>Username</th>
//                 <th>Email</th>
//                 <th>Income</th>
//                 <th>Food</th>
//                 <th>Rent</th>
//                 <th>Bills</th>
//                 <th>Insurance</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {expenses.map((expense) => (
//                 <tr key={expense._id}>
//                   <td>{expense.username}</td>
//                   <td>{expense.email}</td>
//                   <td>{expense.income}</td>
//                   <td>{expense.food}</td>
//                   <td>{expense.rent}</td>
//                   <td>{expense.bills}</td>
//                   <td>{expense.insurance}</td>
//                   <td>
//                     <button onClick={() => populateForm(expense)}>Edit</button>
//                     <button onClick={() => handleUpdate(expense._id)}>Update</button>
//                     <button onClick={() => handleDelete(expense._id)}>Delete</button>
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

// export default FinanceForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; // Using Line chart for area or combined chart
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../user/SavingsForm.css';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const FinanceForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    income: '',
    food: '',
    rent: '',
    bills: '',
    insurance: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ['Food', 'Rent', 'Bills', 'Insurance'],
    datasets: [
      {
        label: 'Expense Distribution',
        data: [0, 0, 0, 0], // Dummy values
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.4)', // Color for area
        borderColor: 'rgba(75, 192, 192, 1)', // Color for line
        borderWidth: 1,
        tension: 0.4, // Smoothing of the line (adjust if needed)
      },
      {
        label: 'Total Expenditure',
        data: [0, 0, 0, 0], // Cumulative totals
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)', // Different color for cumulative line
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, income, food, rent, bills, insurance } = formData;
    if (!username || !email || !income || !food || !rent || !bills || !insurance) {
      setError('All fields are required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/expenses/submit', formData);
      setMessage(response.data.message);
      setError('');
      setFormData({
        username: '',
        email: '',
        income: '',
        food: '',
        rent: '',
        bills: '',
        insurance: '',
      });
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred.');
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
      updateChartData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateChartData = (expensesData) => {
    let foodTotal = 0;
    let rentTotal = 0;
    let billsTotal = 0;
    let insuranceTotal = 0;
    let cumulativeTotal = 0;

    const expenseArray = expensesData.map((expense) => {
      foodTotal += parseFloat(expense.food || 0);
      rentTotal += parseFloat(expense.rent || 0);
      billsTotal += parseFloat(expense.bills || 0);
      insuranceTotal += parseFloat(expense.insurance || 0);
      cumulativeTotal += parseFloat(expense.food || 0) + parseFloat(expense.rent || 0) + parseFloat(expense.bills || 0) + parseFloat(expense.insurance || 0);
      
      return [foodTotal, rentTotal, billsTotal, insuranceTotal];
    });

    setChartData({
      labels: ['Food', 'Rent', 'Bills', 'Insurance'],
      datasets: [
        {
          label: 'Expense Distribution',
          data: [foodTotal, rentTotal, billsTotal, insuranceTotal],
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.4)', // Color for area
          borderColor: 'rgba(75, 192, 192, 1)', // Color for line
          borderWidth: 1,
          tension: 0.4, // Smoothing of the line (adjust if needed)
        },
        {
          label: 'Total Expenditure',
          data: [cumulativeTotal, cumulativeTotal, cumulativeTotal, cumulativeTotal], // Cumulative data
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)', // Different color for cumulative line
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    });
  };

  const populateForm = (expense) => {
    setFormData({
      username: expense.username,
      email: expense.email,
      income: expense.income,
      food: expense.food,
      rent: expense.rent,
      bills: expense.bills,
      insurance: expense.insurance,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/expenses/${id}`, formData);
      setMessage(response.data.message);
      setError('');
      fetchExpenses();
      setFormData({
        username: '',
        email: '',
        income: '',
        food: '',
        rent: '',
        bills: '',
        insurance: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the expense.');
      setMessage('');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setMessage(response.data.message);
      setError('');
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the expense.');
      setMessage('');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="finance-form-container">
      <h2>Finance Tracking Form</h2>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <form onSubmit={handleSubmit} className="finance-form">
        {/* Form fields */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Income:</label>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Food:</label>
          <input
            type="number"
            name="food"
            value={formData.food}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Rent:</label>
          <input
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Bills:</label>
          <input
            type="number"
            name="bills"
            value={formData.bills}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Insurance:</label>
          <input
            type="number"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-button">Add Expense</button>
      </form>

      <div className="finance-overview">
        <div className="chart-container">
          {/* <h3>Expenditure Overview</h3> */}
          <Line data={chartData} />
        </div>

        <div className="table-container">
          <h3>Expense List</h3>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Income</th>
                <th>Food</th>
                <th>Rent</th>
                <th>Bills</th>
                <th>Insurance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.username}</td>
                  <td>{expense.email}</td>
                  <td>{expense.income}</td>
                  <td>{expense.food}</td>
                  <td>{expense.rent}</td>
                  <td>{expense.bills}</td>
                  <td>{expense.insurance}</td>
                  <td>
                    <button onClick={() => populateForm(expense)}>✏️</button>
                    <button onClick={() => handleDelete(expense._id)}>❌</button>
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

export default FinanceForm;
