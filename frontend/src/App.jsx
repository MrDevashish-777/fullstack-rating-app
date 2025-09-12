import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Stores from './pages/User/Stores';
import ChangePassword from './pages/Auth/ChangePassword';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminStoresList from './pages/Admin/StoresList';
import AdminUsersList from './pages/Admin/UsersList';
import OwnerDashboard from './pages/Owner/OwnerDashboard';

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return element;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User routes */}
        <Route path="/" element={<ProtectedRoute element={<Stores />} />} />
        <Route path="/change-password" element={<ProtectedRoute element={<ChangePassword />} />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
        <Route path="/admin/stores" element={<ProtectedRoute element={<AdminStoresList />} allowedRoles={['admin']} />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsersList />} allowedRoles={['admin']} />} />
        
        {/* Store Owner routes */}
        <Route path="/owner" element={<ProtectedRoute element={<OwnerDashboard />} allowedRoles={['owner']} />} />
      </Routes>
    </BrowserRouter>
  );
}
