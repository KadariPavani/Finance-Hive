import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Approach.css';
import config from '../../config';
const Approach = () => {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchContactResponses();
  }, []);

  const fetchContactResponses = async () => {
    try {
      const token = localStorage.getItem('token');      
      const response = await axios.get(`${config.API_URL}/api/responses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponses(response.data);
    } catch (err) {
      setError('Failed to fetch contact responses');
      console.error(err);
    }
  };

  return (
    <div className="approach-page-container">
      <button 
        className="approach-back-button"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      
      <div className="approach-page-header">
        <h1 className="approach-page-title">Contact Form Responses</h1>
      </div>
      
      {error && <div className="approach-error-alert">{error}</div>}
      
      <div className="approach-responses-wrapper">
        <table className="approach-data-table">
          <thead className="approach-table-header">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Message</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response._id} className="approach-table-row">
                <td className="approach-table-cell approach-name-cell">{response.firstName}</td>
                <td className="approach-table-cell approach-name-cell">{response.lastName}</td>
                <td className="approach-table-cell approach-email-cell">{response.email}</td>
                <td className="approach-table-cell approach-mobile-cell">{response.mobileNumber}</td>
                <td className="approach-table-cell approach-message-cell">{response.message}</td>
                <td className="approach-table-cell approach-date-cell">
                  {new Date(response.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Approach;