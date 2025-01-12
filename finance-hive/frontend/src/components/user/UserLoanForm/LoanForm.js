// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './LoanForm.css';
// import PaymentSchedule from '../UserPaymentSchedule/PaymentSchedule';

// const LoanForm = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     loanAmount: '',
//     loanPurpose: '',
//     loanTenureValue: '',
//     loanTenureType: 'months',
//     interestRate: '1',
//     repaymentFrequency: 'monthly',
//     remarks: '',
//   });

//   const [loanId, setLoanId] = useState(null);
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [frequencyDisabled, setFrequencyDisabled] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [emailValid, setEmailValid] = useState(null); // Null for initial state
//   const [isEligible, setIsEligible] = useState(true);
//   const [validationMessage, setValidationMessage] = useState('');
//   const [formErrors, setFormErrors] = useState({
//     email: '',
//     loanAmount: '',
//     loanPurpose: '',
//     loanTenureValue: '',
//     organization: '',
//   });

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => {
//       window.removeEventListener('resize', checkMobile);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchUserEmail = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/profile', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setFormData((prevData) => ({
//           ...prevData,
//           email: response.data.email,
//         }));
//       } catch (error) {
//         console.error('Error fetching user email:', error);
//       }
//     };

//     fetchUserEmail();
//   }, []);

  

//   useEffect(() => {
//     if (formData.loanTenureType === 'years') {
//       setFrequencyDisabled(false);
//     } else {
//       setFrequencyDisabled(true);
//       setFormData((prevData) => ({
//         ...prevData,
//         repaymentFrequency: 'monthly',
//       }));
//     }
//   }, [formData.loanTenureType]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const validateEmail = async () => {

//     const trimmedEmail = formData.email.trim();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email format validation

//     if (!trimmedEmail) {
//       setEmailValid(false);
//       setValidationMessage('Please enter an email to validate.');
//       return;
//     }

//     if (!emailRegex.test(trimmedEmail)) {
//       setEmailValid(false);
//       setValidationMessage('Please provide a valid email format (e.g., user@example.com).');
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/users/validate-email/${trimmedEmail}`
//       );
//       console.log(response.data);

//       if (response.data.exists) {
//         setEmailValid(true);
//         setValidationMessage('Email is valid.');
//       } else {
//         setEmailValid(false);
//         setValidationMessage('Email not found. Please register first.');
//       }
//     } catch (error) {
//       console.error('Error validating email:', error);
//       setEmailValid(false);
//       setValidationMessage('Error validating email. Please try again later.');
//     }
//   };

//   const checkEligibility = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/users/${formData.email}/eligibility`
//       );
//       setIsEligible(response.data.isEligible);
//     } catch (error) {
//       console.error('Error checking eligibility:', error);
//     }
//   };


//   const validateForm = () => {
//     let errors = {};

//     if (!formData.email) {
//       errors.email = 'Email is required.';
//     } else if (!emailValid) {
//       errors.email = 'Please validate your email.';
//     }

//     if (!formData.loanAmount) {
//       errors.loanAmount = 'Loan amount is required.';
//     } else if (isNaN(formData.loanAmount) || formData.loanAmount <= 0) {
//       errors.loanAmount = 'Please enter a valid loan amount.';
//     }

//     if (!formData.loanPurpose) {
//       errors.loanPurpose = 'Loan purpose is required.';
//     }

//     if (!formData.loanTenureValue) {
//       errors.loanTenureValue = 'Loan tenure is required.';
//     } else if (isNaN(formData.loanTenureValue) || formData.loanTenureValue <= 0) {
//       errors.loanTenureValue = 'Please enter a valid loan tenure.';
//     }

//     if (!formData.organization) {
//       errors.organization = 'Please select an organization.';
//     }

//     setFormErrors(errors);

//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       alert('Please fill all required fields');
//       return;
//     }

//     if (!emailValid) {
//       alert('Please validate your email first.');
//       return;
//     }

//     if (!isEligible) {
//       alert('You are not eligible to apply for a loan. Please clear pending payments first.');
//       return;
//     }

//     try {
//       const userId = localStorage.getItem('userId');
//       const finalFormData = {
//         ...formData,
//         userId,
//         loanTenure: `${formData.loanTenureValue} ${formData.loanTenureType}`,
//       };

//       const response = await axios.post('http://localhost:5000/api/loans', finalFormData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       alert('Loan request sent successfully!');
//       setLoanId(response.data.loanId);
//       setFormSubmitted(true);
//     } catch (error) {
//       console.error(error);
//       alert('Error sending loan request.');
//     }
//   };

//   useEffect(() => {
//     if (formData.email) {
//       checkEligibility();
//     }
//   }, [formData.email]);

//   return (
// <div className={`loan-form-container ${isMobile ? 'disabled' : ''}`}>
//   {!formSubmitted ? (
//     <>
//       <h2 className="loan-form-title">Loan Taking</h2>
//       <form className="loan-form" onSubmit={handleSubmit}>
//         <div className="email-validation-section">
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="loan-form-input"
//             required
//           />
//           <button type="button" onClick={validateEmail} className="validate-button">
//             Validate
//           </button>
//         </div>
//         <p className="validation-message">{validationMessage}</p>
//         {formErrors.email && <p className="error-message">{formErrors.email}</p>}

//         <input
//           type="text"
//           name="loanAmount"
//           placeholder="Loan Amount"
//           value={formData.loanAmount}
//           onChange={handleChange}
//           className="loan-form-input"
//           disabled={!emailValid}
//           required
//         />

//         <input
//           type="text"
//           name="loanPurpose"
//           placeholder="Loan Purpose"
//           value={formData.loanPurpose}
//           onChange={handleChange}
//           className="loan-form-input"
//           disabled={!emailValid}
//           required
//         />

//         <div className="loan-form-tenure-section">
//           <input
//             type="number"
//             name="loanTenureValue"
//             placeholder="Loan Tenure"
//             value={formData.loanTenureValue}
//             onChange={handleChange}
//             className="loan-form-number-input"
//             disabled={!emailValid}
//             required
//           />
//           <select
//             name="loanTenureType"
//             value={formData.loanTenureType}
//             onChange={handleChange}
//             className="loan-form-select"
//             disabled={!emailValid}
//           >
//             <option value="months">Months</option>
//             <option value="years">Years</option>
//           </select>
//         </div>

//         <div className="loan-form-repayment-section">
//           <label htmlFor="repaymentFrequency" className="loan-form-repayment-label">
//             Repayment Frequency:
//           </label>
//           <select
//             id="repaymentFrequency"
//             name="repaymentFrequency"
//             value={formData.repaymentFrequency}
//             onChange={handleChange}
//             className="loan-form-repayment-dropdown"
//             required
//             disabled={frequencyDisabled}
//           >
//             <option value="monthly">Monthly</option>
//             <option value="quarterly">Quarterly</option>
//             <option value="annually">Annually</option>
//           </select>
//         </div>

//         <label htmlFor="organization" className="loan-form-label">
//         </label>
//         <select
//           id="organization"
//           name="organization"
//           value={formData.organization}
//           onChange={handleChange}
//           className="loan-form-select"
//           required
//           disabled={!emailValid}
//         >
//           <option value="">Select an organization</option>
//           <option value="K-HUB">K-HUB</option>
//           <option value="GCC">GCC</option>
//           <option value="TOASTMASTERS">TOASTMASTERS</option>
//           <option value="ROBOTICS">ROBOTICS</option>
//         </select>

//         <textarea
//           name="remarks"
//           placeholder="Remarks"
//           value={formData.remarks}
//           onChange={handleChange}
//           className="loan-form-textarea"
//           disabled={!emailValid}
//         ></textarea>
//         <button
//           type="submit"
//           className="loan-form-button"
//           // disabled={!emailValid || formSubmitted}
//         >
//           Submit Loan Request
//         </button>
//       </form>
//     </>
//   ) : (
//     <div>
//       {loanId && <PaymentSchedule loanId={loanId} />}
//     </div>
//   )}
// </div>

//   );
// };

// export default LoanForm;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import './LoanForm.css';
import PaymentSchedule from '../UserPaymentSchedule/PaymentSchedule';

const LoanForm = () => {
    const form = useRef();
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
    const [emailValid, setEmailValid] = useState(null);
    const [isEligible, setIsEligible] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');
    const [formErrors, setFormErrors] = useState({
        email: '',
        loanAmount: '',
        loanPurpose: '',
        loanTenureValue: '',
        organization: '',
    });

    // Check mobile view
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

    // Fetch user email
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setFormData((prevData) => ({ ...prevData, email: response.data.email }));
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

    // Handle changes in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Validate email
    const validateEmail = async () => {
        const trimmedEmail = formData.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail) {
            setEmailValid(false);
            setValidationMessage('Please enter an email to validate.');
            return;
        }
        if (!emailRegex.test(trimmedEmail)) {
            setEmailValid(false);
            setValidationMessage('Please provide a valid email format (e.g., user@example.com).');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/users/validate-email/${trimmedEmail}`);
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

    // Check eligibility
    const checkEligibility = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${formData.email}/eligibility`);
            setIsEligible(response.data.isEligible);
        } catch (error) {
            console.error('Error checking eligibility:', error);
        }
    };

    // Validate form inputs
    const validateForm = () => {
        let errors = {};
        if (!formData.email) errors.email = 'Email is required.';
        else if (!emailValid) errors.email = 'Please validate your email.';
        
        if (!formData.loanAmount) errors.loanAmount = 'Loan amount is required.';
        else if (isNaN(formData.loanAmount) || formData.loanAmount <= 0) errors.loanAmount = 'Please enter a valid loan amount.';
        
        if (!formData.loanPurpose) errors.loanPurpose = 'Loan purpose is required.';
        
        if (!formData.loanTenureValue) errors.loanTenureValue = 'Loan tenure is required.';
        else if (isNaN(formData.loanTenureValue) || formData.loanTenureValue <= 0) errors.loanTenureValue = 'Please enter a valid loan tenure.';
        
        if (!formData.organization) errors.organization = 'Please select an organization.';
        
        setFormErrors(errors);
        
        return Object.keys(errors).length === 0;
    };

    // Send an email notification
    const sendEmailNotification = (date) => {
        const emailDetails = {
            to_name: formData.email,
            from_name: 'Notification System',
            message: `Reminder: You should pay the loan on ${date.toLocaleDateString()} to avoid any penalties.`,
            send_date: date.toISOString().split('T')[0], // Format date for sending
        };
        
        console.log(`Scheduled Email to be sent on ${emailDetails.send_date}:`, emailDetails);

         // For immediate testing purposes:
         emailjs.send('service_4247mkb', 'template_h56ugv5', emailDetails, '1iBIWAFDsrFNstP3C')
             .then(() => { console.log('Email sent successfully!'); },
             (error) => { console.error('Failed to send email...', error.text); });
     };

     // Schedule emails based on loan tenure value
     const scheduleEmails = (tenureValue) => {
         for (let i = 1; i <= tenureValue; i++) { // Start from 1 to avoid sending immediately again
             let dateToSendEmail = new Date();
             dateToSendEmail.setDate(dateToSendEmail.getDate() + (i * 30)); // Every 30 days
             sendEmailNotification(dateToSendEmail); // Schedule the next emails
         }
     };

     // Handle form submission
     const handleSubmit = async (e) => {
         e.preventDefault();
         if (!validateForm()) {
             alert('Please fill all required fields');
             return;
         }
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
             
             console.log("Final Form Data:", finalFormData); // Print to console

             // Send the loan request to the server
             const response = await axios.post('http://localhost:5000/api/loans', finalFormData, { 
                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
             });

             // Set the loan ID for the notification
             setLoanId(response.data.loanId);

             alert('Loan request sent successfully!');
             setFormSubmitted(true);

             // Send an initial notification after successful submission
             sendEmailNotification(new Date());

             // Schedule subsequent emails after initial submission
             scheduleEmails(parseInt(formData.loanTenureValue));
         } catch (error) {
             console.error(error);
             alert('Error sending loan request.');
         }
     };

     useEffect(() => { 
         if (formData.email) checkEligibility(); 
     }, [formData.email]);

     return (
         <div className={`loan-form-container ${isMobile ? 'disabled' : ''}`}>
             {!formSubmitted ? (
                 <>
                     <h2 className="loan-form-title">Loan Taking</h2>
                     <form ref={form} className="loan-form" onSubmit={handleSubmit}>
                         <div className="email-validation-section">
                             <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="loan-form-input" required />
                             <button type="button" onClick={validateEmail} className="validate-button"> Validate </button>
                         </div>
                         <p className="validation-message">{validationMessage}</p>
                         {formErrors.email && <p className="error-message">{formErrors.email}</p>}
                         <input type="text" name="loanAmount" placeholder="Loan Amount" value={formData.loanAmount} onChange={handleChange} className="loan-form-input" disabled={!emailValid} required />
                         <input type="text" name="loanPurpose" placeholder="Loan Purpose" value={formData.loanPurpose} onChange={handleChange} className="loan-form-input" disabled={!emailValid} required />
                         <div className="loan-form-tenure-section">
                             <input type="number" name="loanTenureValue" placeholder="Loan Tenure" value={formData.loanTenureValue} onChange={handleChange} className="loan-form-number-input" disabled={!emailValid} required />
                             <select name="loanTenureType" value={formData.loanTenureType} onChange={handleChange} className="loan-form-select" disabled={!emailValid}>
                                 <option value="months">Months</option>
                                 <option value="years">Years</option>
                             </select>
                         </div>
                         <div className="loan-form-repayment-section">
                             <label htmlFor="repaymentFrequency" className="loan-form-repayment-label"> Repayment Frequency: </label>
                             <select id="repaymentFrequency" name="repaymentFrequency" value={formData.repaymentFrequency} onChange={handleChange} className="loan-form-repayment-dropdown" required disabled={frequencyDisabled}>
                                 <option value="monthly">Monthly</option>
                                 <option value="quarterly">Quarterly</option>
                                 <option value="annually">Annually</option>
                             </select>
                         </div>
                         <select id="organization" name="organization" value={formData.organization} onChange={handleChange} className="loan-form-select" required disabled={!emailValid}>
                             <option value="">Select an organization</option>
                             <option value="K-HUB">K-HUB</option>
                             <option value="GCC">GCC</option>
                             <option value="TOASTMASTERS">TOASTMASTERS</option>
                             <option value="ROBOTICS">ROBOTICS</option>
                         </select>
                         <textarea name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} className="loan-form-textarea" disabled={!emailValid}></textarea>
                         <button type="submit" className="loan-form-button"> Submit Loan Request </button>
                     </form>
                 </>
             ) : (
                 <div>{loanId && <PaymentSchedule loanId={loanId} />}</div>
             )}
         </div>
     );
};

export default LoanForm;
