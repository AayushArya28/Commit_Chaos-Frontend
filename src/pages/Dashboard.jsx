/**
 * ===================================
 * DASHBOARD PAGE
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Purpose: Visualize tourist safety system capabilities
 * 
 * Layout:
 * - Top Navbar (App Name, User Profile, Logout)
 * - Main Dashboard Cards
 * - Feature Panels (Geofencing, Panic Button, Activity)
 * - Authority-Style UI (Clean, Serious, Minimal animations)
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';

// ===== MOCK DATA =====
const MOCK_DATA = {
  safetyScore: 87,
  status: 'Safe',
  lastLocation: 'Shimla, Himachal Pradesh',
  lastUpdate: '2 minutes ago',
  tripId: 'TRP-2026-0114-A7X9',
  tripDuration: 'Jan 12, 2026 - Jan 18, 2026',
  emergencyContacts: [
    { name: 'Local Police', number: '100' },
    { name: 'Tourist Helpline', number: '1363' },
    { name: 'Emergency Services', number: '112' },
  ],
  recentActivity: [
    { time: '10:30 AM', event: 'Check-in confirmed at Hotel Woodville', type: 'info' },
    { time: '09:15 AM', event: 'Entered monitored zone: Mall Road', type: 'info' },
    { time: '08:00 AM', event: 'Daily safety check completed', type: 'success' },
    { time: 'Yesterday', event: 'Route deviation alert - Resolved', type: 'warning' },
  ],
  geofenceAlerts: [
    { zone: 'Ridge Area', status: 'Active', risk: 'Low' },
    { zone: 'Jakhu Temple', status: 'Nearby', risk: 'Moderate' },
    { zone: 'Restricted Zone A', status: 'Clear', risk: 'High' },
  ],
};

// ===== ICON COMPONENTS =====
const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// ===== NAVBAR COMPONENT =====
const Navbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-global-surface border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-global-indigo rounded-lg flex items-center justify-center text-white">
              <ShieldIcon />
            </div>
            <span className="font-bold text-lg text-global-text">SafeTourist</span>
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-global-bg transition-colors"
            >
              <div className="w-8 h-8 bg-global-indigo/10 rounded-full flex items-center justify-center text-global-indigo">
                <UserIcon />
              </div>
              <span className="hidden sm:block text-sm font-medium text-global-text">
                {user?.displayName || user?.email?.split('@')[0] || 'Tourist'}
              </span>
              <svg className="w-4 h-4 text-global-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-global-surface rounded-lg shadow-lg border border-gray-100 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-global-text truncate">
                    {user?.displayName || 'Tourist'}
                  </p>
                  <p className="text-xs text-global-muted truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-global-error hover:bg-global-error/5 transition-colors"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// ===== SAFETY SCORE CARD =====
const SafetyScoreCard = ({ score, status }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-global-success';
    if (score >= 50) return 'text-yellow-500';
    return 'text-global-error';
  };

  const getStatusColor = (status) => {
    if (status === 'Safe') return 'bg-global-success/10 text-global-success';
    if (status === 'Alert') return 'bg-yellow-100 text-yellow-700';
    return 'bg-global-error/10 text-global-error';
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-global-indigo/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-global-muted">Safety Score</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className="text-global-muted text-lg mb-1">/100</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-global-success' : score >= 50 ? 'bg-yellow-500' : 'bg-global-error'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-xs text-global-muted mt-3">
          Your safety score is calculated based on location, activity, and environmental factors.
        </p>
      </div>
    </Card>
  );
};

// ===== LOCATION CARD =====
const LocationCard = ({ location, lastUpdate, tripId }) => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-global-muted">Current Location</h3>
      <div className="flex items-center text-xs text-global-muted">
        <ClockIcon className="w-3 h-3 mr-1" />
        {lastUpdate}
      </div>
    </div>

    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 bg-global-indigo/10 rounded-lg flex items-center justify-center text-global-indigo shrink-0">
        <LocationIcon />
      </div>
      <div>
        <p className="font-semibold text-global-text">{location}</p>
        <p className="text-xs text-global-muted">Monitored Zone</p>
      </div>
    </div>

    {/* Trip ID */}
    <div className="bg-global-bg rounded-lg p-3">
      <p className="text-xs text-global-muted mb-1">Trip ID</p>
      <p className="font-mono text-sm font-semibold text-global-text">{tripId}</p>
    </div>
  </Card>
);

