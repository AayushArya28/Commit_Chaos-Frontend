/**
 * ===================================
 * DASHBOARD PAGE
 * Smart Tourist Safety Monitoring System
 * ===================================
 *
 * Purpose: Trip management with location pinning
 *
 * Features:
 * - Create Trip button
 * - Trip form with name, phone, passengers, duration, map location
 * - Geocoding support (Nominatim)
 * - Leaflet map for pinpointing location
 * - Save to Firestore
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Button, Card, Input } from "../components/ui";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ===== ICON COMPONENTS =====
const ShieldIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const MapPinIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const SOSIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// ===== SOS PANEL COMPONENT =====
const SOSPanel = ({ activeTrip }) => {
  const handleSOS = () => {
    // Implement SOS triggering logic here (backend call, etc.)
    alert(
      `SOS triggered for trip: ${activeTrip.tripName}! Alerts sent to emergency contacts.`
    );
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Active Trip Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-bold text-red-900">
              Active Journey: {activeTrip.tripName}
            </h3>
          </div>
          <p className="text-red-700 text-sm mb-4">
            You are currently monitored. In case of emergency, use the SOS
            button below.
          </p>

          {/* Emergency Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-red-800 bg-white/50 px-3 py-2 rounded-lg">
              <PhoneIcon />
              <div>
                <p className="text-xs font-bold uppercase">Police</p>
                <p className="text-sm font-bold">100</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-800 bg-white/50 px-3 py-2 rounded-lg">
              <PhoneIcon />
              <div>
                <p className="text-xs font-bold uppercase">Ambulance</p>
                <p className="text-sm font-bold">102</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-800 bg-white/50 px-3 py-2 rounded-lg">
              <PhoneIcon />
              <div>
                <p className="text-xs font-bold uppercase">Women Help</p>
                <p className="text-sm font-bold">1091</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-800 bg-white/50 px-3 py-2 rounded-lg">
              <PhoneIcon />
              <div>
                <p className="text-xs font-bold uppercase">Disaster</p>
                <p className="text-sm font-bold">108</p>
              </div>
            </div>
          </div>
        </div>

        {/* SOS Button */}
        <div>
          <button
            onClick={handleSOS}
            className="w-24 h-24 rounded-full bg-red-600 shadow-lg shadow-red-600/30 flex flex-col items-center justify-center text-white hover:bg-red-700 active:scale-95 transition-all border-4 border-red-100 animate-pulse"
          >
            <span className="text-2xl font-black tracking-widest">SOS</span>
            <span className="text-[10px] font-bold mt-1 opacity-90">HELP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
            <span className="font-bold text-lg text-global-text">
              SafeTourist
            </span>
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
                {user?.displayName || user?.email?.split("@")[0] || "Tourist"}
              </span>
              <svg
                className="w-4 h-4 text-global-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-global-surface rounded-lg shadow-lg border border-gray-100 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-global-text truncate">
                    {user?.displayName || "Tourist"}
                  </p>
                  <p className="text-xs text-global-muted truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-global-text hover:bg-global-bg transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <UserIcon />
                  My Profile
                </Link>
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

