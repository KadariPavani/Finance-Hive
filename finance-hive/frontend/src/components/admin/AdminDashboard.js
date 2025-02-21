import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import CustomButton from '../CustomButton';
import Modal from '../Modal/Modal';
import './AdminDasboard.css';
import LandingPage from '../home/LandingPage/LandingPage';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ admins: 0, organizers: 0, users: 0 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleUsers, setVisibleUsers] = useState(5);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

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

  const handleDelete = async (id) => {
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
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredUsers = users.filter(user => {
    if (activeFilter === 'all') return true;
    return user.role.toLowerCase() === activeFilter;
  }).filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const barChartData = {
    labels: ['Admins', 'Organizers', 'Users'],
    datasets: [
      {
        label: 'Count',
        data: [stats.admins, stats.organizers, stats.users],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Admins', 'Organizers', 'Users'],
    datasets: [
      {
        label: 'Count',
        data: [stats.admins, stats.organizers, stats.users],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <img src="/path/to/logo.png" alt="Logo" />
          <span>Admin Dashboard</span>
        </div>
        <div className="nav-buttons">
          <CustomButton className="approach-btn" onClick={() => navigate('/approach')} withGlobalLoading>
            Approach
          </CustomButton>
          <CustomButton className="logout-btn" onClick={handleLogout} withGlobalLoading>
            Logout
          </CustomButton>
        </div>
      </nav>

      <div className="dashboard-content">
        <LandingPage/>
        
        <div className="analytics-section">
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Admins</h3>
              <p>{stats.admins}</p>
            </div>
            <div className="stat-card">
              <h3>Organizers</h3>
              <p>{stats.organizers}</p>
            </div>
            <div className="stat-card">
              <h3>Users</h3>
              <p>{stats.users}</p>
            </div>
          </div>

          <div className="charts">
            <div className="chart-container">
              <Bar data={barChartData} options={{ responsive: true }} />
            </div>
            <div className="chart-container">
              <Pie data={pieChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        <div className="dashboard-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Users
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveFilter('admin')}
            >
              Admins
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'organizer' ? 'active' : ''}`}
              onClick={() => setActiveFilter('organizer')}
            >
              Organizers
            </button>
          </div>

          <div className="action-buttons">
            <CustomButton onClick={() => navigate('/add-admin')}>Add Admin</CustomButton>
            <CustomButton onClick={() => navigate('/add-organizer')}>Add Organizer</CustomButton>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="users-grid">
          {filteredUsers.slice(0, visibleUsers).map((user) => (
            <div key={user._id} className="user-card">
              <h3>{user.name}</h3>
              <p>Role: {user.role}</p>
              <p>Email: {user.email}</p>
              <p>Mobile: {user.mobileNumber}</p>
              <div className="card-actions">
                <FiTrash2 
                  className="delete-icon" 
                  onClick={() => handleDelete(user._id)} 
                />
              </div>
            </div>
          ))}
        </div>

        {visibleUsers < filteredUsers.length && (
          // <CustomButton className="show-more-btn" onClick={() => setVisibleUsers(visibleUsers + 5)}>
          //   Show More
          // </CustomButton>
          <button className="show-more-btn" onClick={() => setVisibleUsers(visibleUsers + 5)}>
            Show More
          </button>
        )}
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
