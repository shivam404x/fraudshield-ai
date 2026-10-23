import React from 'react';
import { FINGER_MAP, FINGER_COLORS } from '../data/fingerMap';

export const FingerGuide = ({ activeChar }) => {
  const charKey = (activeChar || '').toLowerCase();
  const fingerInfo = FINGER_MAP[charKey] || FINGER_MAP[' '];
  const activeFingerKey = fingerInfo?.finger || 'th';
  const activeHand = fingerInfo?.hand || 'both';
  const fingerName = fingerInfo?.name || 'Thumb';

  // Left hand fingers
  const leftFingers = [
    { key: 'lp', name: 'Pinky', keys: 'A, Q, Z, 1' },
    { key: 'lr', name: 'Ring', keys: 'S, W, X, 2' },
    { key: 'lm', name: 'Middle', keys: 'D, E, C, 3' },
    { key: 'li', name: 'Index', keys: 'F, R, V, G, T, B' },
    { key: 'th', name: 'Thumb', keys: 'Space' }
  ];

  // Right hand fingers
  const rightFingers = [
    { key: 'th', name: 'Thumb', keys: 'Space' },
    { key: 'ri', name: 'Index', keys: 'J, U, M, H, Y, N' },
    { key: 'rm', name: 'Middle', keys: 'K, I, ,' },
    { key: 'rr', name: 'Ring', keys: 'L, O, .' },
    { key: 'rp', name: 'Pinky', keys: ';, P, /' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg">
      
      {/* Active Finger Callout */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Active Finger:</span>
          <span className={`px-2.5 py-1 rounded-lg font-bold text-xs border ${
            FINGER_COLORS[activeFingerKey]?.bg
          } ${FINGER_COLORS[activeFingerKey]?.border} ${FINGER_COLORS[activeFingerKey]?.text}`}>
            {fingerName}
          </span>
          <span className="text-slate-500 hidden sm:inline text-[11px]">
            for key <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded uppercase">
              {activeChar === ' ' ? 'Space' : activeChar}
            </strong>
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-medium hidden md:block">
          💡 Tip: Keep index fingers resting lightly on F & J bumps
        </div>
      </div>

      {/* Interactive 2-Hand Graphic */}
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
        
        {/* Left Hand */}
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center mb-2">
            Left Hand
          </span>
          <div className="flex justify-between items-end h-20 px-1">
            {leftFingers.map((f, i) => {
              const isActive = activeFingerKey === f.key && (activeHand === 'left' || activeHand === 'both');
              // finger heights
              const heights = ['h-12', 'h-16', 'h-18', 'h-15', 'h-10'];
              return (
                <div key={f.key + i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-4 sm:w-5 rounded-t-full transition-all duration-150 ${heights[i]} ${
                      isActive 
                        ? `${FINGER_COLORS[f.key].dot} shadow-[0_0_15px_${FINGER_COLORS[f.key].hex}] scale-110` 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  />
                  <span className={`text-[9px] font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {f.name.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand */}
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center mb-2">
            Right Hand
          </span>
          <div className="flex justify-between items-end h-20 px-1">
            {rightFingers.map((f, i) => {
              const isActive = activeFingerKey === f.key && (activeHand === 'right' || activeHand === 'both');
              // finger heights
              const heights = ['h-10', 'h-15', 'h-18', 'h-16', 'h-12'];
              return (
                <div key={f.key + i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-4 sm:w-5 rounded-t-full transition-all duration-150 ${heights[i]} ${
                      isActive 
                        ? `${FINGER_COLORS[f.key].dot} shadow-[0_0_15px_${FINGER_COLORS[f.key].hex}] scale-110` 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  />
                  <span className={`text-[9px] font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {f.name.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
