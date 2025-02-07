
//-----------------UNI LANG PAGE------------------
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navigation from "../Navigation/Navigation";
// import Sidebar from "../sidebar/Sidebar";
// import "./UserDashboard.css";

// const UserDashboard = () => {
//   const [userDetails, setUserDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [nextPayment, setNextPayment] = useState(null);

//   const calculateNextPayment = (paymentSchedule) => {
//     if (!paymentSchedule || paymentSchedule.length === 0) return null;
    
//     const today = new Date();
//     const upcomingPayment = paymentSchedule.find(payment => {
//       const paymentDate = new Date(payment.paymentDate);
//       return paymentDate > today && payment.status === 'PENDING';
//     });
    
//     if (upcomingPayment) {
//       return {
//         ...upcomingPayment,
//         paymentDate: new Date(upcomingPayment.paymentDate)
//       };
//     }
    
//     return null;
//   };

//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/user-details", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       const userData = response.data.data;
      
//       if (userData.paymentSchedule) {
//         userData.paymentSchedule = userData.paymentSchedule.map(payment => ({
//           ...payment,
//           paymentDate: new Date(payment.paymentDate)
//         }));
//       }

//       setUserDetails(userData);
//       const nextPaymentInfo = calculateNextPayment(userData.paymentSchedule);
//       setNextPayment(nextPaymentInfo);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   const formatDate = (date) => {
//     if (!date) return '';
//     try {
//       return new Date(date).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch (error) {
//       console.error('Date formatting error:', error);
//       return 'Invalid Date';
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-layout">
//         <Navigation userDetails={null} onLogout={handleLogout} />
//         <Sidebar userDetails={null} onLogout={handleLogout} />
//         <main className="dashboard-main">
//           <div className="user-loading">
//             <div className="user-loading-spinner"></div>
//             <p>Loading user details...</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-layout">
//       <Navigation userDetails={userDetails} onLogout={handleLogout} />
//       <Sidebar userDetails={userDetails} onLogout={handleLogout} />
      
//       <main className="dashboard-main">
//         <div className="user-dashboard-container">
//           <div className="user-dashboard-header">
//             <h1>Dashboard Overview</h1>
//           </div>

//           {userDetails && (
//             <div className="user-content-wrapper">
//               {/* User Info Card */}
//               <div className="user-info-card">
//                 <div className="user-info-header">
//                   <h2>Personal Information</h2>
//                 </div>
//                 <div className="user-info-content">
//                   <div className="user-info-item">
//                     <span className="user-info-label">Name:</span>
//                     <span className="user-info-value">{userDetails.name}</span>
//                   </div>
//                   <div className="user-info-item">
//                     <span className="user-info-label">Email:</span>
//                     <span className="user-info-value">{userDetails.email}</span>
//                   </div>
//                   <div className="user-info-item">
//                     <span className="user-info-label">Mobile:</span>
//                     <span className="user-info-value">{userDetails.mobileNumber}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Loan Details Card */}
//               <div className="user-loan-card">
//                 <div className="user-loan-header">
//                   <h2>Loan Details</h2>
//                 </div>
//                 <div className="user-loan-content">
//                   <div className="user-loan-summary">
//                     <div className="user-loan-item">
//                       <span className="user-loan-label">Amount Borrowed:</span>
//                       <span className="user-loan-value">
//                         {formatCurrency(userDetails.amountBorrowed)}
//                       </span>
//                     </div>
//                     <div className="user-loan-item">
//                       <span className="user-loan-label">Tenure:</span>
//                       <span className="user-loan-value">{userDetails.tenure} months</span>
//                     </div>
//                     <div className="user-loan-item">
//                       <span className="user-loan-label">Interest:</span>
//                       <span className="user-loan-value">{userDetails.interest}%</span>
//                     </div>
//                     {nextPayment && (
//                       <div className="user-loan-item user-next-payment">
//                         <span className="user-loan-label">Next Payment:</span>
//                         <span className="user-loan-value">
//                           {formatCurrency(nextPayment.emiAmount)} on {formatDate(nextPayment.paymentDate)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Schedule Table */}
//               {userDetails.paymentSchedule && (
//                 <div className="user-payment-schedule">
//                   <h2>Payment Schedule</h2>
//                   <div className="user-table-wrapper">
//                     <table className="user-payment-table">
//                       <thead>
//                         <tr>
//                           <th>S.No</th>
//                           <th>Payment Date</th>
//                           <th>EMI Amount</th>
//                           <th>Principal</th>
//                           <th>Interest</th>
//                           <th>Balance</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userDetails.paymentSchedule.map((payment) => (
//                           <tr key={payment.serialNo}>
//                             <td>{payment.serialNo}</td>
//                             <td>{formatDate(payment.paymentDate)}</td>
//                             <td>{formatCurrency(payment.emiAmount)}</td>
//                             <td>{formatCurrency(payment.principal)}</td>
//                             <td>{formatCurrency(payment.interest)}</td>
//                             <td>{formatCurrency(payment.balance)}</td>
//                             <td>
//                               <span className={`user-payment-status user-status-${payment.status.toLowerCase()}`}>
//                                 {payment.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;


