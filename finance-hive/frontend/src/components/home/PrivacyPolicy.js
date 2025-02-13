import React from 'react';
import './PrivacyPolicy.css';
import logo from '../assets/FH_logoFinal.png'; // Ensure the path to your logo is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaTimes } from 'react-icons/fa'; // Import the cross icon from react-icons

const PrivacyPolicy = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleClose = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="privacy-policy-container">
      {/* Cross Icon Button at Top Right */}
      <button className="privacy-policy-close-button" onClick={handleClose}>
        <FaTimes />
      </button>

      <div className="privacy-policy-header">
        <img src={logo} alt="Finance Hive Logo" className="privacy-policy-logo" />
        <h1>Privacy Policy</h1>
      </div>
      <div className="privacy-policy-content">
        <p>Welcome to Finance Hive's Privacy Policy page. Here, we outline how we collect, use, and protect your personal information when you use our services.</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information that you provide directly to us, such as your name, mobile number, email address, and password when you register or log in to our platform.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, maintain, and improve our services.</li>
          <li>Authenticate your identity and secure your account.</li>
          <li>Communicate with you about updates, offers, and support.</li>
        </ul>
        
        <h2>3. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Your data is stored securely and accessed only by authorized personnel.</p>
        
        <h2>4. Sharing Your Information</h2>
        <p>We do not share your personal information with third parties except as required by law or to provide our services (e.g., payment processing).</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time. You can also opt out of receiving promotional communications from us.</p>
        
        <h2>6. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.</p>
        
        <h2>7. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@financehive.com">support@financehive.com</a>.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;