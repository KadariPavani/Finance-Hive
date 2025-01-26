import React, { useState } from "react";
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
      // Update the API URL to include the backend address
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
    </div>
  );
};

export default OrganizerDashboard;