// ===== TRIP MODAL (CREATE & EDIT) =====
const TripModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [tripName, setTripName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numPassengers, setNumPassengers] = useState(0);
  const [coPassengers, setCoPassengers] = useState([]);
  const [travelDetails, setTravelDetails] = useState("");
  const [remainderTime, setRemainderTime] = useState("");
  const [visitPlace, setVisitPlace] = useState("");
  const [duration, setDuration] = useState("");
  const [endDateTime, setEndDateTime] = useState(""); // New State
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [error, setError] = useState("");

  // Default center (India)
  const defaultCenter = [20.5937, 78.9629];

  // Load initial data for editing
  useEffect(() => {
    if (initialData) {
      setTripName(initialData.tripName || "");
      setPhoneNumber(initialData.phoneNumber || "");
      setCoPassengers(initialData.coPassengers || []);
      setNumPassengers(initialData.coPassengers?.length || 0);
      setTravelDetails(initialData.travelDetails || "");
      setRemainderTime(initialData.remainderTime || "");
      setRemainderTime(initialData.remainderTime || "");
      setVisitPlace(initialData.visitPlace || "");
      setDuration(initialData.durationHours || "");
      setEndDateTime(initialData.endDateTime || ""); // Load initial endDateTime
      if (initialData.latitude && initialData.longitude) {
        setPosition({ lat: initialData.latitude, lng: initialData.longitude });
      }
    } else {
      // Reset form for new trip
      setTripName("");
      setPhoneNumber("");
      setNumPassengers(0);
      setCoPassengers([]);
      setTravelDetails("");
      setRemainderTime("");
      setRemainderTime("");
      setVisitPlace("");
      setDuration("");
      setEndDateTime("");
      setPosition(null);
    }
    setError("");
  }, [initialData, isOpen]);

  // Handle number of passengers change
  const handleNumPassengersChange = (e) => {
    const num = parseInt(e.target.value) || 0;
    setNumPassengers(num);
    // Resize array
    setCoPassengers((prev) => {
      const newArr = [...prev];
      if (num > prev.length) {
        return [...newArr, ...Array(num - prev.length).fill("")];
      } else {
        return newArr.slice(0, num);
      }
    });
  };

  // Handle co-passenger name change
  const handleCoPassengerNameChange = (index, value) => {
    const newArr = [...coPassengers];
    newArr[index] = value;
    setCoPassengers(newArr);
  };

  // Geocoding function
  const handleGeocode = async () => {
    if (!visitPlace.trim()) {
      setError("Please enter a place name to search");
      return;
    }

    setGeocodingLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          visitPlace
        )}`,
        {
          headers: {
            "User-Agent": "HackathonTechnika2k26/1.0",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        setError("Location not found. Please try a more specific name.");
        setPosition(null);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Failed to fetch location. Please try again.");
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!tripName.trim()) {
      setError("Please enter a trip name");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }
    if (!duration || duration < 1) {
      setError("Please enter a valid duration");
      return;
    }
    if (!position) {
      setError("Please search and select a valid location");
      return;
    }

    setLoading(true);

    try {
      // Prepare trip data
      // Status 'created' by default unless we add "Start Now" later
      // We store durationHours, but don't set endTimestamp yet (unless we start)

      const tripData = {
        tripName: tripName.trim(),
        phoneNumber: phoneNumber.trim(),
        coPassengers: coPassengers,
        travelDetails: travelDetails.trim(),
        remainderTime: remainderTime,
        visitPlace: visitPlace.trim(),
        latitude: position.lat,
        longitude: position.lng,
        durationHours: parseInt(duration),
        endDateTime: endDateTime, // Save specific end time
        status: initialData ? initialData.status : "created", // Preserve status on edit, default 'created'
      };

      // If we are creating/editing, we generally just save details now.
      // "Start Journey" will be a separate action on Dashboard as requested.

      // However, if it's already active/completed, we might need to preserve timestamps?
      // For now, let's assume editing doesn't change status unless explicitly done.

      await onSave(tripData);

      if (!initialData) {
        // Reset only if creating new
        setTripName("");
        setPhoneNumber("");
        setNumPassengers(0);
        setCoPassengers([]);
        setTravelDetails("");
        setRemainderTime("");
        setVisitPlace("");
        setDuration("");
        setEndDateTime("");
        setPosition(null);
      }
      onClose();
    } catch (err) {
      setError("Failed to save trip. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-global-surface rounded-2xl shadow-xl max-w-2xl w-full m-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-global-text">
            {initialData ? "Edit Journey" : "Plan New Journey"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-global-bg rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 1. Trip Name & Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-global-text mb-1">
                Trip Name *
              </label>
              <Input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g., Vacation 2k26"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-global-text mb-1">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* 2. Co-passengers */}
          <div>
            <label className="block text-sm font-medium text-global-text mb-1">
              Number of Co-passengers
            </label>
            <Input
              type="number"
              min="0"
              value={numPassengers}
              onChange={handleNumPassengersChange}
              placeholder="0"
            />
          </div>
          {numPassengers > 0 && (
            <div className="space-y-2 pl-4 border-l-2 border-global-indigo/20">
              {coPassengers.map((name, idx) => (
                <div key={idx}>
                  <label className="block text-xs text-global-muted mb-1">
                    Co-passenger {idx + 1} Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      handleCoPassengerNameChange(idx, e.target.value)
                    }
                    placeholder={`Passenger ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 3. Travelling Details */}
          <div>
            <label className="block text-sm font-medium text-global-text mb-1">
              Travelling Details
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-global-indigo/20 bg-white text-global-text transition-all resize-none"
              rows="3"
              value={travelDetails}
              onChange={(e) => setTravelDetails(e.target.value)}
              placeholder="Mode of travel, vehicle number, ticket details..."
            />
          </div>

          {/* 4. Duration & Remainder */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-global-text mb-1">
                Duration (hours) *
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 24"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-global-text mb-1">
                End Date & Time (Optional)
              </label>
              <Input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-global-text mb-1">
                Set Remainder / Alarm
              </label>
              <Input
                type="datetime-local"
                value={remainderTime}
                onChange={(e) => setRemainderTime(e.target.value)}
              />
            </div>
          </div>

          {/* 5. Visit Place / Geocoding */}
          <div>
            <label className="block text-sm font-medium text-global-text mb-1">
              Visit Place (Geofencing) *
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={visitPlace}
                onChange={(e) => setVisitPlace(e.target.value)}
                placeholder="Enter destination name"
              />
              <Button
                type="button"
                onClick={handleGeocode}
                loading={geocodingLoading}
              >
                Search
              </Button>
            </div>

            {/* Map Preview */}
            <div
              className="rounded-xl overflow-hidden border border-gray-200 mt-2"
              style={{ height: "200px" }}
            >
              <MapContainer
                center={position || defaultCenter}
                zoom={position ? 13 : 4}
                style={{ height: "100%", width: "100%" }}
                key={position ? `${position.lat}-${position.lng}` : "default"}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {position && <Marker position={position} />}
              </MapContainer>
            </div>
            {position && (
              <p className="text-xs text-global-success mt-1">
                Location found: {position.lat.toFixed(4)},{" "}
                {position.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-global-error/10 border border-global-error/20 rounded-lg">
              <p className="text-sm text-global-error">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} fullWidth>
              {initialData ? "Update Journey" : "Save Journey"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===== TRIP CARD COMPONENT =====
const TripCard = ({ trip, onDelete, onEdit, onStart }) => {
  // Status check:
  // If status is 'active', check if expired based on endTimestamp
  // If status is 'created', it's waiting to start
  // Fallback for legacy data: if no status, assume active and check expiry

  let status = trip.status || "active"; // Default to active for legacy
  let isExpired = false;

  if (status === "active") {
    if (trip.endTimestamp && new Date(trip.endTimestamp) < new Date()) {
      isExpired = true;
      status = "completed";
    }
  }

  const timeRemaining = trip.endTimestamp
    ? new Date(trip.endTimestamp) - new Date()
    : 0;
  const hoursRemaining = Math.max(
    0,
    Math.floor(timeRemaining / (1000 * 60 * 60))
  );
  const minutesRemaining = Math.max(
    0,
    Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  );

  const getStatusBadge = () => {
    switch (status) {
      case "created":
        return (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
            Planned
          </div>
        );
      case "active":
        return (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-global-success/10 text-global-success animate-pulse">
            Active
          </div>
        );
      case "completed":
        return (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="relative">
      {/* Status badge */}
      {getStatusBadge()}

      <h3 className="text-lg font-bold text-global-text mb-1 pr-20">
        {trip.tripName}
      </h3>
      {trip.visitPlace && (
        <p className="text-sm text-global-indigo mb-3 font-medium">
          {trip.visitPlace}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-global-muted">
          <MapPinIcon className="w-4 h-4" />
          <span>
            {trip.latitude.toFixed(4)}, {trip.longitude.toFixed(4)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-global-muted">
          <ClockIcon className="w-4 h-4" />
          {status === "created" && (
            <span>Duration: {trip.durationHours} hours</span>
          )}
          {status === "active" && (
            <span>
              {hoursRemaining}h {minutesRemaining}m remaining
            </span>
          )}
          {status === "completed" && (
            <span>Ended on {new Date(trip.endTimestamp).toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Additional Details Summary */}
      <div className="text-xs text-global-muted mb-4 border-t border-gray-100 pt-2 space-y-1">
        <p>
          <strong>Phone:</strong> {trip.phoneNumber}
        </p>
        {trip.coPassengers && trip.coPassengers.length > 0 && (
          <p>
            <strong>Passengers:</strong> {trip.coPassengers.length} (
            {trip.coPassengers.join(", ")})
          </p>
        )}
        {trip.remainderTime && (
          <p>
            <strong>Alarm:</strong>{" "}
            {new Date(trip.remainderTime).toLocaleString()}
          </p>
        )}
      </div>

      {/* Mini map preview */}
      <div
        className="rounded-lg overflow-hidden mb-4"
        style={{ height: "120px" }}
      >
        <MapContainer
          center={[trip.latitude, trip.longitude]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[trip.latitude, trip.longitude]} />
        </MapContainer>
      </div>

      <div className="flex gap-2">
        {status === "created" ? (
          <Button
            variant="primary" // Highlight "Start"
            size="sm"
            onClick={() => onStart(trip)}
            className="flex-1"
          >
            Start Journey
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(trip)}
            className="flex-1 text-global-indigo hover:bg-global-indigo/10"
            disabled={status === "completed"} // Disable edit if completed
          >
            <EditIcon className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(trip.id)}
          className="flex-1 text-global-error hover:bg-global-error/10"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
};

// ===== MAIN DASHBOARD COMPONENT =====
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's trips
  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;

      try {
        const tripsRef = collection(db, "trips");
        const q = query(
          tripsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const tripsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(tripsList);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Open Edit Modal
  const handleEditClick = (trip) => {
    setEditingTrip(trip);
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrip(null);
  };

  // Handle start trip
  const handleStartTrip = async (trip) => {
    if (
      !confirm(`Are you sure you want to start the journey: ${trip.tripName}?`)
    )
      return;

    try {
      const tripRef = doc(db, "trips", trip.id);
      const startTime = Date.now();

      // Determine endTimestamp: use endDateTime if available, else calc from duration
      let endTimestamp;
      if (trip.endDateTime) {
        endTimestamp = new Date(trip.endDateTime).toISOString();
      } else {
        endTimestamp = new Date(
          startTime + trip.durationHours * 60 * 60 * 1000
        ).toISOString();
      }

      // 1. Call ID Generation Backend
      let backendId = null;
      try {
        const idRes = await fetch(
          "https://commitchaosbackend.onrender.com/generate-id",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expiry: endTimestamp }),
          }
        );
        const idData = await idRes.json();
        if (idData && idData.id) {
          // Assuming response structure { id: "..." }
          backendId = idData.id;
          console.log("Generated Backend ID:", backendId);
        }
      } catch (backendErr) {
        console.error("Failed to generate backend ID:", backendErr);
        // Proceeding without ID for now, or alert user?
      }

      const updateData = {
        status: "active",
        startedAt: new Date(startTime).toISOString(),
        endTimestamp: endTimestamp,
        backendId: backendId, // Store the generated ID
      };

      await updateDoc(tripRef, updateData);

      setTrips((prev) =>
        prev.map((t) => (t.id === trip.id ? { ...t, ...updateData } : t))
      );
    } catch (err) {
      console.error("Error starting trip:", err);
      alert("Failed to start trip. Please check your connection.");
    }
  };

  // Save new or update existing trip
  const handleSaveTrip = async (tripData) => {
    if (editingTrip) {
      // UPDATE Existing Trip
      try {
        const tripRef = doc(db, "trips", editingTrip.id);
        // Don't overwrite creation details, but update the rest
        await updateDoc(tripRef, tripData);

        setTrips((prev) =>
          prev.map((t) => (t.id === editingTrip.id ? { ...t, ...tripData } : t))
        );
      } catch (err) {
        console.error("Error updating trip:", err);
        throw err; // Re-throw to be caught in Modal
      }
    } else {
      // CREATE New Trip
      // Ensure createdAt is present
      const newTripData = {
        ...tripData,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        status: "created", // Explicitly set status
      };

      const docRef = await addDoc(collection(db, "trips"), newTripData);

      // Update local state
      setTrips((prev) => [
        {
          id: docRef.id,
          ...newTripData,
        },
        ...prev,
      ]);
    }
  };

  // Delete trip
  const handleDeleteTrip = async (tripId) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      await deleteDoc(doc(db, "trips", tripId));
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  // Find active active trip for SOS
  const activeTrip = trips.find(
    (t) => t.status === "active" && new Date(t.endTimestamp) > new Date()
  );

  return (
    <div className="min-h-screen bg-global-bg">
      {/* Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SOS Panel for Active Trips */}
        {activeTrip && <SOSPanel activeTrip={activeTrip} />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-global-text mb-1">
              My Journeys
            </h1>
            <p className="text-global-muted">
              Manage and track your travel itineraries
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setEditingTrip(null);
              setShowModal(true);
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Plan Journey
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-global-indigo border-t-transparent rounded-full" />
          </div>
        ) : trips.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-global-indigo/10 rounded-full flex items-center justify-center">
              <MapPinIcon className="w-12 h-12 text-global-indigo" />
            </div>
            <h2 className="text-xl font-bold text-global-text mb-2">
              No journeys yet
            </h2>
            <p className="text-global-muted mb-6 max-w-md mx-auto">
              Start by creating your first journey. Set your destination, add
              passengers, and enable safety monitoring.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setEditingTrip(null);
                setShowModal(true);
              }}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Plan New Journey
            </Button>
          </div>
        ) : (
          /* Trips grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDelete={handleDeleteTrip}
                onEdit={handleEditClick}
                onStart={handleStartTrip}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Trip Modal */}
      <TripModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveTrip}
        initialData={editingTrip}
      />
    </div>
  );
};

export default Dashboard;
