import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './OrgLineChart.css'

const LineChartSection = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/organization');
        setDataList(response.data);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const amountGivenMonthly = dataList.map((data) => parseFloat(data.amountGivenMonthly));
  const remainingBalance = dataList.map((data) => parseFloat(data.remainingBalance));

  const graphData = {
    labels: dataList.map((data) => data.organizationName),
    datasets: [
      {
        label: "Amount Given Monthly",
        data: amountGivenMonthly,
        backgroundColor: "rgba(189, 156, 247, 0.3)",
        borderColor: "#7e57c2",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Remaining Balance",
        data: remainingBalance,
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        borderColor: "#4bc0c0",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <section className="orgAnalyticsChartWrapper">
      <Line data={graphData} options={{ maintainAspectRatio: true,maintainAspectRatio: false, // Allows the chart to fill the container
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
 }} />
    </section>
  );
};

export default LineChartSection;
