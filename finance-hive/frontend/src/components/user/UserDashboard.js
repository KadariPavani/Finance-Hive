// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import TopBar from './TopBar';
// import Dashboard from './Dashboard';
// import Analytics from './Analytics';
// import Transactions from './Transactions';
// import Settings from './Settings';
// import HelpCenter from './HelpCenter';
// import Cards from './Cards';
// import Expenses from './Expenses';
// import Savings from './Savings';
// import MoneyMatters from './MoneyMatters';
// import Home from './Home';
// import VerificationStatus from './VerificationStatus';
// import SeekingMoney from './SeekingMoney';
// import LoanForm from './LoanForm';
// import styled from 'styled-components';

// const MainContent = styled.div`
//   margin-left: 20px; /* Same width as the sidebar */
//   padding: 20px; /* Add some padding */
//   height: 100vh; /* Full height to avoid overflow */
//   overflow-y: auto; /* Enable scrolling for the main content */
// `;

// const UserDashboard = () => {
//   const { userId } = useParams();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showLoanForm, setShowLoanForm] = useState(false); // Track loan form visibility
//   const [loanSubmitted, setLoanSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('token');
//       console.log("Fetching data for userId:", userId);

//       try {
//         const response = await axios.get(`http://localhost:5000/user-details/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log("User data:", response.data);
//         setUserData(response.data);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.msg || 'Error fetching user data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   const handleLoanApplication = (loanData) => {
//     // Send the loan application data to the backend
//     axios.post(`http://localhost:5000/loan-application`, loanData, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     })
//       .then(response => {
//         console.log("Loan application submitted:", response.data);
//         setLoanSubmitted(true);
//         setShowLoanForm(false); // Close the form after submission
//       })
//       .catch(err => {
//         console.error("Error submitting loan application:", err);
//         setError('Error submitting loan application');
//       });
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ position: 'relative', height: '100vh' }}>
//       <Sidebar />
//       <TopBar />

//       <MainContent>
//         <div style={{
//           position: 'absolute',
//           top: '70px',
//           right: '30px',
//           textAlign: 'right',
//           background: 'rgba(255, 255, 255, 0.8)',
//           padding: '10px',
//           borderRadius: '5px',
//           boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
//           color: 'black',
//         }}>
//           {userData && (
//             <div>
//               <p>Hello! {userData.firstName}</p>
//               <p>Email: {userData.email}</p>
//             </div>
//           )}
//         </div>

//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/transactions" element={<Transactions />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/help-center" element={<HelpCenter />} />
//           <Route path="/cards" element={<Cards />} />
//           <Route path="/expenses" element={<Expenses />} />
//           <Route path="/savings" element={<Savings />} />
//           <Route path="/money-matters" element={<MoneyMatters />} />
//           <Route path="/verification-status" element={<VerificationStatus />} />
//           <Route path="/seeking-money" element={<SeekingMoney />} />
//         </Routes>

//         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//           {!loanSubmitted ? (
//             <>
//               <button onClick={() => setShowLoanForm(true)} style={{
//                 padding: '10px 20px',
//                 fontSize: '16px',
//                 backgroundColor: '#007bff',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//               }}>
//                 Apply for Loan
//               </button>
//               {showLoanForm && (
//                 <LoanForm onSubmit={handleLoanApplication} />
//               )}
//             </>
//           ) : (
//             <p>Your loan application has been submitted!</p>
//           )}
//         </div>
//       </MainContent>
//     </div>
//   );
// };

// export default UserDashboard;




// // // UserDashboard.js
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import TopBar from './TopBar';
// import Footer from './Footer';
// import Dashboard from './Dashboard';
// import Analytics from './Analytics';
// import Transactions from './Transactions';
// import Settings from './Settings'; // Fixed path for Settings
// import HelpCenter from './HelpCenter';
// import Cards from './Cards'; 
// import Expenses from './Expenses';  
// import Savings from './Savings';  
// import MoneyMatters from './MoneyMatters';  // Correctly imported
// import Home from './Home';                    // Correctly imported
// import VerificationStatus from './VerificationStatus';  // Correctly imported
// import SeekingMoney from './SeekingMoney';
// //import LoanForm from './LoanForm'; // Adjust the import path based on your project structure
// const UserDashboard = () => {
//   const { userId } = useParams(); // Extract the userId from the URL
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('token');
//       console.log("Fetching data for userId:", userId); // Debugging
  
