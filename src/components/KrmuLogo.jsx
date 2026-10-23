import React, { useState } from 'react';

/**
 * KrmuLogo Component
 * Renders the official K.R. Mangalam University logo
 * Includes high-res vector fallback and anti-copy / anti-drag attributes.
 */
export default function KrmuLogo({ 
  size = 'md', 
  showText = false, 
  variant = 'default', // 'default' | 'monochrome' | 'print'
  className = '' 
}) {
  const [loadError, setLoadError] = useState(false);

  // Size mapping
  const sizeMap = {
    xs: { dim: 'w-6 h-6', textSize: 'text-xs', subSize: 'text-[9px]' },
    sm: { dim: 'w-8 h-8', textSize: 'text-sm', subSize: 'text-[10px]' },
    md: { dim: 'w-10 h-10', textSize: 'text-base', subSize: 'text-[11px]' },
    lg: { dim: 'w-14 h-14', textSize: 'text-lg', subSize: 'text-xs' },
    xl: { dim: 'w-20 h-20', textSize: 'text-2xl', subSize: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Logo Emblem Container */}
      <div 
        className={`relative ${currentSize.dim} shrink-0 rounded-2xl bg-white/95 p-1 flex items-center justify-center shadow-lg shadow-black/20 border border-slate-700/40 overflow-hidden`}
        title="K.R. Mangalam University"
      >
        {!loadError ? (
          <img
            src="/krmu-logo.svg"
            alt="K.R. Mangalam University Logo"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setLoadError(true)}
          />
        ) : (
          /* SVG Vector Fallback with Official KRMU Red & Gold Crest */
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Crest Shield Background */}
            <path
              d="M50 5 L88 20 C88 58, 50 92, 50 95 C50 92, 12 58, 12 20 Z"
              fill="#c41230"
              stroke="#d4af37"
              strokeWidth="3"
            />
            {/* Inner Gold Border */}
            <path
              d="M50 12 L82 24 C82 54, 50 84, 50 86 C50 84, 18 54, 18 24 Z"
              stroke="#fbbf24"
              strokeWidth="1.5"
              fill="#9b111e"
            />
            {/* Open Book of Knowledge */}
            <path
              d="M32 46 C38 43, 46 44, 50 47 C54 44, 62 43, 68 46 L68 62 C62 59, 54 60, 50 63 C46 60, 38 59, 32 62 Z"
              fill="#ffffff"
              stroke="#d4af37"
              strokeWidth="1.2"
            />
            {/* Central Divider */}
            <line x1="50" y1="47" x2="50" y2="63" stroke="#d4af37" strokeWidth="1.5" />
            {/* Torch / Flame at Top */}
            <path
              d="M50 26 C53 31, 55 34, 50 39 C45 34, 47 31, 50 26 Z"
              fill="#fbbf24"
            />
            <circle cx="50" cy="33" r="2" fill="#ef4444" />
            {/* University Letters */}
            <text x="50" y="76" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
              KRMU
            </text>
          </svg>
        )}
      </div>

      {/* University Typography (Optional) */}
      {showText && (
        <div className="leading-tight">
          <div className={`font-black tracking-tight text-white ${currentSize.textSize} flex items-center gap-1.5`}>
            <span>K.R. MANGALAM</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
              UNIVERSITY
            </span>
          </div>
          <div className={`font-semibold tracking-wider uppercase text-slate-400 ${currentSize.subSize}`}>
            The Complete World of Education &bull; Gurugram
          </div>
        </div>
      )}
    </div>
  );
}
