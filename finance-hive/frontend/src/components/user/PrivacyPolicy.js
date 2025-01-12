import React, { useEffect } from "react";
import "./PrivacyPolicy.css"; // Import the CSS for styling
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  useEffect(() => {
    // Add the 'unique-body' class to the body element when the component mounts
    document.body.classList.add("unique-body");

    // Clean up: Remove the 'unique-body' class when the component unmounts
    return () => {
      document.body.classList.remove("unique-body");
    };
  }, []);

  return (
    <div className="data-protection-container">
      {/* Header Section */}
      <div className="header-text-section">
        <h1 className="header-title">Data Protection Policy</h1>
        <p className="header-description">
          At Finance_Hive, we prioritize the security and confidentiality of
          your financial data. Using industry-standard encryption and compliance
          practices, we ensure your information is protected. We collect and use
          your data responsibly to provide personalized services. You have full
          control over your data, with options to access, modify, or delete it.
        </p>
      </div>

      {/* Image Section */}
      <div className="image-display-section">
        <img
          src="https://media.licdn.com/dms/image/D4D12AQHRzuaBShnJ9g/article-cover_image-shrink_720_1280/0/1685334139216?e=2147483647&v=beta&t=CVOZK2uGe3cQJ9AIpAH_XxTupp2SPjslyGbsiQ4d4fc"
          alt="Data Protection Illustration"
          className="data-protection-image"
        />
      </div>

      {/* Additional Content Section */}
      <div className="privacy-content-wrapper">
        <div className="privacy-policy-block">
          <header className="privacy-page-header">
            <h1 className="privacy-page-title">Privacy Policy 🔐</h1>
          </header>
          <section className="policy-details-section">
            <p className="policy-content">
              FMS (“we,” “us,” or “our”) is committed to protecting your
              financial information. This Privacy Policy explains how we collect,
              use, and protect your personal data. We collect personal information,
              such as name, email, phone number, address, and financial data
              (income, expenses, transactions), to provide our services.
            </p>
            <p className="policy-content">
              We use your information to manage your account, process
              transactions, provide financial analysis, and comply with legal
              requirements. We may also use your information to communicate with
              you about our services, offers, and promotions. We share information
              with financial institutions, service providers, and law enforcement
              agencies (if required). We ensure that these third parties adhere to
              robust data protection standards.
            </p>
            <p className="policy-content">
              We implement industry-standard security measures, including SSL
              encryption, to process and secure data, to protect your data. You
              have the right to access, correct, or delete your information and
              opt-out of communications.
            </p>
            <p className="policy-disclaimer">We reserve the right to update this policy.</p>
          </section>
          <section className="terms-conditions-section">
            <h2 className="terms-header">Terms and Conditions</h2>
            <p className="terms-description">
              Welcome to Finance Hive . These
              Terms and Conditions govern your use of our services. By using our
              services, you agree to provide accurate financial information, comply
              with laws, and respect intellectual property. You must not use our
              service for unlawful purposes or interfere with others’ use or upload
              harmful content.
            </p>
            <p className="terms-description">
              Our services are not guaranteed or licensed. We disclaim warranties
              and limitations. Our liability is limited. You agree to indemnify us.
              We operate under laws applicable in your country. These terms are
              governed by [State/Country] laws. We reserve the right to update these
              terms.
            </p>
          </section>
          <section className="disclaimer-section">
            <h2 className="disclaimer-header">Disclaimer</h2>
            <p className="disclaimer-text">
              Our Finance Management System is provided “as-is” without warranties.
            </p>
          </section>
          <section className="user-agreement-section">
            <h2 className="user-agreement-header">User Agreement</h2>
            <p className="user-agreement-text">
              By using our Finance Management System, you acknowledge reading and
              understanding these terms, agree to abide by these terms, and consent
              to electronic communications.
            </p>
          </section>
          <footer className="footer-section">
            <p className="footer-text">
              Please consult a legal expert to ensure compliance with relevant laws
              and regulations.
            </p>
            <br />
            <Link to="/user-dashboard/:userId" className="cta-button">
              I READ ALL THE INSTRUCTIONS
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
