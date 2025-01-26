// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const UserDashboard = () => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
//         const response = await axios.get("/api/user/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUserData(response.data);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Welcome, {userData.name}</h1>
//       <p>Email: {userData.email}</p>
//       <p>Mobile Number: {userData.mobileNumber}</p>
//       <p>Amount Borrowed: {userData.amountBorrowed}</p>
//       <p>Tenure: {userData.tenure}</p>
//       <p>Interest: {userData.interest}%</p>
//     </div>
//   );
// };

// export default UserDashboard;


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
              {userDetails.payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.amountBorrowed}</td>
                  <td>{payment.tenure}</td>
                  <td>{payment.interest}</td>
                </tr>
              ))}
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
