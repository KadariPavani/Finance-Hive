import React from 'react';
import styled from 'styled-components';
import { FaRegBell } from 'react-icons/fa'; // Import the outlined bell icon
import { Link } from 'react-router-dom'; // Import Link for navigation

const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Space between left and right icons */
  align-items: center;
  padding: 10px 20px;
  color: white;
`;

const SearchBarContainer = styled.div`
  flex: 1; /* Allow this container to grow and fill space */
  display: flex;
  justify-content: center; /* Center the search bar */
`;

const SearchBar = styled.input`
  padding: 5px;
  border: #e3ddf3 solid;
  border-radius: 4px;
  width: 150px; /* Adjust this for a smaller search bar */
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NotificationIcon = styled.div`
  margin-right: 20px; /* Space between the bell icon and other icons */
  cursor: pointer; /* Change cursor to pointer for better UX */
`;

const ProfileIcon = styled.div`
  margin-right: 20px;
  cursor: pointer; /* Change cursor to pointer for better UX */
`;

const TopBar = () => {
  return (
    <TopBarContainer>
      {/* Centered Search Bar */}
      <SearchBarContainer>
        <SearchBar type="text" placeholder="Search..." />
      </SearchBarContainer>
      <IconContainer>
        {/* Bell icon wrapped in Link for navigation */}
        <NotificationIcon>
          <Link to="/notifications" style={{ color: 'black' }}>
            <FaRegBell size={24} /> {/* Outlined black bell icon */}
          </Link>
        </NotificationIcon>
        
        {/* Profile icon wrapped in Link for navigation to profile page */}
        <ProfileIcon>
          <Link to="/profile" style={{ color: 'white' }}>
            <img src={require('../assets/profile.jpg')} alt="Profile" style={{ width: '30px', borderRadius: '50%' }} />
          </Link>
        </ProfileIcon>
      </IconContainer>
    </TopBarContainer>
  );
};

export default TopBar;
