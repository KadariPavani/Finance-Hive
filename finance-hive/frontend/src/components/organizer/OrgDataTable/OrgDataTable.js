import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrgDataTable.css'

const DataTableSection = () => {
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

  return (
    <section className="orgFlexContainer">
      <div className="orgTableContainer">
        <table className="orgTable">
          <thead>
            <tr>
              <th className="orgTh">Organization Name</th>
              <th className="orgTh">User Email</th>
              <th className="orgTh">Money Given</th>
              <th className="orgTh">Status</th>
              <th className="orgTh">Remaining Balance</th>
              <th className="orgTh">Date</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((data, index) => (
              <tr key={index}>
                <td className="orgTd">{data.organizationName}</td>
                <td className="orgTd">{data.organizationMail}</td>
                <td className="orgTd">{data.moneyGiven}</td>
                <td className="orgTd">
                  <span className={`orgStatus${data.status}`}>
                    {data.status === "Completed" ? "Completed ✅" : data.status === "Pending" ? "Pending ⏳" : "Failed 🕒" }
                  </span>
                </td>
                <td className="orgTd">{data.remainingBalance}</td>
                <td className="orgTd">{data.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataTableSection;
