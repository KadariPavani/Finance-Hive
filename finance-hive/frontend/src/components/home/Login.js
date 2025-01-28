import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Finance Hive Login</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;