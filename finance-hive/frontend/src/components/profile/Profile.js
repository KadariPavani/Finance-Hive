import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableFields, setEditableFields] = useState({
    gender: '',
    alternativeMobileNumber: '',
    dateOfBirth: '',
    bio: ''
  });

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileDetails(response.data);
      setEditableFields({
        gender: response.data.gender || '',
        alternativeMobileNumber: response.data.alternativeMobileNumber || '',
        dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split('T')[0] : '',
        bio: response.data.bio || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const handleChange = (e) => {
    setEditableFields({
      ...editableFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/profile', editableFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully');
      fetchProfileDetails(); // Fetch updated profile details after saving
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

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
          {profileDetails.role === 'user' && (
            <>
              <div className="profile-item">
                <span className="profile-label">Amount Taken:</span>
                <span className="profile-value">{profileDetails.amountBorrowed}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Amount Paid:</span>
                <span className="profile-value">{profileDetails.amountPaid}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Balance:</span>
                <span className="profile-value">{profileDetails.balance}</span>
              </div>
            </>
          )}
          {profileDetails.role === 'organizer' && (
            <>
              <div className="profile-item">
                <span className="profile-label">Amount Given:</span>
                <span className="profile-value">{profileDetails.amountGiven}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Amount Collected:</span>
                <span className="profile-value">{profileDetails.amountCollected}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Profit:</span>
                <span className="profile-value">{profileDetails.profit}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Balance:</span>
                <span className="profile-value">{profileDetails.balance}</span>
              </div>
            </>
          )}
          <div className="profile-item">
            <span className="profile-label">Gender:</span>
            <input
              type="text"
              name="gender"
              value={editableFields.gender}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <div className="profile-item">
            <span className="profile-label">Alternative Mobile Number:</span>
            <input
              type="text"
              name="alternativeMobileNumber"
              value={editableFields.alternativeMobileNumber}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <div className="profile-item">
            <span className="profile-label">Date of Birth:</span>
            <input
              type="date"
              name="dateOfBirth"
              value={editableFields.dateOfBirth}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <div className="profile-item">
            <span className="profile-label">Bio:</span>
            <textarea
              name="bio"
              value={editableFields.bio}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <button onClick={handleSave} className="profile-save-btn">Save</button>
        </div>
      )}
    </div>
  );
};

export default Profile;