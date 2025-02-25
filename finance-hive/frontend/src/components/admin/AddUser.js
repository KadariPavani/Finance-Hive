import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddUser.css';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck } from 'react-icons/fa';
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
  const navigate = useNavigate();

  const updateProgress = () => {
    if (!name) {
      setProgress(0);
    } else if (!email) {
      setProgress(25);
    } else if (!mobileNumber) {
      setProgress(50);
    } else if (!password) {
      setProgress(75);
    } else {
      setProgress(100);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidMobile = (number) => {
    return /^\d{10}$/.test(number);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const handleEmailChange = (e) => {
    if (!name) {
      e.preventDefault();
      return;
    }
    const value = e.target.value;
    if (value && !isValidEmail(value)) {
      return;
    }
    setEmail(value);
  };

  const handleMobileChange = (e) => {
    if (!email) {
      e.preventDefault();
      return;
    }
    const value = e.target.value;
    if (value && !isValidMobile(value)) {
      return;
    }
    setMobileNumber(value);
  };

  const handlePasswordChange = (e) => {
    if (!mobileNumber) {
      e.preventDefault();
      return;
    }
    const value = e.target.value;
    if (value && value.length < 6) {
      return;
    }
    setPassword(value);
  };

  useEffect(() => {
    updateProgress();
  }, [name, email, mobileNumber, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !mobileNumber || !password) {
      setModalMessage('Please fill in all fields in sequence');
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (!isValidEmail(email)) {
      setModalMessage('Please enter a valid email address');
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (!isValidMobile(mobileNumber)) {
      setModalMessage('Please enter a valid 10-digit mobile number');
      setIsError(true);
      setShowModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/add-user',
        { name, email, mobileNumber, password, role },
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
    }
  };

  return (
    <div className="user-creation-container">
      <div className="user-creation-card">
        <div className="form-section">
          <div className="form-header">
            <h1 className="form-title">Add New {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
            {/* <p className="form-subtitle">Complete all fields to create the account</p> */}
          </div>
          <div className="progress-container">
            <div className="progress-line">
              <div className="progress-line-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className={`progress-step ${progress >= 25 ? 'completed' : ''} ${progress < 25 ? 'active' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Personal Info</span>
            </div>
            <div className={`progress-step ${progress >= 50 ? 'completed' : ''} ${progress >= 25 && progress < 50 ? 'active' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Contact</span>
            </div>
            <div className={`progress-step ${progress >= 75 ? 'completed' : ''} ${progress >= 50 && progress < 75 ? 'active' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Mobile</span>
            </div>
            <div className={`progress-step ${progress >= 100 ? 'completed' : ''} ${progress >= 75 && progress < 100 ? 'active' : ''}`}>
              <div className="progress-dot"></div>
              <span className="progress-label">Security</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-container" style={{"--index": 1}}>
              <FaUser className="input-icon" />
              <input 
                type="text" 
                className="form-input"
                placeholder="Full Name" 
                value={name}
                onChange={handleNameChange}
                required 
              />
              <FaCheck className="input-status" />
            </div>
            
            <div className="input-container" style={{"--index": 2}}>
              <FaEnvelope className="input-icon" />
              <input 
                type="email" 
                className="form-input"
                placeholder="Email Address" 
                value={email}
                onChange={handleEmailChange}
                required 
                disabled={!name}
              />
              <FaCheck className="input-status" />
            </div>
            
            <div className="input-container" style={{"--index": 3}}>
              <FaPhone className="input-icon" />
              <input 
                type="text" 
                className="form-input"
                placeholder="Mobile Number" 
                value={mobileNumber}
                onChange={handleMobileChange}
                required 
                disabled={!email}
              />
              <FaCheck className="input-status" />
            </div>
            
            <div className="input-container" style={{"--index": 4}}>
              <FaLock className="input-icon" />
              <input 
                type="password" 
                className="form-input"
                placeholder="Create Password" 
                value={password}
                onChange={handlePasswordChange}
                required 
                disabled={!mobileNumber}
              />
              <FaCheck className="input-status" />
            </div>

            <button className="submit-button" type="submit">
              Create Account
              <FaCheck />
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