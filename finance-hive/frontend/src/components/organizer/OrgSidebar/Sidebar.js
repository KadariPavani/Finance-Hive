import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaChartBar,
  FaTable,
  FaFileAlt,
  FaChartLine,
  FaTimes,
  FaRegBell,
  FaSignOutAlt,
  FaTh,
  FaChartPie,
} from 'react-icons/fa';
import axios from 'axios';
import profileImage from '../../assets/profile.jpg';
import './Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setTimeout(() => {
        navigate('/');
      }, 0);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(
          `http://localhost:5000/user-details/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (err) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="topbar-container">
        <button className="menu-button" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
        <div className="icon-container">
          <NavLink to="/get-notification" className="icon-link">
            <FaRegBell size={24} />
          </NavLink>
          <NavLink to="/profiles" className="icon-link">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
            />
          </NavLink>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarVisible ? 'visible' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-heading">Finance Hive</h2>
          <button className="close-button" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="nav">
          <NavLink
            to="#"
            className="sidebar-item"
            onClick={() => {
              setActiveSection('home');
              toggleSidebar();
            }}
          >
            <FaTh />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="#"
            className="sidebar-item"
            onClick={() => {
              setActiveSection('overview');
              toggleSidebar();
            }}
          >
            <FaChartLine />
            <span>Data Overview</span>
          </NavLink>
          <NavLink
            to="#"
            className="sidebar-item"
            onClick={() => {
              setActiveSection('lineChart');
              toggleSidebar();
            }}
          >
            <FaChartBar />
            <span>Line Chart</span>
          </NavLink>
          <NavLink
            to="#"
            className="sidebar-item"
            onClick={() => {
              setActiveSection('datatable');
              toggleSidebar();
            }}
          >
            <FaTable />
            <span>Data Table</span>
          </NavLink>
          <NavLink
            to="#"
            className="sidebar-item"
            onClick={() => {
              setActiveSection('userReports');
              toggleSidebar();
            }}
          >
            <FaFileAlt />
            <span>User Reports</span>
          </NavLink>
          <NavLink
            to="/personal-details/all"
            className="sidebar-item"
            onClick={() => {
              setActiveSection('personaldetails');
              toggleSidebar();
            }}
          >
            <FaFileAlt />
            <span>PersonalDetailsDisplay</span>
          </NavLink>
          <NavLink
            to="#"
            className="sidebar-item"
            onClick={() => {
              setActiveSection('pieChart');
              toggleSidebar();
            }}
          >
            <FaChartPie />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="#" className="sidebar-item" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </NavLink>
        </div>

        <div className="profile-section">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : userData ? (
            <>
              <img
                src={profileImage}
                alt="Profile"
                className="profile-image"
              />
              <div>
                <p>{userData.firstName} {userData.lastName}</p>
                {/* <p>{userData.email}</p> */}
              </div>
            </>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
