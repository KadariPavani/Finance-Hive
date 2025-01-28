import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrganizerDashboard.css";
import { X, User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
import LandingPage from '../home/LandingPage/LandingPage';

const OrganizerDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    amountBorrowed: "",
    tenure: "",
    interest: "",
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentSchedule, setPaymentSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/organizer/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  const [error, setError] = useState(null);

  // const fetchPaymentSchedule = async (userId) => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(`http://localhost:5000/api/payment-schedule/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data.schedule;
  //   } catch (error) {
  //     console.error("Error fetching payment schedule:", error);
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPaymentSchedule = async (userId) => {
    try {
      setLoading(true);
      setError(null); // Reset error state

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/payment-schedule/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.schedule) {
        setPaymentSchedule(response.data.schedule);
        return response.data.schedule;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error("Error fetching payment schedule:", error);
      let errorMessage = "Failed to fetch payment schedule";

      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          errorMessage = "Payment schedule not found for this user";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleEditPayment = async (serialNo, updatedDetails) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/payment-schedule/${selectedUser._id}/${serialNo}`,
        updatedDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Payment updated successfully!");
      fetchPaymentSchedule(selectedUser._id); // Refresh schedule
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment.");
    }
  };

  const handleUpdatePayment = async (serialNo, emiAmount, status) => {
    if (!emiAmount || !status) {
      alert("Please provide valid EMI amount and status.");
      return;
    }
  
    try {
      const updatedDetails = { emiAmount, status };
      const token = localStorage.getItem("token");
  
      // Assuming `selectedUser._id` is the user ID we are working with
      const response = await axios.put(
        `http://localhost:5000/api/payment-schedule/${selectedUser._id}/${serialNo}`,
        updatedDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update local state to reflect the change and lock the row
      const updatedPaymentSchedule = paymentSchedule.map(payment => {
        if (payment.serialNo === serialNo) {
          return {
            ...payment,
            emiAmount,
            status,
            locked: true, // Lock the row after update
          };
        }
        return payment;
      });
  
      setPaymentSchedule(updatedPaymentSchedule);
      alert("Payment updated successfully!");
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment.");
    }
  };
  
  

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.post("http://localhost:5000/api/add-user-payment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User added and email sent successfully.");
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        amountBorrowed: "",
        tenure: "",
        interest: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };
  // const handleUserClick = async (user) => {
  //   setSelectedUser(user);
  //   const schedule = await fetchPaymentSchedule(user._id);
  //   if (schedule) {
  //     setPaymentSchedule(schedule);
  //   }
  //   setShowModal(true);
  // };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    const schedule = await fetchPaymentSchedule(user._id);
    if (!schedule) {
      // If no schedule is returned, the error state will already be set
      // We can still show the modal with user details, just without the schedule
      setPaymentSchedule(null);
    }
  };

  return (
    <div className="organizer-dashboard">
      <LandingPage />
      {/* Add User Form */}
      <div className="add-user-section">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Amount Borrowed (₹)</label>
              <input
                type="number"
                name="amountBorrowed"
                value={formData.amountBorrowed}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tenure (months)</label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Interest (%)</label>
              <input
                type="number"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">Add User</button>
        </form>
      </div>

      {/* Users Grid */}
      <div className="users-section">
        <h2>Your Users</h2>
        <div className="users-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card" onClick={() => handleUserClick(user)}>
              <div className="user-card-header">
                <User className="user-icon" />
                <h3>{user.name}</h3>
              </div>
              <div className="user-card-body">
                <p><Phone size={16} /> {user.mobileNumber}</p>
                <p><Mail size={16} /> {user.email}</p>
                <p><DollarSign size={16} /> {formatCurrency(user.amountBorrowed)}</p>
                <div className="user-card-footer">
                  <span><Calendar size={14} /> {user.tenure} months</span>
                  <span><Percent size={14} /> {user.interest}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => {
              setShowModal(false);
              setPaymentSchedule(null);
            }}>
              <X size={24} />
            </button>
            <div className="modal-content">
              <div className="modal-header">
                <h2>User Details</h2>
              </div>

              <div className="details-grid">
                {/* Personal Information */}
                <div className="details-section">
                  <h3>Personal Information</h3>
                  <div className="details-content">
                    <div className="details-item">
                      <label>Name:</label>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div className="details-item">
                      <label>Email:</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="details-item">
                      <label>Mobile:</label>
                      <span>{selectedUser.mobileNumber}</span>
                    </div>
                    <div className="details-item">
                      <label>User ID:</label>
                      <span>{selectedUser._id}</span>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="details-section">
                  <h3>Loan Details</h3>
                  <div className="details-content">
                    <div className="details-item">
                      <label>Amount Borrowed:</label>
                      <span>{formatCurrency(selectedUser.amountBorrowed)}</span>
                    </div>
                    <div className="details-item">
                      <label>Tenure:</label>
                      <span>{selectedUser.tenure} months</span>
                    </div>
                    <div className="details-item">
                      <label>Interest Rate:</label>
                      <span>{selectedUser.interest}%</span>
                    </div>
                    <div className="details-item">
                      <label>Monthly EMI:</label>
                      <span>{formatCurrency(selectedUser.monthlyEMI)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              {/* {loading ? (
                <div className="loading-spinner">Loading payment schedule...</div>
              ) : paymentSchedule && (
                <div className="schedule-section">
                  <h3>Payment Schedule</h3>
                  <div className="schedule-table-wrapper">
                    <table className="schedule-table">
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
                        {paymentSchedule.map((payment, index) => (
                          <tr key={index} className={payment.status.toLowerCase()}>
                            <td>{index + 1}</td>
                            <td>{formatDate(payment.paymentDate)}</td>
                            <td>{formatCurrency(payment.emiAmount)}</td>
                            <td>{formatCurrency(payment.principal)}</td>
                            <td>{formatCurrency(payment.interest)}</td>
                            <td>{formatCurrency(payment.balance)}</td>
                            <td>
                              <span className={`status-badge ${payment.status.toLowerCase()}`}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )} */}
{
  loading ? (
    <div className="loading-spinner">Loading payment schedule...</div>
  ) : error ? (
    <div className="error-message">
      <p>{error}</p>
    </div>
  ) : paymentSchedule ? (
    <div className="schedule-section">
      <h3>Payment Schedule</h3>
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Payment Date</th>
              <th>EMI Amount</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentSchedule.map((payment, index) => (
              <tr key={index} className={payment.status.toLowerCase()}>
                <td>{index + 1}</td>
                <td>{formatDate(payment.paymentDate)}</td>
                <td>
                  <input
                    type="number"
                    value={payment.emiAmount}
                    onChange={(e) => {
                      if (!payment.locked) {
                        const updatedPaymentSchedule = [...paymentSchedule];
                        updatedPaymentSchedule[index].emiAmount = e.target.value;
                        setPaymentSchedule(updatedPaymentSchedule);
                      }
                    }}
                    disabled={payment.locked} // Disable input if locked
                  />
                </td>
                <td>{formatCurrency(payment.principal)}</td>
                <td>{formatCurrency(payment.interest)}</td>
                <td>{formatCurrency(payment.balance)}</td>
                <td>
                  <select
                    value={payment.status}
                    onChange={(e) => {
                      if (!payment.locked) {
                        const updatedPaymentSchedule = [...paymentSchedule];
                        updatedPaymentSchedule[index].status = e.target.value;
                        setPaymentSchedule(updatedPaymentSchedule);
                      }
                    }}
                    disabled={payment.locked} // Disable select if locked
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleUpdatePayment(payment.serialNo, payment.emiAmount, payment.status)}
                    disabled={payment.locked} // Disable button if locked
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="no-schedule-message">
      <p>No payment schedule available for this user.</p>
    </div>
  )
}



            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;