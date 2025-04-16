import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck, FaSpinner, FaTimes, FaRupeeSign, FaCalendar, FaPercent, FaShieldAlt } from 'react-icons/fa';
import Modal from "../Modal/Modal";
import "./AddUserPage.css";

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

    const [validations, setValidations] = useState({
        name: false,
        email: false,
        mobile: false,
        password: false,
        amount: false,
        tenure: false,
        interest: false,
        surity: false
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);

    // Validation functions
    const isValidName = (name) => name.trim().length >= 2;
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidMobile = (number) => /^\d{10}$/.test(number);
    const isValidPassword = (password) => password.length >= 6;
    const isValidAmount = (amount) => amount > 0;
    const isValidTenure = (tenure) => tenure > 0;
    const isValidInterest = (interest) => interest > 0 && interest <= 100;
    const isValidSurity = (surity) => surity.trim().length > 0;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const updateProgress = () => {
        const completedSteps = Object.values(validations).filter(v => v).length;
        setProgress((completedSteps / 8) * 100);
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return isValidName(value);
            case 'email':
                return isValidEmail(value);
            case 'mobileNumber':
                return isValidMobile(value.replace(/\D/g, ''));
            case 'password':
                return isValidPassword(value);
            case 'amountBorrowed':
                return isValidAmount(Number(value));
            case 'tenure':
                return isValidTenure(Number(value));
            case 'interest':
                return isValidInterest(Number(value));
            case 'surityGiven':
                return isValidSurity(value);
            default:
                return false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Special handling for mobile number
        if (name === 'mobileNumber') {
            processedValue = value.replace(/\D/g, '').slice(0, 10);
        }
        // Special handling for numeric fields
        else if (['amountBorrowed', 'tenure', 'interest'].includes(name)) {
            if (value === '' || value < 0) {
                processedValue = '';
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        const validationKey = name === 'mobileNumber' ? 'mobile' : 
                            name === 'amountBorrowed' ? 'amount' :
                            name === 'surityGiven' ? 'surity' : name;

        setValidations(prev => ({
            ...prev,
            [validationKey]: validateField(name, processedValue)
        }));
    };

    useEffect(() => {
        updateProgress();
    }, [validations]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Object.values(validations).every(v => v)) {
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const mobileWithPrefix = formData.mobileNumber.startsWith('+91') 
                ? formData.mobileNumber 
                : `+91${formData.mobileNumber}`;

            const response = await axios.post(
                "https://finance-hive.onrender.com/api/add-user-payment",
                {
                    ...formData,
                    mobileNumber: mobileWithPrefix
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsSuccess(true);
            setModalMessage(t("dashboard.user_added_successfully"));
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
            setValidations({
                name: false,
                email: false,
                mobile: false,
                password: false,
                amount: false,
                tenure: false,
                interest: false,
                surity: false
            });

            // Navigate to organizer dashboard after successful addition
            navigate("/organizer");
        } catch (error) {
            setIsSuccess(false);
            setModalMessage(error.response?.data?.message || t("dashboard.failed_to_add_user"));
        } finally {
            setIsSubmitting(false);
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
        }
    };

    return (
        <div className="add-user-page">
            <div className="add-user-form">
                <div className="form-section">
                    <button className="close-btn" onClick={() => navigate("/organizer")}>
                        <FaTimes />
                    </button>
                    <h2>{t("dashboard.add_new_user")}</h2>
                    <div className="progress-container">
                        <div className="progress-line">
                            <div className="progress-line-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className={`progress-step ${validations.name && validations.email ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Personal Info</span>
                        </div>
                        <div className={`progress-step ${validations.mobile && validations.password ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Contact</span>
                        </div>
                        <div className={`progress-step ${validations.amount && validations.tenure && validations.interest ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Financial</span>
                        </div>
                        <div className={`progress-step ${validations.surity ? 'completed' : ''}`}>
                            <div className="progress-dot"></div>
                            <span className="progress-label">Security</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className={`form-group ${validations.name ? 'valid' : ''}`}>
                                <label>{t("dashboard.name")}</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validations.name && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>

                            <div className={`form-group ${validations.email ? 'valid' : ''}`}>
                                <label>{t("dashboard.email")}</label>
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validations.email && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>

                            <div className={`form-group ${validations.mobile ? 'valid' : ''}`}>
                                <label>{t("dashboard.mobile")}</label>
                                <div className="input-wrapper">
                                    <FaPhone className="input-icon" />
                                    <span className="mobile-prefix">+91</span>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        className="mobile-input"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validations.mobile && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>

                            <div className={`form-group ${validations.password ? 'valid' : ''}`}>
                                <label>{t("dashboard.password")}</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Minimum 6 characters"
                                    />
                                    {validations.password && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>

                            <div className={`form-group ${validations.amount ? 'valid' : ''}`}>
                                <label>{t("dashboard.amount_borrowed")}</label>
                                <div className="input-wrapper">
                                    <FaRupeeSign className="input-icon" />
                                    <input
                                        type="number"
                                        name="amountBorrowed"
                                        value={formData.amountBorrowed}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                    {validations.amount && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>

                            <div className={`form-group ${validations.tenure ? 'valid' : ''}`}>
                                <label>{t("dashboard.tenure")}</label>
                                <div className="input-wrapper">
                                    <FaCalendar className="input-icon" />
                                    <input
                                        type="number"
                                        name="tenure"
                                        value={formData.tenure}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        placeholder="Months"
                                    />
                                    {validations.tenure && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>

                            <div className={`form-group ${validations.interest ? 'valid' : ''}`}>
                                <label>{t("dashboard.interest")}</label>
                                <div className="input-wrapper">
                                    <FaPercent className="input-icon" />
                                    <input
                                        type="number"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        required
                                        placeholder="0-100%"
                                    />
                                    {validations.interest && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>

                            <div className={`form-group ${validations.surity ? 'valid' : ''}`}>
                                <label>{t("dashboard.surity_given")}</label>
                                <div className="input-wrapper">
                                    <FaShieldAlt className="input-icon" />
                                    <input
                                        type="text"
                                        name="surityGiven"
                                        value={formData.surityGiven}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validations.surity && <FaCheck className="validation-icon success" />}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn ${isSubmitting ? 'loading' : ''} ${Object.values(validations).every(v => v) ? 'enabled' : ''}`}
                            disabled={isSubmitting || !Object.values(validations).every(v => v)}
                        >
                            {isSubmitting ? (
                                <div className="loading-dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            ) : (
                                t("dashboard.add_user")
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