import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, User, LogOut, Users, PlusCircle, Menu, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';
import LanguageSwitcher from '../LanguageSwitcher';
import config from '../../config';
const NavigationOrganizer = ({ organizerDetails, onLogout }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.API_URL}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    setShowLanguageDropdown(false);
  };

  return (
    <nav className="dashboard-nav">
      <div className="nav-logo">
        <Link to="/" className="nav__logo_sub">
          <div className="logo-container">
            <img src="../Images/FH_LogoFinal.png" alt="FMS Logo" className="logo-img" />
          </div>
          <h3 className="logo-text">FINANCE HIVE</h3>
        </Link>      
      </div>

      <div className="mobile-nav-group">
        <div className="language-dropdown-container">
          <button 
            className="language-icon-btn"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <Globe className="nav-icon" />
          </button>
          
          {showLanguageDropdown && (
            <div className="language-dropdown">
              <button onClick={() => changeLanguage('en')}>
                <span>English</span>
              </button>
              <button onClick={() => changeLanguage('hi')}>
                <span>हिन्दी</span>
              </button>
              <button onClick={() => changeLanguage('te')}>
                <span>తెలుగు</span>
              </button>
            </div>
          )}
        </div>

        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="nav-icon" />
        </button>
      </div>

      <div className={`nav-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/notifications" className="nav-icon-btn" title={t('notifications.title')}>
          <div className="notification-icon-wrapper">
            <Bell className="nav-icon" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </div>
        </Link>
        <button className="nav-icon-btn" title={t('common.profile')} onClick={() => navigate('/profile')}>
          <User className="nav-icon" />
        </button>
        <button className="nav-icon-btn logout-btn" onClick={onLogout} title={t('common.logout')}>
          <LogOut className="nav-icon" />
        </button>
      </div>
    </nav>
  );
};

export default NavigationOrganizer;
