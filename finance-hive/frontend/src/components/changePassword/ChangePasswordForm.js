import React, { useState } from 'react';
import axios from 'axios';
import './ChangePasswordForm.css';

const ChangePasswordForm = ({ onClose }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validation
    if (!mobileNumber || !newPassword || !confirmPassword) {
      setErrorMessage('All fields are required');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/change-password', {
        mobileNumber,
        newPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${token}` // Add this header
        }
      });

      if (response.data.success) {
        setSuccessMessage('Password updated successfully');
        // Clear form
        setMobileNumber('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          onClose && onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error details:', error);
      
      if (error.response?.status === 401) {
        setErrorMessage('Please login again to change your password');
      } else if (error.response?.status === 404) {
        setErrorMessage('Mobile number not found. Please check your mobile number.');
      } else if (error.response?.status === 400) {
        setErrorMessage(error.response.data.msg);
      } else {
        setErrorMessage(
          error.response?.data?.msg || 'An error occurred while updating the password'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='ChangePassword-body-chng'>
      <div className="ChangePassword-container">
        <h2 className="ChangePassword-h2">Change Password</h2>
        <form onSubmit={handleSubmit} className="ChangePassword-form">
          <div className="ChangePassword-input-group">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="ChangePassword-input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="ChangePassword-input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {errorMessage && (
            <p className="ChangePassword-error-message" style={{ marginTop: '10px' }}>
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="ChangePassword-success-message" style={{ marginTop: '10px' }}>
              {successMessage}
            </p>
          )}

          <button 
            type="submit" 
            className="ChangePassword-upd-password" 
            disabled={isLoading}
            style={{
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;