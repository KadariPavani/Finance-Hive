import React, { useState, useRef } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const SubmitNotification = ({ onNotificationSubmit }) => {
  const form = useRef();
  const [formData, setFormData] = useState({
    email: '',
    transactionId: '',
    amount: '',
    organization: 'khub',
    verification: 'Not Done'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/notifications/submit-notification', formData);
      if (response.data.success) {
        alert('Notification submitted successfully!');
        setFormData({
          email: '',
          transactionId: '',
          amount: '',
          organization: 'khub',
          verification: 'Not Done'
        });
        onNotificationSubmit();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting notification');
      alert(err.response?.data?.message || 'Error submitting notification');
    }

    setLoading(false);
  };

  const sendEmail = () => {
    const emailDetails = {
      to_name: formData.email,
      from_name: 'Notification System',
      message: `Notification Details:\n\nEmail: ${formData.email}\nTransaction ID: ${formData.transactionId}\nAmount: ${formData.amount}\nOrganization: ${formData.organization}\nVerification Status: ${formData.verification}`
    };

    emailjs
      .send('service_4247mkb', 'template_h56ugv5', emailDetails, '1iBIWAFDsrFNstP3C')
      .then(
        () => {
          console.log('Email sent successfully!');
        },
        (error) => {
          console.error('Failed to send email...', error.text);
        }
      );
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8" id="submit-notification">
      <h2 className="text-2xl font-semibold mb-6">Submit Notification</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); sendEmail(); }}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionId">
            Transaction ID
          </label>
          <input
            type="text"
            id="transactionId"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="org-1">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organization">
            Organization
          </label>
          <select
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="khub">KHUB</option>
            <option value="gcc">GCC</option>
            <option value="tm">Toast Masters</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verification">
            Verification Status
          </label>
          <select
            id="verification"
            name="verification"
            value={formData.verification}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="Not Done">Payment verification Not Done</option>
            <option value="Done">Payment verification Done</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Submitting...' : 'Submit Notification'}
        </button>
      </form>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default SubmitNotification;