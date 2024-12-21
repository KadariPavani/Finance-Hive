import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const AnalyticsContainer = styled.div`
  background-color: #f8faff; /* Light blue background */
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #e3f2fd; /* Subtle border */
  position: relative;
`;

const AnalyticsHeader = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #37474f; /* Dark gray for text */
  margin-bottom: 10px;
`;

const Percentage = styled.div`
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: #1e88e5; /* Blue percentage text */
  font-weight: bold;
`;

const ToggleButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;

const ToggleButtonOption = styled.button`
  background-color: ${(props) => (props.active ? "#1e88e5" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#1e88e5")};
  border: 1px solid #1e88e5;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 12px;
  margin: 0 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.active ? "#1565c0" : "rgba(30, 136, 229, 0.1)"};
  }
`;

const Analytics = ({ paymentSchedule }) => {
  const [view, setView] = useState("daily");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log("Payment Schedule:", paymentSchedule); // Log the data to debug

    // Check if paymentSchedule exists and is an array with data
    if (paymentSchedule && paymentSchedule.length > 0) {
      const formattedData = formatData(paymentSchedule, view);
      setChartData(formattedData);
    }
  }, [paymentSchedule, view]);

  const formatData = (data, view) => {
    let labels = [];
    let values = [];
    
    // Format the data based on the view
    data.forEach(item => {
      if (view === "daily") {
        labels.push(item.date); // assuming item.date is in proper format
        values.push(item.amount); // assuming item.amount holds the value
      } else if (view === "monthly") {
        // Example transformation for monthly view
        labels.push(item.month);
        values.push(item.totalAmount);
      }
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "Payment Schedule",
          data: values,
          borderColor: "#1e88e5",
          backgroundColor: "rgba(30, 136, 229, 0.2)",
          fill: true,
        },
      ],
    };
  };

  return (
    <AnalyticsContainer>
      <AnalyticsHeader>Analytics</AnalyticsHeader>
      {chartData ? (
        <>
          <Line data={chartData} />
          <Percentage>70%</Percentage>
        </>
      ) : (
        <p>No data available</p>
      )}
      <ToggleButton>
        <ToggleButtonOption
          active={view === "daily"}
          onClick={() => setView("daily")}
        >
          Daily
        </ToggleButtonOption>
        <ToggleButtonOption
          active={view === "monthly"}
          onClick={() => setView("monthly")}
        >
          Monthly
        </ToggleButtonOption>
      </ToggleButton>
    </AnalyticsContainer>
  );
};

export default Analytics;
