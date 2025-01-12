import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaCoins, FaCheckCircle, FaCog, FaQuestionCircle, FaTimes, FaRegBell, FaMoneyBillWave, FaWallet, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import './Sidebar.css';
import profile from '../../assets/profile.jpg';

const Sidebar = ({ setShowLoanForm }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Fetch user data from localStorage
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/user-details/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data || err.message);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <>
      <div className="user-sidebar-topbar">
        <button className="user-sidebar-menu-button" onClick={toggleSidebar}>☰</button>
        <div className="user-sidebar-search">
          <input type="text" placeholder="Search..." className="user-sidebar-search-input" />
        </div>
        <div className="user-sidebar-icons">
          <NavLink to="/notifications" style={{ color: 'black' }}><FaRegBell size={24} /></NavLink>
          <NavLink to={`/profiles/${userId}`} style={{ color: 'white' }}>
            <img src={profile} alt="Profile" style={{ width: '30px', borderRadius: '50%' }} />
          </NavLink>
        </div>
      </div>

      <div className={`user-sidebar-container ${isSidebarVisible ? 'visible' : 'hidden'}`}>
        <div className="user-sidebar-header">
          <div className="user-sidebar-logo-text">FINANCE HIVE</div>
          <button className="user-sidebar-close-button" onClick={closeSidebar}><FaTimes /></button>
        </div>
        <div className="user-sidebar-neat-column">
          <NavLink to={`/user-dashboard/${userId}`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaHome /><span>Home</span>
          </NavLink>
          <NavLink to={`/user-dashboard/${userId}/dashboard`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaChartBar /><span>FinanceTrackings</span>
          </NavLink>
          <NavLink to={`/money-matters`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaCoins /><span>Money Matters</span>
          </NavLink>
          <NavLink to={`/loan-form`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaMoneyBillWave /><span>Apply for Loan</span>
          </NavLink>
          <NavLink to={`/user-dashboard/${userId}/verification-status`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaCheckCircle /><span>Verification Status</span>
          </NavLink>
          <NavLink to={`/user-dashboard/${userId}/payments`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaWallet /><span>Payments</span>
          </NavLink>
          <NavLink to={`./user-dashboard/${userId}/settings`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaCog /><span>Settings</span>
          </NavLink>
          <NavLink to={`./user-dashboard/:userId/feedback`} className="user-sidebar-item" onClick={closeSidebar}>
            <FaQuestionCircle /><span>Feedback</span>
          </NavLink>

          <div className="user-sidebar-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <FaSignOutAlt /><span>Logout</span>
          </div>
        </div>

        <div className="user-sidebar-profile">
          <img src={profile} alt="Profile" className="user-sidebar-profile-image" />
          {loading ? (
            <p className="user-sidebar-loading">Loading user...</p>
          ) : error ? (
            <p className="user-sidebar-error">{error}</p>
          ) : userData ? (
            <div className="user-sidebar-info">
              <p className="user-sidebar-name">{userData.firstName} {userData.lastName}</p>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
