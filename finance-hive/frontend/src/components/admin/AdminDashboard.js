// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './AdminDasboard.css';

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

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       <div className="user-management">
//         <h2>User Management</h2>
//         <button onClick={() => navigate('/add-admin')}>Add Admin</button>
//         <button onClick={() => navigate('/add-organizer')}>Add Organizer</button>
//       </div>

//       <div className="users-list">
//         <h2>Admins and Organizers</h2>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         {users.map((user) => (
//           <div key={user.id} className="user-card">
//             <h3>{user.name}</h3>
//             <p>Role: {user.role}</p>
//             <p>Email: {user.email}</p>
//             <p>Mobile: {user.mobileNumber}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FiEdit, FiTrash2 } from 'react-icons/fi';
// import './AdminDasboard.css';

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

//   const handleEdit = (id) => {
//     // Navigate to edit page with the user's ID
//     navigate(`/edit-user/${id}`);
//   };

//   const handleDelete = (id) => {
//     // Implement delete logic here
//     alert(`Delete user with ID: ${id}`);
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       <div className="user-management">
//         <h2>User Management</h2>
//         <button onClick={() => navigate('/add-admin')}>Add Admin</button>
//         <button onClick={() => navigate('/add-organizer')}>Add Organizer</button>
//       </div>

//       <div className="users-grid">
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         {users.map((user) => (
//           <div key={user.id} className="user-card">
//             <h3>{user.name}</h3>
//             <p>Role: {user.role}</p>
//             <p>Email: {user.email}</p>
//             <p>Mobile: {user.mobileNumber}</p>
//             <div className="card-actions">
//               <FiEdit className="edit-icon" onClick={() => handleEdit(user.id)} />
//               <FiTrash2 className="delete-icon" onClick={() => handleDelete(user.id)} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import './AdminDasboard.css';
import LandingPage from '../home/LandingPage/LandingPage';
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
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
      
      // Remove the deleted user from the state
      setUsers(users.filter(user => user._id !== id));
      
      // Optional: Show a success message
      setError('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  // Get the current user's role from localStorage
  const userRole = localStorage.getItem('userRole');
  


  
  return (
    <div className="admin-dashboard">
      {/* Display LandingPage at the top */}
      <LandingPage />

      
      <div className="user-management">
        <button onClick={() => navigate('/add-admin')}>Add Admin</button>
        <button onClick={() => navigate('/add-organizer')}>Add Organizer</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="users-grid">
        {users.map((user) => (
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
// import axios from 'axios';
// import AddUser from './AddUser';
// import './AdminDasboard.css';
// const AdminDashboard = () => {
//   const [activeForm, setActiveForm] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:5000/api/users', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setUsers(response.data);
//     } catch (err) {
//       setError('Failed to fetch users');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>
      
//       <div className="admin-user-management">
//         <h2>User Management</h2>
//         <div className="admin-add-user-buttons">
//           <button onClick={() => setActiveForm('admin')}>
//             Add Admin
//           </button>
//           <button onClick={() => setActiveForm('organizer')}>
//             Add Organizer
//           </button>
//         </div>
        
//         {activeForm === 'admin' && <AddUser role="admin" onUserAdded={fetchUsers} />}
//         {activeForm === 'organizer' && <AddUser role="organizer" onUserAdded={fetchUsers} />}
//       </div>

//       <div className="admin-user-list">
//         <h2>Admins and Organizers</h2>
//         {error && <p className="admin-error">{error}</p>}
//         <div className="admin-user-cards">
//           {users.map(user => (
//             <div key={user._id} className="admin-user-card">
//               <h3>{user.name}</h3>
//               <p>Role: {user.role}</p>
//               <p>Email: {user.email}</p>
//               <p>Mobile: {user.mobileNumber}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;