import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { verifyAdminPasskeyApi } from '../utils/api';

const HARDCODED_ADMIN_KEY = 'SECTIONc';

export default function ResetPasskeyModal({
  isOpen,
  onClose,
  onConfirmReset,
}) {
  const [passkey, setPasskey] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanKey = passkey.trim();
    if (!cleanKey) {
      setErrorMsg('Please enter the Master Admin passkey.');
      return;
    }

    setIsVerifying(true);

    try {
      // 1. Try server verification first
      const resp = await verifyAdminPasskeyApi(cleanKey).catch(() => null);

      if (resp && resp.authorized) {
        setIsVerifying(false);
        setPasskey('');
        onConfirmReset();
        onClose();
        return;
      }

      if (resp && resp.authorized === false) {
        setIsVerifying(false);
        setErrorMsg(resp.error || 'Access Denied: Incorrect Master Admin passkey.');
        return;
      }

      // 2. Fallback check against stored custom passkey or HARDCODED_ADMIN_KEY ('SECTIONc')
      const storedKey = (localStorage.getItem('krmu_master_admin_key') || '').trim();
      if (cleanKey === HARDCODED_ADMIN_KEY || (storedKey && cleanKey === storedKey)) {
        setIsVerifying(false);
        setPasskey('');
        onConfirmReset();
        onClose();
        return;
      }

      setIsVerifying(false);
      setErrorMsg('Access Denied: Incorrect passkey. Platform hard reset requires valid Master Admin authorization.');
    } catch (err) {
      setIsVerifying(false);
      setErrorMsg('Verification error. Please verify your passkey and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600">
              <KeyRound className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Admin Passkey Required
              </h3>
              <p className="text-xs text-slate-500">
                Unauthorized platform resets are strictly blocked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Note */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Master Admin Authorization Enforced</span>
          </div>
          <p className="text-amber-800/90 text-[11px] leading-relaxed">
            Koi bhi platform ko bina Master Admin passkey ke reset nahi kar sakta. KRMU vault ko hard reset karne ke liye apna admin passkey enter karein.
          </p>
        </div>

        {/* Passkey Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Enter Master Admin Passkey</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setErrorMsg('');
                }}
                autoFocus
                placeholder="Enter passkey..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying...' : 'Authorize Reset'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
