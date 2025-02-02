import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import './IncomeForm.css';

const IncomeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

// IncomeForm.js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      'http://localhost:5000/api/tracking/income',
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // Handle success
    navigate('/tracking');
  } catch (error) {
    console.error("Error saving income:", error);
  }
};


  return (
    <div className="dashboard-layout">
      <Navigation />
      <Sidebar />
      <main className="dashboard-main">
        <div className="form-container">
          <div className="form-card">
            <h2>Add Income</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="salary">Salary</option>
                  <option value="business">Business</option>
                  <option value="investment">Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Save Income
                </button>
                <button
                  type="button"
                  className="cancel-button"
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

export default IncomeForm;