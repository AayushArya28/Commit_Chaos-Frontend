/**
 * ===================================
 * MAIN APP COMPONENT
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Hackathon Project: Technika 2k26
 * 
 * Features:
 * - Smart Tourist Safety Monitoring
 * - AI-powered anomaly detection
 * - Real-time safety scoring
 * - Emergency response dashboard
 * - KYC face verification
 * 
 * Tech Stack:
 * - React (Vite)
 * - Tailwind CSS
 * - Firebase Auth
 * - face-api.js
 * - React Router
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Landing, Login, Signup, KYC, Dashboard } from './pages';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          
          {/* Landing Page - Accessible to all */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Pages - Redirect logged-in users */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />

          {/* ===== PROTECTED ROUTES ===== */}
          
          {/* KYC Page - Requires authentication */}
          <Route 
            path="/kyc" 
            element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard - Requires authentication + KYC */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireKyc>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* ===== FALLBACK ROUTE ===== */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

