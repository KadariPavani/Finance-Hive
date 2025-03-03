// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navigation from '../Navigation/Navigation';
// import Sidebar from '../sidebar/Sidebar';
// import { LineChart, PiggyBank } from 'lucide-react';
// import './Tracking.css';

// const Tracking = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="dashboard-layout">
//       <Navigation />
//       <Sidebar />
//       <main className="dashboard-main">
//         <div className="tracking-container">
//           <div className="tracking-header">
//             <h1>Personal Finance Tracking</h1>
//           </div>
          
//           <div className="tracking-cards">
//             <div className="tracking-card">
//               <div className="card-header">
//                 <LineChart className="card-icon" />
//                 <h2>Income & Expense Tracking</h2>
//               </div>
//               <div className="card-content">
//                 <p>Track your daily income and expenses to maintain a clear financial overview.</p>
//                 <div className="card-buttons">
//                   <button 
//                     className="primary-button"
//                     onClick={() => navigate('/tracking/income-form')}
//                   >
//                     Add Income
//                   </button>
//                   <button 
//                     className="primary-button"
//                     onClick={() => navigate('/tracking/expense-form')}
//                   >
//                     Add Expense
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="tracking-card">
//               <div className="card-header">
//                 <PiggyBank className="card-icon" />
//                 <h2>Savings Tracking</h2>
//               </div>
//               <div className="card-content">
//                 <p>Set and track your savings goals to secure your financial future.</p>
//                 <button 
//                   className="primary-button full-width"
//                   onClick={() => navigate('/tracking/savings-form')}
//                 >
//                   Manage Savings
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Tracking;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  RadarController
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import './Tracking.css';
import { FaPlus, FaChartLine, FaPiggyBank, FaWallet } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  RadarController,
  Title,
  Tooltip,
  Legend
);

const Tracking = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [period, setPeriod] = useState('month');
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);  // State to hold user details
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchData();
    fetchUserDetails(); // Fetch user details when the component mounts
  }, [period]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user-details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data.data); // Store user details in state
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [statsRes, savingsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tracking/statistics?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/tracking/savings', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStatistics(statsRes.data);
      setSavingsGoals(savingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = () => {
    if (!statistics) return null;

    return (
      <div className="charts-container">
        {/* Income vs Expenses Trend */}
        <div className="chart-card">
          <h3>Income vs Expenses Trend</h3>
          <Line
            data={{
              labels: statistics.trend.map(t => t.date),
              datasets: [
                {
                  label: 'Income',
                  data: statistics.trend.map(t => t.income),
                  borderColor: '#4CAF50',
                  tension: 0.4
                },
                {
                  label: 'Expenses',
                  data: statistics.trend.map(t => t.expenses),
                  borderColor: '#f44336',
                  tension: 0.4
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: 'Monthly Trend' }
              }
            }}
          />
        </div>

        {/* Expense Categories */}
        <div className="chart-card">
          <h3>Expense Distribution</h3>
          <Doughnut
            data={{
              labels: statistics.expensesByCategory.map(e => e.category),
              datasets: [{
                data: statistics.expensesByCategory.map(e => e.amount),
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                  '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'
                ]
              }]
            }}
            options={{
              plugins: {
                legend: { position: 'right' }
              }
            }}
          />
        </div>

        {/* Savings Progress */}
        <div className="chart-card">
          <h3>Savings Goals Progress</h3>
          <Bar
            data={{
              labels: savingsGoals.map(goal => goal.goalName),
              datasets: [
                {
                  label: 'Current Amount',
                  data: savingsGoals.map(goal => goal.currentAmount),
                  backgroundColor: '#4CAF50'
                },
                {
                  label: 'Remaining',
                  data: savingsGoals.map(goal => goal.targetAmount - goal.currentAmount),
                  backgroundColor: '#FFA726'
                }
              ]
            }}
            options={{
              scales: {
                x: { stacked: true },
                y: { stacked: true }
              }
            }}
          />
        </div>

        {/* Financial Overview (using Bar instead of Radar) */}
        <div className="chart-card">
          <h3>Financial Health Overview</h3>
          <Bar
            data={{
              labels: ['Savings Rate', 'Expense Control', 'Income Growth', 'Goal Progress', 'Budget Adherence'],
              datasets: [{
                label: 'Current Status (%)',
                data: [
                  (statistics.totalSavings / statistics.totalIncome * 100).toFixed(1),
                  ((statistics.totalIncome - statistics.totalExpenses) / statistics.totalIncome * 100).toFixed(1),
                  85, // Example value
                  (savingsGoals.reduce((acc, goal) => acc + (goal.currentAmount / goal.targetAmount), 0) / savingsGoals.length * 100).toFixed(1),
                  90  // Example value
                ],
                backgroundColor: [
                  '#4CAF50',
                  '#2196F3',
                  '#FFC107',
                  '#9C27B0',
                  '#FF5722'
                ]
              }]
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="tracking-dashboard">
      <Navigation />
      <Sidebar />
      <main className="tracking-main">
        <div className="tracking-header">
          <h1>Financial Overview</h1>
          <div className="period-selector">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {statistics && (
          <div className="summary-cards">
            <div className="summary-card income">
              <div className="card-icon">
                <FaWallet />
              </div>
              <div className="card-content">
                <h3>Total Income</h3>
                <p>₹{statistics.totalIncome.toLocaleString()}</p>
                <span className="trend positive">
                  <FaChartLine /> +{((statistics.totalIncome - statistics.totalExpenses) / statistics.totalIncome * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="summary-card expenses">
              <div className="card-icon">
                <FaWallet />
              </div>
              <div className="card-content">
                <h3>Total Expenses</h3>
                <p>₹{statistics.totalExpenses.toLocaleString()}</p>
                <span className="trend">
                  {statistics.totalExpenses > statistics.totalIncome ? 
                    <span className="negative">Over Budget</span> : 
                    <span className="positive">Within Budget</span>
                  }
                </span>
              </div>
            </div>

            <div className="summary-card savings">
              <div className="card-icon">
                <FaPiggyBank />
              </div>
              <div className="card-content">
                <h3>Total Savings</h3>
                <p>₹{statistics.totalSavings.toLocaleString()}</p>
                <span className="trend">
                  {((statistics.totalSavings / statistics.totalIncome) * 100).toFixed(1)}% of Income
                </span>
              </div>
            </div>
          </div>
        )}

        {renderCharts()}

        <div className="action-buttons">
          <button onClick={() => navigate('/tracking/income-form')} className="action-button income">
            <FaPlus /> Add Income
          </button>
          <button onClick={() => navigate('/tracking/expense-form')} className="action-button expense">
            <FaPlus /> Add Expense
          </button>
          <button onClick={() => navigate('/tracking/savings-form')} className="action-button savings">
            <FaPlus /> Add Savings Goal
          </button>
        </div>

        {/* Savings Goals List */}
        <div className="savings-goals-section">
          <h2>Savings Goals</h2>
          <div className="savings-goals-grid">
            {savingsGoals.map((goal) => (
              <div key={goal._id} className="goal-card">
                <h3>{goal.goalName}</h3>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                        backgroundColor: goal.currentAmount >= goal.targetAmount ? '#4CAF50' : '#2196F3'
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="goal-details">
                  <p>Target: ₹{goal.targetAmount.toLocaleString()}</p>
                  <p>Current: ₹{goal.currentAmount.toLocaleString()}</p>
                  <p>Due: {new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => navigate(`/tracking/savings-form/${goal._id}`)} 
                  className="edit-goal-button"
                >
                  Edit Goal
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tracking;
