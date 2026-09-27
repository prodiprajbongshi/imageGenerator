import React from 'react';
import { Download, QrCode, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FinalPreviewSection({ selectedImage, onOpenQR, onBackToGrid, onReset }) {
  const [downloaded, setDownloaded] = React.useState(false);

  const handleDownload = () => {
    // Trigger confetti celebration!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#10b981', '#a855f7'],
    });

    setDownloaded(true);

    // Create a link and trigger browser download
    const link = document.createElement('a');
    link.href = selectedImage.downloadUrl || selectedImage.imageUrl;
    link.download = `Future_2030_${selectedImage.themeId.toUpperCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloaded(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToGrid}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Selection</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Step 7: Final Image Preview
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Start Over</span>
        </button>
      </div>

      {/* Main Preview Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: High-Res Image Preview */}
          <div className="md:col-span-7">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black border-2 border-slate-700/80 shadow-2xl group">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Status corner badge */}
              <div 
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-mono-future font-bold backdrop-blur-md border shadow-lg"
                style={{ 
                  backgroundColor: `${selectedImage.color}25`, 
                  borderColor: selectedImage.color,
                  color: '#ffffff'
                }}
              >
                {selectedImage.title}
              </div>
            </div>
          </div>

          {/* Right: Actions Column matching Step 7 in the diagram */}
          <div className="md:col-span-5 flex flex-col justify-center">
            
            <div className="mb-6">
              <span className="text-xs font-mono-future text-slate-400 uppercase tracking-widest">
                Selected Future Avatar
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {selectedImage.title}
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {selectedImage.subtitle}. High-resolution identity composite generated in ultra-crisp 4K fidelity.
              </p>
            </div>

            {/* Success message banner when downloaded */}
            {downloaded && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Image downloaded successfully! Saved to your device.</span>
              </div>
            )}

            {/* Action Buttons matching Diagram Step 7 */}
            <div className="flex flex-col gap-3.5">
              
              {/* Green Download Image Button */}
              <button
                onClick={handleDownload}
                className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Image</span>
                <span className="text-xs opacity-80 font-normal font-mono-future ml-1">
                  (on this device)
                </span>
              </button>

              {/* QR Code Phone Button */}
              <button
                onClick={onOpenQR}
                className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 border border-slate-700 hover:border-slate-600 text-white font-semibold text-base transition-all cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-cyan-400 group-hover:rotate-6 transition-transform" />
                <span>Download on Phone</span>
                <span className="text-xs text-slate-400 font-normal ml-1">
                  (via QR Code)
                </span>
              </button>

            </div>

            {/* Info note */}
            <p className="text-xs text-slate-500 text-center mt-5">
              Identity Matrix 2030 • No watermark • Free to share
            </p>

          </div>

        </div>
      </div>

    </div>
  );
}
