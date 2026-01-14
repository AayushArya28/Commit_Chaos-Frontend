/**
 * ===================================
 * AUTH CONTEXT PROVIDER
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Manages authentication state across the application:
 * - User login/logout state
 * - Email verification status
 * - KYC verification status
 * - Loading states
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from '../../firebase';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kycVerified, setKycVerified] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Check KYC status from localStorage (mock persistence)
      if (user) {
        const kycStatus = localStorage.getItem(`kyc_${user.uid}`);
        setKycVerified(kycStatus === 'verified');
        
        // Get and log the user's ID token
        const token = await user.getIdToken();
        console.log("User ID Token:", token);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        return { 
          success: false, 
          error: 'Please verify your email before logging in. Check your inbox.',
          needsVerification: true 
        };
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setKycVerified(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Complete KYC verification
  const completeKyc = () => {
    if (user) {
      localStorage.setItem(`kyc_${user.uid}`, 'verified');
      setKycVerified(true);
    }
  };

  // Reset KYC for testing
  const resetKyc = () => {
    if (user) {
      localStorage.removeItem(`kyc_${user.uid}`);
      setKycVerified(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please login instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email. Please sign up.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  };

  const value = {
    user,
    loading,
    kycVerified,
    signup,
    login,
    loginWithGoogle,
    logout,
    resendVerificationEmail,
    completeKyc,
    resetKyc,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
