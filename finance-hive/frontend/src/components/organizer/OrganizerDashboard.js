import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrganizerDashboard = () => {
  const { organizerId } = useParams(); // Extract organizerId from the URL
  const [organizerData, setOrganizerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganizerData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:5000/organizer-details/${organizerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrganizerData(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching organizer data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerData();
  }, [organizerId]);

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
        {organizerData && (
          <div>
            <p>Hello! {organizerData.firstName}</p>
            <p>Email: {organizerData.email}</p>
            <p>Role: {organizerData.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
