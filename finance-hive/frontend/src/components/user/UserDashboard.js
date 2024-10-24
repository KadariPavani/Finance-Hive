// UserDashboard.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const { userId } = useParams(); // Extract the userId from the URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log("Fetching data for userId:", userId); // Debugging
  
      try {
        const response = await axios.get(`http://localhost:5000/user-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User data:", response.data); // Debugging
        setUserData(response.data);
      } catch (err) {
        console.error(err); // Log the actual error
        setError(err.response?.data?.msg || 'Error fetching user data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [userId]);
  
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
        color:'black',
      }}>
        {userData && (
          <div>
            <p>Hello! {userData.firstName}</p>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role}</p>

          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
