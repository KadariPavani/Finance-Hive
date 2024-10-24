import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminDashboard = () => {
  const { adminId } = useParams(); // Extract adminId from the URL
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:5000/admin-details/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminData(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching admin data');
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function if adminId is available
    if (adminId) {
      fetchAdminData();
    } else {
      setError('Admin ID is not provided.');
      setLoading(false);
    }
  }, [adminId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ position: 'relative', height: '100vh', padding: '20px' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        textAlign: 'right',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        color: 'black',
      }}>
        {adminData && (
          <div>
            <p>Hello! {adminData.firstName}</p>
            <p>Email: {adminData.email}</p>
            <p>Role: {adminData.role}</p> {/* Display admin role */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
