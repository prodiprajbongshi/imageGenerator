import React from 'react';
import { Camera, Building2, Trees, Car, Plane, Upload, Sparkles, UserCheck } from 'lucide-react';

export default function HeroSection({ onStartCamera, onUploadPhoto, onUseDemo }) {
  const fileInputRef = React.useRef(null);

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
    <div className="relative pt-6 pb-16 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Main Laptop / Frame Display - Mimicking Step 1 */}
        <div className="relative mx-auto max-w-3xl rounded-2xl p-1 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-blue-500/10 mb-10 border border-slate-700/60">
          <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[16/9] flex flex-col items-center justify-center p-6 text-center border border-slate-800/80">
            
            {/* Background City Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/hero.jpg" 
                alt="2030 Futuristic Skyline" 
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Inner Content */}
            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Step 1: Get Started
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
                See Yourself in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">2030</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-md mb-6 leading-relaxed">
                Take a photo and discover your future in different worlds. Our AI preserves your identity across 4 futuristic 2030 environments.
              </p>

              {/* Main "Take a Photo" Blue Button */}
              <button
                onClick={onStartCamera}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Camera className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>Take a Photo</span>
              </button>

              {/* Bottom 4 Environment Pills matching Diagram Step 1 */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-300">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Office</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nature</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-purple-500/30 text-purple-300">
                  <Car className="w-3.5 h-3.5 text-purple-400" />
                  <span>Road</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-amber-500/30 text-amber-300">
                  <Plane className="w-3.5 h-3.5 text-amber-400" />
                  <span>Travel</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Alternative options: Upload or Demo Photo */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Upload Photo from Device</span>
          </button>

          <button
            onClick={onUseDemo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Try with Sample Photo</span>
          </button>
        </div>

      </div>
    </div>
  );
}
