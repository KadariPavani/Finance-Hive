import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import './ExpenseForm.css';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }, []);
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0); // Scroll to the top when submitting
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        'http://localhost:5000/api/tracking/expense',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/tracking');
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  return (
    <div className="expense-dashboard-layout">
      <Navigation />
      <Sidebar />
      <main className="expense-dashboard-main">
        <div className="expense-form-container">
          <div className="expense-form-card">
            <h2 className="expense-form-title">Add Expense</h2>
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="expense-form-group">
                <label htmlFor="amount" className="expense-form-label">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="expense-form-input"
                />
              </div>

              <div className="expense-form-group">
                <label htmlFor="category" className="expense-form-label">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="expense-form-select"
                >
                  <option value="">Select category</option>
                  <option value="food">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="housing">Housing</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="expense-form-group">
                <label htmlFor="date" className="expense-form-label">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="expense-form-input"
                />
              </div>

              <div className="expense-form-group">
                <label htmlFor="notes" className="expense-form-label">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="expense-form-textarea"
                />
              </div>

              <div className="expense-form-buttons">
                <button type="submit" className="expense-submit-button">
                  Save Expense
                </button>
                <button
                  type="button"
                  className="expense-cancel-button"
                  onClick={() => navigate('/tracking')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpenseForm;
