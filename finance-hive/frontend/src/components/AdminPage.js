import React from 'react';
import AdminDashboard from './admin/AdminDashboard';
const AdminPage = () => {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;

/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterForm from '../home/LoginRegisterForm';
import AdminDashboard from './AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
*/