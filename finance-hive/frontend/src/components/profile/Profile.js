import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { FaUser, FaEnvelope, FaPhone, FaTransgender, FaBirthdayCake, FaPen, FaCamera, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editableFields, setEditableFields] = useState({
    gender: '',
    alternativeMobileNumber: '',
    dateOfBirth: '',
    bio: ''
  });

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://finance-hive.onrender.com/api/profile', {
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
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.put('https://finance-hive.onrender.com/api/profile', editableFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProfileDetails();
      setShowModal(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="back-button" onClick={handleBack}>
            <FaArrowLeft /> Back
          </div>
          <div className="profile-avatar-wrapper">
            {/* <div className="profile-avatar">
              <img src="https://via.placeholder.com/150" alt="Profile" className="avatar-image" />
              <div className="avatar-overlay">
                <FaCamera className="camera-icon" />
              </div>
            </div> */}
            <h2>{profileDetails?.name}</h2>
            <p className="role-badge">{profileDetails?.role}</p>
          </div>
          
          <div className="quick-stats">
            {/* <h3 className="stats-header">Statistics</h3> */}
            {profileDetails?.role === 'user' && (
              <>
                <div className="stat-item">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <span className="stat-label">Amount Taken :: </span>
                    <span className="stat-value">{profileDetails.amountBorrowed}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <span className="stat-label">Amount Paid ::</span>
                    <span className="stat-value">{profileDetails.amountPaid}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⚖️</div>
                  <div className="stat-info">
                    <span className="stat-label">Balance :: </span>
                    <span className="stat-value">{profileDetails.balance}</span>
                  </div>
                </div>
              </>
            )}
            {profileDetails?.role === 'organizer' && (
              <>
                <div className="stat-item">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <span className="stat-label">Amount Given :: </span>
                    <span className="stat-value">{profileDetails.amountGiven}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <span className="stat-label">Amount Collected :: </span>
                    <span className="stat-value">{profileDetails.amountCollected}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">💸</div>
                  <div className="stat-info">
                    <span className="stat-label">Profit :: </span>
                    <span className="stat-value">{profileDetails.profit}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-header">
            <h1>Profile Information</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="global-spinner"></div>
            </div>
          ) : (
            <div className="profile-content">
              <div className="profile-section">
                <h3><FaUser /> Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label><FaEnvelope /> Email</label>
                    <span className="info-value">{profileDetails.email}</span>
                  </div>
                  <div className="form-group">
                    <label><FaPhone /> Mobile Number</label>
                    <span className="info-value">{profileDetails.mobileNumber}</span>
                  </div>
                  <div className="form-group">
                    <label><FaPhone /> Alternative Mobile</label>
                    <input
                      type="text"
                      name="alternativeMobileNumber"
                      value={editableFields.alternativeMobileNumber}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </div>
                  <div className="form-group">
                    <label><FaTransgender /> Gender</label>
                    <select
                      name="gender"
                      value={editableFields.gender}
                      onChange={handleChange}
                      className="profile-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label><FaBirthdayCake /> Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editableFields.dateOfBirth}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>About Me</h3>
                <div className="form-group">
                  <textarea
                    name="bio"
                    value={editableFields.bio}
                    onChange={handleChange}
                    className="profile-input bio-input"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <button 
                onClick={handleSave} 
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? <div className="global-spinner-small"></div> : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Success!</h2>
            <p>Profile updated successfully</p>
            <button 
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;