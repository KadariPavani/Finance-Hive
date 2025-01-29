


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
//     const localSchedule = JSON.parse(localStorage.getItem("paymentSchedule"));
    
//     // Check for user data first
//     if (localUser && localUser._id === userId) {
//       setUserData(localUser);  // Set user data from localStorage
//     } else {
//       console.log("Fetching user data from API...");
//       fetchUserData(); // Fetch user data from API
//     }
  
//     // If payment schedule exists in localStorage, use it directly
//     if (localSchedule) {
//       setPaymentSchedule(localSchedule);  // Set schedule from localStorage
//       setLoading(false);  // Stop loading as schedule is available
//     } else {
//       console.log("Fetching payment schedule from API...");
//       fetchPaymentSchedule(); // Fetch payment schedule from API
//     }
//   }, [userId]);  // Dependency on userId
  
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

//   const handleUpdatePayment = async (serialNo, emiAmount, status) => {
//     try {
//       const token = localStorage.getItem("token");
  
//       // Call API to update payment details
//       const response = await axios.patch(
//         `http://localhost:5000/api/payment/${userId}/${serialNo}`,
//         { emiAmount, status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       // Assuming the API returns the updated schedule
//       const updatedSchedule = response.data.schedule;
  
//       // Save the updated payment schedule to localStorage
//       localStorage.setItem("paymentSchedule", JSON.stringify(updatedSchedule));
  
//       console.log("Payment updated:", response.data);
  
//       // Update local state and trigger re-fetch of user data
//       setPaymentSchedule(updatedSchedule);
//     } catch (error) {
//       console.error("Error updating payment details:", error);
//       setError("Error updating payment details.");
//     }
//   };
  
  
  
  
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
//             {paymentSchedule.map((payment) => (
//               <div key={payment.serialNo} className="payment-row">
//                 <div>{payment.serialNo}</div>
//                 <div>{formatDate(payment.dueDate)}</div>
//                 <div>{formatCurrency(payment.emiAmount)}</div>
//                 <div>
//                   <select
//                     value={payment.status}
//                     onChange={(e) =>
//                       handleUpdatePayment(payment.serialNo, payment.emiAmount, e.target.value)
//                     }
//                   >
//                     <option value="PENDING">Pending</option>
//                     <option value="PAID">Paid</option>
//                     <option value="OVERDUE">Overdue</option>
//                   </select>
//                 </div>
//               </div>
//             ))}
//           </div>

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
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateInProgress, setUpdateInProgress] = useState(false);

  // Combined function to fetch both user data and payment schedule
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Parallel requests for better performance
      const [userResponse, scheduleResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/payment-schedule/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setUserData(userResponse.data);
      setPaymentSchedule(scheduleResponse.data.schedule);
      
      // Update localStorage with fresh data
      localStorage.setItem("selectedUser", JSON.stringify(userResponse.data));
      localStorage.setItem("paymentSchedule", JSON.stringify(scheduleResponse.data.schedule));
      
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Error fetching user data");
      
      // Clear potentially stale data
      localStorage.removeItem("selectedUser");
      localStorage.removeItem("paymentSchedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleUpdatePayment = async (serialNo, emiAmount, status) => {
    console.log("Attempting to update payment:", { serialNo, emiAmount, status }); // Add this
    try {
      const token = localStorage.getItem("token");
      
      // Log the request details
      console.log("Making request to:", `http://localhost:5000/api/payment/${userId}/${serialNo}`);
      console.log("With data:", { emiAmount, status });
  
      const response = await axios.patch(
        `http://localhost:5000/api/payment/${userId}/${serialNo}`,
        { emiAmount, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response received:", response.data); // Add this
  
      if (response.data && response.data.schedule) {
        setPaymentSchedule(response.data.schedule);
        localStorage.setItem("paymentSchedule", JSON.stringify(response.data.schedule));
      }
    } catch (error) {
      console.error("Error details:", error.response || error); // Modified this
      setError(error.response?.data?.message || "Error updating payment details.");
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-payment-details">
      <LandingPage />
      <button 
        onClick={() => navigate('/organizer-dashboard')} 
        className="back-btn"
        disabled={updateInProgress}
      >
        <X size={24} />
      </button>

      {error && <div className="error-message p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {userData && paymentSchedule && (
        <div className="details-container">
          <div className="user-info">
            <h2 className="text-2xl font-bold mb-4">{userData.name}'s Payment Details</h2>
            <div className="details-grid">
              <div className="flex items-center gap-2"><User /> {userData.name}</div>
              <div className="flex items-center gap-2"><Phone /> {userData.mobileNumber}</div>
              <div className="flex items-center gap-2"><Mail /> {userData.email}</div>
              <div className="flex items-center gap-2"><DollarSign /> {formatCurrency(userData.amountBorrowed)}</div>
              <div className="flex items-center gap-2"><Calendar /> {userData.tenure} months</div>
              <div className="flex items-center gap-2"><Percent /> {userData.interest}%</div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Payment Schedule</h3>
          <div className="payment-schedule">
            {paymentSchedule.map((payment) => (
              <div 
                key={payment.serialNo} 
                className={`payment-row ${payment.status === 'PAID' ? 'bg-green-50' : ''}`}
              >
                <div>{payment.serialNo}</div>
                <div>{formatDate(payment.dueDate)}</div>
                <div>{formatCurrency(payment.emiAmount)}</div>
                <div>
                <select
  value={payment.status}
  onChange={(e) => {
    console.log("Select changed:", e.target.value); // Add this
    handleUpdatePayment(payment.serialNo, payment.emiAmount, e.target.value);
  }}
  className={payment.status === 'PAID' ? 'bg-green-100' : ''}
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
      )}
    </div>
  );
};

export default UserPaymentDetails;