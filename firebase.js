/**
 * ===================================
 * FIREBASE CONFIGURATION
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * This file initializes Firebase services:
 * - Authentication (Email/Password + Google OAuth)
 * - Firestore for user profile data
 * - Analytics for tracking
 */

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjMr1NvjL6kdSyOmVELdlxqJt3n4G0tPE",
  authDomain: "devconquest-84f75.firebaseapp.com",
  projectId: "devconquest-84f75",
  storageBucket: "devconquest-84f75.firebasestorage.app",
  messagingSenderId: "396807610318",
  appId: "1:396807610318:web:6076afbc99ebdd41fc959f",
  measurementId: "G-8W725C80RP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export Firebase services for use throughout the app
export {
  app,
  analytics,
  auth,
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
};