import React, { useState } from 'react';
import CompletionPage from './CompletionPage';
import './PersonalDetailsForm.css';
const PersonalDetailsForm = () => {
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    idType: '',
    issuingAuthority: '',
    idNumber: '',
    expirationDate: '',
    occupation: '',
    employerName: '',
    employerIdProof: '',
    monthlyIncome: '',
    sourceOfIncome: '',
    incomeProof: '',
    addressProof: '',
    accountType: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    username: '',
    password: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    maritalStatus: '',
    numberOfDependents: '',
    educationLevel: '',
    termsAccepted: false,
    idDocument: null // For file uploads
  });

  const nextStep = () => {
    if (step < 6) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      idDocument: file, // Store the file in the formData
    });
  };
const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true when submitting

  // Validation: Check if terms and conditions are accepted
  if (!formData.termsAccepted) {
    alert("You must accept the terms and conditions to proceed.");
    setLoading(false); // Stop loading
    return;
  }

  // Additional validations (optional)
  if (!formData.firstName || !formData.lastName || !formData.email) {
    alert("Please fill in all required fields (First Name, Last Name, Email).");
    setLoading(false); // Stop loading
    return;
  }

  // Log submitted data (for debugging or future use)
  console.log("Form Data Submitted: ", formData);

  // Transition directly to the CompletionPage
  setIsCompleted(true);
  setLoading(false); // Stop loading
};


  if (isCompleted) {
    return <CompletionPage />;
  }

  return (
    <div className="personal-details-app-container">
      <div className="personal-details-form-content">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {error && <div className="personal-details-error-message">{error}</div>}

          {step === 1 && (
            <div className="personal-details-form-section">
              <h3>Personal Details</h3>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="personal-details-form-row">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  placeholder="Date Of Birth"
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="preferNotToSay">Prefer not to say</option>
                </select>
              </div>
              <div className="personal-details-form-row">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="personal-details-form-row">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  required
                />
              </div>
              <button type="button" onClick={nextStep} disabled={loading}>
                Next: Identification Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="personal-details-form-section">
              <h3>Identification Details</h3>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  placeholder="ID Type (passport, Driving License, Aadhar, PAN card)"
                  required
                />
                <input
                  type="text"
                  name="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={handleChange}
                  placeholder="Issuing Authority"
                  required
                />
              </div>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="ID Number"
                  required
                />
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  placeholder="Expiration Date"
                  required
                />
              </div>
              <div className="personal-details-form-row">
                <label htmlFor="idDocument">Upload ID Document:</label>
                <input
                  type="file"
                  name="idDocument"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
              </div>
              <button type="button" onClick={prevStep} disabled={loading}>Previous</button>
              <button type="button" onClick={nextStep} disabled={loading}>Next: Employment Details</button>
            </div>
          )}

          {step === 3 && (
            <div className="personal-details-form-section">
              <h3>Employment/Income Details</h3>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Occupation"
                />
                <input
                  type="text"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleChange}
                  placeholder="Employer Name"
                />
                <input
                  type="text"
                  name="employerIdProof"
                  value={formData.employerIdProof}
                  onChange={handleChange}
                  placeholder="Employer ID Proof"
                />
              </div>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="Monthly Income"
                />
                <input
                  type="text"
                  name="sourceOfIncome"
                  value={formData.sourceOfIncome}
                  onChange={handleChange}
                  placeholder="Source of Income (Salary, Business...)"
                />
              </div>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="incomeProof"
                  value={formData.incomeProof}
                  onChange={handleChange}
                  placeholder="Income Proof"
                />
                <input
                  type="text"
                  name="addressProof"
                  value={formData.addressProof}
                  onChange={handleChange}
                  placeholder="Address Proof"
                />
              </div>
              <button type="button" onClick={prevStep} disabled={loading}>Previous</button>
              <button type="button" onClick={nextStep} disabled={loading}>Next: Bank Account Details</button>
            </div>
          )}

          {step === 4 && (
            <div className="personal-details-form-section">
              <h3>Bank Account Details</h3>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  placeholder="Account Type (Savings/Current)"
                />
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Account Number"
                />
              </div>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                />
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder="Branch Name"
                />
              </div>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="IFSC Code"
                />
              </div>
              <button type="button" onClick={prevStep} disabled={loading}>Previous</button>
              <button type="button" onClick={nextStep} disabled={loading}>Next: Security Details</button>
            </div>
          )}

          {step === 5 && (
            <div className="personal-details-form-section">
              <h3>Security Details</h3>
              <div className="personal-details-form-row">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="personal-details-form-row">
                <select
                  name="securityQuestion1"
                  value={formData.securityQuestion1}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a security question
                  </option>
                  <option value="mothersMaidenName">What is your mother's maiden name?</option>
                  <option value="firstPetName">What was the name of your first pet?</option>
                </select>
                <input
                  type="text"
                  name="securityAnswer1"
                  value={formData.securityAnswer1}
                  onChange={handleChange}
                  placeholder="Answer"
                  required
                />
              </div>
              <div className="personal-details-form-row">
                <select
                  name="securityQuestion2"
                  value={formData.securityQuestion2}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a security question
                  </option>
                  <option value="childhoodSchool">What is the name of your childhood school?</option>
                  <option value="favoriteTeacher">Who was your favorite teacher?</option>
                </select>
                <input
                  type="text"
                  name="securityAnswer2"
                  value={formData.securityAnswer2}
                  onChange={handleChange}
                  placeholder="Answer"
                  required
                />
              </div>
              <div className="personal-details-form-row">
                <label>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  I accept the terms and conditions
                </label>
              </div>
              <button type="button" onClick={prevStep} disabled={loading}>Previous</button>
              <button type="submit" disabled={loading}>Submit</button>
            </div>
          )}
        </form>
      </div>

    </div>
  );
};

export default PersonalDetailsForm;
