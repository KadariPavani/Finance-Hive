import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterForm from './home/LoginRegisterForm';
import OrganizerDashboard from './organizer/OrganizerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterForm />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
