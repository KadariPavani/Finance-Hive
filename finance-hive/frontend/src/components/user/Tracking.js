import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import './Tracking.css';
import { FaPlus, FaPiggyBank, FaWallet, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Tracking = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState(null);
  const [period, setPeriod] = useState('month');
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);  // State to hold user details
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // State to track the editing row

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

  const handleDelete = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tracking/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (transaction) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tracking/transaction/${transaction._id}`, transaction, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchData(); // Refresh data after saving
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleChange = (e, transaction) => {
    const { name, value } = e.target;
    const updatedTransaction = { ...transaction, [name]: value };
    setStatistics({
      ...statistics,
      transactions: statistics.transactions.map(t => t._id === transaction._id ? updatedTransaction : t)
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Navigation
        userDetails={userDetails}
        onLogout={handleLogout}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar
        userDetails={userDetails}
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>{t('dashboard.pages.tracking.title')}</h1>
          <div className="period-selector">
            <h2>{t('dashboard.pages.tracking.period_selector.title')}</h2>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="daily">{t('dashboard.pages.tracking.period_selector.daily')}</option>
              <option value="weekly">{t('dashboard.pages.tracking.period_selector.weekly')}</option>
              <option value="monthly">{t('dashboard.pages.tracking.period_selector.monthly')}</option>
              <option value="yearly">{t('dashboard.pages.tracking.period_selector.yearly')}</option>
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
              </div>
            </div>

            <div className="summary-card expenses">
              <div className="card-icon">
                <FaWallet />
              </div>
              <div className="card-content">
                <h3>Total Expenses</h3>
                <p>₹{statistics.totalExpenses.toLocaleString()}</p>
              </div>
            </div>

            <div className="summary-card savings">
              <div className="card-icon">
                <FaPiggyBank />
              </div>
              <div className="card-content">
                <h3>Total Savings</h3>
                <p>₹{statistics.totalSavings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="tables-section">
          <h2>Income Transactions</h2>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statistics?.transactions?.filter(t => t.type === 'income').map(transaction => (
                <tr key={transaction._id}>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="date"
                        name="date"
                        value={new Date(transaction.date).toISOString().split('T')[0]}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      new Date(transaction.date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="text"
                        name="category"
                        value={transaction.category}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      transaction.category
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="number"
                        name="amount"
                        value={transaction.amount}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      `₹${transaction.amount.toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="text"
                        name="notes"
                        value={transaction.notes}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      transaction.notes
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <button onClick={() => handleSave(transaction)}>
                        <FaSave /> Save
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(transaction._id)}>
                        <FaEdit /> Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(transaction._id, 'income')}>
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Expense Transactions</h2>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statistics?.transactions?.filter(t => t.type === 'expense').map(transaction => (
                <tr key={transaction._id}>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="date"
                        name="date"
                        value={new Date(transaction.date).toISOString().split('T')[0]}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      new Date(transaction.date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="text"
                        name="category"
                        value={transaction.category}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      transaction.category
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="number"
                        name="amount"
                        value={transaction.amount}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      `₹${transaction.amount.toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <input
                        type="text"
                        name="notes"
                        value={transaction.notes}
                        onChange={(e) => handleChange(e, transaction)}
                      />
                    ) : (
                      transaction.notes
                    )}
                  </td>
                  <td>
                    {editingId === transaction._id ? (
                      <button onClick={() => handleSave(transaction)}>
                        <FaSave /> Save
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(transaction._id)}>
                        <FaEdit /> Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(transaction._id, 'expense')}>
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
