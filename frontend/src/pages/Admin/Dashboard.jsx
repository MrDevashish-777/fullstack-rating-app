import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
            View Stores
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Total Stores</h2>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-green-600">{stats.totalStores}</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Total Ratings</h2>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-yellow-600">{stats.totalRatings}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link 
              to="/admin/users" 
              className="bg-purple-600 text-white px-4 py-3 rounded text-center hover:bg-purple-700"
            >
              Manage Users
            </Link>
            <Link 
              to="/admin/stores" 
              className="bg-indigo-600 text-white px-4 py-3 rounded text-center hover:bg-indigo-700"
            >
              Manage Stores
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Create New</h2>
          <div className="flex flex-col gap-3">
            <Link 
              to="/admin/users/new" 
              className="bg-green-600 text-white px-4 py-3 rounded text-center hover:bg-green-700"
            >
              Add New User
            </Link>
            <Link 
              to="/admin/stores/new" 
              className="bg-blue-600 text-white px-4 py-3 rounded text-center hover:bg-blue-700"
            >
              Add New Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}