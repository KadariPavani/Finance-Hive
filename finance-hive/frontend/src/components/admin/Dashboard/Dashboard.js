import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components';

const DashboardCards = () => {
  const [signupCounts, setSignupCounts] = useState({
    userSignups: 0,
    organizerSignups: 0,
    adminSignups: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSignupCounts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/signup-count', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { userSignups, organizerSignups, adminSignups } = response.data;
        setSignupCounts({
          userSignups: userSignups || 0,
          organizerSignups: organizerSignups || 0,
          adminSignups: adminSignups || 0,
        });
      } catch (err) {
        console.error('Error fetching data:', err.response?.data?.msg || err.message);
        setError(err.response?.data?.msg || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchSignupCounts();
  }, []);

  if (loading) return <p>Loading signup data...</p>;
  if (error) return <p>{error}</p>;

  const generateRandomData = () => {
    let data = [];
    for (let i = 0; i < 6; i++) {
      data.push({
        name: `${i + 1}`,
        value: Math.floor(Math.random() * 100) + 1,
      });
    }
    return data;
  };

  const totalSignups = signupCounts.userSignups + signupCounts.organizerSignups + signupCounts.adminSignups;
  const totalSignupsPercentage = (totalSignups / 100) * 100;

  return (
    <Section>
      <CardsContainer>
        <Card>
          <CardTitle>Total Users</CardTitle>
          <CardValue>{signupCounts.userSignups}</CardValue>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={generateRandomData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8e44ad" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Total Organizers</CardTitle>
          <CardValue>{signupCounts.organizerSignups}</CardValue>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={generateRandomData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#9b59b6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Total Admins</CardTitle>
          <CardValue>{signupCounts.adminSignups}</CardValue>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={generateRandomData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6a1b9a" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Total Signups Percentage</CardTitle>
          <CircularProgressContainer>
            <CircularProgressbar
              value={totalSignupsPercentage}
              text={`${Math.round(totalSignupsPercentage)}%`}
              styles={{
                path: { stroke: '#8e44ad', strokeWidth: 8 },
                trail: { stroke: '#f3f4f6', strokeWidth: 8 },
                text: { fill: '#8e44ad', fontSize: '24px' },
              }}
            />
          </CircularProgressContainer>
        </Card>
      </CardsContainer>
    </Section>
  );
};

const Section = styled.section`
  padding: 20px;
  background-color: rgb(247, 221, 255);
  margin: 80px 15px 20px 15px;
`;

// const Heading = styled.h1`
//   font-size: 24px;
//   font-weight: bold;
//   margin-bottom: 20px;
//   color: #2d3748;
// `;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width:480px){
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #4a5568;
`;

const CardValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 15px;
`;

const CircularProgressContainer = styled.div`
  width: 80%;
  height: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width:480px){
    height: 80%;
  }
`;

export default DashboardCards;
