import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaChartBar, FaDollarSign, FaCheckCircle, FaCog, FaQuestionCircle } from 'react-icons/fa';
import './Sidebar.css';
import profile from '../assets/profile.jpg';
// import logo from '../assets/FH_FINAL_LOGO.jpg'
const Sidebar = ({ userData, setShowLoanForm }) => {
  return (
    <div className="sidebar-container">
      <div className="logo-text">FH</div>
      {/* <div className="logo-container">
        <img src={logo} alt="FMS Logo" className="logo-image" />
      </div> */}

      <div className="neat-column">
        <NavLink to="/" className="sidebar-item">
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="./analytics" className="sidebar-item">
          <FaChartBar />
          <span>Analytics</span>
        </NavLink>
        <NavLink to="./money-matters" className="sidebar-item">
          <FaDollarSign />
          <span>Money Matters</span>
        </NavLink>

        {/* Apply for Loan Link */}
        <NavLink to="#" className="sidebar-item" onClick={() => setShowLoanForm(true)}>
          <FaDollarSign />
          <span>Apply for Loan</span>
        </NavLink>

        <NavLink to="./verification-status" className="sidebar-item">
          <FaCheckCircle />
          <span>Verification Status</span>
        </NavLink>
        <NavLink to="./payments/list" className="sidebar-item">
          <FaDollarSign />
          <span>Payments</span>
        </NavLink>
        <NavLink to="./settings" className="sidebar-item">
          <FaCog />
          <span>Settings</span>
        </NavLink>
        <NavLink to="./feedback" className="sidebar-item">
          <FaQuestionCircle />
          <span>Feedback</span>
        </NavLink>
      </div>

      <div className="user-profile">
        <img src={profile} alt="Profile" className="profile-image" />
        {userData ? (
          <div className="user-info">
            <p className="user-name">{userData.firstName} {userData.lastName}</p>
          </div>
        ) : (
          <p className="loading-text">Loading user...</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

