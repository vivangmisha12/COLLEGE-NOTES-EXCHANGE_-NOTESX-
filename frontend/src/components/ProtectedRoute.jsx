// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Standard protection for student/admin routes
export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Simple loading state
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin-specific protection
export const AdminRoute = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect to login if not authenticated, or to dashboard if not admin
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};