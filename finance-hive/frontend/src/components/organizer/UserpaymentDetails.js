// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { X, User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
// import LandingPage from '../home/LandingPage/LandingPage';

// const UserPaymentDetails = () => {
//   const { userId } = useParams();  // This grabs the ID from the URL
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [paymentSchedule, setPaymentSchedule] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Fetch user data
//       const userResponse = await axios.get(
//         `http://localhost:5000/api/user/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Fetch payment schedule data
//       const scheduleResponse = await axios.get(
//         `http://localhost:5000/api/payment-schedule/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Update state with the fetched data
//       setUserData(userResponse.data);
//       setPaymentSchedule(scheduleResponse.data.schedule);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setError(error.response?.data?.message || "Error fetching user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user data when component mounts or userId changes
//   useEffect(() => {
//     const localUser = JSON.parse(localStorage.getItem("selectedUser"));
//     console.log("Local user:", localUser);

//     // If the user data is already in localStorage and matches the URL userId
//     if (localUser && localUser._id === userId) {
//       console.log("User data from localStorage matches the ID in URL.");
//       setUserData(localUser);
//       fetchPaymentSchedule(); // Assuming you have this function to fetch payment schedule from local data
//     } else {
//       console.log("Fetching user data from API...");
//       fetchUserData(); // Fetch user and payment data from API
//     }
//   }, [userId]);  // Dependency on userId

//   // const fetchUserData = async () => {
//   //   try {
//   //     setLoading(true); // Start loading
//   //     const token = localStorage.getItem("token");
//   //     const userResponse = await axios.get(
//   //       `http://localhost:5000/api/user/${userId}`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` }
//   //       }
//   //     );
//   //     console.log("Fetched user data:", userResponse.data);
//   //     setUserData(userResponse.data);
//   //     fetchPaymentSchedule();  // Call to fetch payment schedule after user data
//   //   } catch (error) {
//   //     setError(error.response?.data?.message || "Error fetching user data");
//   //     console.error("Error fetching user data:", error);
//   //   }
//   // };

//   const fetchPaymentSchedule = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:5000/api/payment-schedule/${userId}`,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setPaymentSchedule(response.data.schedule);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching payment schedule:", error);
//     }
//   };
  

//   // const handleUpdatePayment = async (serialNo, emiAmount, status) => {
//   //   if (!emiAmount || !status) {
//   //     alert("Please provide valid EMI amount and status");
//   //     return;
//   //   }