//       try {
//         const response = await axios.get(`http://localhost:5000/user-details/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log("User data:", response.data); // Debugging
//         setUserData(response.data);
//       } catch (err) {
//         console.error(err); // Log the actual error
//         setError(err.response?.data?.msg || 'Error fetching user data');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchUserData();
//   }, [userId]);
  
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ position: 'relative', height: '100vh', padding: '20px' }}>
//       <div style={{
//         position: 'absolute',
//         top: '20px',
//         right: '20px',
//         textAlign: 'right',
//         background: 'rgba(255, 255, 255, 0.8)',
//         padding: '10px',
//         borderRadius: '5px',
//         boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
//         color:'black',
//       }}>
//         {userData && (
//           <div>
//             <p>Hello! {userData.firstName}</p>
//             <p>Email: {userData.email}</p>
//             <p>Role: {userData.role}</p>

//           </div>
//         )}
//       </div>
//       <Sidebar/>
//       <TopBar/>
//       <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/home" element={<Home />} />  {/* Route for Home */}
//             <Route path="/analytics" element={<Analytics />} />
//             <Route path="/transactions" element={<Transactions />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/help-center" element={<HelpCenter />} />
//             <Route path="/cards" element={<Cards />} />
//             <Route path="/expenses" element={<Expenses />} />
//             <Route path="/savings" element={<Savings />} />
//             <Route path="/money-matters" element={<MoneyMatters />} />  {/* Route for Money Matters */}
//             <Route path="/verification-status" element={<VerificationStatus />} />  {/* Route for Verification Status */}
//             <Route path="/seeking-money" element={<SeekingMoney />} />  {/* Route for Seeking Money */}
//           </Routes>
//         <Footer/>


//     </div>
//   );
// };

// export default UserDashboard;

// /*
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import LoanForm from './LoanForm';
// import PaymentSchedule from './PaymentSchedule'; // Assuming you have a PaymentSchedule component

// const UserDashboard = () => {
//   const { userId } = useParams(); // Extract the userId from the URL
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [loanSubmitted, setLoanSubmitted] = useState(false); // Track if loan is submitted
//   const [paymentSchedule, setPaymentSchedule] = useState([]); // State for payment schedule

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('token');
//       console.log("Fetching data for userId:", userId); // Debugging

//       try {
//         const response = await axios.get(`http://localhost:5000/user-details/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log("User data:", response.data); // Debugging
//         setUserData(response.data);

//         // Fetch the payment schedule for the user after fetching user data
//         if (response.data.loanId) { // Ensure loanId is available
//           fetchPaymentSchedule(response.data.loanId);
//         } else {
//           console.warn("No loan ID found for user"); // Debugging
//         }
//       } catch (err) {
//         console.error(err); // Log the actual error
//         setError(err.response?.data?.msg || 'Error fetching user data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchPaymentSchedule = async (loanId) => {
//       console.log("Fetching payment schedule for loan ID:", loanId); // Debugging
//       try {
//         const response = await axios.get(`http://localhost:5000/payment-schedule/${loanId}`);
//         console.log("Payment schedule data:", response.data); // Debugging
//         setPaymentSchedule(response.data);
//       } catch (err) {
//         console.error("Error retrieving payment schedule:", err); // Debugging
//         setError('Error retrieving payment schedule');
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   const handleLoanRequest = (loanData) => {
//     console.log('Loan Request Submitted:', loanData); // Debugging
//     setLoanSubmitted(true); // After submission, set loanSubmitted to true
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ position: 'relative', height: '100vh', padding: '20px' }}>
//       <div style={{
//         position: 'absolute',
//         top: '20px',
//         right: '20px',
//         textAlign: 'right',
//         background: 'rgba(255, 255, 255, 0.8)',
//         padding: '10px',
//         borderRadius: '5px',
//         boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
//         color: 'black',
//       }}>
//         {userData && (
//           <div>
//             <p>Hello! {userData.firstName}</p>
//             <p>Email: {userData.email}</p>
//             <p>Role: {userData.role}</p>
//           </div>
//         )}
//       </div>

//       {!loanSubmitted && <LoanForm onSubmit={handleLoanRequest} />}

