import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../CustomButton';
import './Login.css';

import image1 from '../assets/project[1].jpg';
import logo from '../assets/logo.jpg';
import config from '../../config';
const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("You must agree to the Privacy Policy to log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${config.API_URL}/api/login`, 
        {
          mobileNumber,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userEmail", response.data.email);

      navigate(response.data.redirect);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-login-container">
      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form-input">
          <div className="login-logo-container">
            <img src={logo} alt="Finance Hive Logo" className="login-logo" />
            <h3 className="login-get-started">Finance Hive</h3>
          </div>

          <h2 className="login-heading">Get started with Finance Hive</h2>
          <p className="login-paragraph">Welcome to Finance Hive</p>
          {error && (
            <p className="login-error-message" style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </p>
          )}
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-terms">
            <input
              type="checkbox"
              id="privacyPolicy"
              checked={agreeTerms}
              onChange={() => {
                setAgreeTerms(!agreeTerms);
                console.log("Checkbox checked:", !agreeTerms); // Debug
              }}
              required
            />
            <label htmlFor="privacyPolicy">
              I agree to the <a href="/privacy-policy">Privacy Policy</a>
            </label>
          </div>
          <CustomButton type="submit" className="login-btn-login" disabled={!agreeTerms} withGlobalLoading>
            Login
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default Login;