//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const response = await axios.put(
//   //       `http://localhost:5000/api/payment-schedule/${userId}/${serialNo}`,
//   //       { emiAmount, status },
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` }
//   //       }
//   //     );

//   //     if (response.data.schedule) {
//   //       setPaymentSchedule(response.data.schedule);
//   //       alert("Payment updated successfully!");
//   //     }
//   //   } catch (error) {
//   //     if (error.response?.data?.isLocked) {
//   //       alert("This payment has already been updated");
//   //       fetchUserData(); // Refresh data to show current state
//   //     } else {
//   //       alert(error.response?.data?.message || "Failed to update payment");
//   //     }
//   //   }
//   // };

//   const handleUpdatePayment = async (serialNo, emiAmount, status) => {
//     try {
//       const token = localStorage.getItem("token");
  
//       // Ensure that the URL is correct
//       const response = await axios.patch(
//         `http://localhost:5000/api/payment/${userId}/${serialNo}`,
//         { emiAmount, status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       console.log("Payment updated:", response.data);
//       fetchUserData(); // Re-fetch user data to reflect the update
//     } catch (error) {
//       console.error("Error updating payment details:", error);
//       setError("Error updating payment details.");
//     }
//   };
  
  
  
  
//   // const handleUpdatePayment = async (serialNo, emiAmount, status) => {
//   //   if (!emiAmount || !status) {
//   //     alert("Please provide valid EMI amount and status");
//   //     return;
//   //   }
  
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const response = await axios.put(
//   //       `http://localhost:5000/api/payment-schedule/${userId}/${serialNo}`,
//   //       { emiAmount, status },
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` }
//   //       }
//   //     );
  
//   //     // Check for the updated schedule and set it in the state
//   //     if (response.data.schedule) {
//   //       setPaymentSchedule(response.data.schedule);
//   //       alert("Payment updated successfully!");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error updating payment details:", error);
//   //     alert(error.response?.data?.message || "Failed to update payment");
//   //   }
//   // };
   
  
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   if (loading) {
//     console.log("Loading user data and payment schedule...");
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="user-payment-details">
//       <LandingPage />
//       <button onClick={() => navigate('/organizer-dashboard')} className="back-btn">
//         <X size={24} />
//       </button>

//       {error ? (
//         <div className="error">{error}</div>
//       ) : userData && paymentSchedule ? (
//         <div className="details-container">
//           <div className="user-info">
//             <h2>{userData.name}'s Payment Details</h2>
//             <div className="details-grid">
//               <div><User /> {userData.name}</div>
//               <div><Phone /> {userData.mobileNumber}</div>
//               <div><Mail /> {userData.email}</div>
//               <div><DollarSign /> {formatCurrency(userData.amountBorrowed)}</div>
//               <div><Calendar /> {userData.tenure} months</div>
//               <div><Percent /> {userData.interest}%</div>
//             </div>
//           </div>

//           <h3>Payment Schedule</h3>
//           <div className="payment-schedule">
//   {paymentSchedule.map((payment) => (
//     <div key={payment.serialNo} className="payment-row">
//       <div>{payment.serialNo}</div>
//       <div>{formatDate(payment.dueDate)}</div>
//       <div>{formatCurrency(payment.emiAmount)}</div>
//       <div>
//         <select
//           value={payment.status}
//           onChange={(e) =>
//             handleUpdatePayment(payment.serialNo, payment.emiAmount, e.target.value)
//           }
//         >
//           <option value="PENDING">Pending</option>
//           <option value="PAID">Paid</option>
//           <option value="OVERDUE">Overdue</option>
//         </select>
//       </div>
//     </div>
//   ))}
// </div>

//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default UserPaymentDetails;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
import LandingPage from '../home/LandingPage/LandingPage';

const UserPaymentDetails = () => {
  const { userId } = useParams();  // This grabs the ID from the URL
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch user data
      const userResponse = await axios.get(
        `http://localhost:5000/api/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch payment schedule data
      const scheduleResponse = await axios.get(
        `http://localhost:5000/api/payment-schedule/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state with the fetched data
      setUserData(userResponse.data);
      setPaymentSchedule(scheduleResponse.data.schedule);
      setError(null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.response?.data?.message || "Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when component mounts or userId changes
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("selectedUser"));
    const localSchedule = JSON.parse(localStorage.getItem("paymentSchedule"));
    
    // Check for user data first
    if (localUser && localUser._id === userId) {
      setUserData(localUser);  // Set user data from localStorage
    } else {
      console.log("Fetching user data from API...");
      fetchUserData(); // Fetch user data from API
    }
  
    // If payment schedule exists in localStorage, use it directly
    if (localSchedule) {
      setPaymentSchedule(localSchedule);  // Set schedule from localStorage
      setLoading(false);  // Stop loading as schedule is available
    } else {
      console.log("Fetching payment schedule from API...");
      fetchPaymentSchedule(); // Fetch payment schedule from API
    }
  }, [userId]);  // Dependency on userId
  
  const fetchPaymentSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/payment-schedule/${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPaymentSchedule(response.data.schedule);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payment schedule:", error);
    }
  };

  const handleUpdatePayment = async (serialNo, emiAmount, status) => {
    try {
      const token = localStorage.getItem("token");
  
      // Call API to update payment details
      const response = await axios.patch(
        `http://localhost:5000/api/payment/${userId}/${serialNo}`,
        { emiAmount, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Assuming the API returns the updated schedule
      const updatedSchedule = response.data.schedule;
  
      // Save the updated payment schedule to localStorage
      localStorage.setItem("paymentSchedule", JSON.stringify(updatedSchedule));
  
      console.log("Payment updated:", response.data);
  
      // Update local state and trigger re-fetch of user data
      setPaymentSchedule(updatedSchedule);
    } catch (error) {
      console.error("Error updating payment details:", error);
      setError("Error updating payment details.");
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-payment-details">
      <LandingPage />
      <button onClick={() => navigate('/organizer-dashboard')} className="back-btn">
        <X size={24} />
      </button>

      {error ? (
        <div className="error">{error}</div>
      ) : userData && paymentSchedule ? (
        <div className="details-container">
          <div className="user-info">
            <h2>{userData.name}'s Payment Details</h2>
            <div className="details-grid">
              <div><User /> {userData.name}</div>
              <div><Phone /> {userData.mobileNumber}</div>
              <div><Mail /> {userData.email}</div>
              <div><DollarSign /> {formatCurrency(userData.amountBorrowed)}</div>
              <div><Calendar /> {userData.tenure} months</div>
              <div><Percent /> {userData.interest}%</div>
            </div>
          </div>

          <h3>Payment Schedule</h3>
          <div className="payment-schedule">
            {paymentSchedule.map((payment) => (
              <div key={payment.serialNo} className="payment-row">
                <div>{payment.serialNo}</div>
                <div>{formatDate(payment.dueDate)}</div>
                <div>{formatCurrency(payment.emiAmount)}</div>
                <div>
                  <select
                    value={payment.status}
                    onChange={(e) =>
                      handleUpdatePayment(payment.serialNo, payment.emiAmount, e.target.value)
                    }
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : null}
    </div>
  );
};

export default UserPaymentDetails;
