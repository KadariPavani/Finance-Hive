import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import OrganizerPage from './components/OrganizerPage';
import AdminPage from './components/AdminPage';
import PaymentSchedule from './components/user/PaymentSchedule';
import ChangePassword from './components/user/ChangePasswordForm';
import FeedbackForm from './components/user/Feedback';
import PersonalDetailsForm from './components/user/PersonalDetailsForm';
import VerificationStatus from './components/user/VerificationStatus';
import UserDashboard from './components/user/UserDashboard';
import EmptyLoanPage from './components/user/EmptyLoanPage';
import LoanForm from './components/user/LoanForm';
import MainContent from "./components/organizer/Data";
import CompletionPage from './components/user/CompletionPage';
import Sidebar from './components/user/Sidebar';
import AddAdminForm from './components/admin/AddAdminForm';
import AddOrganizerForm from './components/admin/AddOrganizerForm';
import SubmitNotification from './components/admin/SubmitNotification'; 
import GetNotifications from './components/organizer/GetNotifications';
import ProfileForm from './components/user/ProfileForm';
// import FinanceForm from './components/user/FinanceForm';
// import Transaction from './components/user/Transactions';
// import Savings from './components/user/Savings';
import Dashboard from './components/user/Dashboard';
import LoginRegisterForm from './components/home/LoginRegisterForm';
import PrivacyPolicy from './components/user/PrivacyPolicy';
const AppLayout = ({ children }) => {
  const location = useLocation();

  // Define routes that should display the sidebar
  const sidebarRoutes = [
    '/user-dashboard',
    '/organizer-dashboard/:organizerId',
    '/admin-dashboard/:adminId',
    '/settings',
    '/user-dashboard/:userId/feedback',
    '/user-dashboard/:userId/payments',
    '/loan-form',
    '/money-matters'
  ];

  // Check if the current route matches any of the sidebar routes
  const shouldShowSidebar = sidebarRoutes.some(route =>
    location.pathname.startsWith(route.split('/:')[0]) // Check base path
  );

  return (
    <div className="app-layout">
      {shouldShowSidebar && <Sidebar />}
      <div className="main-content">{children}</div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-register" element={<LoginRegisterForm show={true} />} />
        <Route path="/profiles" element={<ProfileForm />} />
        {/* <Route path="/expenses" element={<FinanceForm />} />
        <Route path="/transactions" element={<Transaction/>} />
        <Route path="/savings" element={<Savings/>} /> */}
        <Route path="/user-dashboard/:userId/dashboard" element={<Dashboard />} />
        <Route path="/user-dashboard/:userId" element={<UserPage />} />
        <Route path="/organizer-dashboard/:organizerId" element={<OrganizerPage />} />
        <Route path="/organization" element={<MainContent />} />
        <Route path="/admin-dashboard/:adminId" element={<AdminPage />} />
        <Route
  path="/user-dashboard/:userId/payments"
  element={<PaymentSchedule />}
/>
<Route path="/user-dashboard" element={<EmptyLoanPage />} />
<Route path="/user-dashboard/:userId/money-matters" element={<PersonalDetailsForm />} />

        <Route path="/settings" element={<ChangePassword />} />
        <Route path="/user-dashboard/:userId/main-dashboard" element={<PaymentSchedule />} />
        <Route path="/user-dashboard/:userId/feedback" element={<FeedbackForm />} />
        <Route path="/user-dashboard/:userId/verification-status" element={<VerificationStatus />} />
        <Route path="/money-matters" element={<PersonalDetailsForm />} />
        <Route path="/user-dashboard/:userId" element={<UserDashboard />} />
        {/* <Route path="/user-dashboard/:loanId/payments/list" element={<PaymentSchedule />} /> */}
        <Route path="/money-matters/completed" element={<CompletionPage />} />
        <Route path="/empty-loan" element={<EmptyLoanPage />} /> {/* Empty page route */}
        <Route path="user-dashboard/:userId/completion" element={<CompletionPage />} />
        <Route
          path="/user-dashboard/:userId"
          element={<UserDashboard hideEmptyLoanPage={true} />}
        />
        <Route path="/loan-form" element={<LoanForm />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="add-admin" element={<AddAdminForm />} />
        <Route path="add-organizer" element={<AddOrganizerForm />} />
        <Route path="/submit-notification" element={<SubmitNotification />} /> 
        <Route path="/get-notification/" element={<GetNotifications />} />
        <Route path ="/PrivacyPolicy" element = {<PrivacyPolicy />}></Route>

      </Routes>
    </Router>
  );
};

export default App;
