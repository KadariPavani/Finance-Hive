import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../CustomButton';
import './AddUser.css';

const AddUser = ({ role, onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/add-user', 
        { name, email, mobileNumber, password, role },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      setError('');
      
      // Reset form
      setName('');
      setEmail('');
      setMobileNumber('');
      setPassword('');

      // Callback to refresh user list
      if (onUserAdded) {
        onUserAdded();
      }
      navigate('/admin');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
      setMessage('');
    }
  };

  return (
    <div className="add-user-container">
      <h2>Add {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      {message && <p style={{color: 'green'}}>{message}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="text" 
          placeholder="Mobile Number" 
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <CustomButton type="submit">Add {role.charAt(0).toUpperCase() + role.slice(1)}</CustomButton>
      </form>
    </div>
  );
};

export default AddUser;