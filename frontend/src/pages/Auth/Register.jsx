import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,16}$/;

const schema = yup.object({
  name: yup.string().min(20).max(60).required('Name must be 20-60 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().max(400).required('Address is required'),
  password: yup.string().matches(passwordRegex, 'Password must be 8-16 chars with uppercase and special character').required('Password is required')
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/register', data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
          <p className="text-white/80">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-custom">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-white/80">Join our rating community</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 animate-slideIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Full Name</label>
              <input
                {...register('name')}
                placeholder="Enter your full name (20-60 characters)"
                className="input bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/50"
              />
              {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="input bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/50"
              />
              {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Address</label>
              <textarea
                {...register('address')}
                placeholder="Enter your address"
                rows={3}
                className="input bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/50 resize-none"
              />
              {errors.address && <p className="text-red-300 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="Create a strong password"
                className="input bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/50"
              />
              {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/80">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-medium hover:underline transition-all duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}