// src/LoginRegisterForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoginRegisterForm.css';
import { useNavigate } from 'react-router-dom';

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

  // Phone number validation (10 digits)
  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

  // Email validation for @gmail.com
  const validateEmail = (email) => /\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(email);



const handleSubmit = async (e) => {
  e.preventDefault();
  const { role, email, firstName, lastName, userId, mobileNumber, address, password, confirmPassword } = formData;

    // Validate phone number
    if (!validatePhoneNumber(mobileNumber)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate email domain (@gmail.com)
    if (!validateEmail(email)) {
      alert('Please use a valid Gmail address (e.g., example@gmail.com)');
      return;
    }
  // Ensure passwords match if signing up
  if (isSignup && password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // Updated URL for API requests
  const url = isSignup ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';

  try {
    const response = await axios.post(url, formData);

    // Debug: log the response object to check its structure
    console.log(response);

    // Ensure that response and data are defined before accessing properties
    if (response && response.data) {
      const data = response.data;

      if (isSignup) {
        alert('User registered successfully');
        resetForm(); // Clear the form after successful signup
      } else {
        // Handle JWT token and navigation after login
        const { token } = data;

        // Store the token in local storage
        localStorage.setItem('token', token);

        alert('Login successful');
        resetForm(); // Clear the form after successful login

        // Navigate to the user's homepage/dashboard
        if (role === 'User') {
          navigate(`/user-dashboard/${data.userId}`, { state: { userId: data.userId, role: data.role } });
        } else if (role === 'Organizer') {
          navigate(`/organizer-dashboard/${data.userId}`, { state: { userId: data.userId, role: data.role } });
        } else if (role === 'Admin') {
          navigate(`/admin-dashboard/${data.userId}`, { state: { userId: data.userId, role: data.role } });
        }
        
        
      }

      onClose(); // Close the form modal
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    // Improved error handling with detailed message
    console.error(error);
    alert(error.response?.data?.msg || 'An error occurred. Please try again.');
    resetForm(); // Clear the form after an error
  }
};


  return (
    <div className="app">
      <section className={`home ${show ? 'show' : ''}`}>
        <div className={`openform-form_container ${isSignup ? 'active' : ''}`}>
          <i className="uil uil-times openform-form_close" onClick={onClose}></i>
          {isSignup ? (
            <div className="openform-form openform-signup_form">
              <form onSubmit={handleSubmit}>
                <h2>Signup</h2>
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
          ) : (
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
                  <a href="#" className="forgot_pw">Forgot password?</a>
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
          )}
        </div>
      </section>
    </div>
  );
};

export default LoginRegisterForm;

/*/ src/LoginRegisterForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoginRegisterForm.css';
import { useNavigate } from 'react-router-dom';

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

const handleSubmit = async (e) => {
  e.preventDefault();
  const { role, email, firstName, lastName, userId, mobileNumber, address, password, confirmPassword } = formData;

  // Ensure passwords match if signing up
  if (isSignup && password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // Updated URL for API requests
  const url = isSignup ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';

  try {
    const response = await axios.post(url, formData);

    // Debug: log the response object to check its structure
    console.log(response);

    // Ensure that response and data are defined before accessing properties
    if (response && response.data) {
      const data = response.data;

      if (isSignup) {
        alert('User registered successfully');
        resetForm(); // Clear the form after successful signup
      } else {
        // Handle JWT token and navigation after login
        const { token } = data;

        // Store the token in local storage
        localStorage.setItem('token', token);

        alert('Login successful');
        resetForm(); // Clear the form after successful login

        // Navigate to the user's homepage/dashboard
        if (role === 'User') {
          navigate('/user-dashboard', { state: { userId: data.userId, role: data.role } });
        } else if (role === 'Organizer') {
          navigate('/organizer-dashboard', { state: { userId: data.userId, role: data.role } });
        } else if (role === 'Admin') {
          navigate('/admin-dashboard', { state: { userId: data.userId, role: data.role } });
        }
        
      }

      onClose(); // Close the form modal
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    // Improved error handling with detailed message
    console.error(error);
    alert(error.response?.data?.msg || 'An error occurred. Please try again.');
    resetForm(); // Clear the form after an error
  }
};


  return (
    <div className="app">
      <section className={`home ${show ? 'show' : ''}`}>
        <div className={`openform-form_container ${isSignup ? 'active' : ''}`}>
          <i className="uil uil-times openform-form_close" onClick={onClose}></i>
          {isSignup ? (
            <div className="openform-form openform-signup_form">
              <form onSubmit={handleSubmit}>
                <h2>Signup</h2>
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
          ) : (
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
                  <a href="#" className="forgot_pw">Forgot password?</a>
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
          )}
        </div>
      </section>
    </div>
  );
};

export default LoginRegisterForm;
*/
/*
// src/LoginRegisterForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoginRegisterForm.css';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { role, email, firstName, lastName, userId, mobileNumber, address, password, confirmPassword } = formData;

    // Check if passwords match for signup
    if (isSignup && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Updated URL for API requests
    const url = isSignup ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';

    try {
      const response = await axios.post(url, formData);
      const data = response.data;
      if (isSignup) {
        alert('User registered successfully');
        resetForm(); // Clear the form after successful signup

      } else {
        // Handle JWT token
        const { token } = data;
        // Store the token in local storage
        localStorage.setItem('token', token);
        alert('Login successful');
        // Navigate to the homepage or user dashboard
        resetForm(); // Clear the form after successful login

        navigate('/home'); // Update to your target route
      }
      onClose();
    } catch (error) {
      alert(error.response.data.msg || 'An error occurred');
      resetForm(); // Clear the form after successful login

    }
  };

  return (
    <div className="app">
      <section className={`home ${show ? 'show' : ''}`}>
        <div className={`openform-form_container ${isSignup ? 'active' : ''}`}>
          <i className="uil uil-times openform-form_close" onClick={onClose}></i>
          {isSignup ? (
            <div className="openform-form openform-signup_form">
              <form onSubmit={handleSubmit}>
                <h2>Signup</h2>
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
          ) : (
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
                  <a href="#" className="forgot_pw">Forgot password?</a>
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
          )}
        </div>
      </section>
    </div>
  );
};

export default LoginRegisterForm;
*/
/*
import React, { useEffect, useState } from 'react';
import './LoginRegisterForm.css';

const LoginRegisterForm = ({ show, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Determine the URL based on the selected role
    let url = '';
    if (isSignup) {
      if (formData.role === 'Organizer') {
        url = '/api/auth/register/organizer';
      } else if (formData.role === 'Admin') {
        url = '/api/auth/register/admin';
      } else {
        url = '/api/auth/register/user'; // Default to User
      }
    } else {
      url = '/api/auth/login'; // Login URL
    }

    const dataToSend = isSignup
      ? {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userId: formData.userId,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          password: formData.password,
        }
      : {
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          password: formData.password,
        };

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to communicate with the server');
      }

      const data = await response.json();
      console.log(isSignup ? 'Registration successful' : 'Login successful', data);
      onClose(); // Close the form on success
    } catch (err) {
      console.error('Error:', err.message);
      alert(`Error: ${err.message}`); // Alert user about the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <section className={`home ${show ? 'show' : ''}`}>
        <div className={`openform-form_container ${isSignup ? 'active' : ''}`}>
          <i className="uil uil-times openform-form_close" onClick={onClose}></i>
          {isSignup ? (
            <div className="openform-form openform-signup_form">
              <form onSubmit={handleSubmit}>
                <h2>Signup</h2>
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
                <button className="openform-button" disabled={loading}>
                  {loading ? 'Signing up...' : 'Signup Now'}
                </button>
                <div className="openform-login_signup">
                  Already have an account?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleLogin(); }}>Login</a>
                </div>
              </form>
            </div>
          ) : (
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
                  <a href="#" className="forgot_pw">Forgot password?</a>
                </div>
                <button className="openform-button" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login Now'}
                </button>
                <div className="openform-login_signup">
                  Don't have an account?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleSignup(); }}>Signup</a>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LoginRegisterForm;
*/