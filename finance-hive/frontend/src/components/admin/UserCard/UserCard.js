import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Person from '../../assets/person.jpg'

const UserCards = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data?.msg || err.message);
        setError(err.response?.data?.msg || 'Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filteredUsersData = usersData[selectedRole] || [];
  const initialCardCount = windowWidth > 768 ? 8 : 4;
  const displayedUsers = showAll ? filteredUsersData : filteredUsersData.slice(0, initialCardCount);

  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '80px',
      marginBottom: '60px',
      backgroundColor: 'rgb(247, 221, 255)',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      padding: '15px',
      marginRight: '15px',
      marginLeft: '15px'
    },
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '40px',
      justifyContent: 'space-evenly',
      marginTop: '30px',
    },
    userCard: {
      width: '260px',
      backgroundColor: '#723f8a',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      color: '#ffffff',
      boxShadow: '0 5px 8px rgba(123, 0, 147, 0.5)',
      position: 'relative',
      marginBottom: '20px',
      transition: 'transform 0.3s ease, background-color 0.3s ease',
    },
    userCardHover: {
      transform: 'scale(1.05)',
      backgroundColor: '#8A2BE2',
      boxShadow: '0 5px 8px rgba(123, 0, 147, 0.5)',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      border: '4px solid #723f8a',
      position: 'absolute',
      top: '-40px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ffffff',
    },
    cardTitle: {
      marginTop: '30px',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '60px',
    },
    cardDetails: {
      fontSize: '14px',
      color: '#d1d5db',
      marginTop: '5px',
    },
    socialIcons: {
      marginTop: '15px',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    socialIcon: {
      color: '#ffffff',
      fontSize: '18px',
      transition: 'transform 0.3s ease, color 0.3s ease',
    },
    socialIconHover: {
      transform: 'scale(1.2)',
      color: '#f43f5e',
    },
    readMoreButton: {
      backgroundColor: '#8e44ad',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      marginTop: '30px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(142, 68, 173, 0.2)',
      '&:hover': {
        backgroundColor: '#9b59b6',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 8px rgba(142, 68, 173, 0.3)',
      }
    }
  };

  const handleSocialClick = (e, platform) => {
    e.preventDefault();
    console.log(`${platform} icon clicked`);
  };

  const SocialIcon = ({ platform, icon }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <a
        href="#"
        onClick={(e) => handleSocialClick(e, platform)}
        style={isHovered ? styles.socialIconHover : styles.socialIcon}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <i className={`fab fa-${icon}`}></i>
      </a>
    );
  };

  return (
    <section id="cards" style={styles.container}>
      <h3 style={styles.cardTitle}>All Users (Card View)</h3>
      <div style={styles.cardContainer}>
        {displayedUsers.map((user) => (
          <div
            key={user._id}
            style={{
              ...styles.userCard,
              ...(hoveredCard === user._id ? styles.userCardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(user._id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <img src={Person} alt="Avatar" style={styles.avatar} />
            </div>
            <h4 style={styles.cardTitle}>{user.role}</h4>
            <p style={styles.cardDetails}>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p style={styles.cardDetails}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={styles.cardDetails}>
              <strong>Mobile:</strong> {user.mobileNumber}
            </p>
            <p style={styles.cardDetails}>
              <strong>Address:</strong> {user.address}
            </p>
            <div style={styles.socialIcons}>
              <SocialIcon platform="Facebook" icon="facebook" />
              <SocialIcon platform="Twitter" icon="twitter" />
              <SocialIcon platform="LinkedIn" icon="linkedin" />
            </div>
          </div>
        ))}
      </div>
      {filteredUsersData.length > initialCardCount && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            ...styles.readMoreButton,
            backgroundColor: showAll ? '#723f8a' : '#8e44ad'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#9b59b6'}
          onMouseOut={(e) => e.target.style.backgroundColor = showAll ? '#723f8a' : '#8e44ad'}
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}
    </section>
  );
};

export default UserCards;