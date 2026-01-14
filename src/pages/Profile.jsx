/**
 * ===================================
 * PROFILE PAGE
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Features:
 * - Display user profile information from Firebase
 * - Edit and save profile details
 * - Profile photo upload using ImgBB API
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';

// ImgBB API Key
const IMGBB_API_KEY = '02e05096caf2e12484428cf12fc5cbc3';

// Shield Icon for branding
const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Camera Icon
const CameraIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// User Icon
const UserIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    photoURL: '',
  });

  // Emergency contacts state (1-3 contacts)
  const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', phone: '' }]);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user profile data
  useEffect(() => {
    if (user && userProfile) {
      setFormData({
        displayName: userProfile.displayName || user.displayName || '',
        email: userProfile.email || user.email || '',
        phone: userProfile.phone || '',
        photoURL: userProfile.photoURL || user.photoURL || '',
      });
      // Load emergency contacts
      if (userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0) {
        setEmergencyContacts(userProfile.emergencyContacts);
      }
    } else if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user, userProfile]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle photo upload to ImgBB
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 10MB' });
      return;
    }

    setUploadingPhoto(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare FormData for ImgBB
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      formDataUpload.append('key', IMGBB_API_KEY);

      // Upload to ImgBB
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      
      const result = await response.json();

      if (result.success) {
        const photoURL = result.data.url;
        
        // Update form data with new photo URL
        setFormData(prev => ({ ...prev, photoURL }));
        
        // Save to Firebase
        const updateResult = await updateUserProfile({ photoURL });
        
        if (updateResult.success) {
          setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
        } else {
          setMessage({ type: 'error', text: 'Failed to save photo. Please try again.' });
        }
      } else {
        console.error('ImgBB upload failed:', result);
        setMessage({ type: 'error', text: 'Failed to upload photo. Please try again.' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'An error occurred while uploading. Please try again.' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle emergency contact change
  const handleContactChange = (index, field, value) => {
    const updated = [...emergencyContacts];
    updated[index][field] = value;
    setEmergencyContacts(updated);
  };

  // Add new emergency contact (max 3)
  const addEmergencyContact = () => {
    if (emergencyContacts.length < 3) {
      setEmergencyContacts([...emergencyContacts, { name: '', phone: '' }]);
    }
  };

  // Remove emergency contact (min 1)
  const removeEmergencyContact = (index) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate emergency contacts - at least 1 valid contact required
    const validContacts = emergencyContacts.filter(c => c.name.trim() && c.phone.trim());
    if (validContacts.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one emergency contact with name and phone number.' });
      setLoading(false);
      return;
    }

    const result = await updateUserProfile({
      displayName: formData.displayName,
      phone: formData.phone,
      emergencyContacts: validContacts,
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }

    setLoading(false);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-global-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-global-indigo rounded-lg flex items-center justify-center text-white">
              <ShieldIcon />
            </div>
            <span className="font-bold text-xl text-global-text">SafeTourist</span>
          </Link>
          
          <Button variant="ghost" onClick={handleLogout}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-global-text mb-2">My Profile</h1>
            <p className="text-global-muted">Manage your account information</p>
          </div>

          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-global-indigo/20">
                {formData.photoURL ? (
                  <img 
                    src={formData.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon />
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 w-10 h-10 bg-global-indigo text-white rounded-full flex items-center justify-center shadow-lg hover:bg-global-indigo/90 transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CameraIcon />
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            
            <p className="text-sm text-global-muted mt-3">
              Click the camera icon to upload a new photo
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg border mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p className="text-sm flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {message.text}
              </p>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <Input
              label="Full Name"
              name="displayName"
              type="text"
              placeholder="Enter your full name"
              value={formData.displayName}
              onChange={handleChange}
              disabled={!isEditing}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            {/* Email (Read-only) */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              disabled={true}
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
              disabled={!isEditing}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />

            {/* Emergency Contacts Section */}
            <div className="bg-global-bg rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-global-text">Emergency Contacts</p>
                  <p className="text-xs text-global-muted">Add 1-3 contacts for SOS alerts</p>
                </div>
                {isEditing && emergencyContacts.length < 3 && (
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    className="text-global-indigo text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Contact
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-global-indigo/20 bg-white text-global-text text-sm disabled:bg-gray-50 disabled:text-global-muted"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={contact.phone}
                        onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-global-indigo/20 bg-white text-global-text text-sm disabled:bg-gray-50 disabled:text-global-muted"
                      />
                    </div>
                    {isEditing && emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {!isEditing && emergencyContacts.filter(c => c.name && c.phone).length === 0 && (
                <p className="text-xs text-red-500 mt-2">⚠️ No emergency contacts added. Please edit your profile to add at least one.</p>
              )}
            </div>

            {/* KYC Status */}
            <div className="bg-global-bg rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-global-text">KYC Verification</p>
                  <p className="text-xs text-global-muted">Identity verification status</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  ✓ Verified
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data
                      if (userProfile) {
                        setFormData({
                          displayName: userProfile.displayName || user?.displayName || '',
                          email: userProfile.email || user?.email || '',
                          phone: userProfile.phone || '',
                          photoURL: userProfile.photoURL || user?.photoURL || '',
                        });
                        // Reset emergency contacts
                        if (userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0) {
                          setEmergencyContacts(userProfile.emergencyContacts);
                        } else {
                          setEmergencyContacts([{ name: '', phone: '' }]);
                        }
                      }
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  fullWidth
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>

          {/* Back to Dashboard */}
          <div className="mt-6 text-center">
            <Link 
              to="/dashboard" 
              className="text-global-indigo text-sm hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
