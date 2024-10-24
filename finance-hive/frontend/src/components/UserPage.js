import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterForm from '../home/LoginRegisterForm';
import UserDashboard from './UserDashboard';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterForm />} />
        <Route path="/user-dashboard/:userId" component={UserDashboard} />
      </Routes>
    </Router>
  );
};

export default App;
