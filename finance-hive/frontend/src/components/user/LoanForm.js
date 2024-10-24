import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoanForm.css';
import PaymentSchedule from './PaymentSchedule'; // Import the PaymentSchedule component

const LoanForm = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanPurpose: '',
    loanTenureValue: '', // Numeric value for tenure
    loanTenureType: 'months', // Default type for tenure (months/years)
    interestRate: '1', // Fixed interest rate
    repaymentFrequency: 'monthly', // Default repayment frequency
    remarks: ''
  });

  const [loanId, setLoanId] = useState(null); // State to store loan ID
  const [frequencyDisabled, setFrequencyDisabled] = useState(true); // Disable repayment frequency by default for "months"

  useEffect(() => {
    // Enable repayment frequency dropdown only if loanTenureType is 'years'
    if (formData.loanTenureType === 'years') {
      setFrequencyDisabled(false); // Enable repayment frequency
    } else {
      setFrequencyDisabled(true); // Disable repayment frequency
      setFormData((prevData) => ({
        ...prevData,
        repaymentFrequency: 'monthly' // Reset to monthly when disabled
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine loanTenureValue and loanTenureType into a single field for backend
      const finalFormData = {
        ...formData,
        loanTenure: `${formData.loanTenureValue} ${formData.loanTenureType}`,
      };

      const response = await axios.post('http://localhost:5000/api/loans', finalFormData);
      alert('Loan request sent successfully!');
      setLoanId(response.data.loanId); // Store the loan ID from the response

      // Reset formData to clear the form after submission
      setFormData({
        loanAmount: '',
        loanPurpose: '',
        loanTenureValue: '',
        loanTenureType: 'months',
        interestRate: '1',
        repaymentFrequency: 'monthly',
        remarks: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error sending loan request.');
    }
  };

  return (
    <div className="loan-form-container">
      <h2 className="loan-form-title">Loan Taking</h2>
      <form className="loan-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="loanAmount" 
          placeholder="Loan Amount" 
          value={formData.loanAmount} 
          onChange={handleChange} 
          className="loan-form-input"
          required 
        />
        <input 
          type="text" 
          name="loanPurpose" 
          placeholder="Loan Purpose" 
          value={formData.loanPurpose} 
          onChange={handleChange} 
          className="loan-form-input"
          required 
        />
        
        {/* Loan Tenure Section with number and dropdown */}
        <div className="loan-form-tenure-section">
          <input 
            type="number" 
            name="loanTenureValue" 
            placeholder="Loan Tenure" 
            value={formData.loanTenureValue} 
            onChange={handleChange} 
            className="loan-form-number-input"
            required 
          />
          <select 
            name="loanTenureType" 
            value={formData.loanTenureType} 
            onChange={handleChange}
            className="loan-form-select"
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        
        {/* Interest Rate (Non-editable) */}
        <input 
          type="text" 
          name="interestRate" 
          value="1" 
          readOnly 
          className="loan-form-non-editable loan-form-input" 
        />

        {/* Repayment Frequency Section with text label and dropdown */}
        <div className="loan-form-repayment-section">
          <label htmlFor="repaymentFrequency" className="loan-form-repayment-label">Repayment Frequency:</label>
          <select 
            id="repaymentFrequency"
            name="repaymentFrequency" 
            value={formData.repaymentFrequency} 
            onChange={handleChange}
            className="loan-form-repayment-dropdown"
            required
            disabled={frequencyDisabled} // Disable if frequency is based on 'months'
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>

        <textarea 
          name="remarks" 
          placeholder="Remarks" 
          value={formData.remarks} 
          onChange={handleChange}
          className="loan-form-textarea"
        ></textarea>
        
        <button type="submit" className="loan-form-button">Send Request</button>
      </form>

      {loanId && <PaymentSchedule loanId={loanId} />} {/* Render PaymentSchedule if loanId is available */}
    </div>
  );
};

export default LoanForm;
