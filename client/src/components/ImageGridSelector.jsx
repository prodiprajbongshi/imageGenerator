import React, { useState } from 'react';
import { Check, ArrowRight, Building2, Trees, Car, Plane, Eye, Sparkles } from 'lucide-react';

const THEME_ICONS = {
  office: Building2,
  nature: Trees,
  road: Car,
  travel: Plane,
};

export default function ImageGridSelector({ images, onSelectFavorite, onContinue }) {
  const [selectedImageId, setSelectedImageId] = useState(images?.[0]?.id || null);

  const handleCardClick = (image) => {
    setSelectedImageId(image.id);
    onSelectFavorite(image);
  };

  const selectedImage = images.find((img) => img.id === selectedImageId) || images[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Step Badges & Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Step 5 & 6: Choose Your Favorite 2030 Look
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Your 4 Future 2030 Identities
        </h2>
        <p className="text-sm text-slate-400">
          Our AI synthesized your portrait into 4 distinct 2030 environments. Click to select your favorite avatar.
        </p>
      </div>

      {/* Main 4 Cards Grid - Step 5 & 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {images.map((image) => {
          const isSelected = image.id === selectedImageId;
          const Icon = THEME_ICONS[image.themeId] || Sparkles;

          return (
            <div
              key={image.id}
              onClick={() => handleCardClick(image)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col bg-slate-900 border-2 ${
                isSelected 
                  ? 'border-blue-500 shadow-xl shadow-blue-500/25 scale-[1.02] ring-2 ring-blue-500/40' 
                  : 'border-slate-800 hover:border-slate-700 hover:scale-[1.01]'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Selected Checkmark Badge (Step 6 indicator) */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/50 animate-in zoom-in-75 duration-200">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                )}

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </div>

              {/* Card Footer / Details */}
              <div className="p-4 flex items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-900/90">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div 
                    className="p-1.5 rounded-lg shrink-0"
                    style={{ backgroundColor: `${image.color}20`, color: image.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate font-heading">
                      {image.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {image.subtitle}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Preview Bar & Continue Button - Matching Step 6 of Diagram */}
      <div className="max-w-2xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Thumbnail Strip */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-future text-slate-400 hidden sm:block">SELECT:</span>
          <div className="flex items-center gap-2">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => handleCardClick(img)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all relative ${
                  img.id === selectedImageId 
                    ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' 
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                {img.id === selectedImageId && (
                  <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Big "Continue ->" Button */}
        <button
          onClick={() => onContinue(selectedImage)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
