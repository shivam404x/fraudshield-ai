import React from 'react';
import { 
  Trophy, 
  X, 
  Award, 
  Zap, 
  Flame, 
  Target, 
  Swords, 
  Rocket, 
  Terminal, 
  Crown, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export const ACHIEVEMENTS_LIST = [
  { id: 'first_run', title: 'First Keystroke', desc: 'Complete your first typing lesson or speed test', icon: '🌱', xp: 50 },
  { id: 'speed_40', title: 'Speed Apprentice', desc: 'Reach 40 WPM in any typing test', icon: '⚡', xp: 100 },
  { id: 'speed_60', title: 'Speed Demon', desc: 'Reach 60 WPM with 95%+ accuracy', icon: '🔥', xp: 200 },
  { id: 'speed_100', title: 'Century Legend', desc: 'Hit the mythical 100 WPM speed barrier', icon: '💎', xp: 500 },
  { id: 'perfect_acc', title: 'Sniper Accuracy', desc: 'Finish any lesson with 100% zero errors', icon: '🎯', xp: 150 },
  { id: 'dragon_slayer', title: 'Dragon Slayer', desc: 'Defeat Ignis The Flame Tyrant in Titan Slayer', icon: '🐉', xp: 300 },
  { id: 'galaxy_ace', title: 'Cosmic Ace', desc: 'Survive to Wave 3 in Galaxy Defender', icon: '🚀', xp: 250 },
  { id: 'matrix_hacker', title: 'Cyber Infiltrator', desc: 'Fire an EMP blast in Matrix Defense', icon: '💻', xp: 200 },
  { id: 'nitro_racer', title: 'Nitro Champion', desc: 'Win 1st place in Turbo Racer', icon: '🏎️', xp: 250 },
  { id: 'streak_3', title: 'Habit Builder', desc: 'Maintain a 3-day daily practice streak', icon: '📅', xp: 200 },
  { id: 'certificate_claim', title: 'Certified Typist', desc: 'Generate your official speed certificate', icon: '📜', xp: 150 },
  { id: 'lofi_vibes', title: 'Flow State', desc: 'Practice typing while listening to Lo-Fi beats', icon: '🎧', xp: 100 }
];

export const AchievementsModal = ({ isOpen, onClose, userXp = 0, unlockedIds = [] }) => {
  if (!isOpen) return null;

  const unlockedCount = unlockedIds.length;
  const progressPercent = Math.round((unlockedCount / ACHIEVEMENTS_LIST.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative my-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Trophy Room & Achievements
              </h2>
              <span className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {ACHIEVEMENTS_LIST.length} Badges ({progressPercent}%)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {ACHIEVEMENTS_LIST.map((badge) => {
            const isUnlocked = unlockedIds.includes(badge.id) || (badge.id === 'first_run' && userXp > 50) || (badge.id === 'speed_40' && userXp > 300);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/70 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/30 border-slate-800/80 opacity-60'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isUnlocked ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-900 border border-slate-800'
                }`}>
                  {isUnlocked ? badge.icon : '🔒'}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {badge.title}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      +{badge.xp} XP
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {badge.desc}
                  </p>
                  {isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 pt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-1 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close Trophy Room
          </button>
        </div>

      </div>

    </div>
  );
};
