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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const OrganizerSidebar = ({ organizerDetails, onLogout, isSidebarOpen, toggleSidebar }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed on desktop

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

    return (
        <div
            className={`dashboard-sidebar ${isMobile ? (isSidebarOpen ? "mobile-open" : "mobile-closed") : (isExpanded ? "desktop-expanded" : "desktop-collapsed")}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sidebar-content">
                <nav className="sidebar-nav">
                    <Link to="/organizer" className="sidebar-btn">
                        <Home className="sidebar-icon" />
                        <span>Dashboard</span>
                    </Link>

                    <Link to="/organizer/analytics" className="sidebar-btn">
                        <BarChart className="sidebar-icon" />
                        <span>Analytics</span>
                    </Link>

                    <Link to="/organizer/users" className="sidebar-btn">
                        <User className="sidebar-icon" />
                        <span>Users</span>
                    </Link>

                    <Link to="/organizer/payments" className="sidebar-btn">
                        <CreditCard className="sidebar-icon" />
                        <span>Payment Details</span>
                    </Link>

                    <Link to="/organizer/notifications" className="sidebar-btn">
                        <Bell className="sidebar-icon" />
                        <span>Notifications</span>
                    </Link>

                    <Link to="/organizer/tracking" className="sidebar-btn">
                        <DollarSign className="sidebar-icon" />
                        <span>Track Savings</span>
                    </Link>

                    <Link to="/organizer/change-password" className="sidebar-btn">
                        <Lock className="sidebar-icon" />
                        <span>Change Password</span>
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