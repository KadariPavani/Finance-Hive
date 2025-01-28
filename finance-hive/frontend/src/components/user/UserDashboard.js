
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";
import LandingPage from '../home/LandingPage/LandingPage';

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPayment, setNextPayment] = useState(null);

  const calculateNextPayment = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) return null;
    
    const today = new Date();
    const upcomingPayment = paymentSchedule.find(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate > today && payment.status === 'PENDING';
    });
    
    if (upcomingPayment) {
      return {
        ...upcomingPayment,
        paymentDate: new Date(upcomingPayment.paymentDate)
      };
    }
    
    return null;
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const userData = response.data.data;
      
      // Convert all payment dates to Date objects
      if (userData.paymentSchedule) {
        userData.paymentSchedule = userData.paymentSchedule.map(payment => ({
          ...payment,
          paymentDate: new Date(payment.paymentDate)
        }));
      }

      setUserDetails(userData);
      const nextPaymentInfo = calculateNextPayment(userData.paymentSchedule);
      setNextPayment(nextPaymentInfo);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="user-loading">
        <div className="user-loading-spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-header">
        <LandingPage />
        <h1>User Dashboard</h1>
      </div>

      {userDetails && (
        <div className="user-content-wrapper">
          {/* User Info Card */}
          <div className="user-info-card">
            <div className="user-info-header">
              <h2>Personal Information</h2>
            </div>
            <div className="user-info-content">
              <div className="user-info-item">
                <span className="user-info-label">Name:</span>
                <span className="user-info-value">{userDetails.name}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Email:</span>
                <span className="user-info-value">{userDetails.email}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Mobile:</span>
                <span className="user-info-value">{userDetails.mobileNumber}</span>
              </div>
            </div>
          </div>

          {/* Loan Details Card */}
          <div className="user-loan-card">
            <div className="user-loan-header">
              <h2>Loan Details</h2>
            </div>
            <div className="user-loan-content">
              <div className="user-loan-summary">
                <div className="user-loan-item">
                  <span className="user-loan-label">Amount Borrowed:</span>
                  <span className="user-loan-value">
                    {formatCurrency(userDetails.amountBorrowed)}
                  </span>
                </div>
                <div className="user-loan-item">
                  <span className="user-loan-label">Tenure:</span>
                  <span className="user-loan-value">{userDetails.tenure} months</span>
                </div>
                <div className="user-loan-item">
                  <span className="user-loan-label">Interest:</span>
                  <span className="user-loan-value">{userDetails.interest}%</span>
                </div>
                {nextPayment && (
                  <div className="user-loan-item user-next-payment">
                    <span className="user-loan-label">Next Payment:</span>
                    <span className="user-loan-value">
                      {formatCurrency(nextPayment.emiAmount)} on {formatDate(nextPayment.paymentDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Schedule Table */}
          {userDetails.paymentSchedule && (
            <div className="user-payment-schedule">
              <h2>Payment Schedule</h2>
              <div className="user-table-wrapper">
                <table className="user-payment-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Payment Date</th>
                      <th>EMI Amount</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDetails.paymentSchedule.map((payment) => (
                      <tr key={payment.serialNo}>
                        <td>{payment.serialNo}</td>
                        <td>{formatDate(payment.paymentDate)}</td>
                        <td>{formatCurrency(payment.emiAmount)}</td>
                        <td>{formatCurrency(payment.principal)}</td>
                        <td>{formatCurrency(payment.interest)}</td>
                        <td>{formatCurrency(payment.balance)}</td>
                        <td>
                          <span className={`user-payment-status user-status-${payment.status.toLowerCase()}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
