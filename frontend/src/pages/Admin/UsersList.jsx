import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: {
          ...filters,
          sort: sortField,
          order: sortOrder
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortField, sortOrder]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortOrder === 'ASC' ? '↑' : '↓';
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data);
      setShowUserDetails(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex gap-2">
          <Link to="/admin" className="bg-gray-600 text-white px-4 py-2 rounded">
            Back to Dashboard
          </Link>
          <Link to="/admin/users/new" className="bg-green-600 text-white px-4 py-2 rounded">
            Add New User
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Users</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
              placeholder="Filter by name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
              placeholder="Filter by email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
              placeholder="Filter by address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="owner">Store Owner</option>
            </select>
          </div>
          <div className="md:col-span-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('address')}>
                Address {getSortIcon('address')}
              </th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('role')}>
                Role {getSortIcon('role')}
              </th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-4 text-center">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center">No users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                  <td className="py-2 px-4 border">{user.address || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'owner' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleViewDetails(user.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Name:</span> {selectedUser.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {selectedUser.email}
              </div>
              <div>
                <span className="font-semibold">Address:</span> {selectedUser.address || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Role:</span> {selectedUser.role}
              </div>
              {selectedUser.role === 'owner' && (
                <div>
                  <span className="font-semibold">Average Store Rating:</span> {selectedUser.averageRating || 'No ratings yet'}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowUserDetails(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}