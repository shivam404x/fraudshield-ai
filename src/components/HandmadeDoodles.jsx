import React from 'react';

export const HandArrow = ({ 
  direction = 'curve-down-right', 
  color = '#D97706', 
  className = 'w-16 h-12',
  strokeWidth = 3
}) => {
  if (direction === 'curve-down-right') {
    return (
      <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 10 C 35 8, 65 18, 82 45" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M68 45 C 75 48, 83 47, 85 45 C 84 37, 82 30, 80 25" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (direction === 'curly-loop') {
    return (
      <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M10 20 C 50 10, 80 30, 60 60 C 45 75, 20 60, 45 40 C 65 25, 80 45, 90 65" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M78 62 L 91 66 L 90 52" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5 22 Q 30 15, 55 24 T 92 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M78 8 Q 85 14, 93 18 Q 84 25, 76 31" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const HandLightbulb = ({ className = 'w-10 h-10', color = '#EAB308' }) => (
  <svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 4 L30 10 M12 14 L17 19 M48 14 L43 19 M5 32 L11 32 M55 32 L49 32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 50 C 13 45, 10 35, 12 26 C 14 17, 22 12, 30 12 C 38 12, 46 17, 48 26 C 50 35, 47 45, 40 50 L 38 56 L 22 56 Z" fill="#FEF08A" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M26 36 L28 25 L32 25 L34 36" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
    <path d="M23 56 L37 56 M24 60 L36 60 M26 64 L34 64" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const HandRocket = ({ className = 'w-12 h-12', color = '#EF4444' }) => (
  <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M35 8 C 45 18, 52 35, 48 50 L 22 50 C 18 35, 25 18, 35 8 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="35" cy="30" r="6" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
    <path d="M22 42 L 10 52 L 21 52" fill={color} stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M48 42 L 60 52 L 49 52" fill={color} stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M27 53 Q 35 68, 43 53 Q 38 61, 35 58 Q 32 61, 27 53 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
  </svg>
);

export const HandCoffee = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 14 C 20 10, 24 6, 22 2 M30 14 C 28 9, 32 5, 30 1 M38 14 C 36 10, 40 6, 38 2" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 16 L 45 16 L 41 46 C 40 50, 36 53, 30 53 C 24 53, 20 50, 19 46 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M43 22 C 52 22, 54 36, 42 38" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const HandFire = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M24 4 C 29 18, 44 26, 44 40 C 44 50, 35 56, 25 56 C 14 56, 6 49, 6 38 C 6 28, 15 20, 20 14 C 21 21, 23 23, 27 21 C 28 17, 26 10, 24 4 Z" fill="#FB923C" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M25 28 C 30 36, 35 40, 33 48 C 31 52, 27 54, 25 54 C 20 54, 16 50, 17 44 C 18 39, 23 34, 25 28 Z" fill="#FEF08A" />
  </svg>
);

export const HandStar = ({ className = 'w-8 h-8', color = '#F59E0B' }) => (
  <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 3 L 31 17 L 46 18 L 34 29 L 38 44 L 25 35 L 12 44 L 16 29 L 4 18 L 19 17 Z" fill={color} stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const HandCheck = ({ className = 'w-8 h-8', color = '#10B981' }) => (
  <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 26 C 14 28, 19 36, 22 41 C 28 30, 36 17, 44 8" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HandCross = ({ className = 'w-8 h-8', color = '#EF4444' }) => (
  <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 10 L 40 40 M40 10 L 10 40" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

export const WashiTape = ({ color = 'yellow', angle = '-4deg', className = 'w-24 h-6', style = {} }) => {
  const colorMap = {
    yellow: 'washi-tape-yellow',
    coral: 'washi-tape-coral',
    white: 'scotch-tape'
  };

  return (
    <div 
      className={`absolute z-20 pointer-events-none rounded-sm ${colorMap[color] || colorMap.yellow} ${className}`}
      style={{ transform: `rotate(${angle})`, ...style }}
    />
  );
};

export const StickyNote = ({ text, title = '', color = 'yellow', angle = '-2deg', className = '', onEdit = null, editable = false }) => {
  const colors = {
    yellow: 'bg-amber-100 text-amber-950 border-amber-300',
    pink: 'bg-rose-100 text-rose-950 border-rose-300',
    mint: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    blue: 'bg-sky-100 text-sky-950 border-sky-300'
  };

  return (
    <div 
      className={`relative p-3.5 rounded-sm border shadow-md wobbly-border-sm transition-all ${colors[color] || colors.yellow} ${className}`}
      style={{ transform: `rotate(${angle})` }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 scotch-tape rounded-sm rotate-1 z-10" />
      {title && (
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1 border-b border-black/10 pb-0.5">
          {title}
        </div>
      )}
      {editable ? (
        <textarea
          value={text}
          onChange={(e) => onEdit && onEdit(e.target.value)}
          className="w-full bg-transparent border-none outline-none resize-none font-hand text-base leading-tight p-0"
          rows={3}
        />
      ) : (
        <p className="font-hand text-base leading-tight font-medium">{text}</p>
      )}
    </div>
  );
};

export const RubberStamp = ({ text = '100% SHIPPED', color = 'red', angle = '-7deg', className = '' }) => {
  const colorStyles = {
    red: 'text-red-600 border-red-600 bg-red-500/5',
    green: 'text-emerald-700 border-emerald-700 bg-emerald-500/5',
    blue: 'text-blue-700 border-blue-700 bg-blue-500/5',
    amber: 'text-amber-700 border-amber-700 bg-amber-500/5'
  };

  return (
    <div 
      className={`inline-block font-mono font-black tracking-widest text-[10px] uppercase px-2.5 py-1 border-2 border-dashed rounded-md select-none ${colorStyles[color] || colorStyles.red} ${className}`}
      style={{ transform: `rotate(${angle})` }}
    >
      ★ {text} ★
    </div>
  );
};
