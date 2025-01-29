


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
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
import LandingPage from '../home/LandingPage/LandingPage';
import { Loader2 } from 'lucide-react';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const UserPaymentDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateInProgress, setUpdateInProgress] = useState({});

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  
      const userResponse = await api.get(`/user/${userId}`);
      const userData = userResponse.data;
  
      if (!userData) {
        throw new Error("Invalid data received from server");
      }
  
      console.log('Fetched user data:', userData); // Debug log
  
      // Set user data and payment schedule
      setUserData(userData);
      setPaymentSchedule(userData.paymentSchedule || []); // Ensure paymentSchedule is set correctly
  
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Failed to load payment details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

const handleUpdatePayment = async (serialNo, emiAmount, newStatus) => {
  if (updateInProgress[serialNo]) return;

  console.log('Starting payment update:', { serialNo, newStatus }); // Debug log

  try {
    setUpdateInProgress(prev => ({ ...prev, [serialNo]: true }));
    setError(null);

    // Optimistically update the UI
    setPaymentSchedule(prevSchedule =>
      prevSchedule.map(payment =>
        payment.serialNo === serialNo
          ? { ...payment, status: newStatus }
          : payment
      )
    );

    const response = await api.patch(
      `/payment/${userId}/${serialNo}`,
      {
        emiAmount: Number(emiAmount),
        status: newStatus,
      }
    );

    console.log('Server response:', response.data); // Debug log

    // Update the payment schedule with the response from the server
    if (response.data?.schedule) {
      setPaymentSchedule(response.data.schedule);
    }

  } catch (error) {
    console.error("Update failed:", error);
    setError("Failed to update payment status. Please try again.");
    // Revert the optimistic update
    fetchUserData();
  } finally {
    setUpdateInProgress(prev => ({ ...prev, [serialNo]: false }));
  }
};

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }, []);

  useEffect(() => {
    console.log('Current payment schedule:', paymentSchedule); // Debug log
  }, [paymentSchedule]);

  const renderPaymentStatus = useCallback((payment) => (
    <div className="flex items-center gap-2">
      <select
        key={`${payment.serialNo}-${payment.status}`} // Force re-render on status change
        value={payment.status}
        onChange={(e) => {
          console.log(`Changing status for payment ${payment.serialNo} from ${payment.status} to ${e.target.value}`);
          handleUpdatePayment(payment.serialNo, payment.emiAmount, e.target.value);
        }}
        className={`p-2 rounded border ${
          payment.status === 'PAID' 
            ? 'bg-green-100 border-green-200' 
            : payment.status === 'OVERDUE'
              ? 'bg-red-100 border-red-200'
              : 'bg-white border-gray-200'
        } ${updateInProgress[payment.serialNo] ? 'opacity-50' : ''}`}
        disabled={updateInProgress[payment.serialNo]}
      >
        <option value="PENDING">Pending</option>
        <option value="PAID">Paid</option>
        <option value="OVERDUE">Overdue</option>
      </select>
      {updateInProgress[payment.serialNo] && (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      )}
    </div>
  ), [updateInProgress, handleUpdatePayment]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-payment-details min-h-screen bg-gray-50">
      <LandingPage />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/')} 
          className="back-btn mb-6 p-2 rounded-full hover:bg-gray-200 transition-colors">
          <X size={24} />
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {userData && paymentSchedule.length > 0 && (
          <div className="details-container bg-white rounded-lg shadow-md p-6">
            {/* User info section remains the same */}
            <div className="payment-schedule overflow-x-auto mt-6">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Serial No.</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">EMI Amount</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentSchedule.map((payment) => (
                    <tr 
                      key={payment.serialNo} 
                      className={`border-t ${
                        payment.status === 'PAID' 
                          ? 'bg-green-50' 
                          : payment.status === 'OVERDUE' 
                            ? 'bg-red-50' 
                            : ''
                      }`}
                    >
                      <td className="p-3">{payment.serialNo}</td>
                      <td className="p-3">{formatDate(payment.paymentDate)}</td>
                      <td className="p-3">{formatCurrency(payment.emiAmount)}</td>
                      <td className="p-3">
                        {renderPaymentStatus(payment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPaymentDetails;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { X, User, Phone, Mail, DollarSign, Calendar, Percent } from 'lucide-react';
// import LandingPage from '../home/LandingPage/LandingPage';
// import { Loader2 } from 'lucide-react';

// const UserPaymentDetails = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [paymentSchedule, setPaymentSchedule] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateInProgress, setUpdateInProgress] = useState(false);
// // Add this at the top of your component with other imports

// // Add these states in your component
// const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
// const [loadingPaymentId, setLoadingPaymentId] = useState(null);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [userResponse, scheduleResponse] = await Promise.all([
//         axios.get(`http://localhost:5000/api/user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`http://localhost:5000/api/payment-schedule/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       ]);

//       if (userResponse.data && scheduleResponse.data?.schedule) {
//         setUserData(userResponse.data);
//         setPaymentSchedule(scheduleResponse.data.schedule);
//         setError(null);
//       } else {
//         throw new Error("Invalid data received from server");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.response?.data?.message || "Error fetching user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (paymentSchedule) {
//         console.log("Payment schedule updated:", paymentSchedule);
//     }
// }, [paymentSchedule]);


// // Update your handleUpdatePayment function
// const handleUpdatePayment = async (serialNo, emiAmount, status) => {
//   if (updateInProgress) return;
  
//   try {
//       setUpdateInProgress(true);
//       setLoadingPaymentId(serialNo); // Track which payment is updating
//       setIsLoadingUpdate(true);
//       const token = localStorage.getItem("token");
      
//       const response = await axios.patch(
//           `http://localhost:5000/api/payment/${userId}/${serialNo}`,
//           { 
//               emiAmount: Number(emiAmount),
//               status 
//           },
//           { 
//               headers: { 
//                   Authorization: `Bearer ${token}`,
//                   'Content-Type': 'application/json'
//               } 
//           }
//       );

//       if (response.data?.schedule) {
//           setPaymentSchedule(response.data.schedule);
//           console.log("Payment updated successfully");
//           await fetchUserData();
//       }

//   } catch (error) {
//       console.error("Update failed:", error);
//       setError(error.response?.data?.message || "Failed to update payment");
//       await fetchUserData();
//   } finally {
//       setUpdateInProgress(false);
//       setIsLoadingUpdate(false);
//       setLoadingPaymentId(null);
//   }
// };


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
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50">
//             <div className="text-center">
//                 <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
//                 <p className="mt-2 text-gray-600">Loading payment details...</p>
//             </div>
//         </div>
//     );
// }

//   return (
//     <div className="user-payment-details min-h-screen bg-gray-50">
//       <LandingPage />
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <button  onClick={() => navigate('/')} 
//           className="back-btn mb-6 p-2 rounded-full hover:bg-gray-200 transition-colors"
//           disabled={updateInProgress}
//         >
//           <X size={24} />
//         </button>

//         {error && (
//           <div className="error-message p-4 mb-6 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {userData && paymentSchedule && (
//           <div className="details-container bg-white rounded-lg shadow-md p-6">
//             <div className="user-info border-b pb-6">
//               <h2 className="text-2xl font-bold mb-6">{userData.name}'s Payment Details</h2>
//               <div className="details-grid grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <User className="text-blue-500" /> 
//                   {userData.name}
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <Phone className="text-blue-500" /> 
//                   {userData.mobileNumber}
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <Mail className="text-blue-500" /> 
//                   {userData.email}
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <DollarSign className="text-blue-500" /> 
//                   {formatCurrency(userData.amountBorrowed)}
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <Calendar className="text-blue-500" /> 
//                   {userData.tenure} months
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <Percent className="text-blue-500" /> 
//                   {userData.interest}%
//                 </div>
//               </div>
//             </div>

//             <h3 className="text-xl font-semibold mt-6 mb-4">Payment Schedule</h3>
//             <div className="payment-schedule overflow-x-auto">
//               <table className="w-full min-w-[600px]">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-3 text-left">Serial No.</th>
//                     <th className="p-3 text-left">Due Date</th>
//                     <th className="p-3 text-left">EMI Amount</th>
//                     <th className="p-3 text-left">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paymentSchedule.map((payment) => (
//                     <tr 
//                       key={payment.serialNo} 
//                       className={`border-t ${payment.status === 'PAID' ? 'bg-green-50' : ''}`}
//                     >
//                       <td className="p-3">{payment.serialNo}</td>
//                       <td className="p-3">{formatDate(payment.dueDate)}</td>
//                       <td className="p-3">{formatCurrency(payment.emiAmount)}</td>
//                       <td className="p-3">
//                       <select
//     value={payment.status}
//     onChange={(e) => handleUpdatePayment(payment.serialNo, payment.emiAmount, e.target.value)}
//     className={`p-2 rounded border relative ${
//         payment.status === 'PAID' 
//             ? 'bg-green-100 border-green-200' 
//             : payment.status === 'OVERDUE'
//             ? 'bg-red-100 border-red-200'
//             : 'bg-white border-gray-200'
//     } ${(updateInProgress || loadingPaymentId === payment.serialNo) ? 'opacity-50 cursor-not-allowed' : ''}`}
//     disabled={updateInProgress || loadingPaymentId === payment.serialNo}
// >
//     <option value="PENDING">
//         {loadingPaymentId === payment.serialNo ? 'Updating...' : 'Pending'}
//     </option>
//     <option value="PAID">
//         {loadingPaymentId === payment.serialNo ? 'Updating...' : 'Paid'}
//     </option>
//     <option value="OVERDUE">
//         {loadingPaymentId === payment.serialNo ? 'Updating...' : 'Overdue'}
//     </option>
// </select>
// {loadingPaymentId === payment.serialNo && (
//     <div className="absolute inset-0 flex items-center justify-center">
//         <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//     </div>
// )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserPaymentDetails;