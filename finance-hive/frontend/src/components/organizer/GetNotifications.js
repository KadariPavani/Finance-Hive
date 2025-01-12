import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GetNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notifications/get-notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
        setFilteredNotifications(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = notifications;

    if (organizationFilter) {
      filtered = filtered.filter((notification) => notification.organization === organizationFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (notification) => new Date(notification.createdAt).toISOString().split('T')[0] === dateFilter
      );
    }

    setFilteredNotifications(filtered);
  }, [organizationFilter, dateFilter, notifications]);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8" id="get-notifications">
      <h2 className="text-2xl font-semibold mb-6">Recent Notifications</h2>

      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organization-filter">
            Organization
          </label>
          <select
            id="organization-filter"
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">All</option>
            <option value="khub">KHUB</option>
            <option value="gcc">GCC</option>
            <option value="tm">Toast Masters</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date-filter">
            Date
          </label>
          <input
            type="date"
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredNotifications.length === 0 ? (
        <p className="text-gray-600">No notifications found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Organization</th>
                <th className="border border-gray-300 px-4 py-2">Verification</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((notification) => (
                <tr key={notification._id}>
                  <td className="border border-gray-300 px-4 py-2">{notification.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{notification.transactionId}</td>
                  <td className="border border-gray-300 px-4 py-2">${notification.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        notification.organization === 'khub'
                          ? 'bg-green-200 text-green-800'
                          : notification.organization === 'gcc'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {notification.organization}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        notification.verification === 'Done'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {notification.verification}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link to={`/notifications/${notification._id}`} className="text-blue-500 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetNotifications;
