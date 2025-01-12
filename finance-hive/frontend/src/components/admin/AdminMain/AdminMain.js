import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminMain.css';
import DashboardCards from '../Dashboard/Dashboard';
import SignupDistributionGraphs from '../SignUpDistribution/SignUpDistribution';
import UsersTable from '../UserTable/UserTable';
import UserCards from '../UserCard/UserCard';
import { useParams } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import Sidebar from '../AdminSidebar/Sidebar';
import Footer from '../AdminFooter/Footer';
import AddButtons from '../AddButtons/AddButtons';
import AdminPayments from '../AdminPayments/AdminPayments'

const AdminDashboard = () => {
  const { adminId } = useParams();
  const [signupCounts, setSignupCounts] = useState({
    userSignups: 0,
    organizerSignups: 0,
    adminSignups: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing.');
        setLoading(false);
        return;
      }

      try {
        const signupResponse = await axios.get('http://localhost:5000/signup-count', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { userSignups, organizerSignups, adminSignups } = signupResponse.data;

        setSignupCounts({
          userSignups: userSignups || 0,
          organizerSignups: organizerSignups || 0,
          adminSignups: adminSignups || 0,
        });

        const totalPending =
          Number(userSignups || 0) +
          Number(organizerSignups || 0) +
          Number(adminSignups || 0);
        setPendingApprovals(totalPending);

        const usersResponse = await axios.get('http://localhost:5000/all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsersData(usersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data?.msg || err.message);
        setError(err.response?.data?.msg || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const data = [
    {
      name: 'Users',
      signups: signupCounts.userSignups,
    },
    {
      name: 'Organizers',
      signups: signupCounts.organizerSignups,
    },
    {
      name: 'Admins',
      signups: signupCounts.adminSignups,
    },
  ];

  const filteredUsersData = usersData[selectedRole] || [];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginTop: '10px', width: '100%' }}>
        <div>
          <AddButtons/>
          <DashboardCards />
          <SignupDistributionGraphs />
          <UsersTable />
          <UserCards />
          <AdminPayments />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;