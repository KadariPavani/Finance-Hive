import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import OrganizerPage from './components/OrganizerPage';
import AdminPage from './components/AdminPage';
import PaymentSchedule from './components/user/PaymentSchedule';
import ChangePassword from './components/user/ChangePasswordForm';
import FeedbackForm from './components/user/Feedback';
import PersonalDetailsForm from './components/user/PersonalDetailsForm';
import VerificationStatus from './components/user/VerificationStatus';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-dashboard/:userId" element={<UserPage />} />
        <Route path="/organizer-dashboard/:organizerId" element={<OrganizerPage />} />
        <Route path="/admin-dashboard/:adminId" element={<AdminPage />} />
        <Route
  path="/user-dashboard/:userId/payment-schedule"
  element={<PaymentSchedule />}
/>
        <Route path="/user-dashboard/:userId/settings" element={<ChangePassword />} />
        <Route path="/user-dashboard/:userId/feedback" element={<FeedbackForm />} />
        <Route path="/user-dashboard/:userId/verification-status" element={<VerificationStatus />} />
        <Route path="/user-dashboard/:userId/money-matters" element={<PersonalDetailsForm />} />
      </Routes>
    </Router>
  );
};

export default App;

/*

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginRegisterForm from './components/home/LoginRegisterForm';
import UserDashboard from './components/user/UserDashboard';
import OrganizerDashboard from './components/organizer/OrganizerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRegisterForm />} />
        
        <Route path="/user-dashboard/:userId" element={<UserDashboard />} />
        <Route path="/organizer-dashboard/:organizerId" element={<OrganizerDashboard />} />
        <Route path="/admin-dashboard/:adminId" element={<AdminDashboard />} /> 
      </Routes>
    </Router>
  );
};

export default App;

*/
/* 
import React from 'react';
import HomePage from '../src/components/HomePage';

const App = () => {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
};

export default App;
*/