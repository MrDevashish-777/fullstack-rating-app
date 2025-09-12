import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import StoreCard from '../../components/StoreCard';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stores', {
        params: {
          search,
          sort: sortField,
          order: sortOrder
        }
      });
      setStores(res.data.data || []);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortField, sortOrder]);

  const handleSearch = (e) => {
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
        <h1 className="text-2xl font-bold">Stores</h1>
        <div className="flex gap-2">
          <Link to="/change-password" className="bg-blue-600 text-white px-4 py-2 rounded">
            Change Password
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded">
              Admin Dashboard
            </Link>
          )}
          {user.role === 'owner' && (
            <Link to="/owner" className="bg-green-600 text-white px-4 py-2 rounded">
              Owner Dashboard
            </Link>
          )}
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

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or address"
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>
      </div>

      <div className="mb-4 overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('name')}>
                Store Name {getSortIcon('name')}
              </th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('address')}>
                Address {getSortIcon('address')}
              </th>
              <th className="py-2 px-4 border">
                Overall Rating
              </th>
              <th className="py-2 px-4 border">
                Your Rating
              </th>
              <th className="py-2 px-4 border">
                Actions
              </th>
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
                  <td className="py-2 px-4 border">{store.address}</td>
                  <td className="py-2 px-4 border">{store.avgRating || 'N/A'}</td>
                  <td className="py-2 px-4 border">{store.userRating?.rating || 'Not rated'}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button 
                          key={i} 
                          onClick={() => {
                            api.post(`/ratings/${store.id}/rate`, { rating: i })
                              .then(() => fetchStores())
                              .catch(err => alert(err.response?.data?.message || 'Error'));
                          }} 
                          className={`px-2 py-1 border rounded ${store.userRating?.rating === i ? 'bg-yellow-300' : ''}`}
                        >
                          {i}★
                        </button>
                      ))}
                    </div>
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
