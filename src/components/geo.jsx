import { useEffect, useState, useRef, useCallback } from "react";
import { auth } from "../../firebase";
import { GoogleMap, LoadScript, HeatmapLayer, Circle } from "@react-google-maps/api";

// Google Maps libraries needed for heatmap
const GOOGLE_MAPS_LIBRARIES = ["visualization"];
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBWeejGaYHADOWOTj5G27bl_-Jg4gWjuU0";

// Local center removed in favor of dynamic props
// Radius in meters (e.g., 2000 meters = 2 km for a whole locality)
const SAFE_RADIUS = 10000;

const GeofenceMonitor = ({ center, phoneNumber, onLocationChange, showHeatmap = true }) => {
  const [status, setStatus] = useState("LOCATING");
  const [anomalyAlert, setAnomalyAlert] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const wasInside = useRef(true); // Track previous state to prevent spamming alerts
  
  // For anomaly detection - track previous position
  const prevPosition = useRef(null);
  const currentPosition = useRef(null);

  // Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "12px"
  };

  // Update heatmap data when location history changes
  useEffect(() => {
    if (mapLoaded && window.google && locationHistory.length > 0) {
      const newHeatmapData = locationHistory.map(loc => 
        new window.google.maps.LatLng(loc.lat, loc.lon)
      );
      setHeatmapData(newHeatmapData);
    }
  }, [locationHistory, mapLoaded]);

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  // Helper: Haversine Formula (Same as before)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const sendSMS = async () => {
    console.log("Attempting to send SMS to:", phoneNumber);
    if (!phoneNumber) {
      console.warn("No phone number available for SMS alert.");
      alert(
        "⚠️ Development Warning: No phone number found for this trip. SMS cannot be sent."
      );
      return;
    }

    // Format phone number - add +91 if doesn't start with +
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/^0+/, '')}`;

    try {
      // Get Firebase auth token
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        console.error("No auth token available");
        alert("Authentication error. Please log in again.");
        return;
      }

      // Using the same endpoint as Dashboard SOS
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: formattedPhone,
          message:
            "⚠️ ALERT: You have left the 10km Safe Zone! Please return immediately to maintain valid ID status.",
        }),
      });

      const result = await response.json();
      console.log("SMS Backend Response:", result);

      if (response.ok) {
        console.log("SMS Alert sent successfully to", phoneNumber);
        alert(
          `SMS Sent to ${phoneNumber}: "You have left the 10km Safe Zone!"`
        );
      } else {
        console.error("Backend Error:", result);
        alert(
          `Failed to send SMS. Backend Error: ${
            result.error || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Failed to send SMS alert:", error);
      alert(
        "Network Error: Failed to call SMS API. Did you restart 'npm run dev'?"
      );
    }
  };

  // Check for anomalous behavior by calling backend
  const checkAnomalousBehavior = async () => {
    if (!prevPosition.current || !currentPosition.current) {
      console.log("Not enough position data for anomaly detection");
      return;
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        console.warn("No auth token for anomaly check");
        return;
      }

      // Calculate deviation from safe zone center
      const distFromCenter = center ? getDistance(
        currentPosition.current.lat,
        currentPosition.current.lon,
        center.lat,
        center.lon
      ) : 0;
      const deviation = distFromCenter > SAFE_RADIUS ? 1 : 0;
      
      // Zone risk: 1 if outside safe zone, 0 if inside
      const zoneRisk = deviation;

      const payload = {
        prev_point: {
          lat: prevPosition.current.lat,
          lon: prevPosition.current.lon,
          timestamp: prevPosition.current.timestamp
        },
        curr_point: {
          lat: currentPosition.current.lat,
          lon: currentPosition.current.lon,
          timestamp: currentPosition.current.timestamp
        },
        zone_risk: zoneRisk,
        deviation: deviation
      };

      console.log("Checking anomalous behavior:", payload);

      const response = await fetch("https://commitchaosbackend.onrender.com/analyze-movement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Anomaly check result:", result);

      if (result.status === "ALERT" && result.data) {
        setAnomalyAlert(result.data);
        
        // Vibrate for alert
        try {
          if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        } catch (e) {
          console.log("Vibration not available:", e);
        }

        // If high severity, send SMS alert
        if (result.data.severity === "HIGH" && phoneNumber) {
          console.log("High severity anomaly detected, sending alert SMS");
        }
      } else {
        setAnomalyAlert(null);
      }
    } catch (error) {
      console.error("Anomaly check failed:", error);
    }
  };

  // Logic to check if user is inside/outside
  const checkPosition = (lat, lon) => {
    // Update position tracking for anomaly detection
    const timestamp = new Date().toISOString();
    prevPosition.current = currentPosition.current;
    currentPosition.current = { lat, lon, timestamp };

    // Add to location history for heatmap (limit to last 100 points)
    setLocationHistory(prev => {
      const newHistory = [...prev, { lat, lon, timestamp }];
      return newHistory.slice(-100); // Keep last 100 points
    });

    // Notify parent of location update (for Live View)
    if (onLocationChange) {
      onLocationChange({ lat, lon });
    }

    const dist = getDistance(lat, lon, center.lat, center.lon);
    const isInside = dist <= SAFE_RADIUS;

    if (isInside) {
      setStatus("INSIDE");
      wasInside.current = true;
    } else {
      setStatus("OUTSIDE");

      // THE ALERT LOGIC
      // Only alert if we just crossed the boundary (Inside -> Outside)
      if (wasInside.current === true) {
        sendSMS();

        // Vibrate for feedback (wrapped in try-catch to handle browser restrictions)
        try {
          if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
        } catch (e) {
          console.log("Vibration not available:", e);
        }
      }
      wasInside.current = false;
    }
  };

  // Anomaly detection: Check every 30 seconds
  useEffect(() => {
    if (!center) return;

    const anomalyInterval = setInterval(() => {
      console.log(`[${new Date().toLocaleTimeString()}] Checking for anomalous behavior...`);
      checkAnomalousBehavior();
    }, 30000); // 30 seconds

    return () => clearInterval(anomalyInterval);
  }, [center, phoneNumber]);

  // Heartbeat: Log/Check every 5 minutes (300,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(
        `[${new Date().toLocaleTimeString()}] 5-Minute Heartbeat: Monitoring active.`
      );
      // You can add logic here to force-save regular updates to backend if needed
      // For now, we just verify the monitor is alive.
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!center) return;

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        checkPosition(latitude, longitude);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [center, phoneNumber]); // Re-run if center changes

  if (!center) return null;

  return (
    <div className="space-y-3">
      {/* Geofence Status */}
      <div
        className={`p-4 rounded-lg border-2 ${
          status === "INSIDE"
            ? "border-green-500 bg-green-50"
            : "border-red-500 bg-red-50"
        }`}
      >
        <h2 className="text-xl font-bold">
          {status === "INSIDE" ? "✅ You are in the Zone" : "🚫 OUT OF BOUNDS"}
        </h2>
        <p>Stay within the locality to keep your ID active.</p>

        {/* Teleport Debug Button */}
        <button
          onClick={() => {
            console.log("Teleporting to London (Mock)...");
            checkPosition(51.5074, -0.1278);
          }}
          className="mt-3 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow hover:bg-black transition-colors"
        >
          🛠️ Teleport (Test Alert)
        </button>
      </div>

      {/* Anomaly Alert */}
      {anomalyAlert && (
        <div className={`p-4 rounded-lg border-2 ${
          anomalyAlert.severity === "HIGH" 
            ? "border-red-600 bg-red-100" 
            : anomalyAlert.severity === "MEDIUM"
            ? "border-orange-500 bg-orange-50"
            : "border-yellow-500 bg-yellow-50"
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {anomalyAlert.severity === "HIGH" ? "🚨" : anomalyAlert.severity === "MEDIUM" ? "⚠️" : "⚡"}
            </span>
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                {anomalyAlert.type === "BEHAVIORAL_ANOMALY" ? "Unusual Movement Detected" : "Anomaly Alert"}
              </h3>
              <p className="text-sm text-gray-700">{anomalyAlert.reason}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Severity: <strong className={
                  anomalyAlert.severity === "HIGH" ? "text-red-600" : 
                  anomalyAlert.severity === "MEDIUM" ? "text-orange-600" : "text-yellow-600"
                }>{anomalyAlert.severity}</strong></span>
                <span>Confidence: {Math.round(anomalyAlert.confidence * 100)}%</span>
              </div>
            </div>
            <button 
              onClick={() => setAnomalyAlert(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Heatmap View - Shows location history */}
      {showHeatmap && GOOGLE_MAPS_API_KEY && (
        <div className="rounded-lg border-2 border-blue-200 overflow-hidden">
          <h3 className="p-3 text-lg font-bold bg-blue-50 flex items-center justify-between">
            <span>📍 Movement Heatmap</span>
            <span className="text-xs font-normal text-gray-500">
              {locationHistory.length} points tracked
            </span>
          </h3>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: center.lat, lng: center.lon }}
              zoom={14}
              onLoad={onMapLoad}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true
              }}
            >
              {/* Safe Zone Circle */}
              <Circle
                center={{ lat: center.lat, lng: center.lon }}
                radius={SAFE_RADIUS}
                options={{
                  strokeColor: "#22c55e",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#22c55e",
                  fillOpacity: 0.1
                }}
              />

              {/* Heatmap Layer */}
              {heatmapData.length > 0 && (
                <HeatmapLayer
                  data={heatmapData}
                  options={{
                    radius: 30,
                    opacity: 0.7,
                    gradient: [
                      "rgba(0, 255, 255, 0)",
                      "rgba(0, 255, 255, 1)",
                      "rgba(0, 191, 255, 1)",
                      "rgba(0, 127, 255, 1)",
                      "rgba(0, 63, 255, 1)",
                      "rgba(0, 0, 255, 1)",
                      "rgba(0, 0, 223, 1)",
                      "rgba(127, 0, 63, 1)",
                      "rgba(191, 0, 31, 1)",
                      "rgba(255, 0, 0, 1)"
                    ]
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      {/* Fallback if no API key */}
      {showHeatmap && !GOOGLE_MAPS_API_KEY && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ Add <code className="bg-yellow-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your .env file to enable the live heatmap.
          </p>
        </div>
      )}
    </div>
  );
};

export default GeofenceMonitor;
