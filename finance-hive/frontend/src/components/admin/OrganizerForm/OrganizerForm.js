import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrganizerForm.css'

export const AddOrganizerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'Organizer',
    email: '',
    firstName: '',
    lastName: '',
    userId: '',
    mobileNumber: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token'); // Ensure the token is available in localStorage
      if (!token) {
        setError('Authorization token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Update the API endpoint if necessary
      const response = await axios.post('http://localhost:5000/api/organizer/add-organizer', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Organizer added successfully!');
        navigate('/admin-dashboard/:adminId');
      } else {
        setError(response.data.message || 'Failed to add organizer');
      }
    } catch (err) {
      console.error('Error adding organizer:', err);
      // Enhance error messaging for more clarity
      setError(err.response?.data?.message || 'Error adding organizer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-add-organizer-form">
      <div className="form-header-add-organizer-form">
        <h2>Add Organizer</h2>
        <p>Fill out the form below to add a new organizer.</p>
      </div>
      <div className="form-body-add-organizer-form">
        {error && <div className="form-error-add-organizer-form">{error}</div>}
        <form className="form-add-organizer-form" onSubmit={handleSubmit}>
          <div className="form-group-add-organizer-form">
            <label className="form-label-add-organizer-form">Email</label>
            <input
              className="form-input-add-organizer-form"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-add-organizer-form">
            <label className="form-label-add-organizer-form">First Name</label>
            <input
              className="form-input-add-organizer-form"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-add-organizer-form">
            <label className="form-label-add-organizer-form">Last Name</label>
            <input
              className="form-input-add-organizer-form"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-add-organizer-form">
            <label className="form-label-add-organizer-form">User ID</label>
            <input
              className="form-input-add-organizer-form"
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-add-organizer-form">
            <label className="form-label-add-organizer-form">Mobile Number</label>
            <input
              className="form-input-add-organizer-form"
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-add-organizer-form">
            <label className="form-label-add-organizer-form">Address</label>
            <input
              className="form-input-add-organizer-form"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-add-organizer-form">
            <label className="form-label-add-organizer-form">Password</label>
            <input
              className="form-input-add-organizer-form"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className={`form-button-add-organizer-form ${loading ? 'disabled-add-organizer-form' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Organizer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizerForm;
