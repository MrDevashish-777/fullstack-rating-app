import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Change Password</h2>
            <p className="text-gray-600">Update your account security</p>
          </div>
          
          {message && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-700 px-4 py-3 rounded-lg mb-6 animate-slideIn">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {message}
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slideIn">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                {...register('currentPassword')}
                placeholder="Enter your current password"
                className="input"
              />
              {errors.currentPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.currentPassword.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                {...register('newPassword')}
                placeholder="Enter your new password"
                className="input"
              />
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm your new password"
                className="input"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              ← Back to Stores
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}