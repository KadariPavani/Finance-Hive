import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {userDetails ? (
        <div>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Mobile Number: {userDetails.mobileNumber}</p>
          <h2>Payments</h2>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>Amount Borrowed</th>
                <th>Tenure</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userDetails.amountBorrowed}</td>
                <td>{userDetails.tenure}</td>
                <td>{userDetails.interest}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserDashboard;
