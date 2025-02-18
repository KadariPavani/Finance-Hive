import React, { useState, useEffect } from 'react';
import {
    User,
    Home,
    BarChart,
    CreditCard,
    FileText,
    Bell,
    DollarSign,
    Lock,
    LogOut,
    Plus,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const OrganizerSidebar = ({ organizerDetails, onLogout, isSidebarOpen, toggleSidebar }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed on desktop
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // On mobile, the sidebar should be collapsed by default
        if (isMobile) {
            setIsExpanded(false);
        }
    }, [isMobile]);

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsExpanded(true); // Expand on hover for desktop
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsExpanded(false); // Collapse on mouse leave for desktop
        }
    };

    const handleDashboardClick = () => {
        navigate('/organizer'); // Navigate to the organizer dashboard
        setTimeout(() => {
            const dashboardSection = document.getElementById('dashboard-section');
            if (dashboardSection) {
                dashboardSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Small delay to ensure the page has loaded
    };

    const handleAnalyticsClick = () => {
        navigate('/organizer'); // Navigate to the organizer dashboard
        setTimeout(() => {
            const analyticsSection = document.getElementById('analytics-section');
            if (analyticsSection) {
                analyticsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Small delay to ensure the page has loaded
    };

    const handleUsersClick = () => {
        navigate('/organizer'); // Navigate to the organizer dashboard
        setTimeout(() => {
            const usersSection = document.getElementById('users-section');
            if (usersSection) {
                usersSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Small delay to ensure the page has loaded
    };

    const handlePaymentsClick = () => {
        navigate('/organizer'); // Navigate to the organizer dashboard
        setTimeout(() => {
            const paymentsSection = document.getElementById('payment-details-section');
            if (paymentsSection) {
                paymentsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Small delay to ensure the page has loaded
    };

    return (
        <div
            className={`dashboard-sidebar ${isMobile ? (isSidebarOpen ? "mobile-open" : "mobile-closed") : (isExpanded ? "desktop-expanded" : "desktop-collapsed")}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sidebar-content">
                <nav className="sidebar-nav">
                    <div onClick={handleDashboardClick} className="sidebar-btn">
                        <Home className="sidebar-icon" />
                        <span>Dashboard</span>
                    </div>

                    <div onClick={handleAnalyticsClick} className="sidebar-btn">
                        <BarChart className="sidebar-icon" />
                        <span>Analytics</span>
                    </div>

                    <div onClick={handleUsersClick} className="sidebar-btn">
                        <User className="sidebar-icon" />
                        <span>Users</span>
                    </div>

                    <div onClick={handlePaymentsClick} className="sidebar-btn">
                        <CreditCard className="sidebar-icon" />
                        <span>Payment Details</span>
                    </div>

                    <Link to="/notifications" className="sidebar-btn">
                        <Bell className="sidebar-icon" />
                        <span>Notifications</span>
                    </Link>

                    <Link to="/change-password" className="sidebar-btn">
                        <Lock className="sidebar-icon" />
                        <span>Change Password</span>
                    </Link>

                    <Link to="/add-user" className="sidebar-btn">
    <Plus className="sidebar-icon" />
    <span>Add New User</span>
</Link>

                    <button className="sidebar-btn logout" onClick={onLogout}>
                        <LogOut className="sidebar-icon" />
                        <span>Logout</span>
                    </button>
                </nav>

                {/* Organizer Profile */}
                {organizerDetails && (
                    <div className={`user-profile ${isMobile ? "mobile" : (isExpanded ? "expanded" : "collapsed")}`}>
                        <div className="user-avatar">
                            <User size={40} />
                        </div>
                        <div className="user-info">
                            <h3 className="user-name">{organizerDetails.name ? organizerDetails.name : 'Name not Provided'}</h3>
                            <p className="user-email">{organizerDetails.email ? organizerDetails.email : 'Email not Provided'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizerSidebar;