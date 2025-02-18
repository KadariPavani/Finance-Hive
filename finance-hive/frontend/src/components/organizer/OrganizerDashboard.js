import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./OrganizerDashboard.css";
import { User, Phone, Mail, DollarSign, Calendar, Percent, Shield } from 'lucide-react';
import Navigation from "../Navigation/Navigation";
import { useTranslation } from 'react-i18next';
import OrganizerSidebar from '../sidebar/OrganizerSidebar';
import { Bar, Line, Scatter, Radar, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, RadialLinearScale } from 'chart.js';
import CustomButton from '../CustomButton';
import Modal from "../Modal/Modal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, RadialLinearScale);

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
    surityGiven: ""
  });

  const [users, setUsers] = useState([]);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

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
        role: 'organizer'
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
    
    if (!formData.name || !formData.email || !formData.mobileNumber || !formData.password || 
        !formData.amountBorrowed || !formData.tenure || !formData.interest || !formData.surityGiven) {
      setIsSuccess(false);
      setModalMessage(t("dashboard.failed_to_add_user"));
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      return;
    }
  
    setIsSubmitting(true); // Start loading
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      await axios.post("http://localhost:5000/api/add-user-payment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setIsSuccess(true);
      setModalMessage("User added successfully!");
      await fetchUsers();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        amountBorrowed: "",
        tenure: "",
        interest: "",
        surityGiven: ""
      });
  
    } catch (error) {
      setIsSuccess(false);
      setModalMessage(error.response?.data?.message || "Failed to add user");
      setError(error.response?.data?.message || "Failed to add user");
    } finally {
      setIsSubmitting(false); // Stop loading
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.name || !formData.email || !formData.mobileNumber || !formData.password || !formData.amountBorrowed || !formData.tenure || !formData.interest || !formData.surityGiven) {
  //     setIsSuccess(false);
  //     setModalMessage(t("dashboard.failed_to_add_user"));
  //     setShowModal(true);
  //     setTimeout(() => setShowModal(false), 3000);
  //     return;
  //   }
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       throw new Error("No authentication token found");
  //     }

  //     await axios.post("http://localhost:5000/api/add-user-payment", formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setIsSuccess(true);
  //     setModalMessage("User added successfully!");
  //     await fetchUsers();
      
  //     setFormData({
  //       name: "",
  //       email: "",
  //       mobileNumber: "",
  //       password: "",
  //       amountBorrowed: "",
  //       tenure: "",
  //       interest: "",
  //       surityGiven: ""
  //     });

  //   } catch (error) {
  //     setIsSuccess(false);
  //     setModalMessage(error.response?.data?.message || "Failed to add user");
  //     setError(error.response?.data?.message || "Failed to add user");
  //   } finally {
  //     setShowModal(true);
  //     setTimeout(() => {
  //       setShowModal(false);
  //     }, 3000);
  //   }
  // };

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
        (payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : true) ||
        payment.balance.toString().includes(searchLower) ||
        payment.status.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const totalAmountBorrowed = users.reduce((total, user) => total + parseFloat(user.amountBorrowed || 0), 0);
  const totalInterest = users.reduce((total, user) => total + parseFloat(user.interest || 0), 0);
  const totalUsers = users.length;

  const totalAmountPaid = paymentDetails.reduce((total, payment) => total + parseFloat(payment.emiAmount || 0), 0);
  const totalInterestMoney = users.reduce((total, user) => total + (parseFloat(user.amountBorrowed || 0) * parseFloat(user.interest || 0) / 100), 0);
  const totalPaymentsCollected = paymentDetails
    .filter(payment => payment.status.toLowerCase() === 'paid')
    .reduce((total, payment) => total + parseFloat(payment.emiAmount || 0), 0);

  const lineData = {
    labels: paymentDetails.map(payment => new Date(payment.dueDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Amount Borrowed Over Time',
        data: paymentDetails.map(payment => payment.emiAmount),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const scatterData = {
    datasets: [
      {
        label: 'Users',
        data: users.map(user => ({
          x: user.amountBorrowed,
          y: user.interest,
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const radarData = {
    labels: ['Amount Borrowed', 'Interest', 'Tenure', 'Surity Given'],
    datasets: users.map(user => ({
      label: user.name,
      data: [user.amountBorrowed, user.interest, user.tenure, user.surityGiven],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
    }))
  };

  const polarAreaData = {
    labels: users.map(user => user.name),
    datasets: [
      {
        label: 'Amount Borrowed',
        data: users.map(user => user.amountBorrowed),
        backgroundColor: users.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
      }
    ]
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="organizer-dashboard">
      <Navigation organizerDetails={organizerDetails} onLogout={handleLogout} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="dashboard-layout">
        <OrganizerSidebar organizerDetails={organizerDetails} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="dashboard-main">
        <div className="analytics-section" id="analytics-section">
        <h2>{t("dashboard.analytics")}</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>{t("dashboard.total_amount_borrowed")}</h3>
                <p>{formatCurrency(totalAmountBorrowed)}</p>
              </div>
              <div className="analytics-card">
                <h3>{t("dashboard.total_interest")}</h3>
                <p>{totalInterest}%</p>
              </div>
              <div className="analytics-card">
                <h3>{t("dashboard.total_users")}</h3>
                <p>{totalUsers}</p>
              </div>
              <div className="analytics-card">
                <h3>{t("dashboard.total_amount_paid")}</h3>
                <p>{formatCurrency(totalAmountPaid)}</p>
              </div>
              <div className="analytics-card">
                <h3>{t("dashboard.total_interest_money")}</h3>
                <p>{formatCurrency(totalInterestMoney)}</p>
              </div>
              <div className="analytics-card">
                <h3>{t("dashboard.total_payments_collected")}</h3>
                <p>{formatCurrency(totalPaymentsCollected)}</p>
              </div>
            </div>
            <div className="chart-section">
              <div className="chart-card">
                <h3>{t("dashboard.amount_borrowed_over_time")}</h3>
                <Line data={lineData} />
              </div>
              <div className="chart-card">
                <h3>{t("dashboard.scatter_plot")}</h3>
                <Scatter data={scatterData} />
              </div>
              <div className="chart-card">
                <h3>{t("dashboard.polar_area_chart")}</h3>
                <PolarArea data={polarAreaData} />
              </div>
            </div>
          </div>
          {/* <div className="add-user-section"">
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
<button 
  type="submit" 
  className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <span className="button-content">
      <span className="spinner"></span>
      {t("dashboard.adding_user")}
    </span>
  ) : (
    t("dashboard.add_user")
  )}
</button>
            </form>
          </div> */}

          <div className="users-section" id="users-section">
          <h2>{t("dashboard.your_users")}</h2>
  <div className="search-bar">
    <input
      type="text"
      placeholder={t("dashboard.search_users")}
      value={userSearch}
      onChange={handleUserSearchChange}
    />
  </div>
  {error ? (
    <div className="error">{error}</div>
  ) : (
    <>
      <div className="users-grid">
        {currentUsers.map((user) => (
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
                <span><Shield size={14} /> {user.surityGiven}</span>
              </div>
              <button 
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(user);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="page-btn">
          Previous
        </button>
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)} 
          className="page-btn"
        >
          Next
        </button>
      </div>
    </>
  )}
</div>

<div className="payment-details-section" id="payment-details-section">
              <h2>{t("dashboard.payment_details")}</h2>
            {error ? (
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
                <div className="scrollable-table">
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
                </div>
                <div className="total-count">
                  {t("dashboard.total_payments")}: {filteredPaymentDetails.length}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          message={modalMessage}
          onClose={() => setShowModal(false)}
          isError={!isSuccess}
        />
      )}
    </div>
  );
};

export default OrganizerDashboard;