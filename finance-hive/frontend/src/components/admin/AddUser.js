import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddUser.css';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck, FaSpinner, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Modal from '../Modal/Modal';

const AddUser = ({ role, onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validations, setValidations] = useState({
    name: false,
    email: false,
    mobile: false,
    password: false
  });
  const navigate = useNavigate();

  const updateProgress = () => {
    const completedSteps = Object.values(validations).filter(v => v).length;
    setProgress(completedSteps * 25);
  };

  const isValidName = (name) => {
    return name.trim().length >= 2;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidMobile = (number) => {
    return /^\d{10}$/.test(number);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setValidations(prev => ({
      ...prev,
      name: isValidName(value)
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setValidations(prev => ({
      ...prev,
      email: isValidEmail(value)
    }));
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
    setValidations(prev => ({
      ...prev,
      mobile: isValidMobile(value)
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidations(prev => ({
      ...prev,
      password: isValidPassword(value)
    }));
  };

  useEffect(() => {
    updateProgress();
  }, [validations]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(validations).every(v => v)) {
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const formattedMobileNumber = `+91${mobileNumber}`;

      const response = await axios.post(
        'http://localhost:5000/api/add-user',
        {
          name,
          email,
          mobileNumber: formattedMobileNumber,
          password,
          role
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setModalMessage(response.data.message);
      setIsError(false);
      setShowModal(true);

      setName('');
      setEmail('');
      setMobileNumber('');
      setPassword('');
      setValidations({
        name: false,
        email: false,
        mobile: false,
        password: false
      });

      if (onUserAdded) {
        onUserAdded();
      }

      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (err) {
      setModalMessage(err.response?.data?.message || 'Failed to add user');
      setIsError(true);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-creation-container">

      
      <div className="user-creation-card">
      <button
              className="back-button"
              onClick={() => navigate('/admin')}
              type="button"
            >
              <FaArrowLeft /> Back
            </button>

        <div className="form-section">
          <div className="form-header">

            <h1 className="form-title">Add New {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
          </div>
          <div className="progress-container">
            <div className="progress-line">
              <div className="progress-line-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className={`progress-step ${validations.name ? 'completed' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Personal Info</span>
            </div>
            <div className={`progress-step ${validations.email ? 'completed' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Contact</span>
            </div>
            <div className={`progress-step ${validations.mobile ? 'completed' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Mobile</span>
            </div>
            <div className={`progress-step ${validations.password ? 'completed' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Security</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`input-container ${validations.name ? 'valid' : ''}`} style={{ "--index": 1 }}>
              <FaUser className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Full Name"
                value={name}
                onChange={handleNameChange}
                required
              />
              {validations.name ? <FaCheck className="input-status success" /> : null}
            </div>

            <div className={`input-container ${validations.email ? 'valid' : ''}`} style={{ "--index": 2 }}>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="Email Address"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {validations.email ? <FaCheck className="input-status success" /> : null}
            </div>

            <div className={`input-container ${validations.mobile ? 'valid' : ''}`} style={{ "--index": 3 }}>
              <FaPhone className="input-icon" />
              <div className="mobile-input-wrapper">
                <span className="mobile-prefix">+91</span>
                <input
                  type="text"
                  className="form-input mobile-input"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  required
                />
              </div>
              {validations.mobile ? <FaCheck className="input-status success" /> : null}
            </div>

            <div className={`input-container ${validations.password ? 'valid' : ''}`} style={{ "--index": 4 }}>
              <FaLock className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Create Password (min. 6 characters)"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {validations.password ? <FaCheck className="input-status success" /> : null}
            </div>

            <button
              className={`submit-button ${Object.values(validations).every(v => v) ? 'enabled' : ''}`}
              type="submit"
              disabled={!Object.values(validations).every(v => v) || isLoading}
            >
              {isLoading ? (
                <FaSpinner className="spinner-icon" />
              ) : (
                <>
                  Create Account
                  <FaCheck />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="image-section">
          <div className="image-content">
            <h2>Welcome to Finance Hive</h2>
            <p>Join our platform to manage finances efficiently</p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Secure Account Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Real-time Financial Tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Advanced Analytics Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
        isError={isError}
      />
    </div>
  );
};

export default AddUser;