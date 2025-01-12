import React, { useState } from 'react';
import "./Feedback.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    feedback: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.firstName && formData.lastName && formData.email && formData.feedback) {
      setIsSubmitting(true);
      setFormMessage('');
      try {
        const response = await fetch('http://localhost:5000/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          setFormMessage('Thank you for your feedback!');
          setFormData({ firstName: '', lastName: '', email: '', feedback: '' });
        } else {
          setFormMessage(result.msg || 'Error submitting feedback. Please try again.');
        }
      } catch (error) {
        setFormMessage('Server error. Please try again later.');
        console.error('Error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormMessage('Please fill out all fields before submitting.');
    }

    setTimeout(() => setFormMessage(''), 5000);
  };

  return (
    <div className="Feedback-body">
  <div className="Feedback-form-container">
    <h2>Feedback Form</h2>
    <p>We would love to hear your thoughts, suggestions, or concerns so we can improve.</p>
    <form onSubmit={handleSubmit}>
      <div className="Feedback-name-fields">
        <input
          type="text"
          className="Feedback-text-input"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="Feedback-text-input"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <input
        type="email"
        className="Feedback-text-input"
        name="email"
        placeholder="Your email address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        className="Feedback-text-input"
        name="feedback"
        placeholder="Your feedback"
        value={formData.feedback}
        onChange={handleChange}
        required
      />
      <button type="submit" className="Feedback-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Share Feedback'}
      </button>
    </form>
    {formMessage && <p className="Feedback-form-message">{formMessage}</p>}
  </div>
</div>
  );
};

export default FeedbackForm;