import React from 'react';
import { FaHome, FaChartBar, FaFileAlt, FaDatabase, FaPassport } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import profile from '../assets/profile.jpg';

const SidebarContainer = styled.div`
  background-color:rgb(0, 0, 0);
  height: 100vh;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  position: fixed;
  left: 0;
  top: 0;
  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SidebarItem = styled.div`
  padding: 12px 25px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 7px;

  svg {
    margin-right: 10px;
  }

  a {
    text-decoration: none;
    color: white;
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color:rgb(0, 0, 1);
  justify-content: flex-start;
  margin-top: 10px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 8px;
`;

const Divider = styled.hr`
  width: 80%;
  border: 0;
  height: 1px;
  background-color: #ddd;
  margin: 5px auto;
`;

const LogoText = styled.div`
  font-family: 'The Nautigal', cursive;
  font-size: 72px;
  text-align: center;
  margin: 20px auto;

  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const NeatColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 20px;

  @media (max-width: 768px) {
    margin: 15px;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <div>
        <LogoText>FMS</LogoText>

        <SidebarItem>
          <FaHome />
          <a href='#flexcards'>Dashboard</a>
        </SidebarItem>
        <SidebarItem>
          <FaChartBar />
          <a href='#graph'>Analytics</a>
        </SidebarItem>
        <SidebarItem>
          <FaDatabase />
          <a href='#table'>Overall Data</a>
        </SidebarItem>
        <SidebarItem>
          <FaPassport />
          <a href='#cards'>Profile Cars</a>
        </SidebarItem>

        <Divider />
        <NeatColumn>
          <SidebarItem>
            <FaFileAlt />
            <Link to="/manmemb">Management Requests</Link>
          </SidebarItem>
          <SidebarItem>
            <FaFileAlt />
            <Link to="/loanreq">Loan Requests</Link>
          </SidebarItem>
        </NeatColumn>
      </div>

      <Divider />

      <Link to="/profile" style={{ textDecoration: 'none', color: 'white' }}>
        <UserProfile>
          <ProfileImage src={profile} alt="Profile" />
          <div>
            <p>User name</p>
          </div>
        </UserProfile>
      </Link>
    </SidebarContainer>
  );
};

export default Sidebar;
