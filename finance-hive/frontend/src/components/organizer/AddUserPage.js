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
    const [progress, setProgress] = useState(0);

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login if not authenticated
        }
    }, [navigate]);

    // Update progress based on filled fields
    const updateProgress = () => {
        let completedSteps = 0;
        
        // Personal Info (name)
        if (formData.name) completedSteps++;
        
        // Contact (email and mobile)
        if (formData.email && formData.mobileNumber) completedSteps++;
        
        // Financial (amount, tenure, interest)
        if (formData.amountBorrowed && formData.tenure && formData.interest) completedSteps++;
        
        // Security (password and surity)
        if (formData.password && formData.surityGiven) completedSteps++;

        setProgress((completedSteps / 4) * 100);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Update progress whenever form data changes
    useEffect(() => {
        updateProgress();
    }, [formData]);

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
            <div className="add-user-form">
                <div className="form-section">
                    <h2>{t("dashboard.add_new_user", "Add New User")}</h2>
                    <div className="progress-container">
                        <div className="progress-line">
                            <div className="progress-line-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className={`progress-step ${progress >= 25 ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Personal Info</span>
                        </div>
                        <div className={`progress-step ${progress >= 50 ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Contact</span>
                        </div>
                        <div className={`progress-step ${progress >= 75 ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Financial</span>
                        </div>
                        <div className={`progress-step ${progress >= 100 ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Security</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                                <div className="loading-dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            ) : (
                                t("dashboard.add_user", "Add User")
                            )}
                        </button>
                    </form>
                </div>
                <div className="image-section">
                    <div className="image-content">
                        <h2>Welcome to Finance Hive</h2>
                        <p>Join our platform to manage finances efficiently</p>
                        <div className="feature-list">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Secure Account Management</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Real-time Financial Tracking</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Advanced Analytics Tools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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