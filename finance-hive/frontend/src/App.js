import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ContactForm from './components/home/GetInTouch';
import Login from './components/home/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import OrganizerDashboard from './components/organizer/OrganizerDashboard';
import AddUser from './components/admin/AddUser';

const App = () => (
  <Router>
    <Routes>
      {/* Your existing routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactForm />} />
      
      {/* New routes for login and dashboards */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/organizer" element={<OrganizerDashboard />} />
      <Route path="/user" element={<UserDashboard />} />

      <Route path="/add-admin" element={<AddUser role="admin" />} />
      <Route path="/add-organizer" element={<AddUser role="organizer" />} />

    </Routes>
  </Router>
);

export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './components/HomePage';
// import ContactForm from './components/home/GetInTouch';
// const App = () => (
//   <Router>
//     <Routes>
//     <Route path="/" element={<HomePage />} />
//     <Route path="/contact" element={<ContactForm />} />
//     </Routes>
//   </Router>
// );

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import HomePage from './components/HomePage';
// import UserPage from './components/UserPage';
// import OrganizerPage from './components/OrganizerPage';
// import AdminPage from './components/AdminPage';
// import PaymentSchedule from './components/user/UserPaymentSchedule/PaymentSchedule';
// import ChangePassword from './components/user/UserChangepassword/ChangePasswordForm';
// import FeedbackForm from './components/user/UserFeedback/Feedback';
// import PersonalDetailsForm from './components/user/UserPersonalDetails/PersonalDetailsForm';
// import VerificationStatus from './components/user/UserVerificationStatus/VerificationStatus';
// import UserDashboard from './components/user/UserDashboard/UserDashboard';
// import EmptyLoanPage from './components/user/EmptyLoanPage/EmptyLoanPage';
// import LoanForm from './components/user/UserLoanForm/LoanForm';
// // import MainContent from "./components/organizer/Data";
// import MainContent from "./components/organizer/OrgMain/OrgMain";
// import CompletionPage from './components/user/UserCompletionPage/CompletionPage';
// import Sidebar from './components/user/UserSidebar/Sidebar';
// import Dashboard from './components/user/Dashboard';
// import LoginRegisterForm from './components/home/LoginRegisterForm';
// import PrivacyPolicy from './components/user/PrivacyPolicy';
// import ProfileForm from './components/user/ProfileForm';
// import DashboardPage from './components/admin/Dashboard/Dashboard';
// import SignupDistributionPage from './components/admin/SignUpDistribution/SignUpDistribution';
// import UserCardPage from './components/admin/UserCard/UserCard';
// import UserTablePage from './components/admin/UserTable/UserTable';
// import AdminSidebar from './components/admin/AdminSidebar/Sidebar';
// import AddAdminForm from './components/admin/Adminform/Adminform';
// import AddOrganizerForm from './components/admin/OrganizerForm/OrganizerForm';
// import AdminPayments from './components/admin/AdminPayments/AdminPayments';
// import SubmitNotification from './components/admin/SubmitNotification'; 
// import GetNotifications from './components/organizer/GetNotifications';
// import PersonalDetailsDisplay from './components/organizer/PersonalDetailsDisplay';


// // import OrgMain from './components/admin/AdminPayments/AdminPayments';



// const AppLayout = ({ children }) => {
//   const location = useLocation();

//   // Define routes that should display the sidebar
//   const sidebarRoutes = [
//     '/user-dashboard',
//     '/user-dashboard/:userId/settings',
//     '/user-dashboard/:userId/feedback',
//     '/user-dashboard/:userId/payments',
//     '/loan-form',
//     '/money-matters',
//     // '/admin-dashboard/:adminId/dashboard',
//     // '/admin-dashboard/:adminId/signup-distribution'
//   ];

//   const adminSidebarRoutes = [
//     '/admin-dashboard/:adminId/dashboard',
//     '/admin-dashboard/:adminId/signup-distribution',
//     '/admin-dashboard/:adminId/user-card',
//     '/admin-dashboard/:adminId/user-table',
//     '/add-admin',
//     '/add-organizer',
//     '/admin-payments'
//   ];

//   // Check if the current route matches any of the sidebar routes
//   const shouldShowSidebar = sidebarRoutes.some(route =>
//     location.pathname.startsWith(route.split('/:')[0]) // Check base path
//   );

//   const shouldShowAdminSidebar = adminSidebarRoutes.some(route =>
//     location.pathname.startsWith(route.split('/:')[0]) // Check base path
//   );

//   return (
//     <div className="app-layout">
//       {shouldShowSidebar && <Sidebar />}
//       {shouldShowAdminSidebar && <AdminSidebar />}
//       <div className="main-content">{children}</div>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <AppLayout />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/user-dashboard/:userId" element={<UserPage />} />
//         <Route path="/login-register" element={<LoginRegisterForm show={true} />} />
//         <Route path="/profiles" element={<ProfileForm />} />
//         <Route path="/organizer-dashboard/:organizerId" element={<OrganizerPage />} />
//         <Route path="/organization" element={<MainContent />} />
//         <Route path="/admin-dashboard/:adminId" element={<AdminPage />} />
//         <Route
//           path="/user-dashboard/:userId/payments"
//           element={<PaymentSchedule />}
//         />
//         <Route path="/user-dashboard" element={<EmptyLoanPage />} />
//         <Route path="/user-dashboard/:userId/money-matters" element={<PersonalDetailsForm />} />
//         <Route path="/user-dashboard/:userId/dashboard" element={<Dashboard />} />
//         <Route path="/user-dashboard/:userId/settings" element={<ChangePassword />} />
//         <Route path="/user-dashboard/:userId/main-dashboard" element={<PaymentSchedule />} />
//         <Route path="/user-dashboard/:userId/feedback" element={<FeedbackForm />} />
//         <Route path="/user-dashboard/:userId/verification-status" element={<VerificationStatus />} />
//         <Route path="/money-matters" element={<PersonalDetailsForm />} />
//         <Route path="/user-dashboard/:userId" element={<UserDashboard />} />
//         {/* <Route path="/user-dashboard/:loanId/payments/list" element={<PaymentSchedule />} /> */}
//         <Route path="/money-matters/completed" element={<CompletionPage />} />
//         <Route path="/empty-loan" element={<EmptyLoanPage />} /> {/* Empty page route */}
//         <Route path="user-dashboard/:userId/completion" element={<CompletionPage />} />
//         <Route
//           path="/user-dashboard/:userId"
//           element={<UserDashboard hideEmptyLoanPage={true} />}
//         />
//         <Route path="/loan-form" element={<LoanForm />} />
//         <Route path="/submit-notification" element={<SubmitNotification />} /> 
//         <Route path="/get-notification/" element={<GetNotifications />} />
//         <Route path ="/PrivacyPolicy" element = {<PrivacyPolicy />}></Route>
//         <Route path="/admin-dashboard/:adminId/dashboard" element={<DashboardPage />} />
//         <Route path="/admin-dashboard/:adminId/signup-distribution" element={<SignupDistributionPage />} />
//         <Route path="/admin-dashboard/:adminId/user-card" element={<UserCardPage />} />
//         <Route path="/admin-dashboard/:adminId/user-table" element={<UserTablePage />} />
//         <Route path="/add-admin" element={<AddAdminForm />} />
//         <Route path="/add-organizer" element={<AddOrganizerForm />} />
//         <Route path="/admin-payments" element={<AdminPayments />} />
//         <Route path='/personal-details/all' element={<PersonalDetailsDisplay/>}/>

//       </Routes>
//     </Router>
//   );
// };

// export default App;
