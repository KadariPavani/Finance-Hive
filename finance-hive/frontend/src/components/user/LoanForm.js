import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoanForm.css';
import PaymentSchedule from './PaymentSchedule';

const LoanForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    loanAmount: '',
    loanPurpose: '',
    loanTenureValue: '',
    loanTenureType: 'months',
    interestRate: '1',
    repaymentFrequency: 'monthly',
    remarks: '',
  });

  const [loanId, setLoanId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [frequencyDisabled, setFrequencyDisabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [emailValid, setEmailValid] = useState(null); // Null for initial state
  const [isEligible, setIsEligible] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData((prevData) => ({
          ...prevData,
          email: response.data.email,
        }));
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (formData.loanTenureType === 'years') {
      setFrequencyDisabled(false);
    } else {
      setFrequencyDisabled(true);
      setFormData((prevData) => ({
        ...prevData,
        repaymentFrequency: 'monthly',
      }));
    }
  }, [formData.loanTenureType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = async () => {
    try {
      const trimmedEmail = formData.email.trim();
      const response = await axios.get(
        `http://localhost:5000/api/users/validate-email/${trimmedEmail}`
      );
      console.log(response.data);

      if (response.data.exists) {
        setEmailValid(true);
        setValidationMessage('Email is valid.');
      } else {
        setEmailValid(false);
        setValidationMessage('Email not found. Please register first.');
      }
    } catch (error) {
      console.error('Error validating email:', error);
      setEmailValid(false);
      setValidationMessage('Error validating email. Please try again later.');
    }
  };

  const checkEligibility = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${formData.email}/eligibility`
      );
      setIsEligible(response.data.isEligible);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) {
      alert('Please validate your email first.');
      return;
    }

    if (!isEligible) {
      alert('You are not eligible to apply for a loan. Please clear pending payments first.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const finalFormData = {
        ...formData,
        userId,
        loanTenure: `${formData.loanTenureValue} ${formData.loanTenureType}`,
      };

      const response = await axios.post('http://localhost:5000/api/loans', finalFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert('Loan request sent successfully!');
      setLoanId(response.data.loanId);
      setFormSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Error sending loan request.');
    }
  };

  useEffect(() => {
    if (formData.email) {
      checkEligibility();
    }
  }, [formData.email]);

  return (
<div className={`loan-form-container ${isMobile ? 'disabled' : ''}`}>
  {!formSubmitted ? (
    <>
      <h2 className="loan-form-title">Loan Taking</h2>
      <form className="loan-form" onSubmit={handleSubmit}>
        <div className="email-validation-section">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="loan-form-input"
            required
          />
          <button type="button" onClick={validateEmail} className="validate-button">
            Validate
          </button>
        </div>
        <p className="validation-message">{validationMessage}</p>

        <input
          type="text"
          name="loanAmount"
          placeholder="Loan Amount"
          value={formData.loanAmount}
          onChange={handleChange}
          className="loan-form-input"
          disabled={!emailValid}
          required
        />

        <input
          type="text"
          name="loanPurpose"
          placeholder="Loan Purpose"
          value={formData.loanPurpose}
          onChange={handleChange}
          className="loan-form-input"
          disabled={!emailValid}
          required
        />

        <div className="loan-form-tenure-section">
          <input
            type="number"
            name="loanTenureValue"
            placeholder="Loan Tenure"
            value={formData.loanTenureValue}
            onChange={handleChange}
            className="loan-form-number-input"
            disabled={!emailValid}
            required
          />
          <select
            name="loanTenureType"
            value={formData.loanTenureType}
            onChange={handleChange}
            className="loan-form-select"
            disabled={!emailValid}
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>

        <div className="loan-form-repayment-section">
          <label htmlFor="repaymentFrequency" className="loan-form-repayment-label">
            Repayment Frequency:
          </label>
          <select
            id="repaymentFrequency"
            name="repaymentFrequency"
            value={formData.repaymentFrequency}
            onChange={handleChange}
            className="loan-form-repayment-dropdown"
            required
            disabled={frequencyDisabled}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>

        <label htmlFor="organization" className="loan-form-label">
        </label>
        <select
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          className="loan-form-select"
          required
          disabled={!emailValid}
        >
          <option value="">Select an organization</option>
          <option value="K-HUB">K-HUB</option>
          <option value="GCC">GCC</option>
          <option value="TOASTMASTERS">TOASTMASTERS</option>
          <option value="ROBOTICS">ROBOTICS</option>
        </select>

        <textarea
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="loan-form-textarea"
          disabled={!emailValid}
        ></textarea>
        <button
          type="submit"
          className="loan-form-button"
          disabled={!emailValid || formSubmitted}
        >
          Submit Loan Request
        </button>
      </form>
    </>
  ) : (
    <div>
      {loanId && <PaymentSchedule loanId={loanId} />}
    </div>
  )}
</div>

  );
};

export default LoanForm;
