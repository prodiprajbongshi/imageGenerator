import React from 'react';
import { Sparkles, Cpu, Wifi, RefreshCw } from 'lucide-react';

export default function Navbar({ currentStep, onReset, serverOnline, networkIp }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse-subtle" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg tracking-wider text-white">
                FUTURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">2030</span>
              </span>
              <span className="text-[10px] font-mono-future uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AI Vision
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Identity-Preserved Future Generator</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${serverOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${serverOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-slate-300 font-medium font-mono-future">
              {serverOnline ? `Backend Online (${networkIp || '5000'})` : 'Local Fallback Ready'}
            </span>
          </div>

          {currentStep > 1 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all"
              title="Start New Generation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Photo</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
