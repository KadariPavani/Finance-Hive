import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import LandingPage from '../home/LandingPage/LandingPage';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import CustomButton from '../CustomButton';
import Modal from '../Modal/Modal';
import './AdminDasboard.css';
import LandingPage from '../home/LandingPage/LandingPage';
import AdminTitle from './AdminTitle1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faPlus, faUserPlus, faUserShield, faUsers, faUser, faChartPie, faSearch, faBars, faTimes, faUserTie, faUsersGear } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import { FaUserPlus, FaUsersCog } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { FiLoader } from 'react-icons/fi';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ admins: 0, organizers: 0, users: 0 });
  const [growth, setGrowth] = useState({ admins: 0, organizers: 0, users: 0 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleUsers, setVisibleUsers] = useState(8);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [loginActivity, setLoginActivity] = useState([]);
  const [timeframe, setTimeframe] = useState('daily');
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
    // fetchGrowth();
    fetchAdminProfile();
  }, []);

  useEffect(() => {
    fetchLoginActivity(timeframe);
  }, [timeframe]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setIsError(true);
      setModalMessage('Failed to fetch users');
      setShowModal(true);
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (err) {
      setIsError(true);
      setModalMessage('Failed to fetch stats');
      setShowModal(true);
      console.error(err);
    }
  };

  // const fetchGrowth = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://localhost:5000/api/users/growth', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setGrowth(response.data);
  //   } catch (err) {
  //     setIsError(true);
  //     setModalMessage('Failed to fetch growth data');
  //     setShowModal(true);
  //     console.error(err);
  //   }
  // };

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminProfile(response.data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchLoginActivity = async (selectedTimeframe) => {
    setIsLoadingActivity(true);
    try {
      const token = localStorage.getItem('token');
      // Update the URL to use the users endpoint instead
      const response = await axios.get(`http://localhost:5000/api/users/login-activity?timeframe=${selectedTimeframe}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setLoginActivity(response.data);
      } else {
        console.error('No data received from login activity endpoint');
        setLoginActivity([]);
      }
    } catch (error) {
      console.error('Error fetching login activity:', error);
      setLoginActivity([]);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const handleDelete = async (id, userName) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`);

    if (isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(users.filter(user => user._id !== id));
        setIsError(false);
        setModalMessage('User deleted successfully');
        setShowModal(true);
      } catch (err) {
        setIsError(true);
        setModalMessage('Failed to delete user');
        setShowModal(true);
        console.error(err);
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' ||
        user.role?.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setVisibleUsers(5);
  };

  const handleLoadMore = () => {
    setVisibleUsers(prev => prev + 5);
  };

  const displayedUsers = getFilteredUsers().slice(0, visibleUsers);

  const barChartData = {
    labels: ['Admins', 'Organizers', 'Users'],
    datasets: [
      {
        label: 'Total Users',
        data: [stats.admins, stats.organizers, stats.users],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',  // Pink for Admins
          'rgba(54, 162, 235, 0.8)',  // Blue for Organizers
          'rgba(75, 192, 192, 0.8)',  // Teal for Users
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 50,
      }
    ]
  };

  const pieChartData = {
    labels: ['Admins', 'Organizers', 'Users'],
    datasets: [
      {
        data: [stats.admins, stats.organizers, stats.users],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 15,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'User Distribution',
        color: '#333',
        font: {
          size: 20,
          weight: 'bold',
          family: "'Poppins', sans-serif"
        },
        padding: {
          top: 20,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        titleFont: {
          size: 16,
          weight: 'bold',
          family: "'Poppins', sans-serif"
        },
        bodyColor: '#666',
        bodyFont: {
          size: 14,
          family: "'Poppins', sans-serif"
        },
        padding: 12,
        boxWidth: 10,
        usePointStyle: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)',
          drawTicks: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif"
          },
          color: '#666',
          padding: 10
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif"
          },
          color: '#666',
          padding: 10
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: "'Poppins', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: 'User Composition',
        color: '#333',
        font: {
          size: 20,
          weight: 'bold',
          family: "'Poppins', sans-serif"
        },
        padding: {
          top: 20,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        titleFont: {
          size: 16,
          weight: 'bold',
          family: "'Poppins', sans-serif"
        },
        bodyColor: '#666',
        bodyFont: {
          size: 14,
          family: "'Poppins', sans-serif"
        },
        padding: 12,
        boxWidth: 10,
        usePointStyle: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const prepareActivityData = () => {
    const organizers = {};
    const users = {};

    loginActivity.forEach(item => {
      const date = item._id.date;
      if (item._id.role === 'organizer') {
        organizers[date] = item.count;
      } else {
        users[date] = item.count;
      }
    });

    const labels = [...new Set(loginActivity.map(item => item._id.date))];

    return {
      labels: labels.map(date => {
        if (timeframe === 'hourly') {
          return format(parseISO(date), 'HH:mm');
        }
        return format(parseISO(date), 'MMM dd');
      }),
      datasets: [
        {
          label: 'Organizers',
          data: labels.map(date => organizers[date] || 0),
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Users',
          data: labels.map(date => users[date] || 0),
          borderColor: '#26a69a',
          backgroundColor: 'rgba(38, 166, 154, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="admin-dashboard__container">
      {/* Navbar */}
      <nav className="admin-dashboard__navbar">
        <div className="admin-dashboard__nav-left">
          <div className="admin-dashboard__brand">
            <img src="../Images/FinanceHiveLogoFinal.png" alt="Finance Hive Logo" />
          </div>
        </div>
        <div className="admin-dashboard__nav-right">
          <div className="admin-dashboard__nav-actions">
            {/* <CustomButton 
              className="approach-btn" 
              onClick={() => navigate('/approach')} 
              withGlobalLoading
            >
              Approach
            </CustomButton> */}
            {/* <button 
              className="nav-action-btn add-organizer-btn"
              onClick={() => navigate('/add-admin')}
            >
              <FontAwesomeIcon icon={faUserShield} />
              <span>Add Admin</span>
            </button>
            <button 
              className="nav-action-btn add-organizer-btn"
              onClick={() => navigate('/add-organizer')}
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>Add Organizer</span>
            </button> */}


          </div>
          {/* <div className="admin-dashboard__nav-profile">
            <div className="admin-avatar">
              {getInitial(adminProfile.name)}
            </div>
            <div className="admin-dashboard__profile-info">
              <span className="admin-dashboard__profile-name">{adminProfile.name}</span>
              <span className="admin-dashboard__profile-role">Administrator</span>
            </div>
          </div> */}
          {/* <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button> */}
          <button
            className="admin-dashboard__hamburger"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isSidebarVisible ? faTimes : faBars} />
          </button>
        </div>

      </nav>

      <div className="admin-dashboard__layout">
        {/* Sidebar */}
        <aside className={`admin-dashboard__sidebar ${isSidebarVisible ? 'admin-dashboard__sidebar--visible' : ''}`}>
          <div className="admin-dashboard__menu">
            <button className="admin-dashboard__menu-item admin-dashboard__menu-item--active">
              <FontAwesomeIcon icon={faChartPie} />
              <span>Dashboard</span>
            </button>
            <button className="admin-dashboard__menu-item" onClick={() => navigate('/add-admin')}>
              <FontAwesomeIcon icon={faUserShield} />
              <span>Manage Admins</span>
            </button>
            <button className="admin-dashboard__menu-item" onClick={() => navigate('/add-organizer')}>
              <FontAwesomeIcon icon={faUsers} />
              <span>Manage Organizers</span>
            </button>
            <button className="admin-dashboard__menu-item" onClick={() => navigate('/approach')}>
              <FontAwesomeIcon icon={faSearch} />
              <span>Approaches</span>
            </button>
          </div>
          <button className="admin-dashboard__logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-dashboard__main">
          <LandingPage />
          {/* <div className="admin-dashboard__header">
            <h1>Dashboard Overview</h1>
            <div className="admin-dashboard__actions">
              <CustomButton onClick={() => navigate('/add-admin')}>
                <FontAwesomeIcon icon={faPlus} /> Add Admin
              </CustomButton>
              <CustomButton onClick={() => navigate('/add-organizer')}>
                <FontAwesomeIcon icon={faUserPlus} /> Add Organizer
              </CustomButton>
            </div>
          </div> */}

          {/* Stats Cards Section */}
          <div className="stats-overview">
            <div className="stat-card primary">
              <div className="stat-icon admin-icon">
                <FontAwesomeIcon icon={faUserTie} />
              </div>
              <div className="stat-content">
                <h3>Total Admins</h3>
                <p className="stat-number">{stats.admins}</p>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon organizer-icon">
                <FontAwesomeIcon icon={faUsersGear} />
              </div>
              <div className="stat-content">
                <h3>Total Organizers</h3>
                <p className="stat-number">{stats.organizers}</p>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon admin-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.users}</p>
              </div>
            </div>
          </div>
          <div className="analytics-grid">
            <div className="analytics-card growth-card">
              <div className="analytics-icon growth-icon">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              <div className="analytics-content">
                <h3>User Composition</h3>
                <div className="composition-rings">
                  <div className="ring ring-admin">
                    <div className="ring-inner">
                      <span className="ring-label">Admins</span>
                      <span className="ring-value">{((stats.admins / (stats.admins + stats.organizers + stats.users)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="ring ring-organizer">
                    <div className="ring-inner">
                      <span className="ring-label">Organizers</span>
                      <span className="ring-value">{((stats.organizers / (stats.admins + stats.organizers + stats.users)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="ring ring-user">
                    <div className="ring-inner">
                      <span className="ring-label">Users</span>
                      <span className="ring-value">{((stats.users / (stats.admins + stats.organizers + stats.users)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modern-analytics">
              <div className="analytics-card total-users">
                <div className="analytics-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="analytics-content">
                  <div className="analytics-header">
                    <h3>Total Users Distribution</h3>
                    <div className="analytics-percentage">
                      +{((stats.users / (stats.admins + stats.organizers + stats.users)) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="analytics-metrics">
                    <div className="metric">
                      <div className="metric-bar admin-bar" style={{ width: `${(stats.admins / (stats.admins + stats.organizers + stats.users)) * 100}%` }}>
                        <span className="metric-label">Admins</span>
                        <span className="metric-value">{stats.admins}</span>
                      </div>
                    </div>
                    <div className="metric">
                      <div className="metric-bar organizer-bar" style={{ width: `${(stats.organizers / (stats.admins + stats.organizers + stats.users)) * 100}%` }}>
                        <span className="metric-label">Organizers</span>
                        <span className="metric-value">{stats.organizers}</span>
                      </div>
                    </div>
                    <div className="metric">
                      <div className="metric-bar user-bar" style={{ width: `${(stats.users / (stats.admins + stats.organizers + stats.users)) * 100}%` }}>
                        <span className="metric-label">Users</span>
                        <span className="metric-value">{stats.users}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

          </div>

          {/* Analytics Charts Section */}

          {/* <div className="analytics-card trend-card">
                <div className="analytics-icon trend-icon">
                  <FontAwesomeIcon icon={faUsersGear} />
                </div>
                <div className="analytics-content">
                  <h3>User Activity</h3>
                  <div className="trend-metrics">
                    <div className="trend-item">
                      <div className="trend-info">
                        <span className="trend-label">Active Users</span>
                        <span className="trend-value">{stats.users + stats.organizers}</span>
                      </div>
                      <div className="trend-progress">
                        <div className="progress-bar" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="trend-item">
                      <div className="trend-info">
                        <span className="trend-label">Admin Coverage</span>
                        <span className="trend-value">{stats.admins}</span>
                      </div>
                      <div className="trend-progress">
                        <div className="progress-bar" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

          {/* Users Management Section */}
          <div className="users-section">
            <div className="section-header">
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Users
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'admin' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('admin')}
                >
                  Admins
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'organizer' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('organizer')}
                >
                  Organizers
                </button>
              </div>
            </div>

            {/* Add Search Bar Here */}
            <div className="search-container">
              <div className="search-wrapper">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="users-grid">
              {displayedUsers.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p className="role">Role: {user.role}</p>
                    <p className="email">Email: {user.email}</p>
                    <p className="mobile">Mobile: {user.mobileNumber}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id, user.name)}
                    title="Delete user"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            {getFilteredUsers().length > visibleUsers && (
              <button className="show-more-btn" onClick={handleLoadMore}>
                Show More
              </button>
            )}
          </div>

          <div className="activity-chart-container">
            <div className="activity-chart-header">
              <h3>Login Activity</h3>
              <div className="time-filter-buttons">
                <button
                  className={`time-filter-btn ${timeframe === 'hourly' ? 'active' : ''}`}
                  onClick={() => setTimeframe('hourly')}
                >
                  Hourly
                </button>
                <button
                  className={`time-filter-btn ${timeframe === 'daily' ? 'active' : ''}`}
                  onClick={() => setTimeframe('daily')}
                >
                  Daily
                </button>
                <button
                  className={`time-filter-btn ${timeframe === 'weekly' ? 'active' : ''}`}
                  onClick={() => setTimeframe('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`time-filter-btn ${timeframe === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTimeframe('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="activity-chart">
              {isLoadingActivity ? (
                <div className="chart-loader">
                  <FiLoader className="spinner" />
                  <span>Loading activity data...</span>
                </div>
              ) : loginActivity.length === 0 ? (
                <div className="no-data-message">
                  <p>No login activity data available for this timeframe</p>
                </div>
              ) : (
                <Line
                  data={prepareActivityData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            size: 12,
                            family: "'Poppins', sans-serif"
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${context.raw} logins`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                          drawBorder: false
                        },
                        ticks: {
                          font: {
                            size: 12,
                            family: "'Poppins', sans-serif"
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          font: {
                            size: 12,
                            family: "'Poppins', sans-serif"
                          }
                        }
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </main>
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

export default AdminDashboard;