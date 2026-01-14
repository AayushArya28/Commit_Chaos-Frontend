# 🛡️ SafeTourist - Smart Tourist Safety Monitoring & Incident Response System

> **Hackathon Technika 2k26 Project**

A comprehensive, privacy-first web application for real-time tourist safety monitoring, AI-assisted anomaly detection, and rapid emergency response in high-risk tourism regions.

![SafeTourist Banner](https://img.shields.io/badge/Status-Hackathon%20Demo-blue) ![React](https://img.shields.io/badge/React-19.x-61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38B2AC) ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28)

## 🎯 Problem Statement

Tourism in remote and high-risk regions faces critical safety challenges:
- **Poor Tracking Infrastructure** - Limited communication in remote areas
- **Delayed Rescue Response** - Manual tracking leads to critical delays
- **Fragmented Coordination** - Poor communication between tourists, guides, and emergency services

## 💡 Our Solution

SafeTourist provides:
- **Digital Tourist ID** - Secure, verified identity for seamless check-ins
- **Real-time Safety Score** - Dynamic assessment based on location and conditions
- **AI Anomaly Detection** - Intelligent alerts for unusual patterns and risks
- **Emergency Dashboard** - One-tap SOS with instant coordination

## 🚀 Features

### Authentication & Security
- ✅ Email/Password authentication with email verification
- ✅ Google OAuth login
- ✅ KYC face verification using face-api.js
- ✅ Protected routes with auth state management

### Dashboard
- 📊 Real-time safety score visualization
- 📍 Location tracking with geofencing alerts
- 🚨 Panic button with emergency alert system
- 📱 Activity monitoring feed
- 📞 Quick access to emergency contacts

### UX/UI
- 📱 Mobile-first, fully responsive design
- 🎨 Professional government-grade aesthetic
- ♿ Accessibility-friendly
- 🌐 Clean, intuitive navigation

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React (Vite) | Frontend framework |
| Tailwind CSS | Styling |
| Firebase Auth | Authentication |
| face-api.js | KYC face verification |
| React Router | Routing |
| React Context | State management |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/safetourist.git

# Navigate to project directory
cd safetourist

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx      # Reusable button component
│   │   ├── Input.jsx       # Form input component
│   │   ├── Card.jsx        # Card container component
│   │   └── index.js        # Component exports
│   └── ProtectedRoute.jsx  # Route protection HOC
├── context/
│   └── AuthContext.jsx     # Authentication state provider
├── pages/
│   ├── Landing.jsx         # Home/landing page
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # Registration page
│   ├── KYC.jsx             # Face verification page
│   ├── Dashboard.jsx       # Main dashboard
│   └── index.js            # Page exports
├── App.jsx                 # Main app with routing
├── main.jsx                # React entry point
└── index.css               # Global styles & Tailwind
```

## 🎨 Color Palette

The application uses a strict global color palette:

```javascript
global: {
  indigo: '#3F51B5',    // Primary actions
  bg: '#F4F7F9',        // Background
  surface: '#FFFFFF',   // Cards/surfaces
  text: '#1A1C1E',      // Primary text
  muted: '#6C757D',     // Secondary text
  success: '#00C896',   // Success states
  error: '#E63946',     // Error states
}
```

## 📱 Application Flow

1. **Landing Page** → Explains problem, solution, and value proposition
2. **Sign Up** → Email verification required
3. **Login** → Email/Password or Google OAuth
4. **KYC Verification** → Face matching with government ID
5. **Dashboard** → Safety monitoring and emergency features

## 🔐 Security Features

- End-to-end encryption (conceptual)
- Privacy-first data collection
- Temporary trip IDs (valid only for trip duration)
- Email verification required
- Face verification for identity confirmation

## 🤝 Contributing

This is a hackathon project. Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License - This is a demonstration project for educational purposes.

## 👥 Team

Built with ❤️ for Hackathon Technika 2k26

---

**Disclaimer:** This is a hackathon demonstration project. All safety features are simulated for demonstration purposes. Mock data is used throughout the application.
