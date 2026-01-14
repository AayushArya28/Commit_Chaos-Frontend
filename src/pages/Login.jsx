/**
 * ===================================
 * LOGIN PAGE
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Features:
 * - Email and Password fields
 * - Google Login option
 * - Error handling for invalid credentials & unverified email
 * - On success → redirect to KYC page
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';

// Shield Icon for branding
const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, kycVerified, currentUser } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  // Check for redirect result on mount
  useEffect(() => {
    // Check for redirect error
    const redirectError = sessionStorage.getItem('googleRedirectError');
    if (redirectError) {
      setErrors({ submit: redirectError });
      sessionStorage.removeItem('googleRedirectError');
    }
    
    // Check for successful redirect login
    const redirectSuccess = sessionStorage.getItem('googleRedirectSuccess');
    if (redirectSuccess && currentUser) {
      sessionStorage.removeItem('googleRedirectSuccess');
      const kycStatus = localStorage.getItem(`kyc_${currentUser.uid}`);
      if (kycStatus === 'verified') {
        navigate('/dashboard');
      } else {
        navigate('/kyc');
      }
    }
  }, [currentUser, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setNeedsVerification(false);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setNeedsVerification(false);

    const result = await login(formData.email, formData.password, formData.phone);

    if (result.success) {
      // Navigate based on KYC status
      const kycStatus = localStorage.getItem(`kyc_${result.user.uid}`);
      if (kycStatus === 'verified') {
        navigate('/dashboard');
      } else {
        navigate('/kyc');
      }
    } else {
      if (result.needsVerification) {
        setNeedsVerification(true);
      }
      setErrors({ submit: result.error });
    }

    setLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({});

    const result = await loginWithGoogle();

    if (result.success) {
      // If redirect flow (mobile), the page will reload
      // The redirect result is handled in AuthContext
      if (result.redirect) {
        // Keep loading state as page will redirect
        return;
      }
      
      // Check KYC status
      const kycStatus = localStorage.getItem(`kyc_${result.user.uid}`);
      if (kycStatus === 'verified') {
        navigate('/dashboard');
      } else {
        navigate('/kyc');
      }
    } else {
      setErrors({ submit: result.error });
    }

    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-global-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-global-indigo rounded-lg flex items-center justify-center">
              <ShieldIcon />
            </div>
            <span className="font-bold text-2xl text-global-text">SafeTourist</span>
          </Link>
          <h1 className="text-2xl font-bold text-global-text mb-2">
            Welcome Back
          </h1>
          <p className="text-global-muted">
            Login to access your safety dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Submit error */}
            {errors.submit && (
              <div className={`p-4 rounded-lg border ${needsVerification ? 'bg-yellow-50 border-yellow-200' : 'bg-global-error/10 border-global-error/20'}`}>
                <p className={`text-sm flex items-start ${needsVerification ? 'text-yellow-700' : 'text-global-error'}`}>
                  <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    {needsVerification ? (
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}

            {/* Email */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />

            {/* Password */}
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <button 
                type="button"
                className="text-sm text-global-indigo hover:underline"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-6"
            >
              Login to Dashboard
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-global-surface text-global-muted">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="google"
              fullWidth
              onClick={handleGoogleLogin}
              loading={googleLoading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-global-muted text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-global-indigo font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </Card>

        {/* Back to home */}
        <p className="mt-6 text-center">
          <Link to="/" className="text-global-muted text-sm hover:text-global-text transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
