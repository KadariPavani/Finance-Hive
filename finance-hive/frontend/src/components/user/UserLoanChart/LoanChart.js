import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled from 'styled-components';

const ChartWrapper = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-left: 10px;
`;

const CustomTooltip = styled.div`
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;

  .label {
    font-weight: 600;
    margin-bottom: 8px;
  }

  .value {
    color: #666;
  }
`;

const LoanChart = ({ data }) => {
  // Default data if none provided
  const defaultData = [
    { name: 'JAN', expected: 35, actual: 30 },
    { name: 'FEB', expected: 38, actual: 32 },
    { name: 'MAR', expected: 42, actual: 38 },
    { name: 'APR', expected: 40, actual: 35 },
    { name: 'MAY', expected: 45, actual: 40 },
    { name: 'JUN', expected: 48, actual: 42 },
    { name: 'JUL', expected: 50, actual: 45 },
    { name: 'AUG', expected: 52, actual: 48 },
    { name: 'SEP', expected: 55, actual: 50 },
    { name: 'OCT', expected: 58, actual: 52 },
    { name: 'NOV', expected: 60, actual: 55 },
    { name: 'DEC', expected: 62, actual: 58 }
  ];

  const chartData = data?.length > 0 ? data : defaultData;

  const CustomizedTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <div className="label">{label}</div>
          {payload.map((pld) => (
            <div key={pld.name} className="value" style={{ color: pld.color }}>
              {pld.name}: ${pld.value}
            </div>
          ))}
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartWrapper>
      <ChartTitle>Payment Timeline</ChartTitle>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f0f0f0"
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              padding={{ top: 20 }}
            />
            <Tooltip content={<CustomizedTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
            />
            <Line
              name="Expected Payment"
              type="monotone"
              dataKey="expected"
              stroke="#2196F3"
              strokeWidth={3}
              dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              name="Actual Payment"
              type="monotone"
              dataKey="actual"
              stroke="#4CAF50"
              strokeWidth={3}
              dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};

export default LoanChart;