// // const UserDashboard = () => {
// //   const [userDetails, setUserDetails] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [nextPayment, setNextPayment] = useState(null);

// //   const calculateNextPayment = (paymentSchedule) => {
// //     if (!paymentSchedule || paymentSchedule.length === 0) return null;
    
// //     const today = new Date();
// //     const upcomingPayment = paymentSchedule.find(payment => {
// //       const paymentDate = new Date(payment.paymentDate);
// //       return paymentDate > today && payment.status === 'PENDING';
// //     });
    
// //     if (upcomingPayment) {
// //       return {
// //         ...upcomingPayment,
// //         paymentDate: new Date(upcomingPayment.paymentDate)
// //       };
// //     }
    
// //     return null;
// //   };

// //   const fetchUserDetails = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const response = await axios.get("http://localhost:5000/api/user-details", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
      
// //       const userData = response.data.data;
      
// //       // Convert all payment dates to Date objects
// //       if (userData.paymentSchedule) {
// //         userData.paymentSchedule = userData.paymentSchedule.map(payment => ({
// //           ...payment,
// //           paymentDate: new Date(payment.paymentDate)
// //         }));
// //       }

// //       setUserDetails(userData);
// //       const nextPaymentInfo = calculateNextPayment(userData.paymentSchedule);
// //       setNextPayment(nextPaymentInfo);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching user details:", error);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUserDetails();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="user-loading">
// //         <div className="user-loading-spinner"></div>
// //         <p>Loading user details...</p>
// //       </div>
// //     );
// //   }

// //   const formatDate = (date) => {
// //     if (!date) return '';
// //     try {
// //       return new Date(date).toLocaleDateString('en-IN', {
// //         year: 'numeric',
// //         month: 'long',
// //         day: 'numeric'
// //       });
// //     } catch (error) {
// //       console.error('Date formatting error:', error);
// //       return 'Invalid Date';
// //     }
// //   };

// //   const formatCurrency = (amount) => {
// //     return new Intl.NumberFormat('en-IN', {
// //       style: 'currency',
// //       currency: 'INR'
// //     }).format(amount);
// //   };

// //   return (
// //     <div className="user-dashboard-container">
// //       <div className="user-dashboard-header">
// //         <LandingPage />
// //         <h1>User Dashboard</h1>
// //       </div>

// //       {userDetails && (
// //         <div className="user-content-wrapper">
// //           {/* User Info Card */}
// //           <div className="user-info-card">
// //             <div className="user-info-header">
// //               <h2>Personal Information</h2>
// //             </div>
// //             <div className="user-info-content">
// //               <div className="user-info-item">
// //                 <span className="user-info-label">Name:</span>
// //                 <span className="user-info-value">{userDetails.name}</span>
// //               </div>
// //               <div className="user-info-item">
// //                 <span className="user-info-label">Email:</span>
// //                 <span className="user-info-value">{userDetails.email}</span>
// //               </div>
// //               <div className="user-info-item">
// //                 <span className="user-info-label">Mobile:</span>
// //                 <span className="user-info-value">{userDetails.mobileNumber}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Loan Details Card */}
// //           <div className="user-loan-card">
// //             <div className="user-loan-header">
// //               <h2>Loan Details</h2>
// //             </div>
// //             <div className="user-loan-content">
// //               <div className="user-loan-summary">
// //                 <div className="user-loan-item">
// //                   <span className="user-loan-label">Amount Borrowed:</span>
// //                   <span className="user-loan-value">
// //                     {formatCurrency(userDetails.amountBorrowed)}
// //                   </span>
// //                 </div>
// //                 <div className="user-loan-item">
// //                   <span className="user-loan-label">Tenure:</span>
// //                   <span className="user-loan-value">{userDetails.tenure} months</span>
// //                 </div>
// //                 <div className="user-loan-item">
// //                   <span className="user-loan-label">Interest:</span>
// //                   <span className="user-loan-value">{userDetails.interest}%</span>
// //                 </div>
// //                 {nextPayment && (
// //                   <div className="user-loan-item user-next-payment">
// //                     <span className="user-loan-label">Next Payment:</span>
// //                     <span className="user-loan-value">
// //                       {formatCurrency(nextPayment.emiAmount)} on {formatDate(nextPayment.paymentDate)}
// //                     </span>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Payment Schedule Table */}
// //           {userDetails.paymentSchedule && (
// //             <div className="user-payment-schedule">
// //               <h2>Payment Schedule</h2>
// //               <div className="user-table-wrapper">
// //                 <table className="user-payment-table">
// //                   <thead>
// //                     <tr>
// //                       <th>S.No</th>
// //                       <th>Payment Date</th>
// //                       <th>EMI Amount</th>
// //                       <th>Principal</th>
// //                       <th>Interest</th>
// //                       <th>Balance</th>
// //                       <th>Status</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {userDetails.paymentSchedule.map((payment) => (
// //                       <tr key={payment.serialNo}>
// //                         <td>{payment.serialNo}</td>
// //                         <td>{formatDate(payment.paymentDate)}</td>
// //                         <td>{formatCurrency(payment.emiAmount)}</td>
// //                         <td>{formatCurrency(payment.principal)}</td>
// //                         <td>{formatCurrency(payment.interest)}</td>
// //                         <td>{formatCurrency(payment.balance)}</td>
// //                         <td>
// //                           <span className={`user-payment-status user-status-${payment.status.toLowerCase()}`}>
// //                             {payment.status}
// //                           </span>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserDashboard;

