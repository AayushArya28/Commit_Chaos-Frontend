/**
 * ===================================
 * PROTECTED ROUTE COMPONENT
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Protects routes that require authentication and/or KYC verification.
 * Redirects unauthenticated users to login page.
 * Redirects unverified users to KYC page.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Loading spinner component
const LoadingScreen = () => (
  <div className="min-h-screen bg-global-bg flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <div className="absolute inset-0 border-4 border-global-indigo/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-global-indigo border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-global-muted">Loading...</p>
    </div>
  </div>
);

/**
 * ProtectedRoute - Requires user to be authenticated
 * @param {boolean} requireKyc - If true, also requires KYC verification
 */
const ProtectedRoute = ({ children, requireKyc = false }) => {
  const { user, loading, kycVerified } = useAuth();
  const location = useLocation();

  // Show loading screen while checking auth state
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification for non-Google users
  if (!user.emailVerified && user.providerData[0]?.providerId !== 'google.com') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to KYC if KYC is required but not completed
  if (requireKyc && !kycVerified) {
    return <Navigate to="/kyc" replace />;
  }

  return children;
};

/**
 * PublicRoute - Redirects authenticated users away from auth pages
 */
const PublicRoute = ({ children }) => {
  const { user, loading, kycVerified } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // If user is logged in, redirect based on KYC status
  if (user && (user.emailVerified || user.providerData[0]?.providerId === 'google.com')) {
    if (kycVerified) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/kyc" replace />;
    }
  }

  return children;
};

export { ProtectedRoute, PublicRoute, LoadingScreen };
