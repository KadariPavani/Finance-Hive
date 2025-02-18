import React, { useState, useEffect } from 'react';
import {
    User,
    Lock,
    LogOut,
    Home,
    FileText,
    CreditCard,
    BarChart,
    Bell,
    DollarSign,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userDetails, onLogout, isSidebarOpen, toggleSidebar }) => {
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

    const handlePaymentsClick = () => {
        navigate('/dashboard'); // Navigate to the dashboard route
        setTimeout(() => {
            const paymentsTable = document.getElementById('payments-table');
            if (paymentsTable) {
                paymentsTable.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Small delay to ensure the page has loaded
    };

    const handleAnalyticsClick = () => {
        navigate('/dashboard'); // Navigate to the dashboard route
        setTimeout(() => {
            const analyticsSection = document.getElementById('analytics-section');
            if (analyticsSection) {
                analyticsSection.scrollIntoView({ behavior: 'smooth' });
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
                    <Link to="/user" className="sidebar-btn">
                        <Home className="sidebar-icon" />
                        <span>Dashboard</span>
                    </Link>

                    <div onClick={handleAnalyticsClick} className="sidebar-btn">
                        <BarChart className="sidebar-icon" />
                        <span>Analytics</span>
                    </div>

                    <div onClick={handlePaymentsClick} className="sidebar-btn">
                        <CreditCard className="sidebar-icon" />
                        <span>Payments</span>
                    </div>

                    <Link to="/receipts" className="sidebar-btn">
                        <FileText className="sidebar-icon" />
                        <span>Receipts</span>
                    </Link>

                    <Link to="/notifications" className="sidebar-btn">
                        <Bell className="sidebar-icon" />
                        <span>Notifications</span>
                    </Link>

                    <Link to="/tracking" className="sidebar-btn">
                        <DollarSign className="sidebar-icon" />
                        <span>Track Savings</span>
                    </Link>

                    <Link to="/change-password" className="sidebar-btn">
                        <Lock className="sidebar-icon" />
                        <span>Change Password</span>
                    </Link>

                    <button className="sidebar-btn logout" onClick={onLogout}>
                        <LogOut className="sidebar-icon" />
                        <span>Logout</span>
                    </button>
                </nav>

                {/* User Profile */}
                {userDetails && (
                    <div className={`user-profile ${isMobile ? "mobile" : (isExpanded ? "expanded" : "collapsed")}`}>
                        <div className="user-avatar">
                            <User size={40} />
                        </div>
                        <div className="user-info">
                            <h3 className="user-name">{userDetails.name ? userDetails.name : 'Name not Provided'}</h3>
                            <p className="user-email">{userDetails.email ? userDetails.email : 'Email not Provided'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

// import React, { useState, useEffect } from 'react';
// import {
//     User,
//     Lock,
//     LogOut,
//     Home,
//     FileText,
//     CreditCard,
//     BarChart,
//     Bell,
//     DollarSign,
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import './Sidebar.css';

// const Sidebar = ({ userDetails, onLogout, isSidebarOpen, toggleSidebar }) => {
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//     const [isExpanded, setIsExpanded] = useState(!isMobile); // Default to expanded on desktop

//     useEffect(() => {
//         const handleResize = () => setIsMobile(window.innerWidth < 768);
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     useEffect(() => {
//         setIsExpanded(!isMobile);
//     }, [isMobile]);

//     const handleMouseEnter = () => {
//         if (!isMobile) {
//             setIsExpanded(true);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (!isMobile) {
//             setIsExpanded(false);
//         }
//     };

//     return (
//         <div
//             className={`dashboard-sidebar ${isMobile ? (isSidebarOpen ? "mobile-open" : "mobile-closed") : (isExpanded ? "desktop-expanded" : "desktop-collapsed")}`}
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//         >
//             <div className="sidebar-content">
//                 <nav className="sidebar-nav">
//                     <Link to="/user" className="sidebar-btn">
//                         <Home className="sidebar-icon" />
//                         <span>Dashboard</span>
//                     </Link>

//                     <Link to="/analytica" className="sidebar-btn">
//                         <BarChart className="sidebar-icon" />
//                         <span>Analytica</span>
//                     </Link>

//                     <Link to="/payments" className="sidebar-btn">
//                         <CreditCard className="sidebar-icon" />
//                         <span>Payments</span>
//                     </Link>

//                     <Link to="/receipts" className="sidebar-btn">
//                         <FileText className="sidebar-icon" />
//                         <span>Receipts</span>
//                     </Link>

//                     <Link to="/notifications" className="sidebar-btn">
//                         <Bell className="sidebar-icon" />
//                         <span>Notifications</span>
//                     </Link>

//                     <Link to="/tracking" className="sidebar-btn">
//                         <DollarSign className="sidebar-icon" />
//                         <span>Track Savings</span>
//                     </Link>

//                     <Link to="/change-password" className="sidebar-btn">
//                         <Lock className="sidebar-icon" />
//                         <span>Change Password</span>
//                     </Link>

//                     <button className="sidebar-btn logout" onClick={onLogout}>
//                         <LogOut className="sidebar-icon" />
//                         <span>Logout</span>
//                     </button>
//                 </nav>

//                 {/* User Profile */}
//                 {userDetails && (
//                     <div className={`user-profile ${isMobile ? "mobile" : (isExpanded ? "expanded" : "collapsed")}`}>
//                         <div className="user-avatar">
//                             <User size={40} />
//                         </div>
//                         <div className="user-info">
//                             <h3 className="user-name">{userDetails.name ? userDetails.name : 'Name not Provided'}</h3>
//                             <p className="user-email">{userDetails.email ? userDetails.email : 'Email not Provided'}</p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Sidebar;