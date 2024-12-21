// import React from 'react';
// import styled from 'styled-components';

// // Styled components
// const DashboardContainer = styled.div`
//   padding: 30px;
//   background-color: #f5f5f5;
//   color: black;
//   transition: margin-left 0.3s ease;

//   /* Adjust margin based on sidebar width */
//   margin-left: 250px; /* Default sidebar width */
  
//   @media (max-width: 768px) {
//     margin-left: 80px; /* Adjusted sidebar width on small screens */
//   }
// `;

// const Header = styled.h1`
//   font-size: 24px;
//   margin-bottom: 20px;
//   text-align: center;

//   @media (max-width: 768px) {
//     font-size: 20px;
//   }
// `;

// const CardsContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   gap: 10px;
//   flex-wrap: wrap;
//   margin-bottom: 20px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//   }
// `;

// const Card = styled.div`
//   background-color: white;
//   border-radius: 8px;
//   padding: 20px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   flex: 1;
//   margin: 0 10px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   min-width: 150px;

//   @media (max-width: 768px) {
//     margin: 10px 0;
//   }
// `;

// const CardTitle = styled.h3`
//   font-size: 18px;
//   margin-bottom: 10px;
//   text-align: center;

//   @media (max-width: 768px) {
//     font-size: 16px;
//   }
// `;

// const CardValue = styled.p`
//   font-size: 24px;
//   margin: 0;
//   text-align: center;
// `;

// const CardChange = styled.span`
//   font-size: 14px;
//   color: green; /* or red based on positive/negative change */
//   text-align: center;
// `;

// const AnalyticsContainer = styled.div`
//   background-color: white;
//   border-radius: 8px;
//   padding: 20px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

//   @media (max-width: 768px) {
//     padding: 15px;
//   }
// `;

// const AnalyticsHeader = styled.h3`
//   font-size: 18px;
//   margin-bottom: 20px;
//   text-align: center;

//   @media (max-width: 768px) {
//     font-size: 16px;
//   }
// `;

// const Graph = styled.div`
//   height: 200px;
//   background-color: #eaeaea;
//   position: relative;

//   @media (max-width: 768px) {
//     height: 150px;
//   }
// `;

// const Percentage = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   font-size: 24px;
//   font-weight: bold;

//   @media (max-width: 768px) {
//     font-size: 20px;
//   }
// `;

// const ToggleButton = styled.div`
//   display: flex;
//   justify-content: space-around;
//   margin-top: 10px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: center;
//     gap: 5px;
//   }
// `;

// const ToggleButtonOption = styled.button`
//   background-color: #f5f5f5;
//   border: none;
//   padding: 10px 15px;
//   border-radius: 5px;
//   cursor: pointer;
//   &:hover {
//     background-color: #ddd;
//   }

//   @media (max-width: 768px) {
//     width: 100%;
//     padding: 8px;
//   }
// `;

// const Dashboard = () => {
//   return (
//     <DashboardContainer>
//       <Header>Dashboard</Header>
//       <CardsContainer>
//         <Card>
//           <CardTitle>Money taken from Org.</CardTitle>
//           <CardValue>$632,000</CardValue>
//           <CardChange>+1.12%</CardChange>
//         </Card>
//         <Card>
//           <CardTitle>To be paid Monthly</CardTitle>
//           <CardValue>$632,000</CardValue>
//           <CardChange>+1.12%</CardChange>
//         </Card>
//         <Card>
//           <CardTitle>Balance</CardTitle>
//           <CardValue>$632,000</CardValue>
//           <CardChange>+1.12%</CardChange>
//         </Card>
//         <Card>
//           <CardTitle>Interest & Org.</CardTitle>
//           <CardValue>$632,000</CardValue>
//           <CardChange>+1.12%</CardChange>
//         </Card>
//       </CardsContainer>
      
//       <AnalyticsContainer>
//         <AnalyticsHeader>Analytics</AnalyticsHeader>
//         <Graph>
//           {/* Here you can integrate your graph library (like Chart.js or Recharts) */}
//           <Percentage>91%</Percentage>
//         </Graph>
//         <ToggleButton>
//           <ToggleButtonOption>Daily</ToggleButtonOption>
//           <ToggleButtonOption>Week</ToggleButtonOption>
//           <ToggleButtonOption>Month</ToggleButtonOption>
//         </ToggleButton>
//       </AnalyticsContainer>
//     </DashboardContainer>
//   );
// };

// export default Dashboard;
