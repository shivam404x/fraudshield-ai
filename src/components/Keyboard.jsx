import React from 'react';
import { FINGER_MAP, FINGER_COLORS, KEYBOARD_LAYOUT } from '../data/fingerMap';

export const Keyboard = ({ 
  activeChar, 
  pressedKey, 
  isError 
}) => {
  const targetChar = (activeChar || '').toLowerCase();

  const isTargetKey = (k) => {
    if (targetChar === ' ' && k === ' ') return true;
    return k.toLowerCase() === targetChar;
  };

  const isPressedKey = (k) => {
    if (!pressedKey) return false;
    if (pressedKey === ' ' && k === ' ') return true;
    return k.toLowerCase() === pressedKey.toLowerCase();
  };

  const getKeyWidth = (k) => {
    if (k === 'Backspace') return 'w-20';
    if (k === 'Tab') return 'w-16';
    if (k === 'Caps') return 'w-18';
    if (k === 'Enter') return 'w-20';
    if (k === 'Shift') return 'w-24';
    if (k === ' ') return 'flex-1 max-w-sm';
    if (k === 'Ctrl' || k === 'Alt') return 'w-16';
    return 'w-10 sm:w-12';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-2xl overflow-x-auto select-none">
      
      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 min-w-[620px] max-w-3xl mx-auto">
        {KEYBOARD_LAYOUT.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5">
            {row.map((k, colIdx) => {
              const target = isTargetKey(k);
              const pressed = isPressedKey(k);
              const fingerData = FINGER_MAP[k.toLowerCase()];
              const fingerColor = fingerData ? FINGER_COLORS[fingerData.finger] : null;
              const hasBump = k === 'f' || k === 'j';

              // Styling calculation
              let keyBg = 'bg-slate-800 text-slate-300 border-slate-700/80';
              let ringGlow = '';

              if (target) {
                keyBg = 'bg-indigo-600 text-white font-black scale-105 z-10';
                ringGlow = 'ring-4 ring-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse';
              } else if (pressed) {
                if (isError) {
                  keyBg = 'bg-rose-600 text-white scale-95';
                  ringGlow = 'ring-2 ring-rose-400';
                } else {
                  keyBg = 'bg-emerald-600 text-white scale-95';
                  ringGlow = 'ring-2 ring-emerald-400';
                }
              }

              return (
                <div
                  key={colIdx}
                  className={`relative h-11 sm:h-13 ${getKeyWidth(k)} rounded-xl border flex items-center justify-center font-mono text-xs sm:text-sm font-bold shadow-key-idle transition-all duration-75 ${keyBg} ${ringGlow}`}
                >
                  {k === ' ' ? 'Space' : k.toUpperCase()}

                  {/* Physical bump marker for F & J */}
                  {hasBump && (
                    <span className="absolute bottom-1.5 w-3 h-0.5 rounded-full bg-slate-400 opacity-80"></span>
                  )}

                  {/* Finger color dot indicator on key corner */}
                  {fingerColor && k !== ' ' && (
                    <span 
                      className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${fingerColor.dot}`}
                      title={fingerData?.name}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Color Legend (Finger Zones) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-4 mt-3 border-t border-slate-800 text-[10px] sm:text-xs text-slate-400 font-semibold">
        <span className="text-slate-500 uppercase font-bold text-[10px]">Finger Zones:</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Pinky
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Ring
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Middle
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Index
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Thumbs
        </span>
      </div>

    </div>
  );
};
