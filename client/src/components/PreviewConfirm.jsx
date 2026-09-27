import React from 'react';
import { RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export default function PreviewConfirm({ imageSrc, onRetake, onConfirm }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      
      {/* Title */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
        <ShieldCheck className="w-3.5 h-3.5" />
        Step 3: Biometric Preview & Confirm
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
        Ready for Your 2030 Transformation?
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Check your photo. Make sure your face is clearly visible for the best AI identity preservation.
      </p>

      {/* Portrait Box */}
      <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden p-1 bg-gradient-to-b from-blue-500/40 via-cyan-500/20 to-indigo-500/40 shadow-2xl shadow-cyan-500/10 mb-8 border border-cyan-500/30">
        <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-900">
          <img 
            src={imageSrc} 
            alt="Your Captured Portrait" 
            className="w-full h-full object-cover"
          />

          {/* Biometric Scan Overlay Badge */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-[11px] font-mono-future text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ID SCAN COMPLETE</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/40 text-[11px] font-mono-future text-cyan-300">
            YEAR 2030 TARGET
          </div>
        </div>
      </div>

      {/* Buttons matching Step 3 of diagram: Retake on left, Generate My Future on right */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onRetake}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-semibold text-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retake</span>
        </button>

        <button
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Generate My Future</span>
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </button>
      </div>

    </div>
  );
}
