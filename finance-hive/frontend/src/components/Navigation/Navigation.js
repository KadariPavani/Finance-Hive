// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Bell, User, LogOut } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Navigation.css';
// import LanguageSwitcher from '../LanguageSwitcher';
// const Navigation = ({ userDetails, onLogout }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [unreadCount, setUnreadCount] = useState(0);

//   const fetchUnreadCount = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/notifications/unread-count", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUnreadCount(response.data.count);
//     } catch (error) {
//       console.error("Error fetching unread count:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUnreadCount();
//     const interval = setInterval(fetchUnreadCount, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <nav className="dashboard-nav">
//       <div className="nav-logo">
//         <Link to="/" className="nav__logo">
//           <div className="logo-container">
//             <img src="../Images/FH_LogoFinal.png" alt="FMS Logo" className="logo-img" />
//           </div>
//           <h3 className="logo-text">{t('common.finance_hive')}</h3>
//         </Link>      
//       </div>

//       <div className="nav-actions">
//         <Link to="/notifications" className="nav-icon-btn" title={t('notifications.title')}>
//           <div className="notification-icon-wrapper">
//             <Bell className="nav-icon" />
//             {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
//           </div>
//         </Link>
//         <button className="nav-icon-btn" title={t('common.profile')} onClick={() => navigate('/profile')}>
//           <User className="nav-icon" />
//         </button>
//         <button className="nav-icon-btn logout-btn" onClick={onLogout} title={t('common.logout')}>
//           <LogOut className="nav-icon" />
//         </button>
//         <LanguageSwitcher />

//       </div>


//     </nav>
//   );
// };

// export default Navigation;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, User, LogOut, PiggyBank, LineChart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';
import LanguageSwitcher from '../LanguageSwitcher';

const Navigation = ({ userDetails, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);


  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
// Navigation.js - This path is now correct
const response = await axios.get("http://localhost:5000/api/notifications/unread-count", {
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

      <div className="nav-actions">
        <Link to="/tracking" className="nav-icon-btn" title={t('common.tracking')}>
          <LineChart className="nav-icon" />
        </Link>
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
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default Navigation;

// import React, { useState, useEffect } from 'react';
// import { Bell, User, LogOut } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Navigation.css';

// const Navigation = ({ userDetails, onLogout }) => {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const navigate = useNavigate();

//   const fetchUnreadCount = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/notifications/unread-count", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUnreadCount(response.data.count);
//     } catch (error) {
//       console.error("Error fetching unread count:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUnreadCount();
//     // Set up polling for new notifications
//     const interval = setInterval(fetchUnreadCount, 60000); // Check every minute
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <nav className="dashboard-nav">
//       {/* <div className="nav-logo">
//             <Link to="/" className="nav__logo">
//               <img src="../Images/FH_LogoFinal.png" alt="FMS Logo" />
//               <h3>FINANCE HIVE</h3>
//             </Link>      
//             </div> */}
//       <div className="nav-logo">
//   <Link to="/" className="nav__logo">
//     <div className="logo-container">
//       <img src="../Images/FH_LogoFinal.png" alt="FMS Logo" className="logo-img" />
//     </div>
//     <h3 className="logo-text">FINANCE HIVE</h3>
//     </Link>      
// </div>

      
//       <div className="nav-actions">
//         <Link to="/notifications" className="nav-icon-btn" title="Notifications">
//           <div className="notification-icon-wrapper">
//             <Bell className="nav-icon" />
//             {unreadCount > 0 && (
//               <span className="notification-badge">{unreadCount}</span>
//             )}
//           </div>
//         </Link>
//         <button
//           className="nav-icon-btn"
//           title="Personal Details"
//           onClick={() => navigate('/profile')}
//         >
//           <User className="nav-icon" />
//         </button>
//         <button 
//           className="nav-icon-btn logout-btn" 
//           onClick={onLogout}
//           title="Logout"
//         >
//           <LogOut className="nav-icon" />
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;

// // import React from 'react';
// // import { LogOut, User, Bell } from 'lucide-react';
// // import './Navigation.css';

// // const Navigation = ({ userDetails, onLogout }) => {
// //   return (
// //     <nav className="dashboard-nav">
// //       <div className="nav-logo">
// //         <img src="/logo.png" alt="Logo" className="company-logo" />
// //       </div>
      
// //       <div className="nav-actions">
// //         <button className="nav-icon-btn" title="Profile Updates">
// //           <Bell className="nav-icon" />
// //         </button>
// //         <button className="nav-icon-btn" title="Personal Details">
// //           <User className="nav-icon" />
// //         </button>
// //         <button 
// //           className="nav-icon-btn logout-btn" 
// //           onClick={onLogout}
// //           title="Logout"
// //         >
// //           <LogOut className="nav-icon" />
// //         </button>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navigation;