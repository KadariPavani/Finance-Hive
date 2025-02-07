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
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import { LineChart, BarChart, PieChart, Calendar, PiggyBank, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import './Tracking.css';

const Tracking = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month');
  const [statistics, setStatistics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    trend: [],
    expensesByCategory: []
  });
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);


  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all data in parallel
      const [statsRes, savingsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tracking/statistics?period=${period}`, { headers }),
        axios.get('http://localhost:5000/api/tracking/savings', { headers })
      ]);
  
      const statsData = statsRes.data;
      
      // Ensure all numbers are properly parsed
      setStatistics({
        totalIncome: Number(statsData.totalIncome) || 0,
        totalExpenses: Number(statsData.totalExpenses) || 0,
        totalSavings: Number(statsData.totalSavings) || 0,
        trend: statsData.trend.map(item => ({
          date: item.date,
          income: Number(item.income) || 0,
          expenses: Number(item.expenses) || 0
        })),
        expensesByCategory: statsData.expensesByCategory.map(cat => ({
          category: cat.category || 'Other',
          amount: Number(cat.amount) || 0
        }))
      });
  
      // Format savings goals data
      const formattedSavings = savingsRes.data.map(goal => ({
        goalName: goal.goalName,
        targetAmount: Number(goal.targetAmount),
        currentAmount: Number(goal.currentAmount)
      }));
  
      setSavingsGoals(formattedSavings);
  
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      date: item.date,
      income: Number(item.income) || 0,
      expenses: Number(item.expenses) || 0
    }));
  };

  const formatExpenseCategories = (categories) => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.map(cat => ({
      category: cat.category || 'Other',
      amount: Number(cat.amount) || 0
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b'];

  return (
    <div className="dashboard-layout">
      <Navigation />
      <Sidebar />
      <main className="dashboard-main">
        <div className="tracking-container">
          <div className="tracking-header">
            <h1>Financial Dashboard</h1>
            <div className="period-selector">
              <button
                className={`period-button ${period === 'week' ? 'active' : ''}`}
                onClick={() => setPeriod('week')}
              >
                Week
              </button>
              <button
                className={`period-button ${period === 'month' ? 'active' : ''}`}
                onClick={() => setPeriod('month')}
              >
                Month
              </button>
              <button
                className={`period-button ${period === 'year' ? 'active' : ''}`}
                onClick={() => setPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="summary-cards">
                <div className="summary-card income">
                  <TrendingUp className="card-icon" />
                  <div className="card-content">
                    <h3>Total Income</h3>
                    <p className="amount">{formatCurrency(statistics.totalIncome)}</p>
                  </div>
                </div>
                
                <div className="summary-card expense">
                  <TrendingDown className="card-icon" />
                  <div className="card-content">
                    <h3>Total Expenses</h3>
                    <p className="amount">{formatCurrency(statistics.totalExpenses)}</p>
                  </div>
                </div>

                <div className="summary-card savings">
                  <PiggyBank className="card-icon" />
                  <div className="card-content">
                    <h3>Total Savings</h3>
                    <p className="amount">{formatCurrency(statistics.totalSavings)}</p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="charts-grid">
                {/* Income vs Expenses Trend */}
                <div className="chart-card">
                  <h3>Income vs Expenses Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={statistics.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="income" stroke="#2563eb" name="Income" strokeWidth={2} />
                      <Line type="monotone" dataKey="expenses" stroke="#dc2626" name="Expenses" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>

                {/* Expense Categories */}
                <div className="chart-card">
                  <h3>Expense Categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={statistics.expensesByCategory}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      >
                        {statistics.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                {/* Savings Goals Progress */}
                <div className="chart-card">
                  <h3>Savings Goals Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={savingsGoals}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="goalName" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="currentAmount" name="Current" fill="#2563eb" />
                      <Bar dataKey="targetAmount" name="Target" fill="#16a34a" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="action-button" onClick={() => navigate('/tracking/income-form')}>
                  <TrendingUp className="button-icon" />
                  Add Income
                </button>
                <button className="action-button" onClick={() => navigate('/tracking/expense-form')}>
                  <TrendingDown className="button-icon" />
                  Add Expense
                </button>
                <button className="action-button" onClick={() => navigate('/tracking/savings-form')}>
                  <PiggyBank className="button-icon" />
                  Add Savings Goal
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tracking;