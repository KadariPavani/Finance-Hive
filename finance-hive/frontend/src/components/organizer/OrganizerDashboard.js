// import React, { useState } from "react";
// import axios from "axios";

// const OrganizerDashboard = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     password: "",
//     amountBorrowed: "",
//     tenure: "",
//     interest: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       // Update the API URL to include the backend address
//       await axios.post("http://localhost:5000/api/add-user-payment", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("User added and email sent successfully.");
//       setFormData({
//         name: "",
//         email: "",
//         mobileNumber: "",
//         password: "",
//         amountBorrowed: "",
//         tenure: "",
//         interest: "",
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Failed to add user.");
//     }
//   };

//   return (
//     <div>
//       <h1>Organizer Dashboard</h1>
//       <form onSubmit={handleSubmit}>
//         <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
//         <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
//         <input name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
//         <input name="amountBorrowed" placeholder="Amount Borrowed" value={formData.amountBorrowed} onChange={handleChange} required />
//         <input name="tenure" placeholder="Tenure" value={formData.tenure} onChange={handleChange} required />
//         <input name="interest" placeholder="Interest (%)" value={formData.interest} onChange={handleChange} required />
//         <button type="submit">Add User</button>
//       </form>
//     </div>
//   );
// };

// export default OrganizerDashboard;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const OrganizerDashboard = () => {
//   const [users, setUsers] = useState([]);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/organizer/users", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(response.data.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h1>Organizer Dashboard</h1>
//       <table border="1" style={{ width: "100%", textAlign: "left" }}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Mobile Number</th>
//             <th>Amount Borrowed</th>
//             <th>Tenure</th>
//             <th>Interest</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) =>
//             user.payments.map((payment, index) => (
//               <tr key={`${user._id}-${index}`}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.mobileNumber}</td>
//                 <td>{payment.amountBorrowed}</td>
//                 <td>{payment.tenure}</td>
//                 <td>{payment.interest}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrganizerDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";

const OrganizerDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    amountBorrowed: "",
    tenure: "",
    interest: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/organizer/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/add-user-payment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User added and email sent successfully.");
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        amountBorrowed: "",
        tenure: "",
        interest: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  return (
    <div>
      <h1>Organizer Dashboard</h1>

      {/* User Form */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input name="amountBorrowed" placeholder="Amount Borrowed" value={formData.amountBorrowed} onChange={handleChange} required />
        <input name="tenure" placeholder="Tenure" value={formData.tenure} onChange={handleChange} required />
        <input name="interest" placeholder="Interest (%)" value={formData.interest} onChange={handleChange} required />
        <button type="submit">Add User</button>
      </form>

      {/* Display Users */}
      <h2>Users Added by You</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Amount Borrowed</th>
              <th>Tenure</th>
              <th>Interest (%)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobileNumber}</td>
                <td>{user.amountBorrowed}</td>
                <td>{user.tenure}</td>
                <td>{user.interest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganizerDashboard;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import LandingPage from "../home/LandingPage/LandingPage";
// const OrganizerDashboard = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     password: "",
//     amountBorrowed: "",
//     tenure: "",
//     interest: "",
//   });

//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // Fetch users when the component mounts
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/organizer/users", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsers(response.data.users);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5000/api/add-user-payment", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("User added and email sent successfully.");
//       setFormData({
//         name: "",
//         email: "",
//         mobileNumber: "",
//         password: "",
//         amountBorrowed: "",
//         tenure: "",
//         interest: "",
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Failed to add user.");
//     }
//   };

//   return (
//     <div>
//       <LandingPage/>
//       <h1>Organizer Dashboard</h1>

//       {/* User Form */}
//       <form onSubmit={handleSubmit}>
//         <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
//         <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
//         <input name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
//         <input name="amountBorrowed" placeholder="Amount Borrowed" value={formData.amountBorrowed} onChange={handleChange} required />
//         <input name="tenure" placeholder="Tenure" value={formData.tenure} onChange={handleChange} required />
//         <input name="interest" placeholder="Interest (%)" value={formData.interest} onChange={handleChange} required />
//         <button type="submit">Add User</button>
//       </form>

//       {/* Display Users */}
//       <h2>Users Added by You</h2>
//       {users.length === 0 ? (
//         <p>No users found</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Mobile Number</th>
//               <th>Amount Borrowed</th>
//               <th>Tenure</th>
//               <th>Interest (%)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr key={index}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.mobileNumber}</td>
//                 <td>{user.amountBorrowed}</td>
//                 <td>{user.tenure}</td>
//                 <td>{user.interest}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default OrganizerDashboard;
