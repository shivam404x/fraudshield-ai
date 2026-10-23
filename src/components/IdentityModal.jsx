import React from 'react';
import { X, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { setAnonymousUser } from '../utils/privacySecurity';

export default function IdentityModal({ isOpen, onClose, currentUser, onSelectIdentity }) {
  if (!isOpen) return null;

  const handleRollNewAlias = () => {
    const updated = setAnonymousUser();
    onSelectIdentity(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Anonymous Identity
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                100% untraceable &bull; Zero identity leakage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Identity Display */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Your Active Secret Persona
          </span>
          <div className="flex items-center justify-center gap-2.5 text-xl font-black text-slate-900">
            <span className="p-2 rounded-xl bg-white border border-slate-200 text-lg shadow-xs">
              {currentUser?.icon || '🕶️'}
            </span>
            <span>{currentUser?.alias || 'Anonymous Scholar'}</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 font-medium">
            No name, roll number, email, or personal data is ever collected or exposed.
          </p>
        </div>

        {/* Roll New Random Alias Action */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRollNewAlias}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate New Random Alias</span>
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Click anytime to generate a fresh random untraceable ID for all your paper uploads and requests.
          </p>
        </div>
      </div>
    </div>
  );
}
