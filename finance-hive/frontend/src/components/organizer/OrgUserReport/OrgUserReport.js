import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed
import './OrgUserReport.css'

const UserReport = () => {
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/organization'); // Replace with your API URL
        setRecentEntries(response.data);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orgUserFlexContainer">
        <h4>User Status Report</h4>
      {/* User Status Report */}
      <div className="orgInstallmentSection">
        {recentEntries.map((data, index) => (
          <div key={index} className="orgInstallmentItem">
            {/* User Avatar */}
            <div className="orgAvatar">
              <img
                src={`https://randomuser.me/api/portraits/thumb/men/${index + 1}.jpg`}
                alt={data.organizationName}
              />
            </div>
            {/* User Details and Progress */}
            <div className="orgInstallmentDetails">
              <div className="orgInstallmentHeader">
                <p className="orgName">{data.organizationName}</p>
                <p className="orgProgressPercent">
                  {(((data.interest - data.remainingBalance) / data.interest) * 100).toFixed(1)}%
                </p>
              </div>
              {/* Progress Bar */}
              <div className="orgProgressBarWrapper">
                <div
                  className="orgProgressBar"
                  style={{
                    width: `${((data.interest - data.remainingBalance) / data.interest) * 100}%`,
                    backgroundColor:
                      index % 4 === 0
                        ? "#4b3474"
                        : index % 4 === 1
                        ? " #7e57c2"
                        : index % 4 === 2
                        ? "rgb(172, 136, 234)"
                        : "#FFCE56",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReport;
