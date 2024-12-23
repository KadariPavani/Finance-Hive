import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  FaHome,
  FaChartBar,
  FaRegMoneyBillAlt,
  FaDollarSign,
  FaCheckCircle,
  FaCog,
  FaQuestionCircle,
} from 'react-icons/fa';
import './Sidebar.css';
import profile from '../assets/profile.jpg';

const Sidebar = ({ userData }) => {
  return (
    <div className="sidebar-container">
      <div className="logo-text">FMS</div>



      <div className="neat-column">
        <NavLink to="/" className="sidebar-item">
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="./analytics" className="sidebar-item">
          <FaChartBar />
          <span>Analytics</span>
        </NavLink>
        {/* <NavLink to="./transactions" className="sidebar-item">
          <FaRegMoneyBillAlt />
          <span>Transactions</span>
        </NavLink> */}
        <NavLink to="./money-matters" className="sidebar-item">
          <FaDollarSign />
          <span>Money Matters</span>
        </NavLink>
        <NavLink to="./verification-status" className="sidebar-item">
          <FaCheckCircle />
          <span>Verification Status</span>
        </NavLink>
        <NavLink to="./payment-schedule" className="sidebar-item">
          <FaRegMoneyBillAlt />
          <span>Payments</span>
        </NavLink>
        <NavLink to="./settings" className="sidebar-item">
          <FaCog />
          <span>Settings</span>
        </NavLink>
        <NavLink to="./feedback" className="sidebar-item">
          <FaQuestionCircle />
          <span>Feedback</span>
        </NavLink>
      </div>

      <div className="user-profile">
        <img src={profile} alt="Profile" className="profile-image" />
        {userData ? (
          <div className="user-info">
            <p className="user-name">{userData.firstName} {userData.lastName}</p>
          </div>
        ) : (
          <p className="loading-text">Loading user...</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;



// import React from 'react';
// import {
//   FaHome,
//   FaTachometerAlt,
//   FaChartBar,
//   FaCog,
//   FaQuestionCircle,
//   FaRegMoneyBillAlt,
//   FaFileAlt,
//   FaDollarSign,
//   FaCheckCircle,
// } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import styled from 'styled-components';
// import profile from '../assets/profile.jpg';

// const SidebarContainer = styled.div`
//   background-color: #723f8a;
//   height: 100%;
//   width: 250px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   color: white;
//   border-top-right-radius: 30px;
//   border-bottom-right-radius: 30px;
//   overflow: hidden;
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 1000;

//   @media (max-width: 768px) {
//     width: 80px;
//     align-items: center;
//   }
// `;

// const SidebarItem = styled.div`
//   padding: 8px 20px; /* Reduced padding */
//   font-size: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   margin-bottom: 5px; /* Reduced margin */

//   svg {
//     margin-right: 8px; /* Reduced margin */
//     font-size: 24px;

//     @media (max-width: 768px) {
//       font-size: 28px;
//       margin-right: 0;
//     }
//   }

//   a {
//     text-decoration: none;
//     color: white;
//     width: 100%;
//   }

//   @media (max-width: 768px) {
//     padding: 8px 0; /* Reduced padding for mobile */
//     justify-content: center;
    
//     span {
//       display: none;
//     }
//   }
// `;

// const UserProfile = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 8px 12px; /* Reduced padding */
//   background-color: #723f8a;
//   justify-content: flex-start;
//   margin-top: 5px; /* Reduced margin */

//   @media (max-width: 768px) {
//     flex-direction: column;
//     padding: 6px;
//     align-items: center;
//   }
// `;

// const ProfileImage = styled.img`
//   border-radius: 50%;
//   width: 45px; /* Reduced size */
//   height: 45px;
//   margin-right: 5px;

//   @media (max-width: 768px) {
//     width: 35px;
//     height: 35px;
//     margin-right: 0;
//   }
// `;

// const Divider = styled.hr`
//   width: 80%;
//   border: 0;
//   height: 1px;
//   background-color: #ddd;
//   margin: 5px auto;

//   @media (max-width: 768px) {
//     width: 60%;
//   }
// `;

// const LogoText = styled.div`
//   font-family: 'The Nautigal', cursive;
//   font-size: 64px; /* Slightly reduced */
//   text-align: center;
//   margin: 15px auto;

//   @media (max-width: 768px) {
//     font-size: 32px;
//   }
// `;

// const NeatColumn = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;

//   @media (max-width: 768px) {
//     align-items: center;
//   }
// `;

// const Sidebar = () => {
//   return (
//     <SidebarContainer>
//       <div>
//         <LogoText>FMS</LogoText>

//         <NeatColumn>
//           <SidebarItem>
//             <FaHome />
//             <span>Home</span>
//             <Link to="/home" />
//           </SidebarItem>
//           <SidebarItem>
//             <FaTachometerAlt />
//             <span>Dashboard</span>
//             <Link to="/dashboard" />
//           </SidebarItem>
//           <SidebarItem>
//             <FaChartBar />
//             <span>Analytics</span>
//             <Link to="/analytics" />
//           </SidebarItem>
//           <SidebarItem>
//             <FaRegMoneyBillAlt />
//             <span>Transactions</span>
//             <Link to="/transactions" />
//           </SidebarItem>
//           <SidebarItem>
//             <FaFileAlt />
//             <span>Cards</span>
//             <Link to="/cards" />
//           </SidebarItem>
//         </NeatColumn>

//         <Divider />

//         <NeatColumn>
//           <SidebarItem>
//             <FaDollarSign />
//             <span>Money Matters</span>
//             <Link to="/money-matters" />
//           </SidebarItem>
//           <SidebarItem>
//             <FaCheckCircle />
//             <span>Verification Status</span>
//             <Link to="/verification-status" />
//           </SidebarItem>
//           <SidebarItem>
//             <FaCog />
//             <span>Settings</span>
//             <Link to="/settings" />
//           </SidebarItem>
//           <SidebarItem>
//             <FaQuestionCircle />
//             <span>Help Center</span>
//             <Link to="/help-center" />
//           </SidebarItem>
//         </NeatColumn>
//       </div>

//       <Divider />

//       <Link to="/profile" style={{ textDecoration: 'none', color: 'white' }}>
//         <UserProfile>
//           <ProfileImage src={profile} alt="Profile" />
//           <div>
//             <p>User name</p>
//           </div>
//         </UserProfile>
//       </Link>
//     </SidebarContainer>
//   );
// };

// export default Sidebar;
