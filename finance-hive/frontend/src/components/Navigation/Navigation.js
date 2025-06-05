import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';
import LanguageSwitcher from '../LanguageSwitcher';
import config from '../../config';
const Navigation = ({ userDetails, onLogout, toggleSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="dashboard-nav">
      <div className="nav-logo">
        <Link to="/" className="nav__logo_sub">
          <div className="logo-container">
            <img src="../Images/FinanceHiveLogoFinal.png" alt="FMS Logo" className="logo-img" />
          </div>
          {/* <h3 className="logo-text">FINANCE HIVE</h3> */}
        </Link>
      </div>

      <div className="nav-actions">
        {isMobile ? (
          <button className="nav-icon-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <X className="nav-icon" /> : <Menu className="nav-icon" />}
          </button>
        ) : (
          <>
            <Link to="/notifications" className="nav-icon-btn" title={t('notifications.title')}>
              <div className="notification-icon-wrapper">
                <Bell className="nav-icon" />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </div>
            </Link>
            <button className="nav-icon-btn" title={t('common.profile')} onClick={() => navigate('/profile')}>
              <User className="nav-icon" />
            </button>
            <button 
              className="nav-icon-btn logout-btn" 
              onClick={() => {
                  localStorage.clear();
                  navigate("/login", { replace: true });
              }} 
              title={t('common.logout')}
            >
              <LogOut className="nav-icon" />
            </button>
            <LanguageSwitcher />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;