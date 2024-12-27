import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  LineChart,
} from 'recharts';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';

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
        // Fetch signup counts
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

        // Fetch all users' data
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

  // Data for the main graph
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

  // Filtered users based on the selected role
  const filteredUsersData = usersData[selectedRole] || [];

  // Dummy random data for curve graph in each card
  const generateRandomData = () => {
    let data = [];
    for (let i = 0; i < 6; i++) {
      data.push({
        name: `${i + 1}`,
        value: Math.floor(Math.random() * 100) + 1,
      });
    }
    return data;
  };

  return (
    
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: 'calc(100% - 250px)' }}>
        <TopBar />

        <div style={{ margin: '20px' }}>
        <section id='flexcards'>
          <h1 style={styles.heading}>Admin Dashboard</h1>
         
          {/* Cards and Graphs */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            {/* Total Signups as Cards with Small Graphs */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Users</h3>
              <p style={styles.cardValue}>{signupCounts.userSignups}</p>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={generateRandomData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8e44ad" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Organizers</h3>
              <p style={styles.cardValue}>{signupCounts.organizerSignups}</p>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={generateRandomData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#9b59b6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Admins</h3>
              <p style={styles.cardValue}>{signupCounts.adminSignups}</p>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={generateRandomData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#6a1b9a" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Signups Percentage</h3>
              <div style={styles.circularProgressContainer}>
                <CircularProgressbar
                  value={((signupCounts.userSignups + signupCounts.organizerSignups + signupCounts.adminSignups) / 100) * 100}
                  text={`${Math.round(((signupCounts.userSignups + signupCounts.organizerSignups + signupCounts.adminSignups) / 100) * 100)}%`}
                  styles={{
                    path: {
                      stroke: '#8e44ad',
                      strokeWidth: 8,
                    },
                    trail: {
                      stroke: '#f3f4f6',
                      strokeWidth: 8,
                    },
                    text: {
                      fill: '#8e44ad',
                      fontSize: '24px',
                    },
                  }}
                />
              </div>
            </div>
          </div>
          </section>
          <section id='graph'>
          {/* Signup Count Distribution with Two Graphs Side by Side */}
          <h3 style={styles.sectionTitle}>Signup Count Distribution</h3>
          
          <div style={styles.graphContainer}>
          
            <ResponsiveContainer width="48%" height={300}>
              <ComposedChart data={data} style={styles.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="signups" fill="#9b59b6" stroke="none" />
                <Line type="monotone" dataKey="signups" stroke="#8e44ad" dot={false} strokeDasharray="3 3" />
                <Bar dataKey="signups" fill="#6a1b9a" barSize={20} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* New Line Graph */}
            <ResponsiveContainer width="48%" height={300}>
              <LineChart data={data} style={styles.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="signups" stroke="#8e44ad" />
              </LineChart>
            </ResponsiveContainer>
            
          </div>
          </section>

          <section id='table'>
          {/* Filter dropdown */}
          <div style={{ margin: '20px 0' }}>
            
            <label style={{ marginRight: '10px' }}>Filter by Role:</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="users">Users</option>
              <option value="organizers">Organizers</option>
              <option value="admins">Admins</option>
            </select>
           
          </div>

          {/* All Users Table */}
          <h3>All Users</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>First Name</th>
                <th style={styles.th}>Last Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Mobile Number</th>
                <th style={styles.th}>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsersData.map((user) => (
                <tr key={user._id}>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>{user.firstName}</td>
                  <td style={styles.td}>{user.lastName}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.mobileNumber}</td>
                  <td style={styles.td}>{user.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </section>
          <section id='cards'>
          {/* All Users Flex Cards */}
          <h3 style={{ marginTop: '40px' }}>All Users (Card View)</h3>
          <div style={styles.cardContainer}>
  {filteredUsersData.map((user) => (
    <div
      key={user._id}
      style={styles.userCard}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.userCardHover);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, styles.userCard);
      }}
    >
      <div>
        <img src="/images/no-dp_16.png" alt="Avatar" style={styles.avatar} />
      </div>
      <h4 style={styles.cardTitle}>{user.role}</h4>
      <p style={styles.cardDetails}>
        <strong>Name:</strong> {user.firstName} {user.lastName}
      </p>
      <p style={styles.cardDetails}>
        <strong>Email:</strong> {user.email}
      </p>
      <p style={styles.cardDetails}>
        <strong>Mobile:</strong> {user.mobileNumber}
      </p>
      <p style={styles.cardDetails}>
        <strong>Address:</strong> {user.address}
      </p>
      <div style={styles.socialIcons}>
        <a
          href="#"
          style={styles.socialIcon}
          onMouseEnter={(e) => (e.currentTarget.style = styles.socialIconHover)}
          onMouseLeave={(e) => (e.currentTarget.style = styles.socialIcon)}
        >
          <i className="fab fa-facebook"></i>
        </a>
        <a
          href="#"
          style={styles.socialIcon}
          onMouseEnter={(e) => (e.currentTarget.style = styles.socialIconHover)}
          onMouseLeave={(e) => (e.currentTarget.style = styles.socialIcon)}
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="#"
          style={styles.socialIcon}
          onMouseEnter={(e) => (e.currentTarget.style = styles.socialIconHover)}
          onMouseLeave={(e) => (e.currentTarget.style = styles.socialIcon)}
        >
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
  ))}
</div>


           </section>
        </div>
       
        <Footer />
      </div>
    </div>
  );
};

const styles = {
  // Table Header
 // Table Container and Elements
 tableContainer: {
  margin: '30px 0',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(142, 68, 173, 0.1)',
  backgroundColor: '#ffffff',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(142, 68, 173, 0.15)'
  }
},
table: {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  backgroundColor: '#ffffff'
},
th: {
  padding: '20px 24px',
  background: 'linear-gradient(135deg, #8e44ad 0%,rgb(169, 179, 179) 100%)',
  color: '#ffffff',
  fontWeight: '600',
  fontSize: '15px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  position: 'relative',
  transition: 'all 0.3s ease',
  borderBottom: '3px solid rgba(255, 255, 255, 0.1)',
  '&:first-child': {
    borderTopLeftRadius: '12px'
  },
  '&:last-child': {
    borderTopRightRadius: '12px'
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #9b59b6 0%,rgb(68, 173, 82) 100%)'
  }
},
td: {
  padding: '16px 24px',
  color: '#4a5568',
  fontSize: '14px',
  borderBottom: '1px solid rgba(142, 68, 173, 0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '3px',
    background: 'transparent',
    transition: 'background-color 0.3s ease'
  }
},
tr: {
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(142, 68, 173, 0.04)',
    '& td': {
      color: '#8e44ad',
      '&::before': {
        background: '#8e44ad'
      }
    }
  },
  '&:last-child td': {
    borderBottom: 'none'
  }
},
  // Cards in Section flexcards
  flexCardHover: {
    transform: 'scale(1.05)', // Slight scale on hover
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // Darker shadow on hover
  },
  flexCardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px', // Space between the cards
    justifyContent: 'center', // Center the cards
    marginTop: '30px',
  },
  // Cards in Section cards
  userCard: {
    width: '260px',
    backgroundColor: '#723f8a', // Dark gray background
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    color: '#ffffff', // White text
    boxShadow: '0 4px 8px rgba(105, 61, 126, 0)',
    position: 'relative',
    marginBottom: '20px',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  userCardHover: {
    transform: 'scale(1.05)', // Subtle scale effect
    backgroundColor: '#8A2BE2', // Slightly lighter gray on hover
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0)',

  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '4px solid #723f8a', // Pink border
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ffffff', // Background for the avatar border
  },
  cardTitle: {
    marginTop: '50px', // Space below the avatar
    fontSize: '18px',
    fontWeight: 'bold',
  },
  cardDetails: {
    fontSize: '14px',
    color: '#d1d5db', // Light gray text
    marginTop: '5px',
  },
  socialIcons: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  socialIcon: {
    color: '#ffffff',
    fontSize: '18px',
    transition: 'transform 0.3s ease, color 0.3s ease',
  },
  socialIconHover: {
    transform: 'scale(1.2)', // Slight scaling
    color: '#f43f5e', // Pink hover color
  },
  // Card Container for Section cards
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-evenly',
    marginTop: '30px',
  },
  // Circular Progress in flexcards
  circularProgressContainer: {
    width: '100px',
    height: '100px',
    margin: '0 auto',
  },
  // Section Title
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#2c3e50',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  // Graph Container
  graphContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '30px',
    marginTop: '40px',
  },
  chart: {
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: '#fff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  chartHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
};

export default AdminDashboard;