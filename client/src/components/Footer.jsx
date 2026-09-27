import React from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/40">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-heading font-bold text-sm text-white">
              Future 2030 Image Generator
            </span>
            <span className="text-xs text-slate-500 hidden md:inline">• React 19 • Tailwind CSS • Node.js</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Identity Protected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Neural Synthesis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>2030 Ready</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
