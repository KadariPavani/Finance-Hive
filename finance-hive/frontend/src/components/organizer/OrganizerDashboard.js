// OrganizerDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./OrganizerDashboard.css";
import { User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
import LandingPage from '../home/LandingPage/LandingPage';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    amountBorrowed: "",
    tenure: "",
    interest: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/organizer/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      await axios.post("http://localhost:5000/api/add-user-payment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User added successfully!");
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        amountBorrowed: "",
        tenure: "",
        interest: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleUserClick = (user) => {
    // Store user details in local storage
    localStorage.setItem("selectedUser", JSON.stringify(user));
    navigate(`/user-payments/${user._id}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="organizer-dashboard">
      <LandingPage />
      
      <div className="add-user-section">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Amount Borrowed (₹)</label>
              <input
                type="number"
                name="amountBorrowed"
                value={formData.amountBorrowed}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tenure (months)</label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Interest (%)</label>
              <input
                type="number"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">Add User</button>
        </form>
      </div>

      <div className="users-section">
        <h2>Your Users</h2>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card" onClick={() => handleUserClick(user)}>
                <div className="user-card-header">
                  <User className="user-icon" />
                  <h3>{user.name}</h3>
                </div>
                <div className="user-card-body">
                  <p><Phone size={16} /> {user.mobileNumber}</p>
                  <p><Mail size={16} /> {user.email}</p>
                  <p><DollarSign size={16} /> {formatCurrency(user.amountBorrowed)}</p>
                  <div className="user-card-footer">
                    <span><Calendar size={14} /> {user.tenure} months</span>
                    <span><Percent size={14} /> {user.interest}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
