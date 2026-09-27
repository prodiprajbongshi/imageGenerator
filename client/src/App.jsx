import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CameraCapture from './components/CameraCapture';
import PreviewConfirm from './components/PreviewConfirm';
import ProcessingScreen from './components/ProcessingScreen';
import ImageGridSelector from './components/ImageGridSelector';
import FinalPreviewSection from './components/FinalPreviewSection';
import QRCodeModal from './components/QRCodeModal';
import MobileSimulatorModal from './components/MobileSimulatorModal';
import Footer from './components/Footer';

// Fallback themes in case server is starting or in standalone client mode
const DEFAULT_THEMES = [
  {
    id: 'office',
    themeId: 'office',
    title: 'Future Office — 2030',
    subtitle: 'Holographic Workstation & Smart Glass Skyscraper',
    imageUrl: '/environments/office.jpg',
    color: '#06b6d4',
  },
  {
    id: 'nature',
    themeId: 'nature',
    title: 'Future Nature — 2030',
    subtitle: 'Eco-Futuristic Biodome & Solar Mountain Sanctuaries',
    imageUrl: '/environments/nature.jpg',
    color: '#10b981',
  },
  {
    id: 'road',
    themeId: 'road',
    title: 'Future Road — 2030',
    subtitle: 'Cyberpunk Autonomous Highway & Neon Metropolis',
    imageUrl: '/environments/road.jpg',
    color: '#a855f7',
  },
  {
    id: 'travel',
    themeId: 'travel',
    title: 'Future Travel — 2030',
    subtitle: 'Supersonic Aerospace Port & Coastal Future Harbor',
    imageUrl: '/environments/travel.jpg',
    color: '#f59e0b',
  },
];

export default function App() {
  // Steps: 'hero' (1) | 'camera' (2) | 'confirm' (3) | 'processing' (4) | 'select' (5 & 6) | 'final' (7)
  const [currentStep, setCurrentStep] = useState('hero');
  const [capturedImage, setCapturedImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Modals for Step 8 and Steps 9-11
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPhoneSimModalOpen, setIsPhoneSimModalOpen] = useState(false);

  // Server & Network info
  const [serverOnline, setServerOnline] = useState(false);
  const [networkInfo, setNetworkInfo] = useState(null);

  // Check backend server connection
  useEffect(() => {
    async function checkServer() {
      try {
        const res = await fetch('/api/network-ip');
        if (res.ok) {
          const data = await res.json();
          setNetworkInfo(data);
          setServerOnline(true);
        } else {
          setServerOnline(false);
        }
      } catch (err) {
        console.warn('Backend not yet reachable on /api/network-ip, running with high-res templates:', err);
        setServerOnline(false);
      }
    }
    checkServer();
  }, []);

  // Smooth scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Step 1 -> Step 2
  const handleStartCamera = () => {
    setCurrentStep('camera');
  };

  // Upload photo fallback
  const handleUploadPhoto = (dataUrl) => {
    setCapturedImage(dataUrl);
    setCurrentStep('confirm');
  };

  // Use demo sample photo
  const handleUseDemo = async () => {
    try {
      const response = await fetch('/demo_portrait.jpg');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
        setCurrentStep('confirm');
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback
      setCapturedImage('/demo_portrait.jpg');
      setCurrentStep('confirm');
    }
  };

  // Step 2 -> Step 3
  const handleCapture = (dataUrl) => {
    setCapturedImage(dataUrl);
    setCurrentStep('confirm');
  };

  // Step 3 Retake
  const handleRetake = () => {
    setCurrentStep('camera');
  };

  // Step 3 -> Step 4 -> Step 5: Generate
  const handleConfirmGenerate = async () => {
    setCurrentStep('processing');

    try {
      if (serverOnline) {
        // Send capture to Express backend
        const response = await fetch('/api/generate-future', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: capturedImage,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Short pause so user enjoys the futuristic processing animation
          setTimeout(() => {
            setGeneratedImages(data.images);
            setSelectedImage(data.images[0]);
            setCurrentStep('select');
          }, 2400);
          return;
        }
      }

      // Standalone client fallback if backend is offline
      setTimeout(() => {
        const clientImages = DEFAULT_THEMES.map((theme) => ({
          ...theme,
          id: `local_${theme.id}`,
          downloadUrl: theme.imageUrl,
        }));
        setGeneratedImages(clientImages);
        setSelectedImage(clientImages[0]);
        setCurrentStep('select');
      }, 3000);

    } catch (err) {
      console.error('Error generating images:', err);
      // Fallback
      setTimeout(() => {
        setGeneratedImages(DEFAULT_THEMES);
        setSelectedImage(DEFAULT_THEMES[0]);
        setCurrentStep('select');
      }, 2000);
    }
  };

  // Step 5 & 6: Favorite selection & Continue
  const handleSelectFavorite = (image) => {
    setSelectedImage(image);
  };

  const handleContinueToFinal = (image) => {
    setSelectedImage(image || generatedImages[0]);
    setCurrentStep('final');
  };

  // Reset to initial state
  const handleReset = () => {
    setCapturedImage(null);
    setGeneratedImages([]);
    setSelectedImage(null);
    setIsQRModalOpen(false);
    setIsPhoneSimModalOpen(false);
    setCurrentStep('hero');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentStep={
          currentStep === 'hero' ? 1 :
          currentStep === 'camera' ? 2 :
          currentStep === 'confirm' ? 3 :
          currentStep === 'processing' ? 4 :
          currentStep === 'select' ? 5 : 7
        }
        onReset={handleReset}
        serverOnline={serverOnline}
        networkIp={networkInfo?.localIp}
      />

      {/* Main Flow Views */}
      <main className="flex-1 flex flex-col justify-center">
        {currentStep === 'hero' && (
          <HeroSection
            onStartCamera={handleStartCamera}
            onUploadPhoto={handleUploadPhoto}
            onUseDemo={handleUseDemo}
          />
        )}

        {currentStep === 'camera' && (
          <CameraCapture
            onCapture={handleCapture}
            onCancel={() => setCurrentStep('hero')}
            onUploadPhoto={handleUploadPhoto}
          />
        )}

        {currentStep === 'confirm' && (
          <PreviewConfirm
            imageSrc={capturedImage}
            onRetake={handleRetake}
            onConfirm={handleConfirmGenerate}
          />
        )}

        {currentStep === 'processing' && (
          <ProcessingScreen />
        )}

        {currentStep === 'select' && (
          <ImageGridSelector
            images={generatedImages}
            onSelectFavorite={handleSelectFavorite}
            onContinue={handleContinueToFinal}
          />
        )}

        {currentStep === 'final' && selectedImage && (
          <FinalPreviewSection
            selectedImage={selectedImage}
            onOpenQR={() => setIsQRModalOpen(true)}
            onBackToGrid={() => setCurrentStep('select')}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Step 8 QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        selectedImage={selectedImage}
        networkInfo={networkInfo}
        onOpenPhoneSimulator={() => {
          setIsQRModalOpen(false);
          setIsPhoneSimModalOpen(true);
        }}
      />

      {/* Steps 9, 10, 11 Mobile Phone Simulator Modal */}
      <MobileSimulatorModal
        isOpen={isPhoneSimModalOpen}
        onClose={() => setIsPhoneSimModalOpen(false)}
        selectedImage={selectedImage}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
