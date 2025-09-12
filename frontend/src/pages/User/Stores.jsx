import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

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

  const rateStore = async (storeId, rating) => {
    try {
      await api.post(`/ratings/${storeId}/rate`, { rating });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rating store');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-8 animate-fadeIn">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Store Directory</h1>
              <p className="text-gray-600">Discover and rate amazing stores</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/change-password" className="btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Change Password
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-primary">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Admin Dashboard
                </Link>
              )}
              {user.role === 'owner' && (
                <Link to="/owner" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  Owner Dashboard
                </Link>
              )}
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                className="btn-danger"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="card p-6 mb-8 animate-slideIn">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stores by name or address..."
                className="input"
              />
            </div>
            <button type="submit" className="btn-primary">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search
            </button>
          </form>
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="shimmer h-6 rounded mb-4"></div>
                <div className="shimmer h-4 rounded mb-2"></div>
                <div className="shimmer h-4 rounded w-3/4 mb-4"></div>
                <div className="shimmer h-8 rounded"></div>
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="card p-12 text-center animate-fadeIn">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 4.414L15 8v8H5V8l5-3.586z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No stores found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <div key={store.id} className="card p-6 animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{store.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{store.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-1">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        {store.avgRating ? parseFloat(store.avgRating).toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Overall Rating</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                    <span className="text-sm text-gray-600">
                      {store.userRating?.rating ? `${store.userRating.rating} stars` : 'Not rated'}
                    </span>
                  </div>
                  
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => rateStore(store.id, rating)}
                        className={`star text-2xl transition-all duration-200 transform hover:scale-125 ${
                          store.userRating?.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
