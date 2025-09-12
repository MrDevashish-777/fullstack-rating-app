import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStore, setActiveStore] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/owner/dashboard');
        setDashboardData(response.data);
        
        // Set the first store as active by default if there are stores
        if (response.data.stores && response.data.stores.length > 0) {
          setActiveStore(response.data.stores[0].id);
        }
      } catch (error) {
        console.error('Error fetching owner dashboard data:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActiveStoreRatings = () => {
    if (!dashboardData || !activeStore) return [];
    
    const storeData = dashboardData.ratingsByStore.find(
      store => store.storeId === activeStore
    );
    
    return storeData ? storeData.ratings : [];
  };

  const getActiveStoreName = () => {
    if (!dashboardData || !activeStore) return '';
    
    const store = dashboardData.stores.find(store => store.id === activeStore);
    return store ? store.name : '';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
            View All Stores
          </Link>
          <Link to="/change-password" className="bg-green-600 text-white px-4 py-2 rounded">
            Change Password
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading dashboard data...</div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : !dashboardData || dashboardData.stores.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          You don't have any stores assigned to you. Please contact an administrator.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">Your Stores</h2>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.stores.length}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">Average Rating</h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-yellow-500 mr-2">
                  {parseFloat(dashboardData.averageRating).toFixed(1)}
                </span>
                <span className="text-yellow-500 text-2xl">★</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">Total Ratings</h2>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData.ratingsByStore.reduce(
                  (total, store) => total + store.ratings.length,
                  0
                )}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Stores</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {dashboardData.stores.map(store => (
                <button
                  key={store.id}
                  onClick={() => setActiveStore(store.id)}
                  className={`px-4 py-2 rounded ${
                    activeStore === store.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {store.name}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-3">
              Ratings for {getActiveStoreName()}
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">User</th>
                    <th className="py-2 px-4 border">Rating</th>
                    <th className="py-2 px-4 border">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {getActiveStoreRatings().length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-4 text-center">
                        No ratings for this store yet
                      </td>
                    </tr>
                  ) : (
                    getActiveStoreRatings().map(rating => (
                      <tr key={rating.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">
                          <div>{rating.user.name}</div>
                          <div className="text-xs text-gray-500">{rating.user.email}</div>
                        </td>
                        <td className="py-2 px-4 border">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{rating.rating}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border">
                          {rating.comment || 'No comment'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}