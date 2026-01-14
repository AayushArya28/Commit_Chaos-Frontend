import { useEffect, useState, useRef } from "react";
import { auth } from "../../firebase";

// Local center removed in favor of dynamic props
// Radius in meters (e.g., 2000 meters = 2 km for a whole locality)
const SAFE_RADIUS = 10000;

const GeofenceMonitor = ({ center, phoneNumber, onLocationChange }) => {
  const [status, setStatus] = useState("LOCATING");
  const wasInside = useRef(true); // Track previous state to prevent spamming alerts

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

  // Logic to check if user is inside/outside
  const checkPosition = (lat, lon) => {
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
  );
};

export default GeofenceMonitor;
