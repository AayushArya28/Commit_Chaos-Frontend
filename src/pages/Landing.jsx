/**
 * ===================================
 * LANDING PAGE
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Purpose: Explain problem, solution, trust, and flow clearly in under 10 seconds.
 * 
 * Sections:
 * 1. Hero Section
 * 2. Problem Statement
 * 3. Solution Overview
 * 4. How It Works (4 Steps)
 * 5. Trust & Privacy
 * 6. Footer
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

// ===== ICON COMPONENTS =====
const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EncryptIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const TempIdIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

// ===== HERO SECTION =====
const HeroSection = () => (
  <section className="relative overflow-hidden bg-linear-to-b from-global-indigo/5 to-global-bg pt-20 pb-16 md:pt-28 md:pb-24">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-20 left-10 w-72 h-72 bg-global-indigo/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-global-success/10 rounded-full blur-3xl" />
    </div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 bg-global-indigo/10 text-global-indigo rounded-full text-sm font-medium mb-6">
          <ShieldIcon className="w-4 h-4 mr-2" />
          AI-Powered Tourist Safety
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-global-text leading-tight mb-6">
          Smart, Real-Time{' '}
          <span className="text-global-indigo">Tourist Safety</span>{' '}
          for High-Risk Regions
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-global-muted max-w-2xl mx-auto mb-10">
          Privacy-first monitoring, AI-assisted anomaly detection, and rapid emergency response 
          for tourists in remote and challenging destinations.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button variant="primary" size="lg">
              Login to Your Account
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-global-muted">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-global-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            End-to-End Encryption
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-global-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            24/7 Monitoring
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-global-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Government Grade Security
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ===== PROBLEM STATEMENT SECTION =====
const ProblemSection = () => (
  <section className="py-16 md:py-24 bg-global-surface">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-global-text mb-4">
          The Challenge We're Solving
        </h2>
        <p className="text-global-muted text-lg">
          Tourism in remote regions faces critical safety gaps that put travelers at risk.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {/* Problem 1 */}
        <Card className="text-center border-l-4 border-l-global-error" hover>
          <div className="w-14 h-14 mx-auto mb-4 bg-global-error/10 rounded-full flex items-center justify-center text-global-error">
            <LocationIcon />
          </div>
          <h3 className="text-lg font-semibold text-global-text mb-2">
            Remote & High-Risk Regions
          </h3>
          <p className="text-global-muted text-sm">
            Tourists in remote areas lack reliable communication and tracking infrastructure.
          </p>
        </Card>

        {/* Problem 2 */}
        <Card className="text-center border-l-4 border-l-global-error" hover>
          <div className="w-14 h-14 mx-auto mb-4 bg-global-error/10 rounded-full flex items-center justify-center text-global-error">
            <ClockIcon />
          </div>
          <h3 className="text-lg font-semibold text-global-text mb-2">
            Delayed Rescue Response
          </h3>
          <p className="text-global-muted text-sm">
            Manual tracking methods lead to critical delays in emergency situations.
          </p>
        </Card>

        {/* Problem 3 */}
        <Card className="text-center border-l-4 border-l-global-error" hover>
          <div className="w-14 h-14 mx-auto mb-4 bg-global-error/10 rounded-full flex items-center justify-center text-global-error">
            <AlertIcon />
          </div>
          <h3 className="text-lg font-semibold text-global-text mb-2">
            Poor Coordination
          </h3>
          <p className="text-global-muted text-sm">
            Fragmented communication between tourists, guides, and emergency services.
          </p>
        </Card>
      </div>
    </div>
  </section>
);

