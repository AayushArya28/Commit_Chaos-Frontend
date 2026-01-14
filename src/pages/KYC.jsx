/**
 * ===================================
 * KYC VERIFICATION PAGE
 * Smart Tourist Safety Monitoring System
 * ===================================
 * 
 * Purpose: Face verification using camera + face-api.js
 * 
 * UI Flow:
 * 1. Instruction Card
 * 2. Camera Capture Section (ID photo + live face photo)
 * 3. Face Match Process (Frontend Simulation)
 * 4. Success → redirect to /dashboard
 * 5. Failure → countdown timer → redirect back to /kyc
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';

// ===== ICON COMPONENTS =====

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IdCardIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

// ===== VERIFICATION STEPS =====
const STEPS = {
  INSTRUCTIONS: 'instructions',
  ID_CAPTURE: 'id_capture',
  FACE_CAPTURE: 'face_capture',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

// ===== SUPPORTED ID TYPES =====
const ID_TYPES = [
  { name: 'Aadhaar Card', icon: '🪪' },
  { name: 'PAN Card', icon: '💳' },
  { name: 'Driving License', icon: '🚗' },
  { name: 'Passport', icon: '📘' },
];

// ===== INSTRUCTION CARD COMPONENT =====
const InstructionCard = ({ onStart }) => (
  <div className="max-w-2xl mx-auto">
    <Card className="text-center">
      {/* Header */}
      <div className="w-20 h-20 mx-auto mb-6 bg-global-indigo/10 rounded-full flex items-center justify-center">
        <IdCardIcon />
      </div>

      <h2 className="text-2xl font-bold text-global-text mb-3">
        KYC Verification
      </h2>

      <p className="text-global-muted mb-8 max-w-md mx-auto">
        Complete a quick face verification with your government ID to secure your tourist profile.
      </p>

      {/* Supported IDs */}
      <div className="bg-global-bg rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-global-text mb-4">
          Supported Government IDs
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ID_TYPES.map((id, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-3 bg-global-surface rounded-lg border border-gray-100"
            >
              <span className="text-2xl mb-1">{id.icon}</span>
              <span className="text-xs text-global-muted text-center">{id.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="text-left bg-global-bg rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-global-text mb-3">
          Before you begin, ensure:
        </h3>
        <ul className="space-y-2">
          {[
            'You have your government ID ready',
            'Good lighting conditions',
            'Camera access is enabled',
            'Face is clearly visible (no masks, sunglasses)',
          ].map((item, index) => (
            <li key={index} className="flex items-center text-sm text-global-muted">
              <svg className="w-4 h-4 mr-2 text-global-success shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Button variant="primary" size="lg" onClick={onStart} fullWidth>
        Start Verification
      </Button>
    </Card>
  </div>
);

// ===== CAMERA COMPONENT =====
const CameraCapture = ({ 
  title, 
  description, 
  onCapture, 
  capturedImage, 
  onRetake,
  isIdCapture = false,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);

  // Initialize camera
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        console.error('Camera error:', err);
        setCameraError(
          err.name === 'NotAllowedError' 
            ? 'Camera access denied. Please enable camera permissions.'
            : 'Could not access camera. Please check your device.'
        );
      }
    };

    if (!capturedImage) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage]);

  // Face detection for live face capture
  useEffect(() => {
    if (isIdCapture || capturedImage || !cameraReady) return;

    let animationId;
    const detectFace = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const detections = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          );
          setFaceDetected(!!detections);
        } catch (err) {
          console.log('Face detection not ready yet');
        }
      }
      animationId = requestAnimationFrame(detectFace);
    };

    detectFace();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [cameraReady, capturedImage, isIdCapture]);

  // Capture image
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg');
    onCapture(imageData);
  };

  if (capturedImage) {
    return (
      <div className="text-center">
        <div className="relative inline-block rounded-xl overflow-hidden border-4 border-global-success mb-4">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full max-w-md"
          />
          <div className="absolute top-3 right-3 w-10 h-10 bg-global-success rounded-full flex items-center justify-center text-white">
            <CheckIcon />
          </div>
        </div>
        <p className="text-global-success font-medium mb-4">Image captured successfully!</p>
        <Button variant="ghost" onClick={onRetake}>
          Retake Photo
        </Button>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-global-error/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-global-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-global-error font-medium mb-2">Camera Error</p>
        <p className="text-global-muted text-sm mb-4">{cameraError}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-global-text mb-2">{title}</h3>
      <p className="text-global-muted text-sm mb-6">{description}</p>

      {/* Camera preview */}
      <div className="relative inline-block rounded-xl overflow-hidden bg-gray-900 mb-4">
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin w-10 h-10 border-4 border-global-indigo border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-white/70 text-sm">Starting camera...</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-md"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Face detection indicator */}
        {!isIdCapture && cameraReady && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
            faceDetected 
              ? 'bg-global-success text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {faceDetected ? '✓ Face Detected' : 'Position your face'}
          </div>
        )}

        {/* Capture guide overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {isIdCapture ? (
            <div className="absolute inset-8 border-2 border-dashed border-white/50 rounded-lg" />
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-white/50 rounded-full" />
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <Button 
        variant="primary" 
        size="lg" 
        onClick={handleCapture}
        disabled={!cameraReady || (!isIdCapture && !faceDetected)}
      >
        <CameraIcon className="w-5 h-5 mr-2" />
        Capture Photo
      </Button>

      {!isIdCapture && !faceDetected && cameraReady && (
        <p className="text-yellow-600 text-sm mt-3">
          Please position your face in the frame
        </p>
      )}
    </div>
  );
};

// ===== PROCESSING COMPONENT =====
const ProcessingScreen = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-6 relative">
      <div className="absolute inset-0 border-4 border-global-indigo/20 rounded-full" />
      <div className="absolute inset-0 border-4 border-global-indigo border-t-transparent rounded-full animate-spin" />
      <div className="absolute inset-4 bg-global-indigo/10 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-global-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
    </div>

    <h3 className="text-xl font-bold text-global-text mb-2">
      Verifying Your Identity
    </h3>
    <p className="text-global-muted mb-6">
      Please wait while we compare your face with your ID...
    </p>

    {/* Progress steps */}
    <div className="max-w-sm mx-auto space-y-3">
      {[
        { label: 'Detecting face in ID', done: true },
        { label: 'Extracting face features', done: true },
        { label: 'Comparing with live photo', done: false },
        { label: 'Validating identity', done: false },
      ].map((step, index) => (
        <div key={index} className="flex items-center text-left">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
            step.done ? 'bg-global-success text-white' : 'bg-gray-200'
          }`}>
            {step.done ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <span className="w-2 h-2 bg-global-muted rounded-full" />
            )}
          </div>
          <span className={step.done ? 'text-global-text' : 'text-global-muted'}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ===== SUCCESS COMPONENT =====
const SuccessScreen = ({ countdown }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-6 bg-global-success/10 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-global-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <h3 className="text-2xl font-bold text-global-text mb-2">
      Verification Successful!
    </h3>
    <p className="text-global-muted mb-6">
      Your identity has been verified. Welcome aboard!
    </p>

    <p className="text-global-indigo font-medium">
      Redirecting to dashboard in {countdown} seconds...
    </p>
  </div>
);

// ===== FAILURE COMPONENT =====
const FailureScreen = ({ countdown, onRetry }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-6 bg-global-error/10 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-global-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <h3 className="text-2xl font-bold text-global-text mb-2">
      Verification Failed
    </h3>
    <p className="text-global-muted mb-6">
      We couldn't verify your identity. This could be due to:
    </p>

    <ul className="text-left max-w-sm mx-auto mb-6 space-y-2">
      {[
        'Face in ID doesn\'t match live photo',
        'Poor image quality or lighting',
        'Face not clearly visible in photos',
      ].map((reason, index) => (
        <li key={index} className="flex items-center text-sm text-global-muted">
          <span className="w-1.5 h-1.5 bg-global-error rounded-full mr-2" />
          {reason}
        </li>
      ))}
    </ul>

    <p className="text-global-error font-medium mb-6">
      Retrying automatically in {countdown} seconds...
    </p>

    <Button variant="primary" onClick={onRetry}>
      Retry Now
    </Button>
  </div>
);

// ===== MAIN KYC PAGE COMPONENT =====
const KYC = () => {
  const navigate = useNavigate();
  const { completeKyc, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(STEPS.INSTRUCTIONS);
  const [idImage, setIdImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.log('Face-api models not loaded, using simulation mode');
        // Continue without models - will use simulation
        setModelsLoaded(true);
      }
    };

    loadModels();
  }, []);

  // Process face verification (simulation)
  const processVerification = useCallback(async () => {
    setCurrentStep(STEPS.PROCESSING);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate 85% success rate for demo
    const isSuccess = Math.random() > 0.15;

    if (isSuccess) {
      setCurrentStep(STEPS.SUCCESS);
      completeKyc();

      // Countdown and redirect
      let count = 5;
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          navigate('/dashboard');
        }
      }, 1000);
    } else {
      setCurrentStep(STEPS.FAILURE);

      // Countdown and retry
      let count = 5;
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          handleRetry();
        }
      }, 1000);
    }
  }, [completeKyc, navigate]);

  // Handle retry
  const handleRetry = () => {
    setIdImage(null);
    setFaceImage(null);
    setCountdown(5);
    setCurrentStep(STEPS.INSTRUCTIONS);
  };

  // Handle step transitions
  const handleStartVerification = () => {
    setCurrentStep(STEPS.ID_CAPTURE);
  };

  const handleIdCapture = (image) => {
    setIdImage(image);
    setTimeout(() => setCurrentStep(STEPS.FACE_CAPTURE), 500);
  };

  const handleFaceCapture = (image) => {
    setFaceImage(image);
    setTimeout(() => processVerification(), 500);
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.INSTRUCTIONS:
        return <InstructionCard onStart={handleStartVerification} />;

      case STEPS.ID_CAPTURE:
        return (
          <Card className="max-w-2xl mx-auto">
            <CameraCapture
              title="Step 1: Capture Your ID"
              description="Hold your government ID clearly visible in the frame"
              onCapture={handleIdCapture}
              capturedImage={idImage}
              onRetake={() => setIdImage(null)}
              isIdCapture={true}
            />
          </Card>
        );

      case STEPS.FACE_CAPTURE:
        return (
          <Card className="max-w-2xl mx-auto">
            <CameraCapture
              title="Step 2: Capture Your Face"
              description="Position your face in the oval and look directly at the camera"
              onCapture={handleFaceCapture}
              capturedImage={faceImage}
              onRetake={() => setFaceImage(null)}
              isIdCapture={false}
            />
          </Card>
        );

      case STEPS.PROCESSING:
        return (
          <Card className="max-w-lg mx-auto">
            <ProcessingScreen />
          </Card>
        );

      case STEPS.SUCCESS:
        return (
          <Card className="max-w-lg mx-auto">
            <SuccessScreen countdown={countdown} />
          </Card>
        );

      case STEPS.FAILURE:
        return (
          <Card className="max-w-lg mx-auto">
            <FailureScreen countdown={countdown} onRetry={handleRetry} />
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-global-bg py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-global-indigo rounded-lg flex items-center justify-center text-white">
              <ShieldIcon />
            </div>
            <span className="font-bold text-xl text-global-text">SafeTourist</span>
          </div>

          {/* Progress indicator */}
          {currentStep !== STEPS.INSTRUCTIONS && currentStep !== STEPS.PROCESSING && 
           currentStep !== STEPS.SUCCESS && currentStep !== STEPS.FAILURE && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                currentStep === STEPS.ID_CAPTURE || currentStep === STEPS.FACE_CAPTURE 
                  ? 'bg-global-indigo' : 'bg-gray-300'
              }`} />
              <div className={`w-8 h-0.5 ${
                currentStep === STEPS.FACE_CAPTURE ? 'bg-global-indigo' : 'bg-gray-300'
              }`} />
              <div className={`w-3 h-3 rounded-full ${
                currentStep === STEPS.FACE_CAPTURE ? 'bg-global-indigo' : 'bg-gray-300'
              }`} />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      {renderStep()}
    </div>
  );
};

export default KYC;
