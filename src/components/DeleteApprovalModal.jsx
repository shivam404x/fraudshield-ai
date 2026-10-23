import React, { useState } from 'react';
import { ShieldAlert, Lock, CheckCircle, X, AlertTriangle, KeyRound, Send } from 'lucide-react';

const HARDCODED_ADMIN_KEY = 'SECTIONc';

export default function DeleteApprovalModal({
  isOpen,
  onClose,
  paper,
  onConfirmDelete,
  onRequestRemoval,
}) {
  const [adminKey, setAdminKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('auth'); // 'auth' | 'request'
  const [removalReason, setRemovalReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !paper) return null;

  const handleAdminDelete = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = adminKey.trim();
    const storedCustomKey = (localStorage.getItem('krmu_master_admin_key') || '').trim();

    if (trimmed === HARDCODED_ADMIN_KEY || (storedCustomKey && trimmed === storedCustomKey)) {
      onConfirmDelete(paper.id);
      onClose();
    } else {
      setErrorMsg('Invalid Admin Passkey. Question papers cannot be deleted without Master Admin authorization.');
    }
  };

  const handleSendRemovalRequest = (e) => {
    e.preventDefault();
    if (!removalReason.trim()) {
      setErrorMsg('Please enter a reason for deletion.');
      return;
    }

    if (onRequestRemoval) {
      onRequestRemoval(paper, removalReason.trim());
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Admin Approval Required
              </h3>
              <p className="text-xs text-slate-500">
                Question papers cannot be deleted without Admin authorization
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

        {/* Paper Target Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
            Paper Marked For Deletion
          </div>
          <div className="text-sm font-black text-slate-900">
            {paper.subject} {paper.paperCode ? `(${paper.paperCode})` : ''}
          </div>
          <div className="text-slate-500 flex flex-wrap gap-2 text-[11px] font-medium">
            <span>{paper.school}</span>
            <span>&bull;</span>
            <span>{paper.course}</span>
            <span>&bull;</span>
            <span className="text-indigo-600 font-bold">{paper.semester}</span>
          </div>
        </div>

        {/* Tabs: Admin Authorization vs Student Removal Request */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('auth');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'auth'
                ? 'bg-white text-rose-600 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Passkey</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('request');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'request'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Request Removal</span>
            </span>
          </button>
        </div>

        {/* Tab 1: Admin Passkey Direct Deletion */}
        {activeTab === 'auth' && (
          <form onSubmit={handleAdminDelete} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Master Admin Passkey
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => {
                    setAdminKey(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter Master Admin Passkey..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Only verified school/master administrators hold the key to permanently remove question papers.
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all hover:scale-[1.02]"
              >
                Authorize &amp; Delete
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Student Request Removal */}
        {activeTab === 'request' && (
          <form onSubmit={handleSendRemovalRequest} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Removal Request
              </label>
              <textarea
                rows={3}
                value={removalReason}
                onChange={(e) => {
                  setRemovalReason(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Explain why this paper should be removed (e.g. wrong syllabus year, duplicate entry, blurry scan)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 resize-none"
              />
              <p className="text-[11px] text-slate-400">
                Your request will be submitted to the Master Admin for review.
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSubmitted && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Removal request submitted to Master Admin!</span>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitted}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
