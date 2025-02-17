import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import LandingPage from '../home/LandingPage/LandingPage';
import './AdminDasboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter(user => user._id !== id));
      setError('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeFilter === 'all') return true;
    return user.role.toLowerCase() === activeFilter;
  });

  return (
    <div className="admin-dashboard">
      <LandingPage />

      <div className="dashboard-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Users
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveFilter('admin')}
          >
            Admins
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'organizer' ? 'active' : ''}`}
            onClick={() => setActiveFilter('organizer')}
          >
            Organizers
          </button>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/add-admin')}>Add Admin</button>
          <button onClick={() => navigate('/add-organizer')}>Add Organizer</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user._id} className="user-card">
            <h3>{user.name}</h3>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>
            <p>Mobile: {user.mobileNumber}</p>
            <div className="card-actions">
              <FiTrash2 
                className="delete-icon" 
                onClick={() => handleDelete(user._id)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FiTrash2 } from 'react-icons/fi';
// import './AdminDasboard.css';
// import LandingPage from '../home/LandingPage/LandingPage';
// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:5000/api/users', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(response.data);
//     } catch (err) {
//       setError('Failed to fetch users');
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/users/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       // Remove the deleted user from the state
//       setUsers(users.filter(user => user._id !== id));
      
//       // Optional: Show a success message
//       setError('User deleted successfully');
//     } catch (err) {
//       setError('Failed to delete user');
//       console.error(err);
//     }
//   };

//   // Get the current user's role from localStorage
//   const userRole = localStorage.getItem('userRole');
  


  
//   return (
//     <div className="admin-dashboard">
//       {/* Display LandingPage at the top */}
//       <LandingPage />

      
//       <div className="user-management">
//         <button onClick={() => navigate('/add-admin')}>Add Admin</button>
//         <button onClick={() => navigate('/add-organizer')}>Add Organizer</button>
//       </div>

//       {error && <div className="error-message">{error}</div>}
      
//       <div className="users-grid">
//         {users.map((user) => (
//           <div key={user._id} className="user-card">
//             <h3>{user.name}</h3>
//             <p>Role: {user.role}</p>
//             <p>Email: {user.email}</p>
//             <p>Mobile: {user.mobileNumber}</p>
//             <div className="card-actions">
//               <FiTrash2 
//                 className="delete-icon" 
//                 onClick={() => handleDelete(user._id)} 
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
