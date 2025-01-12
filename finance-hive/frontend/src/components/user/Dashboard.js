import React from 'react';
import { useParams } from 'react-router-dom';
import SavingsForm from './Savings'; // Assuming SavingsForm is in the same directory
import ExpensesComponent from './FinanceForm'; // Assuming ExpensesComponent is in the same directory
import TransactionsComponent from './Transactions'; // Assuming TransactionsComponent is in the same directory

const Dashboard = () => {
  // Get userId from the URL
  const { userId } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      {/* <h1>Financial Dashboard for User {userId}</h1> */}
<h1>USER Personal finance Dashboard</h1>
      {/* Savings Component */}
      <div style={{ marginBottom: '40px' }}>
        {/* <h2>Savings Plans</h2> */}
        <SavingsForm userId={userId} />
      </div>
      {/* Transactions Component */}
      <div>
        {/* <h2>Transactions</h2> */}
        <TransactionsComponent userId={userId} />
      </div>
      {/* Expenses Component */}
      <div style={{ marginBottom: '40px' }}>
        {/* <h2>Expenses</h2> */}
        <ExpensesComponent userId={userId} />
      </div>


    </div>
  );
};

export default Dashboard;
