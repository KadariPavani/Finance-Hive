import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
        const response = await axios.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <p>Email: {userData.email}</p>
      <p>Mobile Number: {userData.mobileNumber}</p>
      <p>Amount Borrowed: {userData.amountBorrowed}</p>
      <p>Tenure: {userData.tenure}</p>
      <p>Interest: {userData.interest}%</p>
    </div>
  );
};

export default UserDashboard;
