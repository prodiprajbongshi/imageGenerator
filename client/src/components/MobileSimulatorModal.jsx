import React, { useState } from 'react';
import { X, Check, Download, Scan, Sparkles, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MobileSimulatorModal({ isOpen, onClose, selectedImage }) {
  // Mobile sub-step: 'scanning' (Step 9) -> 'page' (Step 10) -> 'downloaded' (Step 11)
  const [mobileStep, setMobileStep] = useState('scanning');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !selectedImage) return null;

  const handleSimulateScanComplete = () => {
    setMobileStep('page');
  };

  const handleMobileDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setMobileStep('downloaded');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 800);
  };

  const handleResetMobile = () => {
    setMobileStep('scanning');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm rounded-[40px] bg-slate-950 p-4 border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Island / Notch */}
        <div className="w-28 h-5 bg-black rounded-full mb-3 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
          <div className="w-2 h-2 rounded-full bg-blue-950" />
        </div>

        {/* Top Header inside phone */}
        <div className="w-full flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-mono-future text-slate-400">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-cyan-400 font-bold">5G</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Phone Content Screen */}
        <div className="w-full rounded-[28px] bg-slate-900 border border-slate-800 p-4 flex flex-col items-center min-h-[460px] overflow-hidden">
          
          {/* STEP 9: User Scans QR with Phone */}
          {mobileStep === 'scanning' && (
            <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold uppercase mb-4">
                Step 9: Mobile Camera Scanner
              </div>

              {/* Viewfinder Reticle */}
              <div className="relative w-44 h-44 rounded-2xl border-2 border-emerald-400/80 p-2 flex flex-col items-center justify-center mb-6 overflow-hidden">
                <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-scanline" />
                <Scan className="w-12 h-12 text-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono-future text-emerald-300 mt-2">
                  Scanning...
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Phone detected QR Code link for 2030 Image!
              </p>

              <button
                onClick={handleSimulateScanComplete}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Tap to Open Download Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 10: Mobile Download Page */}
          {mobileStep === 'page' && (
            <div className="w-full flex-1 flex flex-col items-center animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-semibold uppercase mb-2">
                Step 10: Mobile Download Page
              </div>

              <h4 className="text-base font-extrabold text-white">Your 2030 Image</h4>
              <p className="text-[11px] text-slate-400 mb-3">{selectedImage.title}</p>

              {/* Image Preview */}
              <div className="w-full rounded-xl overflow-hidden aspect-[4/3] bg-black border border-slate-700 shadow-md mb-4">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Big Blue Download Button matching Step 10 */}
              <button
                onClick={handleMobileDownload}
                disabled={isDownloading}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Saving to Phone...' : 'Download Image'}</span>
              </button>

              <p className="text-[10px] text-slate-500 mt-3 text-center">
                Saves high-res JPEG directly to your Photos / Camera Roll
              </p>
            </div>
          )}

          {/* STEP 11: Image Downloaded Successfully */}
          {mobileStep === 'downloaded' && (
            <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-90 duration-300">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase mb-4">
                Step 11: Download Complete
              </div>

              {/* Green checkmark circle */}
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-3 shadow-xl shadow-emerald-500/30">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h4 className="text-base font-extrabold text-white mb-1">
                Image Downloaded Successfully!
              </h4>
              <p className="text-xs text-slate-300 mb-4">
                Enjoy your 2030 look!
              </p>

              {/* Mini thumbnail */}
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-500/50 mb-5">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={handleResetMobile}
                className="py-2 px-4 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:text-white"
              >
                Scan Again / Restart Test
              </button>
            </div>
          )}

        </div>

        {/* Bottom home indicator line */}
        <div className="w-32 h-1 bg-slate-600 rounded-full mt-3" />
      </div>
    </div>
  );
}
