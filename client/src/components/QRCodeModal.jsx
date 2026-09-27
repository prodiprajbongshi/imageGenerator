import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, Check, ExternalLink, Clock, Sparkles } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, selectedImage, networkInfo, onOpenPhoneSimulator }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !selectedImage) return null;

  // Compute the URL for the phone to download
  // Prefer the network IP server URL: e.g. http://192.168.68.112:5000/download/:imageId
  const localIp = networkInfo?.localIp || window.location.hostname;
  const serverPort = networkInfo?.serverPort || 5000;
  
  // The mobile download endpoint served by our Express server
  const mobileDownloadUrl = `http://${localIp}:${serverPort}/download/${selectedImage.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileDownloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow behind QR */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 8 Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Step 8: Generate QR Code
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
          Scan to Download on Phone
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Open your phone's camera and point at the QR code
        </p>

        {/* White QR Code Card matching Step 8 of Diagram */}
        <div className="p-4 rounded-2xl bg-white shadow-2xl shadow-cyan-500/10 mb-6 flex flex-col items-center justify-center">
          <QRCodeSVG
            value={mobileDownloadUrl}
            size={220}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Instructions matching Diagram Step 8: "Scan with your phone to download the image" */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>Scan with your phone to download the image</span>
        </div>

        {/* Validity notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-6 font-mono-future">
          <Clock className="w-3.5 h-3.5 text-amber-400/80" />
          <span>QR code will be valid for 10 minutes</span>
        </div>

        {/* Quick Link & Action buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono-future">
            <span className="truncate px-2 select-all flex-1 text-left">
              {mobileDownloadUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center gap-1 shrink-0 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={mobileDownloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Link</span>
            </a>

            <button
              onClick={onOpenPhoneSimulator}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-xs font-semibold text-blue-300 border border-blue-500/40 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulate Phone</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
