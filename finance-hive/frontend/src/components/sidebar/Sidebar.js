import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  LogOut, 
  ChevronRight, 
  Home,
  FileText,
  CreditCard,
  BarChart,  // Added for 'Analytica'
  Bell,  // Added for 'Notifications'
  DollarSign  // Added for 'Track Savings'
} from 'lucide-react';
import { Link } from 'react-router-dom'; // For routing
import './Sidebar.css';

const Sidebar = ({ userDetails, onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`dashboard-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-toggle">
        <ChevronRight className={`toggle-icon ${isExpanded ? 'rotated' : ''}`} />
      </div>

      <div className="sidebar-content">


        <nav className="sidebar-nav">
          <Link to="/user" className="sidebar-btn">
            <Home className="sidebar-icon" />
            {isExpanded && <span>Dashboard</span>}
          </Link>

          <Link to="/analytica" className="sidebar-btn">
            <BarChart className="sidebar-icon" />
            {isExpanded && <span>Analytica</span>}
          </Link>

          <Link to="/payments" className="sidebar-btn">
            <CreditCard className="sidebar-icon" />
            {isExpanded && <span>Payments</span>}
          </Link>

          <Link to="/receipts" className="sidebar-btn">
            <FileText className="sidebar-icon" />
            {isExpanded && <span>Receipts</span>}
          </Link>

          <Link to="/notifications" className="sidebar-btn">
            <Bell className="sidebar-icon" />
            {isExpanded && <span>Notifications</span>}
          </Link>

          <Link to="/tracking" className="sidebar-btn">
            <DollarSign className="sidebar-icon" />
            {isExpanded && <span>Track Savings</span>}
          </Link>

          <Link to="/change-password" className="sidebar-btn">
            <Lock className="sidebar-icon" />
            {isExpanded && <span>Change Password</span>}
          </Link>

          <button className="sidebar-btn logout" onClick={onLogout}>
            <LogOut className="sidebar-icon" />
            {isExpanded && <span>Logout</span>}
          </button>
        </nav>
        {isExpanded && (
          <div className="user-profile">
            <div className="user-avatar">
              <User size={40} />
            </div>
            <div className="user-info">
              <h3 className="user-name">{userDetails?.name}</h3>
              <p className="user-email">{userDetails?.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
