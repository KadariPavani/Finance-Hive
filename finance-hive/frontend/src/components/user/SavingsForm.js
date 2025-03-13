import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import './SavingsForm.css';

const SavingsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tracking/savings", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/tracking');
    } catch (error) {
      console.error("Error saving savings goal:", error);
    }
  };

  return (
    <div className="savings-dashboard-layout">
      <Navigation />
      <Sidebar />
      <main className="savings-dashboard-main">
        <div className="savings-form-container">
          <div className="savings-form-card">
            <h2>Add Savings Goal</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="goalName">Goal Name</label>
                <input
                  type="text"
                  id="goalName"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Emergency Fund, New Car"
                />
              </div>

              <div className="form-group">
                <label htmlFor="targetAmount">Target Amount</label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentAmount">Current Amount Saved</label>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="targetDate">Target Date</label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add details about your savings goal..."
                />
              </div>

              <div className="progress-container">
                <div className="progress-label">
                  Progress: {formData.currentAmount && formData.targetAmount ? 
                    ((formData.currentAmount / formData.targetAmount) * 100).toFixed(1) + '%' 
                    : '0%'}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: formData.currentAmount && formData.targetAmount ? 
                        `${(formData.currentAmount / formData.targetAmount) * 100}%` 
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Save Goal
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

export default SavingsForm;