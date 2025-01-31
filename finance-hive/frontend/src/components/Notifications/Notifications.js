//-----------------UNI LANG PAGE------------------

// import React, { useState, useEffect } from 'react';

// import { Bell, X, Mail, Key, UserPlus, Clock } from 'lucide-react';
// import axios from 'axios';
// import './Notifications.css';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/notifications/all", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       setNotifications(response.data.notifications);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError("Failed to load notifications");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const markAsRead = async (notificationId) => {
//     try {
//       const token = localStorage.getItem("token");
//       // await axios.patch(
//       //   `http://localhost:5000/api/notifications/${notificationId}/read`,
//       //   {},
//       //   {
//       //     headers: {
//       //       Authorization: `Bearer ${token}`,
//       //     },
//       //   }
//       // );
//       const unreadResponse = await axios.get("http://localhost:5000/api/notifications/unread", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       // Update local state
//       setNotifications(prevNotifications =>
//         prevNotifications.map(notification =>
//           notification._id === notificationId
//             ? { ...notification, read: true }
//             : notification
//         )
//       );
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'CREDENTIALS':
//         return <Key className="notification-icon credentials" />;
//       case 'REGISTRATION':
//         return <UserPlus className="notification-icon registration" />;
//       case 'REMINDER':
//         return <Clock className="notification-icon reminder" />;
//       default:
//         return <Mail className="notification-icon default" />;
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diff = (now - date) / 1000; // difference in seconds

//     if (diff < 60) {
//       return 'Just now';
//     } else if (diff < 3600) {
//       const minutes = Math.floor(diff / 60);
//       return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//     } else if (diff < 86400) {
//       const hours = Math.floor(diff / 3600);
//       return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     } else {
//       return date.toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="notifications-container">
//         <div className="notifications-header">
//           <h1>Notifications</h1>
//           <Bell className="header-icon" />
//         </div>
//         <div className="notifications-loading">
//           <div className="loading-spinner"></div>
//           <p>Loading notifications...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="notifications-container">
//         <div className="notifications-header">
//           <h1>Notifications</h1>
//           <Bell className="header-icon" />
//         </div>
//         <div className="notifications-error">
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="notifications-container">
//       <div className="notifications-header">
//         <h1>Notifications</h1>
//         <Bell className="header-icon" />
//       </div>

//       <div className="notifications-content">
//         {notifications.length === 0 ? (
//           <div className="no-notifications">
//             <p>No notifications yet</p>
//           </div>
//         ) : (
//           notifications.map((notification) => (
//             <div
//               key={notification._id}
//               className={`notification-item ${notification.read ? 'read' : 'unread'}`}
//             >
//               <div className="notification-icon-wrapper">
//                 {getNotificationIcon(notification.type)}
//               </div>
//               <div className="notification-details">
//                 <div className="notification-header">
//                   <h3>{notification.title}</h3>
//                   <span className="notification-time">
//                     {formatTimestamp(notification.createdAt)}
//                   </span>
//                 </div>
//                 <p className="notification-message">{notification.message}</p>
//                 {notification.additionalInfo && (
//                   <div className="notification-credentials">
//                     {notification.type === 'CREDENTIALS' && (
//                       <>
//                         <p><strong>Username:</strong> {notification.additionalInfo.username}</p>
//                         <p><strong>Password:</strong> {notification.additionalInfo.password}</p>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//               {!notification.read && (
//                 <button
//                   className="mark-read-button"
//                   onClick={() => markAsRead(notification._id)}
//                   title="Mark as read"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;

//-----------------MULTI LANG PAGE------------------

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, X, Mail, Key, UserPlus, Clock } from 'lucide-react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/notifications/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(t('notifications.error'));
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      // API call to mark as read
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      CREDENTIALS: <Key className="notification-icon credentials" />,
      REGISTRATION: <UserPlus className="notification-icon registration" />,
      REMINDER: <Clock className="notification-icon reminder" />
    };
    return icons[type] || <Mail className="notification-icon default" />;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return t('time.just_now');
    if (diff < 3600) return t('time.minutes_ago', { count: Math.floor(diff/60) });
    if (diff < 86400) return t('time.hours_ago', { count: Math.floor(diff/3600) });
    
    return date.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>{t('notifications.title')}</h1>
        <Bell className="header-icon" />
      </div>

      {loading ? (
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>{t('notifications.loading')}</p>
        </div>
      ) : error ? (
        <div className="notifications-error">
          <p>{error}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="no-notifications">
          <p>{t('notifications.none')}</p>
        </div>
      ) : (
        <div className="notifications-content">
          {notifications.map((notification) => (
            <div key={notification._id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              <div className="notification-icon-wrapper">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-details">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-time">
                    {formatTimestamp(notification.createdAt)}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                {notification.additionalInfo && (
                  <div className="notification-credentials">
                    {notification.type === 'CREDENTIALS' && (
                      <>
                        <p><strong>{t('notifications.username')}</strong> {notification.additionalInfo.username}</p>
                        <p><strong>{t('notifications.password')}</strong> {notification.additionalInfo.password}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              {!notification.read && (
                <button className="mark-read-button" onClick={() => markAsRead(notification._id)} title={t('notifications.mark_read')}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;