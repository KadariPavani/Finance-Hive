import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaChartBar,
  FaDatabase,
  FaUserCircle,
  // FaFileAlt,
  // FaCog,
  // FaQuestionCircle,
  FaChartLine,
  FaMoneyCheckAlt,
  FaTimes,
  FaRegBell,
  FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';
import profile from '../../assets/profile.jpg';
import './Sidebar.css'

const AdminSidebarContainer = styled.div`
  background-color: #000000;
  color: white;
  width: 300px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)')};
`;

const AdminTopbarContainer = styled.div`
position: fixed;
  top: 0; /* Align to the top of the viewport */
  left: 0; /* Start from the left edge */
  width: 100%; /* Span the full width */
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(236, 229, 250);
  padding: 5px 10px;
  z-index :1000;
`;

const AdminMenuButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  padding: 10px 20px;

  &:hover {
    background: white;
  }
`;

const AdminSearchContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 20px;
`;

const AdminSearchInput = styled.input`
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;

  @media(max-width:768px){
  width: 100px;
  }
`;

const AdminIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AdminSidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;

  svg {
    margin-right: 10px;
    font-size: 24px;
  }

  &:hover {
    background-color: #5c548d;
  }
`;

const AdminProfileSection = styled.div`
  display: flex;
  align-items: center;
  background-color: #4b39bf;
  padding: 10px;
  border-radius: 10px;
  margin-top: 20px;
`;

const AdminProfileImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  // @media (max-width:768px){
  //  width: 40px;
  // height: 40px;
  // }
`;

const AdminSidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  color:White;
`;

const AdminCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px 20px;

  &:hover {
    background: white;
    color: #000000;
  }
`;

const AdminSidebar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`http://localhost:5000/user-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      <AdminTopbarContainer>
        <AdminMenuButton onClick={toggleSidebar}>☰</AdminMenuButton>
        <AdminSearchContainer>
          <AdminSearchInput type="text" placeholder="Search..." />
        </AdminSearchContainer>
        <AdminIconContainer>
          <Link to="/submit-notification" style={{ color: 'Black' }}>
            <FaRegBell size={24} />
          </Link>
          <Link to="/profiles" style={{ color: 'white' }}>
            <AdminProfileImage src={profile} alt="Profile" />
          </Link>
        </AdminIconContainer>
      </AdminTopbarContainer>

      {/* Sidebar */}
      <AdminSidebarContainer isSidebarVisible={isSidebarVisible}>
        <AdminSidebarHeader>
          <h2 className='admin-sidebar-heading'>Finance Hive</h2>
          <AdminCloseButton onClick={toggleSidebar}>
            <FaTimes />
          </AdminCloseButton>
        </AdminSidebarHeader>

        <div>
          <AdminSidebarItem to="/admin-dashboard/:adminId" onClick={toggleSidebar}>
            <FaHome />
            <span>Home</span>
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-dashboard/:adminId/dashboard" onClick={toggleSidebar}>
            <FaChartLine />
            Dashboard
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-dashboard/:adminId/signup-distribution" onClick={toggleSidebar}>
            <FaChartBar />
            Analytics
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-dashboard/:adminId/user-table" onClick={toggleSidebar}>
            <FaDatabase />
            Overall Data
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-dashboard/:adminId/user-card" onClick={toggleSidebar}>
            <FaUserCircle />
            Profile cards
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-payments" onClick={toggleSidebar}>
            <FaMoneyCheckAlt />
            Payments
          </AdminSidebarItem>
          {/* <AdminSidebarItem to="/admin-requests">
            <FaFileAlt />
            Management Requests
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-loans">
            <FaFileAlt />
            Loan Requests
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-settings">
            <FaCog />
            Settings
          </AdminSidebarItem>
          <AdminSidebarItem to="/admin-feedback">
            <FaQuestionCircle />
            Feedback
          </AdminSidebarItem> */}
          <AdminSidebarItem as="div" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </AdminSidebarItem>
        </div>

        <AdminProfileSection>
          <AdminProfileImage src={profile} alt="Profile" />
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : userData ? (
            <div>
              <p>{userData.firstName} {userData.lastName}</p>
            </div>
          ) : (
            <p>No data</p>
          )}
        </AdminProfileSection>
      </AdminSidebarContainer>
    </>
  );
};

export default AdminSidebar;