//-----------------MULTI LANG PAGE------------------


import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import Navigation from "../Navigation/Navigation";

import Sidebar from "../sidebar/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import "./UserDashboard.css";

const UserDashboard = () => {
  const { t, i18n } = useTranslation();
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
    
    return upcomingPayment ? { ...upcomingPayment, paymentDate: new Date(upcomingPayment.paymentDate) } : null;
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user-details", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data.data;
      if (userData.paymentSchedule) {
        userData.paymentSchedule = userData.paymentSchedule.map(payment => ({
          ...payment,
          paymentDate: new Date(payment.paymentDate),
        }));
      }

      setUserDetails(userData);
      setNextPayment(calculateNextPayment(userData.paymentSchedule));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString(i18n.language, {
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
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!userDetails || !userDetails.paymentSchedule) return [];

    return userDetails.paymentSchedule.map(payment => ({
      name: `Payment ${payment.serialNo}`,
      dueDate: formatDate(payment.paymentDate),
      paidDate: payment.paidDate ? formatDate(payment.paidDate) : 'Not Paid',
      emiAmount: payment.emiAmount,
      principal: payment.principal,
      interest: payment.interest,
      balance: payment.balance,
      status: payment.status,
    }));
  };

  const preparePieChartData = () => {
    if (!userDetails || !userDetails.paymentSchedule) return [];

    const paid = userDetails.paymentSchedule.filter(p => p.status === 'PAID').length;
    const pending = userDetails.paymentSchedule.filter(p => p.status === 'PENDING').length;

    return [
      { name: 'Paid', value: paid },
      { name: 'Pending', value: pending },
    ];
  };

  const COLORS = ['#16a34a', '#dc2626']; // Green for Paid, Red for Pending

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navigation userDetails={null} onLogout={handleLogout} />
        <Sidebar userDetails={null} onLogout={handleLogout} />
        <main className="dashboard-main">
          <div className="user-loading">
            <div className="user-loading-spinner"></div>
            <p>{t('dashboard.loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navigation userDetails={userDetails} onLogout={handleLogout} />
      <Sidebar userDetails={userDetails} onLogout={handleLogout} />
      
      <main className="dashboard-main">
        <div className="user-dashboard-container">
          <div className="user-dashboard-header">
            <h1>{t('dashboard.overview')}</h1>
          </div>

          {userDetails && (
            <div className="user-content-wrapper">
              {/* Personal Info Card */}
              <div className="user-info-card">
                <div className="user-info-header">
                  <h2>{t('dashboard.personal_info')}</h2>
                </div>
                <div className="user-info-content">
                  <div className="user-info-item">
                    <span className="user-info-label">{t('dashboard.name')}</span>
                    <span className="user-info-value">{userDetails.name}</span>
                  </div>
                  <div className="user-info-item">
                    <span className="user-info-label">{t('dashboard.email')}</span>
                    <span className="user-info-value">{userDetails.email}</span>
                  </div>
                  <div className="user-info-item">
                    <span className="user-info-label">{t('dashboard.mobile')}</span>
                    <span className="user-info-value">{userDetails.mobileNumber}</span>
                  </div>
                </div>
              </div>

              {/* Loan Details Card */}
              <div className="user-loan-card">
                <div className="user-loan-header">
                  <h2>{t('dashboard.loan_details')}</h2>
                </div>
                <div className="user-loan-content">
                  <div className="user-loan-summary">
                    <div className="user-loan-item">
                      <span className="user-loan-label">{t('dashboard.amount_borrowed')}</span>
                      <span className="user-loan-value">
                        {formatCurrency(userDetails.amountBorrowed)}
                      </span>
                    </div>
                    <div className="user-loan-item">
                      <span className="user-loan-label">{t('dashboard.tenure')}</span>
                      <span className="user-loan-value">{userDetails.tenure} {t('dashboard.months')}</span>
                    </div>
                    <div className="user-loan-item">
                      <span className="user-loan-label">{t('dashboard.interest')}</span>
                      <span className="user-loan-value">{userDetails.interest}%</span>
                    </div>
                    {nextPayment && (
                      <div className="user-loan-item user-next-payment">
                        <span className="user-loan-label">{t('dashboard.next_payment')}</span>
                        <span className="user-loan-value">
                          {formatCurrency(nextPayment.emiAmount)} {t('common.on')} {formatDate(nextPayment.paymentDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="user-charts-section">
                {/* Pie Chart for Paid vs Pending */}
                <div className="chart-card">
                  <h3>{t('dashboard.paid_vs_pending')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={preparePieChartData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {preparePieChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart for EMI Amounts Over Time */}
                <div className="chart-card">
                  <h3>{t('dashboard.emi_trend')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="emiAmount" stroke="#2563eb" name="EMI Amount" />
                      <Line type="monotone" dataKey="principal" stroke="#16a34a" name="Principal" />
                      <Line type="monotone" dataKey="interest" stroke="#dc2626" name="Interest" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart for Due Dates and Paid Dates */}
                <div className="chart-card">
                  <h3>{t('dashboard.due_vs_paid')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="emiAmount" fill="#2563eb" name="EMI Amount" />
                      <Bar dataKey="principal" fill="#16a34a" name="Principal" />
                      <Bar dataKey="interest" fill="#dc2626" name="Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Schedule Table */}
              {userDetails.paymentSchedule && (
                <div className="user-payment-schedule">
                  <h2>{t('dashboard.payment_schedule')}</h2>
                  <div className="user-table-wrapper">
                    <table className="user-payment-table">
                      <thead>
                        <tr>
                          <th>{t('dashboard.sno')}</th>
                          <th>{t('dashboard.payment_date')}</th>
                          <th>{t('dashboard.paid_date')}</th>
                          <th>{t('dashboard.emi_amount')}</th>
                          <th>{t('dashboard.principal')}</th>
                          <th>{t('dashboard.interest')}</th>
                          <th>{t('dashboard.balance')}</th>
                          <th>{t('dashboard.status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDetails.paymentSchedule.map((payment) => (
                          <tr key={payment.serialNo}>
                            <td>{payment.serialNo}</td>
                            <td>{formatDate(payment.paymentDate)}</td>
                            <td>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</td>
                            <td>{formatCurrency(payment.emiAmount)}</td>
                            <td>{formatCurrency(payment.principal)}</td>
                            <td>{formatCurrency(payment.interest)}</td>
                            <td>{formatCurrency(payment.balance)}</td>
                            <td>
                              <span className={`user-payment-status user-status-${payment.status.toLowerCase()}`}>
                                {t(`status.${payment.status.toLowerCase()}`)}
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
      </main>
    </div>
  );
};

export default UserDashboard;

// import React, { useEffect, useState } from "react";
// import { useTranslation } from 'react-i18next';
// import axios from "axios";
// import Navigation from "../Navigation/Navigation";
// import Sidebar from "../sidebar/Sidebar";
// import "./UserDashboard.css";

// const UserDashboard = () => {
//   const { t, i18n } = useTranslation();
//   const [userDetails, setUserDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [nextPayment, setNextPayment] = useState(null);

//   const calculateNextPayment = (paymentSchedule) => {
//     if (!paymentSchedule || paymentSchedule.length === 0) return null;
    
//     const today = new Date();
//     const upcomingPayment = paymentSchedule.find(payment => {
//       const paymentDate = new Date(payment.paymentDate);
//       return paymentDate > today && payment.status === 'PENDING';
//     });
    
//     return upcomingPayment ? { ...upcomingPayment, paymentDate: new Date(upcomingPayment.paymentDate) } : null;
//   };

//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/user-details", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const userData = response.data.data;
//       if (userData.paymentSchedule) {
//         userData.paymentSchedule = userData.paymentSchedule.map(payment => ({
//           ...payment,
//           paymentDate: new Date(payment.paymentDate),
//         }));
//       }

//       setUserDetails(userData);
//       setNextPayment(calculateNextPayment(userData.paymentSchedule));
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   const formatDate = (date) => {
//     if (!date) return '';
//     try {
//       return new Date(date).toLocaleDateString(i18n.language, {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch (error) {
//       console.error('Date formatting error:', error);
//       return 'Invalid Date';
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat(i18n.language, {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-layout">
//         <Navigation userDetails={null} onLogout={handleLogout} />
//         <Sidebar userDetails={null} onLogout={handleLogout} />
//         <main className="dashboard-main">
//           <div className="user-loading">
//             <div className="user-loading-spinner"></div>
//             <p>{t('dashboard.loading')}</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-layout">
//       <Navigation userDetails={userDetails} onLogout={handleLogout} />
//       <Sidebar userDetails={userDetails} onLogout={handleLogout} />
      
//       <main className="dashboard-main">
//         <div className="user-dashboard-container">
//           <div className="user-dashboard-header">
//             <h1>{t('dashboard.overview')}</h1>
//           </div>

//           {userDetails && (
//             <div className="user-content-wrapper">
//               {/* Personal Info Card */}
//               <div className="user-info-card">
//                 <div className="user-info-header">
//                   <h2>{t('dashboard.personal_info')}</h2>
//                 </div>
//                 <div className="user-info-content">
//                   <div className="user-info-item">
//                     <span className="user-info-label">{t('dashboard.name')}</span>
//                     <span className="user-info-value">{userDetails.name}</span>
//                   </div>
//                   <div className="user-info-item">
//                     <span className="user-info-label">{t('dashboard.email')}</span>
//                     <span className="user-info-value">{userDetails.email}</span>
//                   </div>
//                   <div className="user-info-item">
//                     <span className="user-info-label">{t('dashboard.mobile')}</span>
//                     <span className="user-info-value">{userDetails.mobileNumber}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Loan Details Card */}
//               <div className="user-loan-card">
//                 <div className="user-loan-header">
//                   <h2>{t('dashboard.loan_details')}</h2>
//                 </div>
//                 <div className="user-loan-content">
//                   <div className="user-loan-summary">
//                     <div className="user-loan-item">
//                       <span className="user-loan-label">{t('dashboard.amount_borrowed')}</span>
//                       <span className="user-loan-value">
//                         {formatCurrency(userDetails.amountBorrowed)}
//                       </span>
//                     </div>
//                     <div className="user-loan-item">
//                       <span className="user-loan-label">{t('dashboard.tenure')}</span>
//                       <span className="user-loan-value">{userDetails.tenure} {t('dashboard.months')}</span>
//                     </div>
//                     <div className="user-loan-item">
//                       <span className="user-loan-label">{t('dashboard.interest')}</span>
//                       <span className="user-loan-value">{userDetails.interest}%</span>
//                     </div>
//                     {nextPayment && (
//                       <div className="user-loan-item user-next-payment">
//                         <span className="user-loan-label">{t('dashboard.next_payment')}</span>
//                         <span className="user-loan-value">
//                           {formatCurrency(nextPayment.emiAmount)} {t('common.on')} {formatDate(nextPayment.paymentDate)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Schedule Table */}
//               {userDetails.paymentSchedule && (
//                 <div className="user-payment-schedule">
//                   <h2>{t('dashboard.payment_schedule')}</h2>
//                   <div className="user-table-wrapper">
//                     <table className="user-payment-table">
//                       <thead>
//                         <tr>
//                           <th>{t('dashboard.sno')}</th>
//                           <th>{t('dashboard.payment_date')}</th>
//                           <th>{t('dashboard.paid_date')}</th>
//                           <th>{t('dashboard.emi_amount')}</th>
//                           <th>{t('dashboard.principal')}</th>
//                           <th>{t('dashboard.interest')}</th>
//                           <th>{t('dashboard.balance')}</th>
//                           <th>{t('dashboard.status')}</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userDetails.paymentSchedule.map((payment) => (
//                           <tr key={payment.serialNo}>
//                             <td>{payment.serialNo}</td>
//                             <td>{formatDate(payment.paymentDate)}</td>
//                             <td>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</td>
//                             <td>{formatCurrency(payment.emiAmount)}</td>
//                             <td>{formatCurrency(payment.principal)}</td>
//                             <td>{formatCurrency(payment.interest)}</td>
//                             <td>{formatCurrency(payment.balance)}</td>
//                             <td>
//                               <span className={`user-payment-status user-status-${payment.status.toLowerCase()}`}>
//                                 {t(`status.${payment.status.toLowerCase()}`)}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;

