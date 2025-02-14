//============================MULTI LANG =======================================

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./OrganizerDashboard.css";
import { User, Phone, Mail, DollarSign, Calendar, Percent, Shield } from 'lucide-react';
// import LandingPage from '../home/LandingPage/LandingPage';
import Navigation from "../Navigation/Navigation";
import { useTranslation } from 'react-i18next';
import OrganizerSidebar from '../sidebar/OrganizerSidebar';

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
    surityGiven: "" // New field for Surity Given
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organizerDetails, setOrganizerDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [filter, setFilter] = useState({
    sno: "",
    userName: "",
    dueDate: "",
    emiAmount: "",
    paymentDate: "",
    balance: "",
    status: ""
  });
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        surityGiven: "" // Reset the new field
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

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleUserSearchChange = (e) => {
    setUserSearch(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user => {
    const searchLower = userSearch.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.mobileNumber.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const filteredPaymentDetails = paymentDetails
    .filter(payment => {
      const searchLower = search.toLowerCase();
      return (
        payment.sno.toString().includes(searchLower) ||
        payment.userName.toLowerCase().includes(searchLower) ||
        new Date(payment.dueDate).toLocaleDateString().includes(searchLower) ||
        payment.emiAmount.toString().includes(searchLower) ||
        (payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString().includes(searchLower) : true) ||
        payment.balance.toString().includes(searchLower) ||
        payment.status.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="organizer-dashboard">
      {/* <LandingPage /> */}
      <Navigation organizerDetails={organizerDetails} onLogout={handleLogout} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="dashboard-layout">
        <OrganizerSidebar organizerDetails={organizerDetails} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="dashboard-main">
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
                <div className="form-group">
                  <label>{t("dashboard.surity_given")}</label>
                  <input
                    type="text"
                    name="surityGiven"
                    value={formData.surityGiven}
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
            <div className="search-bar">
              <input
                type="text"
                placeholder={t("dashboard.search_users")}
                value={userSearch}
                onChange={handleUserSearchChange}
              />
            </div>
            {loading ? (
              <div className="loading">{t("dashboard.loading_users")}</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="users-grid">
                {filteredUsers.map((user) => (
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
                        <span><Shield size={14} /> {user.surityGiven}</span> {/* Display Surity Given */}
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
              <>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder={t("dashboard.search")}
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
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
                    {filteredPaymentDetails.map((payment, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{payment.userName}</td>
                        <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                        <td>{formatCurrency(payment.emiAmount)}</td>
                        <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : t("dashboard.not_paid")}</td>
                        <td>{formatCurrency(payment.balance)}</td>
                        <td>
                          <span className={`status-badge ${payment.status.toLowerCase()}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
