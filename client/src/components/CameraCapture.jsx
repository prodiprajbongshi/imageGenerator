import React, { useRef, useState, useEffect } from 'react';
import { Camera, SwitchCamera, AlertCircle, ArrowLeft, Timer, Upload } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel, onUploadPhoto }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [flash, setFlash] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    let currentStream = null;

    async function startCamera() {
      try {
        setError(null);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const userStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = userStream;
        setStream(userStream);

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError('Camera access was denied or not available. You can upload a photo or use a demo portrait.');
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Flip camera
  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  // Instant or Timer Snap
  const handleSnapClick = () => {
    if (isCountingDown) return;
    
    // Quick flash & snap
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Flip horizontally if front camera for natural selfie look
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCapture(dataUrl);
  };

  // Start 3-second countdown
  const startTimerCapture = () => {
    if (isCountingDown) return;
    setIsCountingDown(true);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setIsCountingDown(false);
        handleSnapClick();
      }
    }, 1000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUploadPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono-future uppercase text-slate-300 tracking-wider">
            Live 2030 Biometric Scan
          </span>
        </div>

        <button
          onClick={toggleFacingMode}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          title="Switch Camera"
        >
          <SwitchCamera className="w-4 h-4" />
        </button>
      </div>

      {/* Main Camera Viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] border-2 border-slate-800 shadow-2xl flex items-center justify-center">
        
        {/* Flash Overlay */}
        {flash && <div className="absolute inset-0 bg-white z-50 transition-opacity duration-200" />}

        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
        />

        {/* Cyber Scanning Reticle & Face Guide */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          
          {/* Subtle Scan Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scanline" />

          {/* Oval face guide */}
          <div className="w-64 h-80 rounded-[50%] border-2 border-dashed border-cyan-400/40 relative flex items-center justify-center">
            {/* Corner cyber ticks */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-3 -left-3 w-6 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-3 -right-3 w-6 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Center target crosshair */}
            <div className="w-3 h-3 border-t border-l border-cyan-400/60" />
          </div>

          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-md border border-cyan-500/30 text-[11px] font-mono-future text-cyan-400">
            FRAME YOUR FACE IN CENTER
          </div>
        </div>

        {/* Countdown Overlay */}
        {isCountingDown && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex items-center justify-center">
            <span className="text-8xl font-black text-cyan-400 animate-ping font-heading">
              {countdown}
            </span>
          </div>
        )}

        {/* Camera Error Fallback */}
        {error && (
          <div className="absolute inset-0 bg-slate-950/95 z-40 p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Camera Unavailable</h3>
            <p className="text-sm text-slate-300 max-w-sm mb-6">{error}</p>
            <div className="flex gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload Photo Instead
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Shutter / Controls Panel */}
      <div className="mt-6 flex items-center justify-center gap-6">
        {/* 3s Timer button */}
        <button
          onClick={startTimerCapture}
          disabled={isCountingDown || !!error}
          className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
          title="3-Second Timer Capture"
        >
          <Timer className="w-5 h-5" />
        </button>

        {/* Big Capture Shutter Button */}
        <button
          onClick={handleSnapClick}
          disabled={isCountingDown || !!error}
          className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-white p-1.5 shadow-2xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <div className="w-full h-full rounded-full border-4 border-slate-900 group-hover:border-cyan-500 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 group-hover:bg-cyan-500 transition-colors flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </button>

        {/* Upload Fallback icon */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
          title="Upload image from file"
        >
          <Upload className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
