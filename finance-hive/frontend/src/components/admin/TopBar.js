import React from 'react';
import styled from 'styled-components';
import { FaRegBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UniqueTopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #723f8a;
  padding: 10px 20px;
  color: white;
  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const UniqueSearchBarContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const UniqueSearchBar = styled.input`
  padding: 5px;
  border: #e3ddf3 solid;
  border-radius: 4px;
  width: 200px;
  @media (max-width: 768px) {
    width: 120px;
  }
`;

const UniqueIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UniqueNotificationIcon = styled.div`
  margin-right: 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-right: 15px;
  }
`;

const UniqueProfileIcon = styled.div`
  margin-right: 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-right: 15px;
  }
`;

const TopBar = () => {
  return (
    <UniqueTopBarContainer>
      <UniqueSearchBarContainer>
        <UniqueSearchBar type="text" placeholder="Search..." />
      </UniqueSearchBarContainer>
      <UniqueIconContainer>
        <UniqueNotificationIcon>
          <Link to="/notifications" style={{ color: 'black' }}>
            <FaRegBell size={24} />
          </Link>
        </UniqueNotificationIcon>
        <UniqueProfileIcon>
          <Link to="/profile" style={{ color: 'white' }}>
            <img
              src={require('../assets/profile.jpg')}
              alt="Profile"
              style={{ width: '30px', borderRadius: '50%' }}
            />
          </Link>
        </UniqueProfileIcon>
      </UniqueIconContainer>
    </UniqueTopBarContainer>
  );
};

export default TopBar;
