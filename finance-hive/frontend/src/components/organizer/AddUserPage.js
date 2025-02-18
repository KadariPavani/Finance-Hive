import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Modal from "../Modal/Modal";
import "./AddUserPage.css"; // Import the CSS file for styling

const AddUserPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        amountBorrowed: "",
        tenure: "",
        interest: "",
        surityGiven: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login if not authenticated
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.mobileNumber ||
            !formData.password ||
            !formData.amountBorrowed ||
            !formData.tenure ||
            !formData.interest ||
            !formData.surityGiven
        ) {
            setIsSuccess(false);
            setModalMessage(t("dashboard.failed_to_add_user", "Failed to add user. Please fill all fields."));
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
            return;
        }

        setIsSubmitting(true); // Start loading

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            await axios.post("http://localhost:5000/api/add-user-payment", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsSuccess(true);
            setModalMessage("User added successfully!");
            setFormData({
                name: "",
                email: "",
                mobileNumber: "",
                password: "",
                amountBorrowed: "",
                tenure: "",
                interest: "",
                surityGiven: "",
            });
        } catch (error) {
            setIsSuccess(false);
            setModalMessage(error.response?.data?.message || "Failed to add user");
        } finally {
            setIsSubmitting(false); // Stop loading
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }
    };

    return (
        <div className="add-user-page">
            <h2>{t("dashboard.add_new_user", "Add New User")}</h2>
            <form onSubmit={handleSubmit} className="add-user-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>{t("dashboard.name", "Name")}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("dashboard.email", "Email")}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("dashboard.mobile", "Mobile")}</label>
                        <input
                            type="text"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("dashboard.password", "Password")}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("dashboard.amount_borrowed", "Amount Borrowed")}</label>
                        <input
                            type="number"
                            name="amountBorrowed"
                            value={formData.amountBorrowed}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("dashboard.tenure", "Tenure")}</label>
                        <input
                            type="number"
                            name="tenure"
                            value={formData.tenure}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("dashboard.interest", "Interest")}</label>
                        <input
                            type="number"
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("dashboard.surity_given", "Surity Given")}</label>
                        <input
                            type="text"
                            name="surityGiven"
                            value={formData.surityGiven}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className={`submit-btn ${isSubmitting ? "loading" : ""}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="button-content">
                            <span className="spinner"></span>
                            {t("dashboard.adding_user", "Adding User...")}
                        </span>
                    ) : (
                        t("dashboard.add_user", "Add User")
                    )}
                </button>
            </form>

            {showModal && (
                <Modal
                    show={showModal}
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                    isError={!isSuccess}
                />
            )}
        </div>
    );
};

export default AddUserPage;