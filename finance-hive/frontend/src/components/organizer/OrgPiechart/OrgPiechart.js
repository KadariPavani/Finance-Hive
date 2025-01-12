import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import './OrgPiechart.css'

const PieChartSection = () => {
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

  if (loading) return <div className="pieChartLoading">Loading...</div>;
  if (error) return <div className="pieChartError">{error}</div>;

  const amountGivenMonthly = dataList.map((data) => parseFloat(data.amountGivenMonthly));
  const remainingBalance = dataList.map((data) => parseFloat(data.remainingBalance));
  const interest = dataList.map((data) => parseFloat(data.interest));
  const amountAtOrganization = dataList.map((data) => parseFloat(data.amountAtOrganization));

  const totalAmountGivenMonthly = amountGivenMonthly.reduce((a, b) => a + b, 0);
  const totalRemainingBalance = remainingBalance.reduce((a, b) => a + b, 0);
  const totalInterest = interest.reduce((a, b) => a + b, 0);
  const totalAmountAtOrganization = amountAtOrganization.reduce((a, b) => a + b, 0);

  const pieChartData = {
    labels: ["Amount Given Monthly", "Remaining Balance", "Interest", "Amount at Organization"],
    datasets: [
      {
        label: "Overview",
        data: [totalAmountGivenMonthly, totalRemainingBalance, totalInterest, totalAmountAtOrganization],
        backgroundColor: ["#4b3474", "#7e57c2", "#b79af1", "#a371fc"],
        hoverBackgroundColor: ["#4b3474", "#7e57c2", "#b79af1", "#a371fc"],
        borderWidth: 2,
        borderColor: "white",
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",  // Move the legend below the pie chart for better mobile responsiveness
        labels: {
          usePointStyle: true,
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const value = pieChartData.datasets[0].data[tooltipItem.dataIndex];
            const total = pieChartData.datasets[0].data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <section className="pieChartSection">
      <h2 className="pieChartTitle">Organization Analytics</h2>
      <div className="pieChartWrapper">
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </section>
  );
};

export default PieChartSection;
