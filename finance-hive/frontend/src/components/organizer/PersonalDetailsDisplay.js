import React, { useState, useEffect } from 'react';
import './PersonalDetailsDisplay.css';

const PersonalDetailsDisplay = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationForm, setVerificationForm] = useState({
    userId: null,
    email: '',
    username: '',
    status: '',
  });
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await fetch('http://localhost:5000/personal-details/all');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(`Error fetching user details: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/verification/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: verificationForm.email,
          username: verificationForm.username,
          status: verificationForm.status,
          userId: verificationForm.userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to store verification');
      }

      alert('Verification stored successfully');
      setShowVerificationForm(false);
      await fetchUserData();
    } catch (err) {
      setError(`Verification storage failed: ${err.message}`);
      console.error('Verification error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setVerificationForm({
      userId: null,
      email: '',
      username: '',
      status: '',
    });
    setError('');
  };

  if (loading) return <div className="loading-indicator">Loading user data...</div>;
  if (error && !userData.length) return <div className="error-message">{error}</div>;
  if (!userData.length) return <div className="no-data">No records found</div>;

  return (
    <div className="user-details-container">
      {error && <div className="error-banner">{error}</div>}

      {userData.map((user, index) => (
        <div key={user.id || index} className="user-card">
          <h2>User Details #{index + 1}</h2>

          <section>
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
          </section>

          <section>
            <h3>Employment Details</h3>
            <p><strong>Occupation:</strong> {user.occupation}</p>
            <p><strong>Employer:</strong> {user.employerName}</p>
            <p><strong>Monthly Income:</strong> {user.monthlyIncome}</p>
          </section>

          <section>
            <h3>Bank Information</h3>
            <p><strong>Account Type:</strong> {user.accountType}</p>
            <p><strong>Bank Name:</strong> {user.bankName}</p>
            <p><strong>Branch:</strong> {user.branchName}</p>
            <p><strong>IFSC Code:</strong> {user.ifscCode}</p>
          </section>

          <button 
            onClick={() => {
              resetForm();
              setVerificationForm({
                userId: user.id,
                email: user.email || '',
                username: '',
                status: '',
              });
              setShowVerificationForm(true);
            }}
            className="verify-button"
            disabled={submitLoading}
          >
            {submitLoading ? 'Processing...' : 'Verify User'}
          </button>

          {showVerificationForm && verificationForm.userId === user.id && (
            <form onSubmit={handleVerificationSubmit} className="verification-form">
              <input
                type="email"
                placeholder="Enter Email to Verify"
                value={verificationForm.email}
                onChange={(e) => setVerificationForm({
                  ...verificationForm,
                  email: e.target.value,
                })}
                required
                disabled={submitLoading}
              />
              <input
                type="text"
                placeholder="Enter Username to Verify"
                value={verificationForm.username}
                onChange={(e) => setVerificationForm({
                  ...verificationForm,
                  username: e.target.value,
                })}
                required
                disabled={submitLoading}
              />
              <select 
                value={verificationForm.status}
                onChange={(e) => setVerificationForm({
                  ...verificationForm,
                  status: e.target.value,
                })}
                required
                disabled={submitLoading}
              >
                <option value="">Select status</option>
                <option value="verified">Verified</option>
                <option value="not_verified">Not Verified</option>
              </select>
              <button type="submit" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit Verification'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowVerificationForm(false)}
                disabled={submitLoading}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default PersonalDetailsDisplay;
