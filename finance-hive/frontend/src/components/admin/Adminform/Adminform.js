import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Adminform.css';
export const AddAdminForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'Admin',
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
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/add-admin', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Admin added successfully!');
        navigate('/admin-dashboard/:adminId');
      } else {
        setError(response.data.message || 'Failed to add admin');
      }
    } catch (err) {
      console.error('Error adding admin:', err);
      setError(err.response?.data?.message || 'Error adding admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-add-admin-form">
      <div className="form-header-add-admin-form">
        <h2>Add New Admin</h2>
        <p>Fill out the form to add a new admin</p>
      </div>
      <div className="form-body-add-admin-form">
        {error && <div className="form-error-add-admin-form">{error}</div>}
        <form onSubmit={handleSubmit} className="form-add-admin-form">
          {['email', 'firstName', 'lastName', 'userId', 'mobileNumber', 'address', 'password'].map((field) => (
            <div className="form-group-add-admin-form" key={field}>
              <label className="form-label-add-admin-form">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              {field === 'address' ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="form-input-add-admin-form"
                />
              ) : (
                <input
                  type={field === 'password' ? 'password' : field === 'mobileNumber' ? 'tel' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="form-input-add-admin-form"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className={`form-button-add-admin-form ${loading ? 'disabled-add-admin-form' : ''}`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdminForm;
