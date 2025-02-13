import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import image1 from '../assets/project[1].jpg';
import logo from '../assets/logo.jpg';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted"); // Debug
    setError(""); // Reset error message

    console.log("Checkbox value:", agreeTerms); // Debug

    // Check if the checkbox is checked
    if (!agreeTerms) {
      setError("You must agree to the Privacy Policy to log in.");
      return; // Stop the login process
    }

    try {
      console.log("Attempting login with:", { mobileNumber, password }); // Debug

      const response = await axios.post("http://localhost:5000/api/login", {
        mobileNumber,
        password,
      });

      console.log("Login successful:", response.data);

      // Store token and user info in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userEmail", response.data.email);

      // Redirect based on role
      navigate(response.data.redirect);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
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
          <button type="submit" className="login-btn-login" disabled={!agreeTerms}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;