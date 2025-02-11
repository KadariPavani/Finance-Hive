//============================MULTI LANG =======================================

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./OrganizerDashboard.css";
import { User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
import LandingPage from '../home/LandingPage/LandingPage';
import NavigationOrganizer from "../Navigation/NavigationOrganizer";
import { useTranslation } from 'react-i18next';

const OrganizerDashboard = () => {
  const { t, i18n } = useTranslation();
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
  const [organizerDetails, setOrganizerDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchOrganizerDetails(),
        fetchUsers(),
        fetchPaymentDetails()
      ]);
    };
    fetchInitialData();
  }, []);

  const fetchOrganizerDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("http://localhost:5000/api/organizer/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrganizerDetails({
        ...response.data.data,
        role: 'organizer' // Ensure role is set explicitly
      });
    } catch (error) {
      console.error("Error fetching organizer details:", error);
      setError(error.response?.data?.message || "Error fetching organizer details");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
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

  const fetchPaymentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("http://localhost:5000/api/finance-payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPaymentDetails(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setError(error.response?.data?.message || "Error fetching payment details");
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

      alert(t("dashboard.user_added_successfully"));
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
      alert(error.response?.data?.message || t("dashboard.failed_to_add_user"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleUserClick = (user) => {
    localStorage.setItem("selectedUser", JSON.stringify(user));
    navigate(`/user-payments/${user._id}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="organizer-dashboard">
      <LandingPage />
      <NavigationOrganizer organizerDetails={organizerDetails} onLogout={handleLogout} />

      <div className="add-user-section">
        <h2>{t("dashboard.add_new_user")}</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-grid">
            <div className="form-group">
              <label>{t("dashboard.name")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.email")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.mobile")}</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.password")}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.amount_borrowed")}</label>
              <input
                type="number"
                name="amountBorrowed"
                value={formData.amountBorrowed}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.tenure")}</label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.interest")}</label>
              <input
                type="number"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">{t("dashboard.add_user")}</button>
        </form>
      </div>

      <div className="users-section">
        <h2>{t("dashboard.your_users")}</h2>
        {loading ? (
          <div className="loading">{t("dashboard.loading_users")}</div>
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
                    <span><Calendar size={14} /> {user.tenure} {t("dashboard.months")}</span>
                    <span><Percent size={14} /> {user.interest}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="payment-details-section">
        <h2>{t("dashboard.payment_details")}</h2>
        {loading ? (
          <div className="loading">{t("dashboard.loading_payments")}</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <table className="payment-details-table">
            <thead>
              <tr>
                <th>{t("dashboard.sno")}</th>
                <th>{t("dashboard.user_name")}</th>
                <th>{t("dashboard.due_date")}</th>
                <th>{t("dashboard.emi_amount")}</th>
                <th>{t("dashboard.payment_date")}</th>
                <th>{t("dashboard.balance")}</th>
                <th>{t("dashboard.status")}</th>
              </tr>
            </thead>
            <tbody>
              {paymentDetails.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.sno}</td>
                  <td>{payment.userName}</td>
                  <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td>{formatCurrency(payment.emiAmount)}</td>
                  <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : t("dashboard.not_paid")}</td>
                  <td>{formatCurrency(payment.balance)}</td>
                  <td>{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
