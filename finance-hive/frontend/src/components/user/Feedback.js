import React, { useState } from 'react';
import "./Feedback.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    feedback: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Thank you for your feedback!');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      feedback: '',
    });
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Feedback Form</h2>
        <p>We would love to hear your thoughts, suggestions, or concerns so we can improve.</p>
        <form onSubmit={handleSubmit}>
          <div className="name-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="feedback"
            placeholder="Your feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
          />
          <button type="submit">Share Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;