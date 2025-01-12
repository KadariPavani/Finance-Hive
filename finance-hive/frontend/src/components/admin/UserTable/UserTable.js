import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersTable = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsersData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersData(response.data);
      } catch (err) {
        console.error('Error fetching users:', err.response?.data?.msg || err.message);
        setError(err.response?.data?.msg || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filteredUsersData = usersData[selectedRole] || [];

  const getTitle = () => {
    switch (selectedRole) {
      case 'admins':
        return 'Admins';
      case 'organizers':
        return 'Organizers';
      case 'users':
      default:
        return 'Users';
    }
  };

  return (
    <section style={styles.section}>
      {/* Filter Controls */}
      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Filter by Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="users">Users</option>
          <option value="organizers">Organizers</option>
          <option value="admins">Admins</option>
        </select>
      </div>

      {/* Table Section */}
      <h3 style={styles.title}>All {getTitle()}</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Role', 'First Name', 'Last Name', 'Email', 'Mobile Number', 'Address'].map((header) => (
                <th key={header} style={styles.th}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsersData.map((user) => (
              <tr key={user._id} style={styles.tr}>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>{user.firstName}</td>
                <td style={styles.td}>{user.lastName}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.mobileNumber}</td>
                <td style={styles.td}>{user.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const styles = {
  section: {
    marginTop:'80px',
    padding: '24px',
    backgroundColor: 'rgb(247, 221, 255)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginRight: '15px',
    marginLeft:'15px',
    marginBottom:'20px'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
    textAlign:'center'
  },
  filterContainer: {
    margin: '20px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#9b59b6',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  filterLabel: {
    marginRight: '10px',
    fontWeight: '600',
    color: '#ffffff',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    color: '#2d3748',
    transition: 'all 0.2s ease',
    outline: 'none',
    '&:hover': {
      borderColor: '#9b59b6',
    },
    '&:focus': {
      borderColor: '#8e44ad',
      boxShadow: '0 0 0 2px rgba(142, 68, 173, 0.2)',
    },
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: '#ffffff',
  },
  th: {
    padding: '16px 24px',
    backgroundColor: '#9b59b6',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'left',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    transition: 'background-color 0.2s ease',
    '&:first-child': {
      borderTopLeftRadius: '8px',
    },
    '&:last-child': {
      borderTopRightRadius: '8px',
    },
  },
  tr: {
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  td: {
    padding: '16px 24px',
    color: '#4a5568',
    fontSize: '14px',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
};

export default UsersTable;