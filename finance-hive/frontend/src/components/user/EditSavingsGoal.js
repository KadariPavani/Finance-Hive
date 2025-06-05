import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import './EditSavingsGoal.css';
import { FaPiggyBank, FaArrowLeft } from 'react-icons/fa';
import config from '../../config';
const EditSavingsGoal = () => {
  const navigate = useNavigate();
  const { goalId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchSavingsGoal();
  }, [goalId]);

  const fetchSavingsGoal = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching goal with ID:', goalId); // Debug log
      const response = await axios.get(
        `${config.API_URL}/api/tracking/savings/${goalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Received goal data:', response.data); // Debug log
      const goal = response.data;
      setFormData({
        goalName: goal.goalName,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
        description: goal.description || '',
        category: goal.category
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching goal:', err); // Debug log
      setError('Failed to fetch savings goal details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Updating goal with data:', formData); // Debug log
      await axios.put(
        `${config.API_URL}/api/tracking/savings/${goalId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/tracking');
    } catch (err) {
      console.error('Error updating goal:', err); // Debug log
      setError('Failed to update savings goal');
    }
  };

  if (loading) {
    return (
      <div className="edit-savings-layout">
        <Navigation />
        <Sidebar />
        <main className="edit-savings-main">
          <div className="loading-spinner">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-savings-layout">
      <Navigation />
      <Sidebar />
      <main className="edit-savings-main">
        <div className="edit-savings-container">
          <div className="edit-savings-card">
            <div className="edit-savings-header">
              <button 
                className="back-button" 
                onClick={() => navigate('/tracking')}
              >
                <FaArrowLeft /> Back
              </button>
              <h2><FaPiggyBank /> Edit Savings Goal</h2>
            </div>

            {error && <div className="error-message">{error}</div>}

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
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="targetAmount">Target Amount (₹)</label>
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
                  <label htmlFor="currentAmount">Current Amount (₹)</label>
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
                  <option value="">Select Category</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                  <option value="Home">Home</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Other">Other</option>
                </select>
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
                  rows="4"
                />
              </div>

              <div className="progress-preview">
                <h3>Progress Preview</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${(formData.currentAmount / formData.targetAmount) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="progress-stats">
                  <span>
                    {((formData.currentAmount / formData.targetAmount) * 100).toFixed(1)}% Complete
                  </span>
                  <span>
                    ₹{(formData.targetAmount - formData.currentAmount).toLocaleString()} Remaining
                  </span>
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-button">
                  Update Goal
                </button>
                <button 
                  type="button" 
                  className="delete-button"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this savings goal?')) {
                      try {
                        const token = localStorage.getItem('token');
                        await axios.delete(
                          `${config.API_URL}/api/tracking/savings/${goalId}`,
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        navigate('/tracking');
                      } catch (err) {
                        setError('Failed to delete savings goal');
                      }
                    }
                  }}
                >
                  Delete Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditSavingsGoal;