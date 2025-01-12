import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import styled from 'styled-components';

const SignupDistributionGraphs = () => {
  const [signupCounts, setSignupCounts] = useState([]);
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
        const formattedData = [
          { name: 'Users', signups: userSignups || 0 },
          { name: 'Organizers', signups: organizerSignups || 0 },
          { name: 'Admins', signups: adminSignups || 0 },
        ];

        setSignupCounts(formattedData);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data?.msg || err.message);
        setError(err.response?.data?.msg || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchSignupCounts();
  }, []);

  if (loading) return <p>Loading signup distribution data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Section>
      <Title>Signup Count Distribution</Title>
      <GraphContainer>
        {/* Combined Chart */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={signupCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={TooltipStyle}
                cursor={TooltipCursor}
              />
              <Area
                type="monotone"
                dataKey="signups"
                fill="#9b59b6"
                stroke="none"
                fillOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#8e44ad"
                dot={false}
                strokeDasharray="3 3"
                strokeWidth={2}
              />
              <Bar
                dataKey="signups"
                fill="#6a1b9a"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Line Chart */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={signupCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={TooltipStyle}
                cursor={TooltipCursor}
              />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#8e44ad"
                strokeWidth={2}
                dot={{ stroke: '#8e44ad', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8e44ad', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </GraphContainer>
    </Section>
  );
};

// Styled Components
const Section = styled.section`
  padding: 14px;
  background-color:rgb(247, 221, 255);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin: 80px 15px 20px 15px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 24px;
  text-align: center;
`;

const GraphContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const ChartWrapper = styled.div`
  flex: 1 1 calc(50% - 20px);
  max-width: 500px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

const TooltipStyle = {
  backgroundColor: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '8px 12px',
};

const TooltipCursor = {
  stroke: '#8e44ad',
  strokeWidth: 1,
  strokeDasharray: '4 4',
};

export default SignupDistributionGraphs;
