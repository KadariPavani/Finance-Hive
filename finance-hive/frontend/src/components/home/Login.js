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
    setError(""); // Reset error message
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

      
        <h2 className="login-heading">Get started with Finance Hive 
        </h2>
        <p className="login-paragraph">Welcome to Finance Hive</p>
        {error && <p className="login-error-message">{error}</p>}
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
            id="terms" 
            checked={agreeTerms} 
            onChange={() => setAgreeTerms(!agreeTerms)}
          />
          <label htmlFor="terms">I agree to the <a href="#">Terms and Conditions</a></label>
        </div>
        <button type="submit" className="login-btn-login">Login</button>
      </form>
    </div>
  </div>

    
  );
};

export default Login;
