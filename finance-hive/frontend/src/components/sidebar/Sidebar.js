import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  LogOut, 
  ChevronRight, 
  Home,
  FileText,
  CreditCard
} from 'lucide-react';
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

        <nav className="sidebar-nav">
          <button className="sidebar-btn">
            <Home className="sidebar-icon" />
            {isExpanded && <span>Dashboard</span>}
          </button>

          <button className="sidebar-btn">
            <FileText className="sidebar-icon" />
            {isExpanded && <span>Documents</span>}
          </button>

          <button className="sidebar-btn">
            <CreditCard className="sidebar-icon" />
            {isExpanded && <span>Payments</span>}
          </button>

          <button className="sidebar-btn">
            <User className="sidebar-icon" />
            {isExpanded && <span>Profile</span>}
          </button>

          <button className="sidebar-btn">
            <Lock className="sidebar-icon" />
            {isExpanded && <span>Change Password</span>}
          </button>

          <button className="sidebar-btn logout" onClick={onLogout}>
            <LogOut className="sidebar-icon" />
            {isExpanded && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;