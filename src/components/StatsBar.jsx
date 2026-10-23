import React from 'react';
import { Timer, Flame, Target, Zap, Award } from 'lucide-react';

export const StatsBar = ({ 
  wpm, 
  accuracy, 
  timeElapsed, 
  streak, 
  progressPercent 
}) => {
  return (
    <div className="space-y-2">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* WPM */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Speed (WPM)
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white block mt-0.5">
            {wpm}
          </span>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" /> Accuracy
          </span>
          <span className={`text-2xl sm:text-3xl font-black font-mono block mt-0.5 ${
            accuracy >= 95 ? 'text-emerald-400' : accuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {accuracy}%
          </span>
        </div>

        {/* Time Elapsed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Timer className="w-3.5 h-3.5 text-sky-400" /> Time
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white block mt-0.5">
            {timeElapsed}s
          </span>
        </div>

        {/* Keystroke Streak */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" /> Streak
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-orange-400 block mt-0.5">
            {streak}
          </span>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

    </div>
  );
};
