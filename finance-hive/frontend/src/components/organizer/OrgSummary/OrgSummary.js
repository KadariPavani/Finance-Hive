import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaWallet, FaPercentage, FaBuilding } from 'react-icons/fa';
import axios from 'axios';
import './OrgSummary.css'

const SummaryCards = () => {
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
  const interest = dataList.map((data) => parseFloat(data.interest));
  const amountAtOrganization = dataList.map((data) => parseFloat(data.amountAtOrganization));

  const totalAmountGivenMonthly = amountGivenMonthly.reduce((a, b) => a + b, 0);
  const totalRemainingBalance = remainingBalance.reduce((a, b) => a + b, 0);
  const totalInterest = interest.reduce((a, b) => a + b, 0);
  const totalAmountAtOrganization = amountAtOrganization.reduce((a, b) => a + b, 0);

  return (
    <section className="orgDataContainer">
      <div className="orgValueBox">
        <FaMoneyBillWave size={40} color="black" />
        <h3>Amount Given Monthly</h3>
        <p>{totalAmountGivenMonthly}</p>
      </div>
      <div className="orgValueBox">
        <FaWallet size={40} color="black" />
        <h3>Remaining Balance</h3>
        <p>{totalRemainingBalance}</p>
      </div>
      <div className="orgValueBox">
        <FaPercentage size={40} color="black" />
        <h3>Interest</h3>
        <p>{totalInterest}</p>
      </div>
      <div className="orgValueBox">
        <FaBuilding size={40} color="black" />
        <h3>Amount at Organization</h3>
        <p>{totalAmountAtOrganization}</p>
      </div>
    </section>
  );
};

export default SummaryCards;
