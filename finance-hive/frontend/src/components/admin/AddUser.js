import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../CustomButton';
import Modal from '../Modal/Modal';
import './AddUser.css';

const AddUser = ({ role, onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

      setModalMessage(response.data.message);
      setIsError(false);
      setShowModal(true);

      setName('');
      setEmail('');
      setMobileNumber('');
      setPassword('');

      if (onUserAdded) {
        onUserAdded();
      }

    } catch (err) {
      setModalMessage(err.response?.data?.message || 'Failed to add user');
      setIsError(true);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!isError) {
      navigate('/admin');
    }
  };

  return (
    <div className="add-useroa-container">
      <h2>Add {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="add-useroa-input"
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="add-useroa-input"
          required 
        />
        <input 
          type="text" 
          placeholder="Mobile Number" 
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="add-useroa-input"
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="add-useroa-input"
          required 
        />
        <CustomButton type="submit" className="add-useroa-button">
          Add {role.charAt(0).toUpperCase() + role.slice(1)}
        </CustomButton>
      </form>
  
      <Modal 
        show={showModal} 
        message={modalMessage} 
        onClose={handleCloseModal} 
        isError={isError} 
      />
    </div>
  );
};

export default AddUser;