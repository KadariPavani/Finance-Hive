// DashboardHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  // Styles object
  const styles = {
    heading: {
      fontSize: '28px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#2c3e50',
      textTransform: 'uppercase',
      textAlign:'center',
      letterSpacing: '1px',
      marginTop:'60px',
      // boxShadow: '0 4px 0px rgba(123, 0, 147, 0.5)'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '20px',
    },
    button1: {
      padding: '10px 20px',
      backgroundColor: '#723f8a',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      boxShadow: '0 4px 6px rgba(123, 0, 147, 0.5)'
    },
    buttonHover: {
      backgroundColor: '#rgb(247, 221, 255)',
      color: 'Black'
    }
  };

  // Button hover handlers
  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = 'rgb(247, 221, 255)';
    e.target.style.color = 'Black';
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = '#723f8a';
    e.target.style.color = 'White';
  };

  return (
    <div>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate('/add-admin')}
          style={styles.button1}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Add Admin
        </button>
        <button
          onClick={() => navigate('/add-organizer')}
          style={styles.button1}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Add Organizer
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;