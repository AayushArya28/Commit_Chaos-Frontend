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
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
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
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kycVerified, setKycVerified] = useState(false);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        await fetchUserProfile(user.uid);
        
        // Check KYC status from localStorage (mock persistence)
        const kycStatus = localStorage.getItem(`kyc_${user.uid}`);
        setKycVerified(kycStatus === 'verified');
        
        // Get and log the user's ID token
        const token = await user.getIdToken();
        console.log("User ID Token:", token);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
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
  const login = async (email, password, phone = null) => {
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
      
      // Update phone number in profile if provided
      if (phone) {
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          await updateDoc(userDocRef, { phone });
        } else {
          await setDoc(userDocRef, {
            email: userCredential.user.email,
            phone,
            displayName: userCredential.user.displayName || '',
            photoURL: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        await fetchUserProfile(userCredential.user.uid);
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
      
      // Create/update user profile in Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: result.user.email,
          phone: '',
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      await fetchUserProfile(result.user.uid);
      
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

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const updateData = {
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      
      if (userDoc.exists()) {
        await updateDoc(userDocRef, updateData);
      } else {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || '',
          phone: '',
          photoURL: '',
          createdAt: new Date().toISOString(),
          ...updateData
        });
      }
      
      await fetchUserProfile(user.uid);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
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
    userProfile,
    loading,
    kycVerified,
    signup,
    login,
    loginWithGoogle,
    logout,
    resendVerificationEmail,
    completeKyc,
    resetKyc,
    updateUserProfile,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
