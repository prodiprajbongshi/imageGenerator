import React, { useEffect, useState } from 'react';
import { Cpu, Sparkles, Building2, Trees, Car, Plane } from 'lucide-react';

const STAGES = [
  { text: 'Scanning facial landmarks & biometric identity...', icon: Cpu },
  { text: 'Synthesizing Future Office 2030 holographic workspace...', icon: Building2 },
  { text: 'Generating Eco-Sanctuary Nature 2030 biodomes...', icon: Trees },
  { text: 'Calibrating Cyberpunk Road 2030 autonomous hypercar...', icon: Car },
  { text: 'Rendering Supersonic Aerospace travel destination...', icon: Plane },
  { text: 'Finalizing 4K neural render & identity composite...', icon: Sparkles },
];

export default function ProcessingScreen({ onComplete }) {
  const [progress, setProgress] = useState(12);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          return 98;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(prev + increment, 98);

        // Update stage based on progress
        const stage = Math.min(
          Math.floor((next / 100) * STAGES.length),
          STAGES.length - 1
        );
        setCurrentStageIndex(stage);

        return next;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = STAGES[currentStageIndex]?.icon || Sparkles;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      
      {/* Step Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        Step 4: AI Neural Synthesis
      </div>

      {/* Futuristic AI Orb / Processor Graphic */}
      <div className="relative mx-auto w-36 h-36 mb-8 flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-[spin_8s_linear_infinite]" />
        {/* Middle dashed cyber ring */}
        <div className="absolute inset-3 rounded-full border-2 border-dashed border-cyan-400/50 animate-[spin_6s_linear_infinite_reverse]" />
        {/* Inner pulse circle */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-blue-600/40 via-indigo-600/40 to-cyan-500/40 blur-md animate-pulse" />
        
        {/* Core Icon Box */}
        <div className="relative z-10 w-20 h-20 rounded-2xl bg-slate-900 border border-indigo-500/50 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600">
            <Cpu className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
        Generating 4 future images...
      </h2>
      <p className="text-sm text-slate-400 mb-8">
        This may take a few seconds
      </p>

      {/* Animated Progress Bar */}
      <div className="max-w-md mx-auto mb-4">
        <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden shadow-inner">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-mono-future text-slate-500 mt-2">
          <span>IDENTITY ENGINE v2.4</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>
      </div>

      {/* Current Generation Stage ticker */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
        <CurrentIcon className="w-4 h-4 text-cyan-400 animate-spin" />
        <span>{STAGES[currentStageIndex]?.text}</span>
      </div>

    </div>
  );
}
