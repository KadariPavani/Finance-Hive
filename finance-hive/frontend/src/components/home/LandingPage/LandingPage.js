import React, { useEffect, useState } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [greeting, setGreeting] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Retrieve user info from localStorage
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    setUserRole(role);
    setUserName(name);

    // Get current time and set greeting
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Morning');
    } else if (hours < 18) {
      setGreeting('Afternoon');
    } else {
      setGreeting('Evening');
    }
  }, []);

  return (
    <div className="landing-page">
      <div className="card">
        <h2>Happy {greeting} {userName}!</h2>
        <p>Welcome to the Finance Hive</p>
        <p>We are glad to have you on board, {userRole}!</p>
      </div>
    </div>
  );
};

export default LandingPage;
