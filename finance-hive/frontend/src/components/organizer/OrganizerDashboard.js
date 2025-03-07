import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./OrganizerDashboard.css";
import { User, Phone, Mail, DollarSign, Calendar, Percent, Shield, Coins, CheckCircle, CreditCard , TrendingUp} from 'lucide-react';
import Navigation from "../Navigation/Navigation";
import { useTranslation } from 'react-i18next';
import OrganizerSidebar from '../sidebar/OrganizerSidebar';
import { Bar, Line, Scatter, Radar, PolarArea, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, RadialLinearScale } from 'chart.js';
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
  const [particular, setparticular] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;
  const [timeFilter, setTimeFilter] = useState('daily');

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

      localStorage.setItem("orgtoken", response.data.data._id);

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

  const fetchUserPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const organizerId = localStorage.getItem("orgtoken");

      if (!token || !organizerId) {
        throw new Error("Authentication tokens not found");
      }

      const usersResponse = await axios.get("http://localhost:5000/api/organizer/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userIds = usersResponse.data.users.map(user => user._id);
      let allPaymentDetails = [];

      await Promise.all(userIds.map(async (userId) => {
        try {
          const paymentResponse = await axios.get(
            `http://localhost:5000/api/finance-payments/${organizerId}/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          allPaymentDetails.push(...paymentResponse.data);
        } catch (error) {
          console.error(`Error fetching payments for User ${userId}:`, error.response?.data?.message);
        }
      }));

      setPaymentDetails(allPaymentDetails);
      setError(null);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setError(error.response?.data?.message || "Error fetching payment details");
    }
  };

  useEffect(() => {
    fetchUserPayments();
  }, []);

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

    setIsSubmitting(true);

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
      setIsSubmitting(false);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const getFilteredPaymentDetails = () => {
    if (!paymentDetails || paymentDetails.length === 0) {
      return [];
    }

    const now = new Date();

    return paymentDetails.filter(payment => {
      if (!payment.dueDate) return false;

      const paymentDate = new Date(payment.dueDate);

      if (timeFilter === 'daily') {
        return paymentDate.toDateString() === now.toDateString();
      } else if (timeFilter === 'weekly') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return paymentDate >= weekStart && paymentDate <= weekEnd;
      } else if (timeFilter === 'monthly') {
        return paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear();
      } else if (timeFilter === 'yearly') {
        return paymentDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  };

  const groupPaymentsByTimePeriod = (payments) => {
    if (!payments || payments.length === 0) {
      return { labels: [], data: [] };
    }

    const grouped = {};
    const now = new Date();

    payments.forEach(payment => {
      if (!payment.dueDate) return;

      const date = new Date(payment.dueDate);
      let key = '';

      if (timeFilter === 'daily') {
        key = date.getHours().toString();
      } else if (timeFilter === 'weekly') {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        key = dayNames[date.getDay()];
      } else if (timeFilter === 'monthly') {
        key = date.getDate().toString();
      } else if (timeFilter === 'yearly') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        key = monthNames[date.getMonth()];
      }

      if (!grouped[key]) {
        grouped[key] = 0;
      }

      grouped[key] += parseFloat(payment.emiAmount || 0);
    });

    let labels = [];
    let data = [];

    if (timeFilter === 'daily') {
      labels = Array.from({ length: 24 }, (_, i) => i.toString());
      data = labels.map(hour => grouped[hour] || 0);
    } else if (timeFilter === 'weekly') {
      labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data = labels.map(day => grouped[day] || 0);
    } else if (timeFilter === 'monthly') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      data = labels.map(day => grouped[day] || 0);
    } else if (timeFilter === 'yearly') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data = labels.map(month => grouped[month] || 0);
    }

    return { labels, data };
  };

  const renderTimeFilterOptions = () => {
    return (
      <select id="timeFilter" value={timeFilter} onChange={handleTimeFilterChange}>
        <option value="daily">{t('dashboard.daily')}</option>
        <option value="weekly">{t('dashboard.weekly')}</option>
        <option value="monthly">{t('dashboard.monthly')}</option>
        <option value="yearly">{t('dashboard.yearly')}</option>
      </select>
    );
  };

  const generateLineChartData = () => {
    const filteredPayments = getFilteredPaymentDetails();
    const { labels, data } = groupPaymentsByTimePeriod(filteredPayments);

    return {
      labels,
      datasets: [
        {
          label: 'Total Amount (₹)',
          data: data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
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
// Calculate Totals
const totalAmountBorrowed = users.reduce((total, user) => total + parseFloat(user.amountBorrowed || 0), 0);

// Total Interest Money (total interest users are supposed to pay)
const totalInterestMoney = users.reduce((total, user) => {
  const amountBorrowed = parseFloat(user.amountBorrowed || 0);
  const interest = parseFloat(user.interest || 0);
  const tenure = parseFloat(user.tenure || 0); // Assuming tenure is in months
  return total + (amountBorrowed * interest * tenure) / 1200; // Updated formula
}, 0);

// Total Interest Profit (organizer's profit from interest)
const totalInterestProfit = totalInterestMoney; // Same as totalInterestMoney

// Total Amount Paid (sum of all paid EMIs)
const totalAmountPaid = paymentDetails
  .filter(payment => payment.status.toLowerCase() === 'paid')
  .reduce((total, payment) => total + parseFloat(payment.emiAmount || 0), 0);

// Total Amount Collected (total amount the organizer is supposed to collect)
const totalAmountCollected = totalAmountBorrowed + totalInterestMoney;

// Total Payments Collected (sum of all paid EMIs)
const totalPaymentsCollected = paymentDetails
  .filter(payment => payment.status.toLowerCase() === 'paid')
  .reduce((total, payment) => total + parseFloat(payment.emiAmount || 0), 0);
// Calculate Profit Percentage
const profitPercentage = ((totalAmountCollected - totalAmountBorrowed) / totalAmountBorrowed) * 100;
// Total Users
const totalUsers = users.length; // Add this line
  const filteredPaymentDetailsForLineData = getFilteredPaymentDetails();

  const lineData = {
    labels: filteredPaymentDetailsForLineData.map(payment => {
      if (timeFilter === 'daily') {
        return new Date(payment.dueDate).getHours();
      } else if (timeFilter === 'weekly') {
        return new Date(payment.dueDate).toLocaleDateString('en-IN', { weekday: 'short' });
      } else if (timeFilter === 'yearly') {
        return new Date(payment.dueDate).toLocaleDateString('en-IN', { month: 'short' });
      }
      return formatDate(payment.dueDate);
    }),
    datasets: [
      {
        label: 'Total Amount Borrowed Over Time',
        data: filteredPaymentDetailsForLineData.map(payment => payment.emiAmount),
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

  const calculateUserProgress = () => {
    return users.map(user => {
      const userPayments = paymentDetails.filter(payment => payment.userName === user.name);
      const paidPayments = userPayments.filter(payment => payment.status.toLowerCase() === 'paid');
      const progress = userPayments.length > 0
        ? (paidPayments.length / userPayments.length) * 100
        : 0;

      return {
        name: user.name,
        progress: Math.round(progress),
        totalPayments: userPayments.length,
        paidPayments: paidPayments.length
      };
    });
  };

  return (
    <div className="organizer-dashboard">
      <Navigation organizerDetails={organizerDetails} onLogout={handleLogout} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="dashboard-layout">
        <OrganizerSidebar organizerDetails={organizerDetails} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="dashboard-main">
          <div className="analytics-section" id="analytics-section">
            <div className="organizer-analytics-dashboard">
            <div className="analytics-grid">
      {/* Total Amount Borrowed */}
      <div className="analytics-card">
        <div className="analytics-icon">
          <DollarSign size={24} />
        </div>
        <h3>Total Amount Borrowed</h3>
        <p>{formatCurrency(totalAmountBorrowed)}</p>
      </div>

      {/* Total Interest Money */}
      <div className="analytics-card">
        <div className="analytics-icon">
          <Percent size={24} />
        </div>
        <h3>Total Interest Money</h3>
        <p>{formatCurrency(totalInterestMoney)}</p>
      </div>

      {/* Total Users */}
      <div className="analytics-card">
        <div className="analytics-icon">
          <User size={24} />
        </div>
        <h3>Total Users</h3>
        <p>{totalUsers}</p>
      </div>

      {/* Profit Percentage */}
      <div className="analytics-card">
        <div className="analytics-icon">
          <TrendingUp size={24} /> {/* Use an appropriate icon */}
        </div>
        <h3>Profit Percentage</h3>
        <p>{profitPercentage.toFixed(2)}%</p>
      </div>

      {/* Total Amount Collected */}
      <div className="analytics-card">
        <div className="analytics-icon">
          <Coins size={24} />
        </div>
        <h3>Total Amount Collected</h3>
        <p>{formatCurrency(totalAmountCollected)}</p>
      </div>

      {/* Total Payments Collected */}
      <div className="analytics-card">
        <div className="analytics-icon">
          <CheckCircle size={24} />
        </div>
        <h3>Total Payments Collected</h3>
        <p>{formatCurrency(totalPaymentsCollected)}</p>
      </div>
    </div>
  
              <div className="organizer-analytics-header">
                <div className="organizer-analytics-title-section">
                  <h2 className="organizer-analytics-title">{t('dashboard.analytics')}</h2>
                  <p className="organizer-analytics-subtitle">{t('dashboard.organizer_analytics_subtitle')}</p>
                </div>
                <div className="time-filter">
                  <label htmlFor="timeFilter">{t('dashboard.time_filter')}</label>
                  {renderTimeFilterOptions()}
                </div>
              </div>

              <div className="organizer-analytics-layout">
                <div className="organizer-analytics-main">
                  <div className="organizer-analytics-card organizer-timeline-card">
                    <h3>
                      <span className="organizer-card-title">{t('dashboard.loan_disbursement_timeline')}</span>
                      <span className="organizer-card-subtitle">
                        {timeFilter === 'daily' && t('dashboard.showing_hourly_data')}
                        {timeFilter === 'weekly' && t('dashboard.showing_daily_data')}
                        {timeFilter === 'monthly' && t('dashboard.showing_daily_data')}
                        {timeFilter === 'yearly' && t('dashboard.showing_monthly_data')}
                      </span>
                    </h3>
                    <div className="organizer-chart-container large">
                      <Line
                        data={generateLineChartData()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: value => formatCurrency(value)
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: true
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  return `Amount: ${formatCurrency(context.raw)}`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                

                <div className="organizer-analytics-secondary">
                  <div className="organizer-analytics-card organizer-status-card">
                    <h3>{t('dashboard.payment_overview')}</h3>
                    <div className="organizer-status-overview">
                      <Doughnut
                        data={{
                          labels: [t('dashboard.paid'), t('dashboard.pending'), t('dashboard.overdue')],
                          datasets: [{
                            data: [
                              paymentDetails.filter(p => p.status?.toLowerCase() === 'paid').length,
                              paymentDetails.filter(p => p.status?.toLowerCase() === 'pending').length,
                              paymentDetails.filter(p =>
                                p.status?.toLowerCase() === 'pending' &&
                                new Date(p.dueDate) < new Date()
                              ).length
                            ],
                            backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false
                        }}
                      />
                    </div>
                  </div>

                  <div className="organizer-analytics-card organizer-collection-card">
                    <h3>{t('dashboard.collection_efficiency')}</h3>
                    <div className="organizer-collection-progress">
                      {(() => {
                        const totalDue = paymentDetails.length;
                        const collected = paymentDetails.filter(p => p.status.toLowerCase() === 'paid').length;
                        const efficiency = totalDue ? (collected / totalDue) * 100 : 0;

                        return (
                          <>
                            <div className="organizer-progress-circle">
                              <div className="organizer-progress-value">{Math.round(efficiency)}%</div>
                            </div>
                            <div className="organizer-progress-label">
                              {t('dashboard.collection_rate')}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="organizer-analytics-bottom">
                  <div className="organizer-analytics-card organizer-trends-card">
                    <h3>{t('dashboard.monthly_collection_trends')}</h3>
                    <div className="organizer-chart-container">
                      <Bar
                        data={{
                          labels: [...new Set(paymentDetails.map(p =>
                            new Date(p.dueDate).toLocaleString('default', { month: 'short', year: 'numeric' })
                          ))],
                          datasets: [
                            {
                              label: t('dashboard.expected_amount'),
                              data: paymentDetails.reduce((acc, payment) => {
                                const monthYear = new Date(payment.dueDate)
                                  .toLocaleString('default', { month: 'short', year: 'numeric' });
                                acc[monthYear] = (acc[monthYear] || 0) + payment.emiAmount;
                                return acc;
                              }, {}),
                              backgroundColor: '#4F46E5'
                            },
                            {
                              label: t('dashboard.collected_amount'),
                              data: paymentDetails.reduce((acc, payment) => {
                                if (payment.status.toLowerCase() === 'paid') {
                                  const monthYear = new Date(payment.dueDate)
                                    .toLocaleString('default', { month: 'short', year: 'numeric' });
                                  acc[monthYear] = (acc[monthYear] || 0) + payment.emiAmount;
                                }
                                return acc;
                              }, {}),
                              backgroundColor: '#10B981'
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: value => formatCurrency(value)
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="organizer-analytics-card organizer-insights-card">
                    <h3>{t('dashboard.business_insights')}</h3>
                    <div className="organizer-insights-grid">
                      {[
                        {
                          label: t('dashboard.total_users'),
                          value: users.length,
                          icon: 'users',
                          trend: '+' + users.filter(u =>
                            new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          ).length + ' ' + t('dashboard.this_month')
                        },
                        {
                          label: t('dashboard.total_disbursed'),
                          value: formatCurrency(totalAmountBorrowed),
                          icon: 'money',
                          trend: formatCurrency(totalAmountPaid) + ' ' + t('dashboard.collected')
                        },
                        {
                          label: t('dashboard.avg_loan_size'),
                          value: formatCurrency(totalAmountBorrowed / users.length || 0),
                          icon: 'chart',
                          trend: t('dashboard.across_all_users')
                        }
                      ].map((insight, index) => (
                        <div key={index} className="organizer-insight-item">
                          <div className="organizer-insight-header">
                            <span className="organizer-insight-label">{insight.label}</span>
                            <span className={`organizer-insight-icon ${insight.icon}`} />
                          </div>
                          <div className="organizer-insight-value">{insight.value}</div>
                          <div className="organizer-insight-trend">{insight.trend}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

            <div className="bottom-analytics-container">
              <div className="payment-details-section">
                <div className="section-header">
                  <h3>{t('dashboard.recent_payments')}</h3>
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder={t('dashboard.search_payments')}
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div className="scrollable-table">
                  <table className="payment-details-table">
                    <thead>
                      <tr>
                        <th>{t('dashboard.sno')}</th>
                        <th>{t('dashboard.user_name')}</th>
                        <th>{t('dashboard.due_date')}</th>
                        <th>{t('dashboard.emi_amount')}</th>
                        <th>{t('dashboard.payment_date')}</th>
                        <th>{t('dashboard.balance')}</th>
                        <th>{t('dashboard.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPaymentDetails.map((payment, index) => (
                        <tr key={index}>
                          <td>{payment.sno}</td>
                          <td>{payment.userName}</td>
                          <td>{formatDate(payment.dueDate)}</td>
                          <td>{formatCurrency(payment.emiAmount)}</td>
                          <td>
                            {payment.paymentDate
                              ? formatDate(payment.paymentDate)
                              : '-'}
                          </td>
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
              </div>

              <div className="user-progress-section">
                <div className="section-header">
                  <h3>{t('dashboard.user_progress')}</h3>
                </div>
                <div className="progress-bars-container">
                  {calculateUserProgress().map((user, index) => (
                    <div key={index} className="user-progress-item">
                      <div className="progress-header">
                        <span className="user-name">{user.name}</span>
                        <span className="progress-percentage">{user.progress}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <div className="progress-details">
                        <span>{user.paidPayments} / {user.totalPayments} {t('dashboard.payments')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
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