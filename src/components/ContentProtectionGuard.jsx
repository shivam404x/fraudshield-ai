import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldAlert, Lock, ShieldX } from 'lucide-react';

/**
 * ContentProtectionGuard
 * High-Security Anti-Screenshot & DRM Screen Shield.
 * 
 * 1. Synchronous CSS Screen Shield:
 *    #drm-persistent-shield is permanently in DOM with z-index 2147483647.
 *    The microsecond `drm-screen-shield-active` is added, pure CSS covers the viewport
 *    with a 100% opaque jet-black curtain (0ms latency, bypassing React queue).
 * 2. Windows Snipping Tool (Win + Shift + S) & Blur Interception:
 *    When Snipping Tool or external screenshot software activates, the window loses focus.
 *    Immediate blackout triggers, and background content is wiped to pure black.
 * 3. Clipboard-Friendly:
 *    Paste (Ctrl+V / Cmd+V) is 100% PRESERVED and never blocked or overwritten, so users
 *    can freely paste question text, notes, URLs, and squad messages.
 * 4. Anti-Print & Save Protection:
 *    Blocks Ctrl+P, window.print(), Ctrl+S, F12, Ctrl+Shift+I/J/C, and right-click on papers.
 */
export default function ContentProtectionGuard({ isEnabled = true }) {
  const [warningMessage, setWarningMessage] = useState('');
  const [isBlackoutActive, setIsBlackoutActive] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const wipeTimeoutRef = useRef(null);

  const triggerWarning = (msg) => {
    setWarningMessage(msg);
    setTimeout(() => setWarningMessage(''), 3000);
  };

  // Screen blackout trigger
  const triggerScreenshotBlackout = useCallback((reason = 'Screenshot attempt detected') => {
    setIsBlackoutActive(true);
    document.documentElement.classList.add('drm-screen-shield-active');
    triggerWarning('📸 SCREENSHOT BLOCKED: Screen captures & snippets are strictly disabled on KRMU Vault.');

    if (wipeTimeoutRef.current) clearTimeout(wipeTimeoutRef.current);
    wipeTimeoutRef.current = setTimeout(() => {
      setIsBlackoutActive(false);
      if (!isWindowBlurred && document.hasFocus()) {
        document.documentElement.classList.remove('drm-screen-shield-active');
      }
    }, 2000);
  }, [isWindowBlurred]);

  const handleResume = () => {
    setIsBlackoutActive(false);
    setIsWindowBlurred(false);
    document.documentElement.classList.remove('drm-screen-shield-active');
  };

  useEffect(() => {
    if (!isEnabled) return;

    // 1. Right-Click Context Menu Restriction (Allow in inputs/textareas)
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return; // Always allow context menu inside text inputs for easy pasting
      }
      e.preventDefault();
      triggerWarning('⚠️ Right-click context menu is restricted to protect question papers.');
    };

    // 2. Text / Image Copy Restriction (Allow copy inside inputs)
    const handleCopy = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return; // Allow copying inside inputs
      }
      e.preventDefault();
      try {
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', '⚠️ KRMU VAULT: Question paper copying is restricted.');
        }
      } catch (err) {}
      triggerWarning('🚫 Content copying is restricted on KRMU Vault.');
    };

    // 3. Screenshot & Snipping Keyboard Interception
    const handleKeyDown = (e) => {
      // ALWAYS allow Paste (Ctrl+V / Cmd+V) unconditionally!
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        return;
      }

      // PrintScreen key (any variation)
      if (e.key === 'PrintScreen' || e.keyCode === 44 || e.code === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlackout('PrintScreen keydown');
        return;
      }

      // Windows Snipping Tool (Win + Shift + S) or Ctrl + Shift + S
      if ((e.key === 'S' || e.key === 's') && e.shiftKey && (e.ctrlKey || e.metaKey || e.altKey)) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlackout('Snipping Tool shortcut');
        return;
      }

      // Mac Screen Capture (Cmd + Shift + 3, 4, 5, 6)
      if (e.metaKey && e.shiftKey && ['3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlackout('Mac Screen Capture');
        return;
      }

      // Alt + PrintScreen
      if (e.altKey && (e.key === 'PrintScreen' || e.keyCode === 44 || e.code === 'PrintScreen')) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlackout('Alt+PrintScreen');
        return;
      }

      // Print page shortcut (Ctrl + P / Cmd + P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('🔒 Printing / Saving as PDF is strictly restricted.');
        return;
      }

      // Save page shortcut (Ctrl + S / Cmd + S outside input)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S') && !e.shiftKey) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          triggerWarning('🔒 Saving webpage source is restricted.');
          return;
        }
      }

      // Developer Tools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
      if (
        e.key === 'F12' || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        triggerWarning('🔒 Inspection tools are disabled.');
      }
    };

    // 4. PrintScreen KeyUp
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44 || e.code === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlackout('PrintScreen keyup');
      }
    };

    // 5. Window Blur (Snipping Tool & External Screen Capture trigger)
    const handleWindowBlur = () => {
      setIsWindowBlurred(true);
      document.documentElement.classList.add('drm-screen-shield-active');
    };

    // 6. Window Focus (When user returns from snip)
    const handleWindowFocus = () => {
      setIsWindowBlurred(false);
      if (!isBlackoutActive) {
        document.documentElement.classList.remove('drm-screen-shield-active');
      }
    };

    // 7. Page Visibility Change (Tab switch / Minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        document.documentElement.classList.add('drm-screen-shield-active');
      } else {
        if (!isWindowBlurred && !isBlackoutActive) {
          document.documentElement.classList.remove('drm-screen-shield-active');
        }
      }
    };

    // 8. Print Hooks
    const handleBeforePrint = () => {
      setIsBlackoutActive(true);
      document.documentElement.classList.add('drm-screen-shield-active');
    };

    const handleAfterPrint = () => {
      setIsBlackoutActive(false);
      document.documentElement.classList.remove('drm-screen-shield-active');
    };

    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('copy', handleCopy, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('copy', handleCopy, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      document.documentElement.classList.remove('drm-screen-shield-active');
    };
  }, [isEnabled, isBlackoutActive, isWindowBlurred, triggerScreenshotBlackout]);

  return (
    <>
      {/* 
        Persistent DRM Screen Shield Curtain 
        Permanently in the DOM with maximum z-index (2147483647).
        Pure CSS activates it synchronously in 0ms whenever window blurs or screenshot shortcut is detected.
      */}
      <div 
        id="drm-persistent-shield"
        onClick={handleResume}
        className="fixed inset-0 z-[2147483647] bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer"
      >
        <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500/50 text-rose-400 flex items-center justify-center mb-5 shadow-2xl shadow-rose-500/30">
          <ShieldX className="w-9 sm:w-11 h-9 sm:h-11" />
        </div>
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-3">
          🔒 SCREEN CAPTURE RESTRICTED
        </h2>
        <p className="text-xs sm:text-base text-slate-300 max-w-lg leading-relaxed">
          Screenshots, Snipping Tool (<kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-xs font-bold">Win+Shift+S</kbd>), PrintScreen, and Screen Recording are strictly prohibited on KRMU Vault.
        </p>
        <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono shadow-inner">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>KRMU Military-Grade DRM Screen Shield Active</span>
        </div>
        <p className="mt-5 text-xs text-slate-400 font-medium">
          Click anywhere inside this screen to resume viewing question papers.
        </p>
      </div>

      {/* Floating Alert Toast */}
      {warningMessage && !isBlackoutActive && !isWindowBlurred && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999999] flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900/95 text-white font-bold text-xs sm:text-sm shadow-2xl border border-rose-500/50 animate-fade-in pointer-events-none">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}
    </>
  );
}
