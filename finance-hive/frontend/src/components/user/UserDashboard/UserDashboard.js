
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import LoanChart from '../UserLoanChart/LoanChart';
import Sidebar from '../UserSidebar/Sidebar';
// import TopBar from './TopBar';
import LoanForm from '../UserLoanForm/LoanForm';
import Footer from '../UserFooter/Footer';
import CompletionPage from '../UserCompletionPage/CompletionPage';

const MainContent = styled.div`
  // margin-left: 250px;
  // padding: 5px;
  height: 100vh;
  overflow-y: auto;
  background-color: rgb(255, 255, 255);
  transition: margin-left 0.3s ease;

  // @media (max-width: 768px) {
  //   margin-left: 80px;
  // }
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
  const [showCompletion, setShowCompletion] = useState(true);

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

        transformLoanDataToChartData(response.data);

        setLoanSubmitted(true);
        setShowLoanForm(false);
        setShowCompletion(false);
      })
      .catch(() => setError('Error submitting loan application'));
  };

  const handleShowLoanForm = () => {
    setShowCompletion(false);
    setShowLoanForm(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* <Sidebar userData={userData}/> */}
      {/* <TopBar /> */}

      <MainContent>
        {showCompletion && !showLoanForm && <CompletionPage />}

        {/* <CardsContainer>
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
        </ChartContainer> */}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {showLoanForm && <LoanForm onSubmit={handleLoanApplication} />}
          {loanSubmitted && <p>Your loan application has been submitted!</p>}
        </div>
        <Footer />
      </MainContent>
    </div>
  );
};

export default UserDashboard;