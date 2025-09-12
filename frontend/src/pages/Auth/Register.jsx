import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,16}$/;

const schema = yup.object({
  name: yup.string().min(20).max(60).required(),
  email: yup.string().email().required(),
  address: yup.string().max(400).required(),
  password: yup.string().matches(passwordRegex).required()
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      alert('Registered. Please login');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6">
      <h2 className="text-xl mb-4">Register</h2>
      <input {...register('name')} placeholder="Full name (20-60 chars)" className="w-full p-2 mb-2 border" />
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      <input {...register('email')} placeholder="Email" className="w-full p-2 mb-2 border" />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      <textarea {...register('address')} placeholder="Address" className="w-full p-2 mb-2 border" />
      {errors.address && <p className="text-red-600">{errors.address.message}</p>}
      <input type="password" {...register('password')} placeholder="Password" className="w-full p-2 mb-2 border" />
      {errors.password && <p className="text-red-600">Password invalid</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Register</button>
    </form>
  );
}
