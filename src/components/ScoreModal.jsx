import React, { useEffect } from 'react';
import { 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Target,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScoreModal = ({ 
  isOpen, 
  stats, 
  onRetry, 
  onNextLesson, 
  hasNextLesson,
  lessonTitle,
  onClaimCertificate
}) => {
  const { wpm, accuracy, timeElapsed, errors, errorKeys } = stats || {};

  // Calculate Stars
  let stars = 1;
  if ((accuracy || 0) >= 96 && (wpm || 0) >= 25) stars = 3;
  else if ((accuracy || 0) >= 90) stars = 2;

  // Fire celebratory confetti on 3 or 2 stars
  useEffect(() => {
    if (!isOpen) return;
    try {
      confetti({
        particleCount: stars === 3 ? 100 : 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, [isOpen, stars]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-pop">
        
        {/* Top Trophy & Stars */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
              Lesson Completed!
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lessonTitle}
            </h2>
          </div>

          {/* Stars display */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-7 h-7 ${
                  s <= stars 
                    ? 'fill-amber-400 text-amber-400 animate-bounce' 
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2 Big Core Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Final Speed</span>
            <span className="text-3xl font-black font-mono text-emerald-400 block mt-0.5">
              {wpm} <span className="text-xs text-slate-400">WPM</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Accuracy</span>
            <span className={`text-3xl font-black font-mono block mt-0.5 ${
              accuracy >= 90 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Weak Keys Feedback */}
        {errorKeys && errorKeys.length > 0 ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
            <span className="font-bold flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Keys Needing Practice:
            </span>
            <div className="flex justify-center gap-1.5 pt-1">
              {errorKeys.slice(0, 5).map((k, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 font-mono font-bold text-white uppercase">
                  {k === ' ' ? 'Space' : k}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Perfect Run! Zero mistyped keys.
          </div>
        )}

        {/* Claim Certificate Banner Button */}
        {onClaimCertificate && (
          <button
            onClick={onClaimCertificate}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Generate Verified Certificate for this Run 📜</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </button>

          {hasNextLesson ? (
            <button
              onClick={onNextLesson}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-accent transition-all active:scale-95"
            >
              Next Lesson
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Stage Completed!
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