// ===== SOLUTION OVERVIEW SECTION =====
const SolutionSection = () => (
  <section className="py-16 md:py-24 bg-global-bg">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-global-text mb-4">
          Our Smart Safety Solution
        </h2>
        <p className="text-global-muted text-lg">
          A comprehensive, privacy-first approach to tourist safety using cutting-edge technology.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Solution 1 */}
        <Card className="text-center" hover>
          <div className="w-14 h-14 mx-auto mb-4 bg-global-indigo/10 rounded-full flex items-center justify-center text-global-indigo">
            <UserIcon />
          </div>
          <h3 className="text-lg font-semibold text-global-text mb-2">
            Digital Tourist ID
          </h3>
          <p className="text-global-muted text-sm">
            Secure, verified digital identity for seamless check-ins and emergency identification.
          </p>
        </Card>

        {/* Solution 2 */}
        <Card className="text-center" hover>
          <div className="w-14 h-14 mx-auto mb-4 bg-global-success/10 rounded-full flex items-center justify-center text-global-success">
            <DashboardIcon />
          </div>
          <h3 className="text-lg font-semibold text-global-text mb-2">
            Real-time Safety Score
          </h3>
          <p className="text-global-muted text-sm">
            Live monitoring with dynamic safety assessment based on location and conditions.
          </p>
        </Card>

        {/* Solution 3 */}
        <Card className="text-center" hover>
          <div className="w-14 h-14 mx-auto mb-4 bg-global-indigo/10 rounded-full flex items-center justify-center text-global-indigo">
            <AlertIcon />
          </div>
          <h3 className="text-lg font-semibold text-global-text mb-2">
            AI Anomaly Detection
          </h3>
          <p className="text-global-muted text-sm">
            Intelligent alerts for unusual patterns, potential risks, and deviations from planned routes.
          </p>
        </Card>

        {/* Solution 4 */}
        <Card className="text-center" hover>
          <div className="w-14 h-14 mx-auto mb-4 bg-global-error/10 rounded-full flex items-center justify-center text-global-error">
            <PhoneIcon />
          </div>
          <h3 className="text-lg font-semibold text-global-text mb-2">
            Emergency Dashboard
          </h3>
          <p className="text-global-muted text-sm">
            One-click SOS alerts with instant coordination between tourists and rescue teams.
          </p>
        </Card>
      </div>
    </div>
  </section>
);

// ===== HOW IT WORKS SECTION =====
const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Secure Login',
      description: 'Create your account with email verification or Google OAuth for instant access.',
      icon: <LockIcon />,
      color: 'bg-global-indigo',
    },
    {
      number: '02',
      title: 'KYC Verification',
      description: 'Complete face verification with your government ID for secure identity confirmation.',
      icon: <CameraIcon />,
      color: 'bg-global-indigo',
    },
    {
      number: '03',
      title: 'Live Safety Dashboard',
      description: 'Access your personalized dashboard with real-time safety scores and monitoring.',
      icon: <DashboardIcon />,
      color: 'bg-global-success',
    },
    {
      number: '04',
      title: 'Emergency Support',
      description: 'One-tap panic button connects you instantly with local emergency responders.',
      icon: <PhoneIcon />,
      color: 'bg-global-error',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-global-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-global-text mb-4">
            How It Works
          </h2>
          <p className="text-global-muted text-lg">
            Get started in minutes with our simple 4-step process.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200" />
                )}
                
                <Card className="relative z-10 text-center h-full">
                  {/* Step number */}
                  <div className={`w-12 h-12 mx-auto mb-4 ${step.color} text-white rounded-full flex items-center justify-center font-bold text-lg`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 mx-auto mb-3 text-global-muted flex items-center justify-center">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-global-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-global-muted text-sm">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== TRUST & PRIVACY SECTION =====
const TrustSection = () => (
  <section className="py-16 md:py-24 bg-global-indigo text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Built on Trust & Privacy
        </h2>
        <p className="text-white/80 text-lg">
          Your safety data is protected with enterprise-grade security measures.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Privacy 1 */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <LockIcon />
          </div>
          <h3 className="text-lg font-semibold mb-2">Privacy-First Design</h3>
          <p className="text-white/70 text-sm">
            Minimal data collection with user consent at every step.
          </p>
        </div>

        {/* Privacy 2 */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <EncryptIcon />
          </div>
          <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
          <p className="text-white/70 text-sm">
            All data transmitted and stored with military-grade encryption.
          </p>
        </div>

        {/* Privacy 3 */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <TempIdIcon />
          </div>
          <h3 className="text-lg font-semibold mb-2">Temporary Trip IDs</h3>
          <p className="text-white/70 text-sm">
            Digital IDs are valid only for trip duration, then automatically purged.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ===== FOOTER =====
const Footer = () => (
  <footer className="bg-global-text py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Disclaimer */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <ShieldIcon className="w-6 h-6 text-global-indigo" />
              <span className="text-white font-bold text-lg">SafeTourist</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              A hackathon project demonstrating Smart Tourist Safety Monitoring & Incident Response System capabilities.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
              Sign Up
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 SafeTourist. Built for Hackathon Technika 2k26. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

// ===== MAIN LANDING PAGE COMPONENT =====
const Landing = () => {
  return (
    <div className="min-h-screen bg-global-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-global-surface/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-global-indigo rounded-lg flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-global-text">SafeTourist</span>
            </Link>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
