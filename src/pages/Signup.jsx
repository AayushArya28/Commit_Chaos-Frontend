/**
 * ===================================
 * SIGNUP PAGE
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Features:
 * - Full Name, Email, Password, Confirm Password fields
 * - Firebase email verification required
 * - Inline validation
 * - Tailwind styled error/success messages (NO alert())
 * - Google OAuth option
 * - After signup: Show "Verify your email to continue" screen
 */

import React, { useState } from 'react';
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

// Email Verification Success Screen
const EmailVerificationScreen = ({ email, onResend, resending }) => (
  <div className="text-center py-8">
    {/* Success icon */}
    <div className="w-20 h-20 mx-auto mb-6 bg-global-success/10 rounded-full flex items-center justify-center">
      <svg className="w-10 h-10 text-global-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>

    <h2 className="text-2xl font-bold text-global-text mb-3">
      Verify Your Email
    </h2>

    <p className="text-global-muted mb-6 max-w-sm mx-auto">
      We've sent a verification link to{' '}
      <span className="font-semibold text-global-text">{email}</span>.
      Please check your inbox and click the link to continue.
    </p>

    {/* Tips */}
    <div className="bg-global-bg rounded-lg p-4 mb-6 text-left max-w-sm mx-auto">
      <p className="text-sm font-medium text-global-text mb-2">Didn't receive the email?</p>
      <ul className="text-sm text-global-muted space-y-1">
        <li>• Check your spam or junk folder</li>
        <li>• Make sure you entered the correct email</li>
        <li>• Wait a few minutes and try again</li>
      </ul>
    </div>

    <div className="space-y-3">
      <Button 
        variant="secondary" 
        onClick={onResend} 
        loading={resending}
        fullWidth
      >
        Resend Verification Email
      </Button>

      <Link to="/login">
        <Button variant="ghost" fullWidth>
          Back to Login
        </Button>
      </Link>
    </div>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [resending, setResending] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const result = await signup(formData.email, formData.password);

    if (result.success) {
      setShowVerification(true);
    } else {
      setErrors({ submit: result.error });
    }

    setLoading(false);
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setErrors({});

    const result = await loginWithGoogle();

    if (result.success) {
      // Google accounts are pre-verified, go directly to KYC
      navigate('/kyc');
    } else {
      setErrors({ submit: result.error });
    }

    setGoogleLoading(false);
  };

  // Handle resend verification email
  const handleResend = async () => {
    setResending(true);
    // In a real app, you'd call resendVerificationEmail here
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResending(false);
  };

  // Show verification screen after successful signup
  if (showVerification) {
    return (
      <div className="min-h-screen bg-global-bg flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <EmailVerificationScreen 
            email={formData.email}
            onResend={handleResend}
            resending={resending}
          />
        </Card>
      </div>
    );
  }

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
            Create Your Account
          </h1>
          <p className="text-global-muted">
            Start your journey to safer travel experiences
          </p>
        </div>

        {/* Signup Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Submit error */}
            {errors.submit && (
              <div className="p-4 bg-global-error/10 border border-global-error/20 rounded-lg">
                <p className="text-global-error text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Full Name */}
            <Input
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

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

            {/* Password */}
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="At least 6 characters with one number"
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-6"
            >
              Create Account
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

            {/* Google Signup */}
            <Button
              type="button"
              variant="google"
              fullWidth
              onClick={handleGoogleSignup}
              loading={googleLoading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-global-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-global-indigo font-semibold hover:underline">
              Login here
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

export default Signup;
