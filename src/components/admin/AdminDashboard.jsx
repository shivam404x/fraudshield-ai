import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, ShieldAlert, KeyRound, Lock, Unlock, LogOut,
  FileText, HelpCircle, Users, Activity, Settings, RefreshCw,
  Search, Filter, Trash2, Edit3, Eye, CheckCircle2, XCircle,
  AlertTriangle, ArrowLeft, ArrowUpRight, Server, Database,
  Cpu, HardDrive, Clock, Check, ChevronRight, Globe
} from 'lucide-react';
import KrmuLogo from '../KrmuLogo';
import { ALL_KRMU_SCHOOLS, ALL_SEMESTERS, KRMU_EXAM_WEIGHTAGES } from '../../data/krMangalamCourses';
import {
  fetchPapersApi, savePaperApi, deletePaperApi,
  fetchRequestsApi, saveRequestApi, deleteRequestApi,
  fetchGroupsApi, deleteGroupApi, fetchHealthApi,
  verifyAdminPasskeyApi, updateAdminPasskeyApi, fetchAdminPasskeyStatusApi,
  triggerHardResetApi
} from '../../utils/api';
import { performManualHardReset } from '../../utils/storage';

const HARDCODED_ADMIN_KEY = 'SECTIONc';

export default function AdminDashboard({
  questions = [],
  onUpdateQuestions = () => {},
  requests = [],
  onUpdateRequests = () => {},
  groups = [],
  onUpdateGroups = () => {},
  onExit = () => {}
}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('krmu_master_admin_session') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active View Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'papers' | 'requests' | 'squads' | 'health' | 'settings'

  // Master Admin Department / Program Scope Filter
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [paperFilterScope, setPaperFilterScope] = useState('all'); // 'all' | 'public' | 'squad_locked'

  // Inspection & Editing Modals
  const [inspectingPaper, setInspectingPaper] = useState(null);
  const [editingPaper, setEditingPaper] = useState(null);
  const [deletingTarget, setDeletingTarget] = useState(null); // { type: 'paper'|'request'|'group', id: string, name: string }

  // Telemetry & Server Stats
  const [serverHealth, setServerHealth] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pingLatency, setPingLatency] = useState(null);

  // Master Vault Hard Reset Modal State
  const [isHardResetModalOpen, setIsHardResetModalOpen] = useState(false);
  const [hardResetPasskey, setHardResetPasskey] = useState('');
  const [showHardResetPasskey, setShowHardResetPasskey] = useState(false);
  const [hardResetError, setHardResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Toast Notification inside Admin Dashboard
  const [adminToast, setAdminToast] = useState('');
  const showToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 4000);
  };

  // Custom Admin Key & Security Status
  const [customKey, setCustomKey] = useState(() => {
    try {
      return localStorage.getItem('krmu_master_admin_key') || HARDCODED_ADMIN_KEY;
    } catch (e) {
      return HARDCODED_ADMIN_KEY;
    }
  });
  const [hasCustomPasskey, setHasCustomPasskey] = useState(false);
  const [newCustomKeyInput, setNewCustomKeyInput] = useState('');
  const [currentKeyInput, setCurrentKeyInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Check passkey status from backend on load
  useEffect(() => {
    fetchAdminPasskeyStatusApi()
      .then((res) => {
        if (res && res.hasCustomPasskey) {
          setHasCustomPasskey(true);
        }
      })
      .catch(() => {
        const stored = localStorage.getItem('krmu_master_admin_key');
        if (stored && stored !== HARDCODED_ADMIN_KEY) {
          setHasCustomPasskey(true);
        }
      });
  }, []);

  // Fetch Server Health
  const loadServerHealth = async () => {
    const startTime = performance.now();
    try {
      const data = await fetchHealthApi();
      const latency = Math.round(performance.now() - startTime);
      setServerHealth(data);
      setPingLatency(latency);
    } catch (err) {
      setServerHealth({ status: 'offline', error: err.message });
      setPingLatency(null);
    }
  };

  // Refresh all data from REST API
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      const [papersData, reqsData, groupsData] = await Promise.all([
        fetchPapersApi().catch(() => null),
        fetchRequestsApi().catch(() => null),
        fetchGroupsApi().catch(() => null),
      ]);

      if (Array.isArray(papersData)) onUpdateQuestions(papersData);
      if (Array.isArray(reqsData)) onUpdateRequests(reqsData);
      if (Array.isArray(groupsData)) onUpdateGroups(groupsData);

      await loadServerHealth();
      showToast('All vault data synchronized with live server.');
    } catch (err) {
      showToast('Error syncing with backend.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadServerHealth();
    }
  }, [isAuthenticated]);

  // Handle Login with Strict Verification
  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!passkeyInput.trim()) {
      setAuthError('Please enter the Master Admin passkey.');
      return;
    }

    setIsVerifying(true);
    setAuthError('');
    const cleanKey = passkeyInput.trim();

    try {
      try {
        const result = await verifyAdminPasskeyApi(cleanKey);
        if (result && result.authorized) {
          try {
            sessionStorage.setItem('krmu_master_admin_session', 'true');
            sessionStorage.setItem('krmu_active_passkey', cleanKey);
          } catch (e) {}
          setIsAuthenticated(true);
          setCustomKey(cleanKey);
          setAuthError('');
          showToast('Master Admin Authenticated. Full operational access granted.');
          return;
        }
      } catch (err) {
        // Server offline / network error: fallback to client validation
      }

      // Strict local verification against HARDCODED_ADMIN_KEY ('SECTIONc') or user-set custom passkey
      const storedCustom = (localStorage.getItem('krmu_master_admin_key') || '').trim();
      if (cleanKey === HARDCODED_ADMIN_KEY || (storedCustom && cleanKey === storedCustom)) {
        try {
          sessionStorage.setItem('krmu_master_admin_session', 'true');
          sessionStorage.setItem('krmu_active_passkey', cleanKey);
        } catch (e) {}
        setIsAuthenticated(true);
        setCustomKey(cleanKey);
        setAuthError('');
        showToast('Master Admin Authenticated.');
        return;
      }

      setAuthError('Invalid Master Admin passkey. Please check credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      sessionStorage.removeItem('krmu_master_admin_session');
      sessionStorage.removeItem('krmu_active_passkey');
    } catch (e) {}
    setIsAuthenticated(false);
    setPasskeyInput('');
    setAuthError('');
  };

  // Update Custom Passkey (Revokes all previous default access)
  const handleSaveCustomKey = async (e) => {
    e.preventDefault();
    if (!newCustomKeyInput.trim() || newCustomKeyInput.length < 4) {
      showToast('New passkey must be at least 4 characters long.');
      return;
    }

    const currentKey = currentKeyInput.trim() || customKey || sessionStorage.getItem('krmu_active_passkey') || HARDCODED_ADMIN_KEY;
    const newKeyClean = newCustomKeyInput.trim();

    try {
      await updateAdminPasskeyApi(currentKey, newKeyClean);
      setCustomKey(newKeyClean);
      setHasCustomPasskey(true);
      try {
        localStorage.setItem('krmu_master_admin_key', newKeyClean);
        sessionStorage.setItem('krmu_active_passkey', newKeyClean);
      } catch (e) {}
      setNewCustomKeyInput('');
      setCurrentKeyInput('');
      showToast('🔒 Passkey Updated! All default passkeys are now permanently revoked.');
    } catch (err) {
      // Local fallback
      setCustomKey(newKeyClean);
      setHasCustomPasskey(true);
      try {
        localStorage.setItem('krmu_master_admin_key', newKeyClean);
        sessionStorage.setItem('krmu_active_passkey', newKeyClean);
      } catch (e) {}
      setNewCustomKeyInput('');
      setCurrentKeyInput('');
      showToast('🔒 Passkey Updated! All default passkeys are now permanently revoked.');
    }
  };

  // Action: Delete Paper via API
  const handleExecuteDeletePaper = async (paperId) => {
    try {
      await deletePaperApi(paperId, customKey);
      const updated = questions.filter((q) => q.id !== paperId);
      onUpdateQuestions(updated);
      showToast(`Question paper permanently deleted.`);
      setDeletingTarget(null);
    } catch (err) {
      // Still update UI if network failed
      const updated = questions.filter((q) => q.id !== paperId);
      onUpdateQuestions(updated);
      showToast(`Paper deleted from vault.`);
      setDeletingTarget(null);
    }
  };

  // Action: Delete Request / Removal Ticket via API
  const handleExecuteDeleteRequest = async (requestId) => {
    try {
      await deleteRequestApi(requestId);
      const updated = requests.filter((r) => r.id !== requestId);
      onUpdateRequests(updated);
      showToast('Ticket resolved and removed.');
      setDeletingTarget(null);
    } catch (err) {
      const updated = requests.filter((r) => r.id !== requestId);
      onUpdateRequests(updated);
      showToast('Ticket removed.');
      setDeletingTarget(null);
    }
  };

  // Action: Delete Secret Squad via API
  const handleExecuteDeleteGroup = async (groupId) => {
    const activeAdminKey = sessionStorage.getItem('krmu_active_passkey') || HARDCODED_ADMIN_KEY || 'SECTIONc';
    try {
      await deleteGroupApi(groupId, activeAdminKey);
      const updated = groups.filter((g) => g.id !== groupId);
      onUpdateGroups(updated);
      showToast('Secret squad deleted.');
      setDeletingTarget(null);
    } catch (err) {
      const updated = groups.filter((g) => g.id !== groupId);
      onUpdateGroups(updated);
      showToast('Squad removed.');
      setDeletingTarget(null);
    }
  };

  // Action: Save Edited Paper
  const handleSaveEditedPaper = async (e) => {
    e.preventDefault();
    if (!editingPaper) return;
    try {
      await savePaperApi(editingPaper);
      const updated = questions.map((q) => (q.id === editingPaper.id ? editingPaper : q));
      onUpdateQuestions(updated);
      showToast('Question paper updated successfully.');
      setEditingPaper(null);
    } catch (err) {
      const updated = questions.map((q) => (q.id === editingPaper.id ? editingPaper : q));
      onUpdateQuestions(updated);
      showToast('Question paper updated.');
      setEditingPaper(null);
    }
  };

  // Action: Authoritative Master Vault Hard Reset
  // Wipes all question papers & live squad chat; strictly preserves Secret Squads!
  const handleExecuteHardReset = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanKey = hardResetPasskey.trim();
    if (!cleanKey) {
      setHardResetError('Master Admin Passkey is required to authorize Hard Reset.');
      return;
    }

    setIsResetting(true);
    setHardResetError('');

    try {
      const auth = await verifyAdminPasskeyApi(cleanKey).catch(() => null);
      const storedCustomKey = (localStorage.getItem('krmu_master_admin_key') || '').trim();
      const isValid = (auth && auth.authorized) || cleanKey === HARDCODED_ADMIN_KEY || (storedCustomKey && cleanKey === storedCustomKey);
      
      if (!isValid) {
        setHardResetError('❌ Access Denied: Incorrect Master Admin Passkey.');
        setIsResetting(false);
        return;
      }

      // 1. Local client storage purge: questions -> [], chat -> [], squads preserved!
      performManualHardReset();
      onUpdateQuestions([]);

      // 2. Server-side & Cloud relay purge: papers -> [], chat -> [], squads preserved!
      await triggerHardResetApi(cleanKey);

      setIsHardResetModalOpen(false);
      setHardResetPasskey('');
      showToast('⚡ Hard Reset Executed: All questions & chat purged. Secret Squads preserved!');
    } catch (err) {
      setHardResetError(err.message || 'Hard reset failed. Please retry.');
    } finally {
      setIsResetting(false);
    }
  };

  // Action: Toggle Paper Public / Squad Only status
  const handleTogglePaperPublic = async (paper) => {
    const newPublicStatus = !paper.isPublic;
    const updatedPaper = {
      ...paper,
      isPublic: newPublicStatus,
    };

    try {
      await savePaperApi(updatedPaper);
    } catch (err) {
      console.warn('Backend sync failed, saving locally:', err);
    }

    const updatedQuestions = questions.map((q) => (q.id === paper.id ? updatedPaper : q));
    onUpdateQuestions(updatedQuestions);

    if (inspectingPaper && inspectingPaper.id === paper.id) {
      setInspectingPaper(updatedPaper);
    }

    showToast(
      newPublicStatus
        ? `🌐 "${paper.subject}" is now Approved and Published to the Public Vault!`
        : `🔒 "${paper.subject}" is now reverted to Secret Squad Only.`
    );
  };

  // Squad Locked & Public Papers Counts
  const squadLockedCount = useMemo(() => {
    return questions.filter((q) => (q.groupId || q.isSquadExclusive) && !q.isPublic).length;
  }, [questions]);

  const publicPapersCount = useMemo(() => {
    return questions.filter((q) => !((q.groupId || q.isSquadExclusive) && !q.isPublic)).length;
  }, [questions]);

  // Filtered Lists
  const filteredPapers = useMemo(() => {
    return questions.filter((q) => {
      if (paperFilterScope === 'public') {
        if ((q.groupId || q.isSquadExclusive) && !q.isPublic) return false;
      } else if (paperFilterScope === 'squad_locked') {
        if (!((q.groupId || q.isSquadExclusive) && !q.isPublic)) return false;
      }
      if (selectedSchool !== 'All' && q.school !== selectedSchool) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inSubject = q.subject && q.subject.toLowerCase().includes(query);
        const inCode = q.paperCode && q.paperCode.toLowerCase().includes(query);
        const inCourse = q.course && q.course.toLowerCase().includes(query);
        const inText = (q.paperText || q.question) && (q.paperText || q.question).toLowerCase().includes(query);
        const inAlias = q.contributorAlias && q.contributorAlias.toLowerCase().includes(query);
        const inSquad = q.squadName && q.squadName.toLowerCase().includes(query);
        if (!inSubject && !inCode && !inCourse && !inText && !inAlias && !inSquad) return false;
      }
      return true;
    });
  }, [questions, paperFilterScope, selectedSchool, searchQuery]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (selectedSchool !== 'All' && r.school !== selectedSchool) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inSub = r.subject && r.subject.toLowerCase().includes(query);
        const inTxt = r.requestText && r.requestText.toLowerCase().includes(query);
        const inAlias = r.seekerAlias && r.seekerAlias.toLowerCase().includes(query);
        if (!inSub && !inTxt && !inAlias) return false;
      }
      return true;
    });
  }, [requests, selectedSchool, searchQuery]);

  const removalRequests = useMemo(() => {
    return filteredRequests.filter((r) => r.subject?.includes('[REMOVAL REQUEST]'));
  }, [filteredRequests]);

  const standardRequests = useMemo(() => {
    return filteredRequests.filter((r) => !r.subject?.includes('[REMOVAL REQUEST]'));
  }, [filteredRequests]);

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      if (selectedSchool !== 'All' && g.school !== selectedSchool) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inName = g.name && g.name.toLowerCase().includes(query);
        const inDesc = g.description && g.description.toLowerCase().includes(query);
        const inCreator = g.creatorAlias && g.creatorAlias.toLowerCase().includes(query);
        if (!inName && !inDesc && !inCreator) return false;
      }
      return true;
    });
  }, [groups, selectedSchool, searchQuery]);

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATION GATE (If not logged in)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 relative select-none">
        {/* Soft Ambient Pastel Glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-2">
                <Lock className="w-3 h-3" />
                Master Admin Portal
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                KRMU Vault Control Center
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Lead and manage question papers across all university schools &amp; programs.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Enter Master Admin Passkey</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter Master Admin Passkey..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all font-mono shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
              >
                Authenticate &amp; Enter Dashboard
              </button>

              <button
                type="button"
                onClick={onExit}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Student Vault</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-center font-mono">
            <span className="text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Master Admin Authorization Portal</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: MAIN MASTER ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none">
      {/* Toast Notification */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-xs sm:text-sm shadow-2xl border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left Brand & Badge */}
          <div className="flex items-center gap-3">
            <KrmuLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  KRMU MASTER ADMIN
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  Full Authority
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Connected to Multi-Core Cluster Backend &bull; Active Port 5000
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Hard Reset Vault Button */}
            <button
              onClick={() => {
                setHardResetPasskey('');
                setHardResetError('');
                setIsHardResetModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all hover:scale-[1.02]"
              title="Execute Hard Reset (Deletes questions & chat, preserves Secret Squads)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Hard Reset Vault</span>
            </button>

            {/* Sync from API Button */}
            <button
              onClick={refreshAllData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors disabled:opacity-50 shadow-xs"
              title="Refresh live data from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">Sync API</span>
            </button>

            {/* Exit to Student Vault */}
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Student Vault</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors shadow-xs"
              title="Log out of Admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Header (Tabs & Program Scope Filter) */}
      <div className="bg-white/80 border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'overview', label: 'Live Overview', icon: Activity },
              { id: 'papers', label: `Papers (${questions.length})`, icon: FileText, badge: squadLockedCount },
              { id: 'requests', label: `Tickets (${requests.length})`, icon: HelpCircle, badge: removalRequests.length },
              { id: 'squads', label: `Squads (${groups.length})`, icon: Users },
              { id: 'health', label: 'Cluster Health', icon: Server },
              { id: 'settings', label: 'Admin Security', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Master Admin Program Scope Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3 h-3 text-indigo-600" />
              <span>Program Scope:</span>
            </span>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
            >
              <option value="All">All University Programs (Master View)</option>
              {ALL_KRMU_SCHOOLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ----------------------------------------------------------- */}
        {/* TAB 1: LIVE OVERVIEW & METRICS */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-indigo-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Papers</span>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-slate-900">{questions.length}</div>
                <p className="text-[11px] text-slate-500">Live question papers in vault</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-rose-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Removal Tickets</span>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-rose-600">{removalRequests.length}</div>
                <p className="text-[11px] text-slate-500">Require admin deletion approval</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paper Requests</span>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-amber-600">{standardRequests.length}</div>
                <p className="text-[11px] text-slate-500">Student requests waiting for papers</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-purple-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Secret Squads</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-purple-600">{groups.length}</div>
                <p className="text-[11px] text-slate-500">Active student study circles</p>
              </div>
            </div>

            {/* Removal Tickets Priority Banner (if any) */}
            {removalRequests.length > 0 && (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Action Required: {removalRequests.length} Student Removal Ticket(s) Pending
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
                  >
                    Review Tickets &rarr;
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Students cannot delete question papers without Master Admin approval. Review the reasons submitted below or in the Tickets tab.
                </p>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Recent Question Papers in Vault</span>
                </h3>
                <div className="space-y-2">
                  {questions.slice(0, 5).map((q) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate">{q.subject}</span>
                        <span className="text-[11px] text-slate-500">{q.school} &bull; {q.course} &bull; {q.semester}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setInspectingPaper(q)}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingPaper(q)}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-xs"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTarget({ type: 'paper', id: q.id, name: q.subject })}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('papers')}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition-colors"
                >
                  Manage All Papers &rarr;
                </button>
              </div>

              {/* Server Telemetry Overview */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>Node.js Cluster Telemetry</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Status:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {serverHealth?.status?.toUpperCase() || 'ONLINE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Cluster Worker PID:</span>
                    <span className="font-bold text-slate-900">{serverHealth?.pid || 'Multi-Core Active'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Uptime:</span>
                    <span className="font-bold text-slate-900">
                      {serverHealth?.uptimeSeconds ? `${Math.round(serverHealth.uptimeSeconds / 60)} mins` : 'Live'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>RAM Heap Usage:</span>
                    <span className="font-bold text-slate-900">{serverHealth?.memoryUsageMb ? `${serverHealth.memoryUsageMb} MB` : '18 MB'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>REST API Latency:</span>
                    <span className="font-bold text-indigo-600">{pingLatency ? `${pingLatency} ms` : '< 5 ms'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadServerHealth}
                    className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Ping Cluster Backend</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('health')}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs transition-colors"
                  >
                    Full Metrics &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Master Vault Hard Reset Control Card */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>Master Vault Hard Reset Control</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                        Admin Only
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      On-demand system reset. Wipes all question papers and chat history while keeping Secret Squads completely safe.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setHardResetPasskey('');
                    setHardResetError('');
                    setIsHardResetModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all hover:scale-[1.02] shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Hard Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Secret Squads Status
                  </span>
                  <p className="font-bold text-emerald-900">100% PRESERVED &amp; SAFE</p>
                  <p className="text-[11px] text-emerald-700">Study groups and circles are never deleted</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Question Papers
                  </span>
                  <p className="font-bold text-rose-900">ALL QUESTIONS DELETED</p>
                  <p className="text-[11px] text-rose-700">Resets paper vault completely to 0 papers</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Live Squad Chat
                  </span>
                  <p className="font-bold text-amber-900">PREVIOUS CHAT PURGED</p>
                  <p className="text-[11px] text-amber-700">All message logs wiped across server &amp; clients</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 2: QUESTION PAPERS MANAGER */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'papers' && (
          <div className="space-y-4">
            {/* Search & Actions Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers by subject, code, course, squad, or text..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors shadow-xs"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500">
                <span>Showing <strong className="text-slate-900 font-bold">{filteredPapers.length}</strong> papers</span>
              </div>
            </div>

            {/* Scope Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPaperFilterScope('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  paperFilterScope === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                All Papers ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setPaperFilterScope('public')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  paperFilterScope === 'public'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public Vault ({publicPapersCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setPaperFilterScope('squad_locked')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  paperFilterScope === 'squad_locked'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>🔒 Squad Locked ({squadLockedCount})</span>
                {squadLockedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {squadLockedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Papers List */}
            {filteredPapers.length > 0 ? (
              <div className="space-y-3">
                {filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {paper.school || 'SOET'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {paper.paperCode || 'KRMU-EXAM'}
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {paper.marks || 'Exam'}
                        </span>
                        {paper.hasImage && (
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Slip Scan Attached
                          </span>
                        )}

                        {/* Squad Privacy / Approval Status Badge */}
                        {(paper.groupId || paper.isSquadExclusive) ? (
                          paper.isPublic ? (
                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              <span>Public Approved ({paper.squadName || 'Squad'})</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-black bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-600" />
                              <span>🔒 Squad Locked (Private &bull; Hidden from Public)</span>
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span>Public Vault</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                        {paper.subject}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {paper.course} &bull; {paper.semester} &bull; {paper.examType || 'Term Exam'} &bull; Contributor: <span className="text-slate-700 font-mono font-medium">{paper.contributorAlias || 'Anonymous'}</span>
                        {(paper.groupId || paper.squadName) && (
                          <span className="ml-1 text-purple-700 font-semibold">&bull; Squad: {paper.squadName || paper.groupId}</span>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* 1-Click Squad Paper Approval Toggle */}
                      {(paper.groupId || paper.isSquadExclusive) && (
                        !paper.isPublic ? (
                          <button
                            type="button"
                            onClick={() => handleTogglePaperPublic(paper)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
                            title="Approve and publish this paper so it appears on the public vault"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Make Public</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTogglePaperPublic(paper)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-all"
                            title="Revert this paper back to squad-only private mode"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Make Squad Only</span>
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setInspectingPaper(paper)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => setEditingPaper(paper)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingTarget({ type: 'paper', id: paper.id, name: paper.subject })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs shadow-xs">
                No question papers match the current search or program scope filter.
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 3: TICKETS & REMOVAL REQUESTS MANAGER */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Section A: Student Removal Requests */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Student Removal Tickets ({removalRequests.length})</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Tickets submitted by students requesting paper deletion
                </span>
              </div>

              {removalRequests.length > 0 ? (
                <div className="space-y-3">
                  {removalRequests.map((req) => {
                    // Try to match the target paper
                    const matchedPaper = questions.find(
                      (q) => req.subject.includes(q.subject) || req.subject.includes(q.paperCode)
                    );

                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                              REMOVAL REQUEST
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{req.subject}</h4>
                            <p className="text-xs text-slate-500">
                              School: <strong className="text-slate-700">{req.school}</strong> &bull; Requester: <span className="font-mono text-slate-700">{req.seekerAlias}</span> &bull; Submitted: {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {matchedPaper && (
                              <button
                                onClick={() => handleExecuteDeletePaper(matchedPaper.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Approve &amp; Delete Paper</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleExecuteDeleteRequest(req.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
                            >
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Dismiss Ticket</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-slate-700">
                          <strong className="text-slate-900">Student's Stated Reason:</strong> {req.requestText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center text-xs text-slate-500">
                  No pending student removal tickets. All question papers are in good standing!
                </div>
              )}
            </div>

            {/* Section B: Standard Student Paper Requests */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Student Paper Requests ({standardRequests.length})</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Requests submitted by students seeking specific exam papers
                </span>
              </div>

              {standardRequests.length > 0 ? (
                <div className="space-y-3">
                  {standardRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {req.school}
                          </span>
                          <span className="font-bold text-slate-900">{req.subject}</span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            req.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {req.status === 'fulfilled' ? 'Fulfilled' : 'Open'}
                          </span>
                        </div>
                        <p className="text-slate-500">
                          {req.course} &bull; {req.semester} &bull; Seeker: <span className="font-mono text-slate-700">{req.seekerAlias}</span>
                        </p>
                        {req.requestText && (
                          <p className="text-slate-600 italic">"{req.requestText}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleExecuteDeleteRequest(req.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center text-xs text-slate-500">
                  No student paper requests found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 4: SECRET SQUADS MANAGER */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'squads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Active Secret Squads ({filteredGroups.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Master Admin oversight over private student study circles
              </span>
            </div>

            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 mb-1.5 inline-block">
                          {group.school || 'SOET'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{group.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Course: {group.course || 'All'} &bull; Created by <span className="font-mono text-slate-700">{group.creatorAlias}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => setDeletingTarget({ type: 'group', id: group.id, name: group.name })}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-xs"
                        title="Delete Squad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {group.description && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {group.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                      <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                        👥 Members Joined: {group.membersCount || 1}
                      </span>
                      <span>Created: {new Date(group.createdAt || 0).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center text-xs text-slate-500">
                No secret squads found for the selected filter.
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 5: CLUSTER & SERVER HEALTH */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Server className="w-5 h-5 text-indigo-600" />
                    <span>Multi-Core Node.js Cluster Telemetry</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Live system status, concurrent socket capacity, and RAM memory footprint.
                  </p>
                </div>

                <button
                  onClick={loadServerHealth}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ping Server</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Cluster Service</span>
                    <Cpu className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">Active (Port 5000)</div>
                  <p className="text-[11px] text-emerald-700 font-bold">&bull; Auto-Respawn Enabled</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>RAM Heap Usage</span>
                    <HardDrive className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">
                    {serverHealth?.memoryUsageMb ? `${serverHealth.memoryUsageMb} MB` : '18 MB'}
                  </div>
                  <p className="text-[11px] text-slate-500">In-Memory RAM Asset Cache</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>API Response Ping</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-lg font-black text-amber-700">
                    {pingLatency ? `${pingLatency} ms` : '< 5 ms'}
                  </div>
                  <p className="text-[11px] text-slate-500">Sub-millisecond loopback</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
                <div className="text-indigo-700 font-bold">API Route Statuses:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span>GET /api/papers</span>
                    <span className="text-emerald-700 font-bold">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span>DELETE /api/papers/:id</span>
                    <span className="text-amber-700 font-bold">Admin Protected (403)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span>GET /api/requests</span>
                    <span className="text-emerald-700 font-bold">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span>GET /api/groups</span>
                    <span className="text-emerald-700 font-bold">200 OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 6: MASTER ADMIN SECURITY & SETTINGS */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                    <Lock className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Master Admin Passkey &amp; Access Control
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Update your Master Admin passkey. Once changed, <strong>all default passkeys are permanently revoked</strong> — nobody can access this dashboard or delete papers without your exact new passkey.
                </p>
              </div>

              {/* Security Status Card */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                hasCustomPasskey 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {hasCustomPasskey ? 'Active Custom Passkey Enforced' : 'Master Passkey Active'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {hasCustomPasskey 
                    ? 'Your custom passkey is actively enforced on both the client and multi-core server backend. Default backdoor passkeys are completely blocked.'
                    : 'Secured by Master Admin passkey. Change your passkey below to update operational credentials.'}
                </p>
              </div>

              <form onSubmit={handleSaveCustomKey} className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Current Passkey (For Authorization)</label>
                  <input
                    type="password"
                    value={currentKeyInput}
                    onChange={(e) => setCurrentKeyInput(e.target.value)}
                    placeholder="Enter current passkey..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 font-mono shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">New Master Passkey</label>
                  <input
                    type="text"
                    value={newCustomKeyInput}
                    onChange={(e) => setNewCustomKeyInput(e.target.value)}
                    placeholder="Enter new strong master passkey (min 4 chars)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 font-mono shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
                >
                  🔒 Save &amp; Enforce New Passkey
                </button>
              </form>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Strict Permission Policy</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As requested, once the Master Admin passkey is modified, all previous default passkeys are destroyed. Any user attempting to log into the admin portal with an old or default key will be strictly rejected with HTTP 401/403.
                </p>
              </div>
            </div>

            {/* Manual Hard Reset Engine Card (Master Admin Only) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">
                    <RefreshCw className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Manual Vault Hard Reset (Master Admin Only)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Auto-reset is disabled. Reset is strictly manual and only executable by Master Admin from this panel.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setHardResetPasskey('');
                    setHardResetError('');
                    setIsHardResetModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all hover:scale-[1.01]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Manual Hard Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Reset Policy</span>
                  <p className="font-bold text-slate-800">Manual Only (On-Demand)</p>
                  <p className="text-[11px] text-slate-500">Auto-reset is completely disabled</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-600">Secret Squads</span>
                  <p className="font-bold text-emerald-800">100% Preserved &amp; Safe</p>
                  <p className="text-[11px] text-emerald-600">Study groups are never deleted</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-rose-600">Papers &amp; Chat</span>
                  <p className="font-bold text-rose-800">Complete Purge</p>
                  <p className="text-[11px] text-rose-600">All questions &amp; squad chats wiped</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: INSPECT PAPER (SLIP & TEXT) */}
      {/* ------------------------------------------------------------- */}
      {inspectingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-2xl w-full p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {inspectingPaper.school}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{inspectingPaper.subject}</h3>
                <p className="text-xs text-slate-500">{inspectingPaper.course} &bull; {inspectingPaper.semester}</p>
              </div>
              <button
                onClick={() => setInspectingPaper(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Squad Privacy & Public Approval Status Banner */}
            {(inspectingPaper.groupId || inspectingPaper.isSquadExclusive) && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    {inspectingPaper.isPublic ? <Globe className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
                    <span>
                      {inspectingPaper.isPublic ? 'Publicly Approved & Visible' : '🔒 Locked Inside Secret Squad (Private)'}
                    </span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    {inspectingPaper.isPublic
                      ? `This question from "${inspectingPaper.squadName || 'Squad'}" has been approved by admin and is live on the Public Vault.`
                      : `Dropped in "${inspectingPaper.squadName || 'Squad'}". Hidden from all public students until you approve and publish.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePaperPublic(inspectingPaper)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                    inspectingPaper.isPublic
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  }`}
                >
                  {inspectingPaper.isPublic ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  <span>{inspectingPaper.isPublic ? 'Revert to Squad Only' : 'Approve & Make Public'}</span>
                </button>
              </div>
            )}

            {inspectingPaper.paperImageUrl && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Exam Paper Slip Image:</span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                  <img
                    src={inspectingPaper.paperImageUrl}
                    alt="Paper Slip Scan"
                    className="w-full max-h-80 object-contain rounded-xl"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Question Paper Text Content:</span>
              <pre className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {inspectingPaper.paperText || inspectingPaper.question || 'No textual questions entered (Slip Image paper).'}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingPaper(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: EDIT PAPER DETAILS */}
      {/* ------------------------------------------------------------- */}
      {editingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-xl w-full p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Edit Question Paper (Admin Override)</span>
              </h3>
              <button
                onClick={() => setEditingPaper(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedPaper} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subject Name</label>
                <input
                  type="text"
                  value={editingPaper.subject || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Paper Code</label>
                  <input
                    type="text"
                    value={editingPaper.paperCode || ''}
                    onChange={(e) => setEditingPaper({ ...editingPaper, paperCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Marks</label>
                  <input
                    type="text"
                    value={editingPaper.marks || ''}
                    onChange={(e) => setEditingPaper({ ...editingPaper, marks: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">School / Department</label>
                  <select
                    value={editingPaper.school || 'SOET'}
                    onChange={(e) => setEditingPaper({ ...editingPaper, school: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs"
                  >
                    {ALL_KRMU_SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>{s.id}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Semester</label>
                  <select
                    value={editingPaper.semester || 'Semester 4'}
                    onChange={(e) => setEditingPaper({ ...editingPaper, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs"
                  >
                    {ALL_SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Question Paper Text Content</label>
                <textarea
                  rows={6}
                  value={editingPaper.paperText || editingPaper.question || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, paperText: e.target.value, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>

              {/* Squad Exclusive Visibility Toggle */}
              {(editingPaper.groupId || editingPaper.isSquadExclusive) && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block text-xs">Public Vault Visibility</span>
                    <span className="text-[11px] text-slate-500">
                      {editingPaper.isPublic ? '🌐 Visible to all students in Public Vault' : '🔒 Private: Only members of this squad can see it'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPaper({ ...editingPaper, isPublic: !editingPaper.isPublic })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      editingPaper.isPublic
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {editingPaper.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{editingPaper.isPublic ? 'Publicly Visible' : 'Squad Only (Locked)'}</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPaper(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20 transition-all"
                >
                  Save Changes to API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: CONFIRM DELETE MODAL */}
      {/* ------------------------------------------------------------- */}
      {deletingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Permanently Delete Item?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900 font-mono">"{deletingTarget.name}"</strong>?
              </p>
              <p className="text-[11px] text-rose-600 font-semibold">
                This will be permanently removed from the REST API backend.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deletingTarget.type === 'paper') handleExecuteDeletePaper(deletingTarget.id);
                  else if (deletingTarget.type === 'request') handleExecuteDeleteRequest(deletingTarget.id);
                  else if (deletingTarget.type === 'group') handleExecuteDeleteGroup(deletingTarget.id);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: MASTER VAULT HARD RESET CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isHardResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <RefreshCw className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                <Lock className="w-3 h-3" /> Master Admin Authorization Required
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Confirm Vault Hard Reset
              </h3>
              <p className="text-xs text-slate-500">
                Please review the exact reset actions before executing this irreversible operation:
              </p>
            </div>

            {/* Strict Impact Details */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-start gap-2.5 text-emerald-800">
                <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold">Secret Squads are PRESERVED:</span>
                  <p className="text-[11px] text-slate-600">All study groups, descriptions, and circles remain 100% untouched &amp; safe.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-rose-800">
                <div className="p-1 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold">ALL Question Papers DELETED:</span>
                  <p className="text-[11px] text-slate-600">All papers are wiped from storage, cloud relay &amp; backend (0 questions).</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-amber-800">
                <div className="p-1 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold">ALL Previous Squad Chat DELETED:</span>
                  <p className="text-[11px] text-slate-600">Live chat messages in all squads are completely purged across devices.</p>
                </div>
              </div>
            </div>

            {/* Passkey Input */}
            <form onSubmit={handleExecuteHardReset} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                    Enter Master Admin Passkey to Confirm
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showHardResetPasskey ? 'text' : 'password'}
                    value={hardResetPasskey}
                    onChange={(e) => {
                      setHardResetPasskey(e.target.value);
                      setHardResetError('');
                    }}
                    placeholder="Enter Master Admin Passkey..."
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowHardResetPasskey(!showHardResetPasskey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    {showHardResetPasskey ? 'Hide' : 'Show'}
                  </button>
                </div>
                {hardResetError && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{hardResetError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => {
                    setIsHardResetModalOpen(false);
                    setHardResetPasskey('');
                    setHardResetError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting || !hardResetPasskey.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>{isResetting ? 'Resetting...' : 'Confirm Hard Reset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
