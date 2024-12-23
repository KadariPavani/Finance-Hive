// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { FaHome, FaChartBar, FaWallet, FaCreditCard, FaClipboardList, FaCogs, FaLifeRing, FaMoneyCheckAlt, FaChartLine, FaMoneyBillAlt, FaCheckCircle, FaSearchDollar } from 'react-icons/fa'; // Add any other icons you want
import './SidebarPersonal.css';

const SidebarPersonal = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>FMS</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/">
            <FaHome className="sidebar-icon" /> Home
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/dashboard">
            <FaChartBar className="sidebar-icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/analytics">
            <FaChartLine className="sidebar-icon" /> Analytics
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/transactions">
            <FaWallet className="sidebar-icon" /> Transactions
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/cards">
            <FaCreditCard className="sidebar-icon" /> Cards
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/expenses">
            <FaClipboardList className="sidebar-icon" /> Expenses
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/savings">
            <FaMoneyCheckAlt className="sidebar-icon" /> Savings
          </Link>
        </li>
        <hr />
        <li className="sidebar-item">
          <Link to="/money-matters">
            <FaMoneyBillAlt className="sidebar-icon" /> Money Matters
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/verification-status">
            <FaCheckCircle className="sidebar-icon" /> Verification Status
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/seeking-money">
            <FaSearchDollar className="sidebar-icon" /> Seeking Money
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/settings">
            <FaCogs className="sidebar-icon" /> Settings
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/help-center">
            <FaLifeRing className="sidebar-icon" /> Help Center
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9JgCtdbYRhlDgcM_fu0rEUjx0p2EcXyE69g&s" alt="User Avatar" className="avatar" />
        <p>User Name</p>
      </div>
    </div>
  );
};

export default SidebarPersonal;
