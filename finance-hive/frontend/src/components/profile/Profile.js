import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile details:', error);
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  if (loading) {
    return <div className="profile-loading">Loading profile details...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {profileDetails && (
        <div className="profile-details">
          <div className="profile-item">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{profileDetails.name}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{profileDetails.email}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Mobile Number:</span>
            <span className="profile-value">{profileDetails.mobileNumber}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Role:</span>
            <span className="profile-value">{profileDetails.role}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;