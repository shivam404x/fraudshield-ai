import React, { useState, useEffect } from 'react';
import { Laptop, ShieldAlert, Monitor, RotateCcw, AlertTriangle } from 'lucide-react';
import KrmuLogo from './KrmuLogo';

export default function MobileDeviceBlocker({ children }) {
  const [deviceStatus, setDeviceStatus] = useState(() => {
    if (typeof window === 'undefined') return { isBlocked: false, isMobileUa: false };
    const ua = navigator.userAgent || '';
    const isMobileUa = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    const isSmallScreen = window.innerWidth < 1024;
    return {
      isBlocked: isMobileUa || isSmallScreen,
      isMobileUa,
    };
  });

  const [desktopBypass, setDesktopBypass] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const ua = navigator.userAgent || '';
      const isMobileUa = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
      const isSmallScreen = window.innerWidth < 1024;
      setDeviceStatus({
        isBlocked: isMobileUa || isSmallScreen,
        isMobileUa,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If blocked and not bypassed on desktop
  if (deviceStatus.isBlocked && !desktopBypass) {
    return (
      <div className="fixed inset-0 z-[9999999] bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden font-sans">
        {/* Soft Ambient Pastel Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm w-full space-y-6 animate-fade-in">
          {/* Logo & Restriction Badge */}
          <div className="flex flex-col items-center gap-3">
            <KrmuLogo size="lg" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted on Phone</span>
            </span>
          </div>

          {/* Laptop Only Graphic Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <Laptop className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Laptop / Desktop View Only
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                K.R. Mangalam University Question Paper Vault is strictly restricted on mobile devices.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-700">
                <Monitor className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Device Policy Notice</span>
              </div>
              <p className="text-slate-600">
                To examine high-resolution question paper scans, formulae, and complete semester papers, please open this URL on a <strong>laptop</strong> or <strong>desktop computer</strong>.
              </p>
            </div>

            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-check Display</span>
              </button>

              {/* Developer / Window Resized Override for Laptop users only */}
              {!deviceStatus.isMobileUa && (
                <button
                  type="button"
                  onClick={() => setDesktopBypass(true)}
                  className="w-full text-[10px] text-slate-400 hover:text-indigo-600 transition-colors py-1"
                >
                  Continue in Resized Window (Desktop Only)
                </button>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            KRMU Examination Division &bull; Gurugram
          </p>
        </div>
      </div>
    );
  }

  return children;
}
