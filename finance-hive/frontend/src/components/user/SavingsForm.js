import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../sidebar/Sidebar';
import './SavingsForm.css';
import { useTranslation } from 'react-i18next'; // Add translation support

const SavingsForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: '',
    category: '' // Add category field
  });

  const handleChange = (e) => {
    const value = e.target.type === 'number' ?
      parseFloat(e.target.value) : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://finance-hive.onrender.com/api/tracking/savings",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        navigate('/tracking');
      }
    } catch (error) {
      console.error("Error saving savings goal:", error);
      setError(error.response?.data?.message || 'Failed to save savings goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="savings-dashboard-layout">
      <Navigation />
      <Sidebar />
      <main className="savings-dashboard-main">
        <div className="savings-form-container">
          <div className="savings-form-card">
            <h2>{t('dashboard.forms.savings.title')}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="goalName">{t('dashboard.forms.savings.goal_name')}</label>
                <input
                  type="text"
                  id="goalName"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleChange}
                  required
                  placeholder={t('dashboard.tracking.savings.form.categories.emergency')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">{t('dashboard.forms.savings.category')}</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('dashboard.select_language')}</option>
                  <option value="Emergency Fund">{t('dashboard.tracking.savings.form.categories.emergency')}</option>
                  <option value="Retirement">{t('dashboard.tracking.savings.form.categories.retirement')}</option>
                  <option value="Education">{t('dashboard.tracking.savings.form.categories.education')}</option>
                  <option value="Travel">{t('dashboard.tracking.savings.form.categories.travel')}</option>
                  <option value="Home">{t('dashboard.tracking.savings.form.categories.home')}</option>
                  <option value="Vehicle">{t('dashboard.tracking.savings.form.categories.vehicle')}</option>
                  <option value="Wedding">{t('dashboard.tracking.savings.form.categories.wedding')}</option>
                  <option value="Other">{t('dashboard.tracking.savings.form.categories.other')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="targetAmount">{t('dashboard.tracking.savings.form.target_amount')}</label>
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
                <label htmlFor="currentAmount">{t('dashboard.tracking.savings.form.current_amount')}</label>
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
                <label htmlFor="targetDate">{t('dashboard.tracking.savings.form.target_date')}</label>
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
                <label htmlFor="description">{t('dashboard.tracking.savings.form.description')}</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t('dashboard.forms.savings.description')}
                />
              </div>

              <div className="progress-container">
                <div className="progress-label">
                  {t('dashboard.pages.savings.goals.progress')}:{' '}
                  {formData.currentAmount && formData.targetAmount ?
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
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? t('dashboard.common.loading') : t('dashboard.buttons.save')}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/tracking')}
                  disabled={loading}
                >
                  {t('dashboard.buttons.cancel')}
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