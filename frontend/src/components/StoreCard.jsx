import React, { useState } from 'react';
import api from '../api/api';

export default function StoreCard({ store, onUpdated }) {
  const [rating, setRating] = useState(store.userRating?.rating || 0);

  const submit = async (val) => {
    try {
      const res = await api.post(`/ratings/${store.id}/rate`, { rating: val });
      setRating(res.data.rating || val);
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold">{store.name}</h3>
      <p className="text-sm">{store.address}</p>
      <p>Avg: {store.avgRating ?? 'N/A'}</p>
      <div className="mt-2">
        Your rating: {rating || 'Not rated'}
        <div className="flex gap-1 mt-1">
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => submit(i)} className={`px-2 py-1 border ${rating===i ? 'bg-yellow-300' : ''}`}>{i}★</button>
          ))}
        </div>
      </div>
    </div>
  );
}
