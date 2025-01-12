import React, { useState } from "react";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    loanTaken: "",
    paidAmount: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Make sure the backend URL is correct
      const response = await fetch("http://localhost:5000/api/profiles/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message || "Profile form submitted successfully!");
      } else if (response.status === 404) {
        setErrorMessage("Endpoint not found. Please check your backend.");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to submit form. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Ensure the backend is running and try again.");
      console.error("Error submitting form:", error);
    }
  };

  const styles = {
    container: {
      width: "50%",
      margin: "auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    heading: {
      textAlign: "center",
      color: "#333",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "#4caf50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
    },
    message: {
      textAlign: "center",
      marginTop: "15px",
      color: "green",
    },
    error: {
      textAlign: "center",
      marginTop: "15px",
      color: "red",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Profile Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="firstName" style={styles.label}>
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="lastName" style={styles.label}>
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="loanTaken" style={styles.label}>
            Loan Taken:
          </label>
          <input
            type="number"
            id="loanTaken"
            name="loanTaken"
            value={formData.loanTaken}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="paidAmount" style={styles.label}>
            Paid Amount:
          </label>
          <input
            type="number"
            id="paidAmount"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
      {successMessage && <p style={styles.message}>{successMessage}</p>}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default ProfileForm;