import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stores', {
        params: {
          ...filters,
          sort: sortField,
          order: sortOrder
        }
      });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
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
    fetchStores();
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stores Management</h1>
        <div className="flex gap-2">
          <Link to="/admin" className="bg-gray-600 text-white px-4 py-2 rounded">
            Back to Dashboard
          </Link>
          <Link to="/admin/stores/new" className="bg-green-600 text-white px-4 py-2 rounded">
            Add New Store
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Stores</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="md:col-span-3">
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
                Store Name {getSortIcon('name')}
              </th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('address')}>
                Address {getSortIcon('address')}
              </th>
              <th className="py-2 px-4 border">Owner</th>
              <th className="py-2 px-4 border">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-4 text-center">Loading...</td>
              </tr>
            ) : stores.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center">No stores found</td>
              </tr>
            ) : (
              stores.map(store => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{store.name}</td>
                  <td className="py-2 px-4 border">{store.email || 'N/A'}</td>
                  <td className="py-2 px-4 border">{store.address || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    {store.owner ? `${store.owner.name} (${store.owner.email})` : 'No owner assigned'}
                  </td>
                  <td className="py-2 px-4 border">
                    {store.averageRating ? (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{parseFloat(store.averageRating).toFixed(1)}</span>
                      </div>
                    ) : (
                      'No ratings yet'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}