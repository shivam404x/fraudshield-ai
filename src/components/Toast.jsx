import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all animate-slide-up bg-white ${
              isSuccess ? 'border-emerald-200 text-emerald-900 shadow-emerald-500/5' :
              isError ? 'border-rose-200 text-rose-900 shadow-rose-500/5' :
              isWarning ? 'border-amber-200 text-amber-900 shadow-amber-500/5' :
              'border-blue-200 text-blue-900 shadow-blue-500/5'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
              <span className="text-xs font-semibold leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-3 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
