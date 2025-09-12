import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import StoreCard from '../../components/StoreCard';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const fetchStores = async () => {
    try {
      const res = await api.get('/stores?search=');
      setStores(res.data.data || []);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchStores(); }, []);
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {stores.map(s => <StoreCard key={s.id} store={s} onUpdated={fetchStores} />)}
    </div>
  );
}
