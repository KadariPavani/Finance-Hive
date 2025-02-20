import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Approach.css';

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
      const response = await axios.get('http://localhost:5000/api/responses', {
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
    <div className="approach-page">
      <h1>Contact Form Responses</h1>
      {error && <div className="error-message">{error}</div>}
      <table className="responses-table">
  <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Mobile Number</th> {/* Add this column */}
      <th>Message</th>
      <th>Submitted At</th>
    </tr>
  </thead>
  <tbody>
    {responses.map((response) => (
      <tr key={response._id}>
        <td>{response.firstName}</td>
        <td>{response.lastName}</td>
        <td>{response.email}</td>
        <td>{response.mobileNumber}</td> {/* Add this cell */}
        <td>{response.message}</td>
        <td>{new Date(response.createdAt).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default Approach;