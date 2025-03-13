import "./GetInTouch.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactForm = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "", // Add this line
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you! Your message has been sent.");

        // Reset form fields after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "", // Reset this field
          message: "",
        });

        // Navigate to the home page and scroll to the top
        navigate("/");
        window.scrollTo(0, 0);
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Unable to send the message. Please try later.");
    }
  };

  return (
    <div className="contact-container">
      {/* Contact Form Section */}
      <div className="contact-form-container">
        <h1>Contact Us</h1>
        <p className="contact-description">
          Got questions or need assistance? Fill out the form, and our team will
          get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="name-group">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="First name*"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email*"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number*"
              required
              value={formData.mobileNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="What can we help you with?"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className="contact-map-container">
        <iframe
          title="Location Map"
          className="contact-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.015607199199!2d144.9537363153542!3d-37.81632644202171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577e489ab0f0b9b!2sMelbourne!5e0!3m2!1sen!2sau!4v1672114560924!5m2!1sen!2sau"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactForm;