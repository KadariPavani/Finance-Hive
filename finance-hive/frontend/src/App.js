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
        
        {/* Dynamic routes for dashboards with :userId */}
        <Route path="/user-dashboard/:userId" element={<UserDashboard />} />
        <Route path="/organizer-dashboard/:organizerId" element={<OrganizerDashboard />} />
        <Route path="/admin-dashboard/:adminId" element={<AdminDashboard />} /> {/* Updated route for Admin */}
      </Routes>
    </Router>
  );
};

export default App;


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