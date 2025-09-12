import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api/api';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,16}$/;

const schema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .matches(
      passwordRegex,
      'Password must be 8-16 characters and include at least one uppercase letter and one special character'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password')
});

export default function ChangePassword() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setMessage('');
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in');
        return;
      }
      
      await api.put('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMessage('Password updated successfully');
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            {...register('currentPassword')}
            className="w-full p-2 border rounded"
          />
          {errors.currentPassword && (
            <p className="text-red-600 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            {...register('newPassword')}
            className="w-full p-2 border rounded"
          />
          {errors.newPassword && (
            <p className="text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full p-2 border rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}