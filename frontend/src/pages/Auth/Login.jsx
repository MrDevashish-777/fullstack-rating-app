import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6">
      <h2 className="text-xl mb-4">Login</h2>
      <input {...register('email')} placeholder="Email" className="w-full p-2 mb-2 border" />
      <input type="password" {...register('password')} placeholder="Password" className="w-full p-2 mb-2 border" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2">Login</button>
    </form>
  );
}
