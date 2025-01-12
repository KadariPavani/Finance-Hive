import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Form.css"; // Add form-specific styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";

const OrganizationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationMail: "",
    date: "",
    moneyGiven: "",
    status: "",
    amountAtOrganization: "",
    amountGivenMonthly: "",
    remainingBalance: "",
    interest: "",
  });

  const [pendingCount, setPendingCount] = useState(0); // Track the number of "Pending" submissions for the same email

  useEffect(() => {
    if (formData.organizationMail && formData.status === "Pending") {
      const count = JSON.parse(localStorage.getItem(formData.organizationMail)) || 0;
      setPendingCount(count);
    }
  }, [formData.organizationMail, formData.status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Ensure that the value doesn't exceed 100000 for number fields
    if (name === "moneyGiven" || name === "amountAtOrganization" || name === "amountGivenMonthly" || name === "remainingBalance" || name === "interest") {
      if (value > 100000) {
        return; // Ignore the input if it exceeds 100000
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.status === "Pending") {
      const newCount = pendingCount + 1;
      localStorage.setItem(formData.organizationMail, JSON.stringify(newCount));
      setPendingCount(newCount);
    }

    try {
      await axios.post("http://localhost:5000/api/organization", formData);
      alert("Data saved successfully!");
      setFormData({
        organizationName: "",
        organizationMail: "",
        date: "",
        moneyGiven: "",
        status: "",
        amountAtOrganization: "",
        amountGivenMonthly: "",
        remainingBalance: "",
        interest: "",
      });
      navigate("/organization");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  return (
    <div className="background-container">
      <div className="orgFormContainer">
        <h1 className="hello">Organization Form</h1>
        <form onSubmit={handleSubmit} className="orgOrganizationForm">
          <label>
            Organization Name:
            <select
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
            >
              <option value="">Select Organization</option>
              <option value="Khub">Khub</option>
              <option value="GCC">GCC</option>
              <option value="Toastmaster">Toastmaster</option>
            </select>
          </label>

          <label>
            User email:
            <input
              type="email"
              name="organizationMail"
              value={formData.organizationMail}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Money Given:
            <input
              type="number"
              name="moneyGiven"
              value={formData.moneyGiven}
              onChange={handleChange}
              max="100000"
              required
            />
          </label>

          <label>
            Status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              {pendingCount >= 3 ? (
                <option value="Failed">
                  <FontAwesomeIcon icon={faExclamationCircle} /> Failed
                </option>
              ) : (
                <>
                  <option value="Completed">
                    <FontAwesomeIcon icon={faCheckCircle} /> Completed
                  </option>
                  <option value="Pending">
                    <FontAwesomeIcon icon={faHourglassHalf} /> Pending
                  </option>
                  <option value="Failed">
                    <FontAwesomeIcon icon={faExclamationCircle} /> Failed
                  </option>
                </>
              )}
            </select>
          </label>

          <label>
            Amount at Organization:
            <input
              type="number"
              name="amountAtOrganization"
              value={formData.amountAtOrganization}
              onChange={handleChange}
              max="100000"
              required
            />
          </label>

          <label>
            Amount Given Monthly:
            <input
              type="number"
              name="amountGivenMonthly"
              value={formData.amountGivenMonthly}
              onChange={handleChange}
              max="100000"
              required
            />
          </label>

          <label>
            Remaining Balance:
            <input
              type="number"
              name="remainingBalance"
              value={formData.remainingBalance}
              onChange={handleChange}
              max="100000"
              required
            />
          </label>

          <label>
            Interest:
            <input
              type="number"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              max="100000"
              required
            />
          </label>

          <button type="submit" className="orgSubmitButton">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm;