//       {paymentSchedule.length > 0 && <PaymentSchedule data={paymentSchedule} />}
//     </div>
//   );
// };

// export default UserDashboard;
// // */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import LoanChart from './LoanChart';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Transactions from './Transactions';
import Settings from './Settings';
import HelpCenter from './HelpCenter';
import Cards from './Cards';
import Expenses from './Expenses';
import Savings from './Savings';
import MoneyMatters from './MoneyMatters';
import Home from './Home';
import VerificationStatus from './VerificationStatus';
import SeekingMoney from './SeekingMoney';
import LoanForm from './LoanForm';
import Footer from './Footer';

const MainContent = styled.div`
  margin-left: 250px;
  padding: 5px;
  height: 100vh;
  overflow-y: auto;
  background-color: #f5f5f5;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 80px;
  }
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 150px;

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const ChartContainer = styled.div`
  margin: 20px 10px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const UserDashboard = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || null);
  const [loading, setLoading] = useState(!userData);
  const [error, setError] = useState('');
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanSubmitted, setLoanSubmitted] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!userData) {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');

        try {
          const response = await axios.get(`http://localhost:5000/user-details/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
          
          // If there's existing loan data, transform it for the chart
          if (response.data.loans && response.data.loans.length > 0) {
            const latestLoan = response.data.loans[response.data.loans.length - 1];
            transformLoanDataToChartData(latestLoan);
          }
        } catch (err) {
          setError(err.response?.data?.msg || 'Error fetching user data');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, userData]);

  // const transformLoanDataToChartData = (loanData) => {
  //   if (loanData && loanData.paymentSchedule) {
  //     const transformedData = loanData.paymentSchedule.map(payment => ({
  //       month: new Date(payment.date).toLocaleString('default', { month: 'short' }).toUpperCase(),
  //       amount: payment.expectedAmount,
  //       actualPayment: payment.status === 'Done' ? payment.amount : null
  //     }));
  //     setChartData(transformedData);
  //   }
  // };

  const transformLoanDataToChartData = (loanData) => {
    if (loanData && loanData.paymentSchedule) {
      const transformedData = loanData.paymentSchedule.map(payment => ({
        month: new Date(payment.date).toLocaleString('default', { month: 'short' }).toUpperCase(),
        day: new Date(payment.date).getDate(),
        amount: payment.expectedAmount,
      }));
      setChartData(transformedData);
    }
  };
  

  const handleLoanApplication = (loanData) => {
    axios
      .post(`http://localhost:5000/loan-application`, loanData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        const updatedUserData = {
          ...userData,
          loans: [...(userData.loans || []), loanData],
        };
        setUserData(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Transform and set chart data
        transformLoanDataToChartData(response.data);
        
        setLoanSubmitted(true);
        setShowLoanForm(false);
      })
      .catch(() => setError('Error submitting loan application'));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Sidebar userData={userData} />
      <TopBar />

      <MainContent>
        <Header>Dashboard</Header>

        <CardsContainer>
          <Card>
            <h3>Money taken from Org.</h3>
            <p>${userData?.moneyTaken || 0}</p>
          </Card>
          <Card>
            <h3>To be paid Monthly</h3>
            <p>${userData?.monthlyPayment || 0}</p>
          </Card>
          <Card>
            <h3>Balance</h3>
            <p>${userData?.balance || 0}</p>
          </Card>
          <Card>
            <h3>Interest & Org.</h3>
            <p>${userData?.interest || 0}</p>
          </Card>
        </CardsContainer>

        <ChartContainer>
          <LoanChart data={chartData} />
        </ChartContainer>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/money-matters" element={<MoneyMatters />} />
          <Route path="/verification-status" element={<VerificationStatus />} />
          <Route path="/seeking-money" element={<SeekingMoney />} />
        </Routes>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {!loanSubmitted ? (
            <>
              <button
                onClick={() => setShowLoanForm(true)}
                style={{
                  padding: '10px 20px',
                  margin: '20px',
                  fontSize: '16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Apply for Loan
              </button>
              {showLoanForm && <LoanForm onSubmit={handleLoanApplication} />}
            </>
          ) : (
            <p>Your loan application has been submitted!</p>
          )}
        </div>
        <Footer/>
      </MainContent>
    </div>
  );
};

export default UserDashboard;