// ===== PANIC BUTTON CARD =====
const PanicButtonCard = ({ onPanic }) => {
  const [pressed, setPressed] = useState(false);

  const handlePanic = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
      onPanic();
    }, 2000);
  };

  return (
    <Card className="text-center">
      <h3 className="text-sm font-medium text-global-muted mb-4">Emergency SOS</h3>

      <button
        onClick={handlePanic}
        disabled={pressed}
        className={`
          w-32 h-32 mx-auto rounded-full 
          flex items-center justify-center
          transition-all duration-200
          ${pressed 
            ? 'bg-global-error scale-110 shadow-lg shadow-global-error/30' 
            : 'bg-global-error/90 hover:bg-global-error hover:scale-105 active:scale-95'
          }
        `}
      >
        {pressed ? (
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2" />
            <span className="text-white text-xs">Sending...</span>
          </div>
        ) : (
          <div className="text-center text-white">
            <svg className="w-10 h-10 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm font-bold">SOS</span>
          </div>
        )}
      </button>

      <p className="text-xs text-global-muted mt-4 max-w-50 mx-auto">
        Press and hold to send an emergency alert to nearby authorities
      </p>
    </Card>
  );
};

// ===== GEOFENCING ALERTS CARD =====
const GeofencingCard = ({ alerts }) => {
  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'bg-global-success/10 text-global-success';
    if (risk === 'Moderate') return 'bg-yellow-100 text-yellow-700';
    return 'bg-global-error/10 text-global-error';
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <MapIcon />
        <h3 className="font-medium text-global-text">Geofencing Alerts</h3>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-global-bg rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-global-text">{alert.zone}</p>
              <p className="text-xs text-global-muted">Status: {alert.status}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(alert.risk)}`}>
              {alert.risk} Risk
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ===== ACTIVITY FEED CARD =====
const ActivityCard = ({ activities }) => {
  const getTypeStyles = (type) => {
    if (type === 'success') return 'bg-global-success';
    if (type === 'warning') return 'bg-yellow-500';
    return 'bg-global-indigo';
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon />
        <h3 className="font-medium text-global-text">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${getTypeStyles(activity.type)}`} />
              {index < activities.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm text-global-text">{activity.event}</p>
              <p className="text-xs text-global-muted">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ===== EMERGENCY CONTACTS CARD =====
const EmergencyContactsCard = ({ contacts }) => (
  <Card>
    <div className="flex items-center gap-2 mb-4">
      <PhoneIcon />
      <h3 className="font-medium text-global-text">Emergency Contacts</h3>
    </div>

    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <a
          key={index}
          href={`tel:${contact.number}`}
          className="flex items-center justify-between p-3 bg-global-bg rounded-lg hover:bg-global-indigo/5 transition-colors"
        >
          <span className="text-sm text-global-text">{contact.name}</span>
          <span className="font-mono font-semibold text-global-indigo">{contact.number}</span>
        </a>
      ))}
    </div>
  </Card>
);

// ===== MAIN DASHBOARD COMPONENT =====
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, kycVerified } = useAuth();
  const [showPanicAlert, setShowPanicAlert] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Handle panic button
  const handlePanic = () => {
    setShowPanicAlert(true);
    setTimeout(() => setShowPanicAlert(false), 5000);
  };

  return (
    <div className="min-h-screen bg-global-bg">
      {/* Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Panic Alert Banner */}
      {showPanicAlert && (
        <div className="bg-global-error text-white py-3 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertIcon />
              <span className="font-medium">Emergency alert sent! Authorities have been notified.</span>
            </div>
            <button 
              onClick={() => setShowPanicAlert(false)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-global-text mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Tourist'}
          </h1>
          <p className="text-global-muted">
            Your safety dashboard • Trip: {MOCK_DATA.tripDuration}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top row - Safety Score & Location */}
            <div className="grid sm:grid-cols-2 gap-6">
              <SafetyScoreCard 
                score={MOCK_DATA.safetyScore} 
                status={MOCK_DATA.status} 
              />
              <LocationCard 
                location={MOCK_DATA.lastLocation}
                lastUpdate={MOCK_DATA.lastUpdate}
                tripId={MOCK_DATA.tripId}
              />
            </div>

            {/* Geofencing Alerts */}
            <GeofencingCard alerts={MOCK_DATA.geofenceAlerts} />

            {/* Activity Feed */}
            <ActivityCard activities={MOCK_DATA.recentActivity} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Panic Button */}
            <PanicButtonCard onPanic={handlePanic} />

            {/* Emergency Contacts */}
            <EmergencyContactsCard contacts={MOCK_DATA.emergencyContacts} />

            {/* Quick Actions */}
            <Card>
              <h3 className="font-medium text-global-text mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="secondary" fullWidth className="justify-start">
                  <MapIcon className="mr-2" />
                  View Safety Map
                </Button>
                <Button variant="secondary" fullWidth className="justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Update Itinerary
                </Button>
                <Button variant="secondary" fullWidth className="justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="mt-12 text-center text-sm text-global-muted">
          <p>
            SafeTourist Safety Monitoring System • Hackathon Technika 2k26
          </p>
          <p className="mt-1">
            This is a demonstration project. All data shown is mock data.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
