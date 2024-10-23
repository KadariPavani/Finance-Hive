import React, { useState } from 'react';
import './GetInTouch.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    location: '',
    phoneNumber: '',
    message: '',
  });

  const organizations = [
    'KIET GROUP',
    'K-HUB',
    'IIIT-H',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="contact-main-div">
      <div className="contact-left-div">
          <form onSubmit={handleSubmit}>
          <div className="contact-input-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="contact-input"
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="contact-input"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="contact-input"
          />
          <select
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="contact-select"
          >
            <option value="">Select Organization</option>
            {organizations.map((org, index) => (
              <option key={index} value={org}>
                {org}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="contact-input"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="contact-input"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="contact-textarea"
          ></textarea>
          <button type="submit" className="contact-button">Send</button>
        </form>
      </div>
      <div className="contact-right-div">
        <img
          src="https://img.freepik.com/free-photo/business-woman-working_1303-5972.jpg?ga=GA1.1.2051335758.1728988912&semt=ais_hybrid"
          alt="Contact Us"
        />
      </div>
    </div>
  );
};

export default ContactForm;
