 

// src/LoginRegisterForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoginRegisterForm.css';
import { useNavigate,Link } from 'react-router-dom';

const LoginRegisterForm = ({ show, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    role: 'User',
    email: '',
    firstName: '',
    lastName: '',
    userId: '',
    mobileNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [show]);

  const toggleSignup = () => {
    setIsSignup(true);
    resetForm();
  };

  const toggleLogin = () => {
    setIsSignup(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      role: 'User',
      email: '',
      firstName: '',
      lastName: '',
      userId: '',
      mobileNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

  const validateEmail = (email) => /\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { role, email, firstName, lastName, userId, mobileNumber, address, password, confirmPassword } = formData;

    if (!validatePhoneNumber(mobileNumber)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please use a valid Gmail address (e.g., example@gmail.com)');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const url = isSignup ? 'https://finance-hive.onrender.com/signup' : 'https://finance-hive.onrender.com/login';

    try {
      const response = await axios.post(url, formData);

      if (response && response.data) {
        const data = response.data;
        

        if (isSignup) {
          alert('User registered successfully');
          localStorage.setItem('userId', data.userId);
          resetForm();
        } else {
          const { token, userId } = data;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          alert('Login successful');
          resetForm();

          if (role === 'User') {
            navigate(`/user-dashboard/${data.userId}`, { state: { userId: data.userId, role: data.role } });
          } else if (role === 'Organizer') {
            navigate(`/organizer-dashboard/${data.userId}`, { state: { userId: data.userId, role: data.role } });
          } else if (role === 'Admin') {
            navigate(`/admin-dashboard/${data.userId}`, { state: { userId: data.userId, role: data.role } });
          }
        }

        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error(error);
      // alert(error.response?.data?.msg || 'An error occurred. Please try again.');
      resetForm();
    }
  };

  return (
    <div className="app">
      <section className={`home ${show ? 'show' : ''}`}>
        <div className={`openform-form_container ${isSignup ? 'active' : ''}`}>
        <Link to="/" onClick={onClose}>
  <i className="uil uil-times openform-form_close"></i>
</Link>
          {!isSignup ? (
            <div className="openform-login_layout">
              {/* Left side for the image */}
              <div className="openform-login_image">
                <img src="https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg" alt="Login Illustration" />
              </div>

              {/* Right side for the login form */}
              <div className="openform-form openform-login_form">
                <form onSubmit={handleSubmit}>
                  <h2>Login</h2>
                  <div className="openform-role_selection">
                    <select id="role" name="role" value={formData.role} onChange={handleInputChange} required>
                      <option value="User">User</option>
                      <option value="Organizer">Organizer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="openform-input_box">
                    <input
                      type="email"
                      placeholder="Email Id"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-envelope-alt email"></i>
                  </div>
                  <div className="openform-input_box">
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    /> 
                     <i className="uil uil-phone password"></i>
                  </div>
                  <div className="openform-input_box">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-lock password"></i>
                  </div>
                  <div className="openform-option_field">
                    <span className="openform-checkbox">
                      <input type="checkbox" id="check" />
                      <label htmlFor="check">Remember me</label>
                    </span>
                    <a href="/user-dashboard/:userId/settings" className="forgot_pw">Forgot password?</a>
                  </div>
                  <button type="submit" className="openform-button">
                    Login Now
                  </button>
                  <div className="openform-login_signup">
                    Don't have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleSignup(); }}>Signup</a>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="openform-signup_layout">
            {/* Left side for the image */}
            <div className="openform-signup_image">
              <img src="https://media.istockphoto.com/id/1305268276/vector/registration-abstract-concept-vector-illustration.jpg?s=612x612&w=0&k=20&c=nfvUbHjcNDVIPdWkaxGx0z0WZaAEuBK9SyG-aIqg2-0=" alt="Signup Illustration" />
            </div>
          
            {/* Right side for the signup form */}
            <div className="openform-form openform-signup_form">
              <form onSubmit={handleSubmit}>
                <h2>Signup</h2>
                <div className="openform-role_selection">
                  {/* <select id="role" name="role" value={formData.role} onChange={handleInputChange} required> */}
                    {/* <option value="User">User</option> */}
                    {/* Uncomment if needed */}
                    {/* <option value="Organizer">Organizer</option> */}
                    {/* <option value="Admin">Admin</option> */}
                  {/* </select> */}
                </div>
                <div className="openform-input_box">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <i className="uil uil-envelope-alt email"></i>
                </div>
                <div className="openform-input_row">
                  <div className="openform-input_box">
                    <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-user-square email"></i>
                  </div>
                  <div className="openform-input_box">
                    <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-user-square email"></i>
                  </div>
                </div>
                <div className="openform-input_row">
                  <div className="openform-input_box">
                    <input
                      type="text"
                      placeholder="User ID"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-user-circle email"></i>
                  </div>
                  <div className="openform-input_box">
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-phone password"></i>
                  </div>
                </div>
                <div className="openform-input_box">
                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  <i className="uil uil-home email"></i>
                </div>
                <div className="openform-input_row">
                  <div className="openform-input_box">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-lock password"></i>
                  </div>
                  <div className="openform-input_box">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <i className="uil uil-lock password"></i>
                  </div>
                </div>
                <button type="submit" className="openform-button">
                  Signup Now
                </button>
                <div className="openform-login_signup">
                  Already have an account?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleLogin(); }}>Login</a>
                </div>
              </form>
            </div>
          </div>
          
          )}
        </div>
      </section>
    </div>
  );
};

export default LoginRegisterForm;
