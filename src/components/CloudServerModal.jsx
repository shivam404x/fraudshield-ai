import React, { useState, useEffect } from 'react';
import { 
  X, Server, CheckCircle2, AlertTriangle, RefreshCw, 
  ExternalLink, ArrowUpRight, ShieldCheck, Zap, Database, Lock, Unlock, KeyRound, Eye, EyeOff
} from 'lucide-react';
import { 
  getCloudServerUrl, setCloudServerUrl, checkServerHealth, 
  syncAllPapersToCloud, fetchPapersApi, verifyAdminPasskeyApi 
} from '../utils/api';

const HARDCODED_ADMIN_KEY = 'SECTIONc';

export default function CloudServerModal({ 
  isOpen, 
  onClose, 
  questions = [], 
  onPapersUpdated = null 
}) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [healthStatus, setHealthStatus] = useState({ loading: true, online: false, latency: null, error: null, data: null });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  // Security & Admin Unlock State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const active = getCloudServerUrl();
      setCurrentUrl(active);
      setInputUrl(active);
      runHealthCheck(active);
      setTestResult(null);
      setSyncFeedback(null);
      setAdminAuthError('');
      setAdminPasskey('');

      // Auto-unlock if Master Admin session is already active
      try {
        const hasSession = sessionStorage.getItem('krmu_master_admin_session') === 'true';
        setIsAdminUnlocked(hasSession);
      } catch (e) {
        setIsAdminUnlocked(false);
      }
    }
  }, [isOpen]);

  const runHealthCheck = async (targetUrl = null) => {
    setHealthStatus({ loading: true, online: false, latency: null, error: null, data: null });
    const res = await checkServerHealth(targetUrl);
    setHealthStatus({
      loading: false,
      online: res.online,
      latency: res.latency,
      error: res.error,
      data: res.data,
      url: res.url
    });
  };

  const handleTestInputUrl = async () => {
    const target = inputUrl.trim() || currentUrl;
    if (!target) {
      setTestResult({ online: false, error: 'Please enter a valid server URL' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const res = await checkServerHealth(target);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleAdminUnlock = async (e) => {
    e.preventDefault();
    setAdminAuthError('');
    const cleanKey = adminPasskey.trim();
    if (!cleanKey) {
      setAdminAuthError('Please enter Master Admin passkey.');
      return;
    }

    setIsVerifyingAdmin(true);

    try {
      // 1. Verify via server API
      const resp = await verifyAdminPasskeyApi(cleanKey).catch(() => null);
      if (resp && resp.authorized) {
        setIsAdminUnlocked(true);
        setShowAdminLogin(false);
        setIsVerifyingAdmin(false);
        setSyncFeedback({ type: 'success', message: 'Master Admin authenticated! Cloud server settings unlocked.' });
        return;
      }

      // 2. Check HARDCODED_ADMIN_KEY ('SECTIONc') or stored custom key
      const storedKey = (localStorage.getItem('krmu_master_admin_key') || '').trim();
      if (cleanKey === HARDCODED_ADMIN_KEY || (storedKey && cleanKey === storedKey)) {
        setIsAdminUnlocked(true);
        setShowAdminLogin(false);
        setIsVerifyingAdmin(false);
        setSyncFeedback({ type: 'success', message: 'Master Admin authenticated! Cloud server settings unlocked.' });
        return;
      }

      setIsVerifyingAdmin(false);
      setAdminAuthError('Access Denied: Invalid Master Admin passkey.');
    } catch (err) {
      setIsVerifyingAdmin(false);
      setAdminAuthError('Verification error: ' + err.message);
    }
  };

  const handleSaveAndConnect = async () => {
    if (!isAdminUnlocked) {
      setSyncFeedback({ type: 'error', message: 'Security restriction: Master Admin passkey required to change cloud address.' });
      return;
    }

    const cleanUrl = inputUrl.trim().replace(/\/+$/, '');
    setCloudServerUrl(cleanUrl);
    setCurrentUrl(cleanUrl);
    await runHealthCheck(cleanUrl);

    if (onPapersUpdated) {
      try {
        const fresh = await fetchPapersApi();
        if (fresh && fresh.length > 0) {
          onPapersUpdated(fresh);
        }
      } catch (e) {}
    }
    setSyncFeedback({ type: 'success', message: 'Cloud Server connected successfully!' });
  };

  const handleResetToDefault = async () => {
    if (!isAdminUnlocked) {
      setSyncFeedback({ type: 'error', message: 'Security restriction: Master Admin passkey required to reset cloud address.' });
      return;
    }

    setCloudServerUrl('');
    const defaultUrl = 'https://krmu-vault.onrender.com';
    setCurrentUrl(defaultUrl);
    setInputUrl(defaultUrl);
    setTestResult(null);
    await runHealthCheck(defaultUrl);
    setSyncFeedback({ type: 'info', message: 'Reset to official default Render cloud server.' });
  };

  const handlePushAllToCloud = async () => {
    if (!questions || questions.length === 0) {
      setSyncFeedback({ type: 'error', message: 'No papers found in local vault to upload.' });
      return;
    }
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncAllPapersToCloud(questions);
      if (res.success) {
        setSyncFeedback({ 
          type: 'success', 
          message: `Successfully synchronized ${res.count} papers to the Cloud Server!` 
        });
      } else {
        setSyncFeedback({ type: 'error', message: res.error || 'Failed to sync papers.' });
      }
    } catch (err) {
      setSyncFeedback({ type: 'error', message: `Sync error: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const fresh = await fetchPapersApi();
      if (onPapersUpdated && Array.isArray(fresh)) {
        onPapersUpdated(fresh);
      }
      setSyncFeedback({ 
        type: 'success', 
        message: `Successfully fetched ${fresh ? fresh.length : 0} papers from the Cloud Server!` 
      });
    } catch (err) {
      setSyncFeedback({ type: 'error', message: `Fetch error: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  KRMU Dedicated Cloud Server
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Verified &amp; Secure</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Permanent multi-user cloud repository &bull; Tamper-proof central sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Active Server Status Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            healthStatus.loading 
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : healthStatus.online
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${
                  healthStatus.loading
                    ? 'bg-slate-400 animate-pulse'
                    : healthStatus.online
                      ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-200'
                      : 'bg-amber-500'
                }`} />
                <div>
                  <div className="flex items-center gap-2 font-black text-sm">
                    <span>
                      {healthStatus.loading
                        ? 'Checking Cloud Server Connection...'
                        : healthStatus.online
                          ? 'Official KRMU Cloud Engine: LIVE & CONNECTED'
                          : 'Server Reconnecting / Offline Fallback'}
                    </span>
                    {healthStatus.latency !== null && (
                      <span className="px-2 py-0.2 rounded-full text-[11px] font-bold bg-white/80 border border-current shadow-2xs">
                        {healthStatus.latency}ms
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                    <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Active Cloud URL: <strong className="font-mono text-indigo-700">{currentUrl || 'https://krmu-vault.onrender.com'}</strong></span>
                  </div>
                  {healthStatus.data && (
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                      <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                        Papers: {healthStatus.data.papersCount || 0}
                      </span>
                      <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                        Squads: {healthStatus.data.groupsCount || 0}
                      </span>
                      <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                        Requests: {healthStatus.data.requestsCount || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => runHealthCheck(currentUrl)}
                disabled={healthStatus.loading}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs disabled:opacity-50"
                title="Refresh Health"
              >
                <RefreshCw className={`w-4 h-4 ${healthStatus.loading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {syncFeedback && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              syncFeedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : syncFeedback.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}>
              <span>{syncFeedback.message}</span>
              <button onClick={() => setSyncFeedback(null)} className="ml-2 font-bold opacity-60 hover:opacity-100">&times;</button>
            </div>
          )}

          {/* Security Notice: Locked for Regular Students */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
                  {isAdminUnlocked ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Admin Mode: Settings Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-slate-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tamper-Proof Protection: Active</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAdminUnlocked 
                    ? 'You have verified Master Admin access. You may modify or test the cloud server configuration below.'
                    : 'The server endpoint is permanently locked to prevent unauthorized tampering. All student uploads and fetches automatically sync to this secure address.'}
                </p>
              </div>

              {!isAdminUnlocked && (
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(!showAdminLogin)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-indigo-600 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Admin Unlock</span>
                </button>
              )}
            </div>

            {/* Admin Unlock Password Form */}
            {showAdminLogin && !isAdminUnlocked && (
              <form onSubmit={handleAdminUnlock} className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={adminPasskey}
                      onChange={(e) => setAdminPasskey(e.target.value)}
                      placeholder="Enter Master Admin Passkey"
                      className="w-full px-3.5 py-2 pr-9 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifyingAdmin}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 shrink-0"
                  >
                    {isVerifyingAdmin ? 'Verifying...' : 'Unlock'}
                  </button>
                </div>
                {adminAuthError && (
                  <p className="text-[11px] font-bold text-rose-600">{adminAuthError}</p>
                )}
              </form>
            )}
          </div>

          {/* Cloud Server Address Configuration (Unlocked ONLY for Master Admin) */}
          {isAdminUnlocked ? (
            <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 animate-fade-in">
              <label className="block text-xs font-black uppercase tracking-wider text-indigo-950">
                Change Cloud Server Address (Admin Only)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://krmu-vault.onrender.com"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleTestInputUrl}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 disabled:opacity-50 shrink-0"
                >
                  <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce text-amber-500' : 'text-slate-600'}`} />
                  <span>{isTesting ? 'Testing...' : 'Test Ping'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndConnect}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0"
                >
                  Connect &amp; Save
                </button>
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl border text-xs font-medium ${
                  testResult.online ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {testResult.online ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Server Responded! Latency: <strong>{testResult.latency}ms</strong> &bull; Status 200 OK</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Connection failed: {testResult.error || 'Server did not respond'}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-indigo-600 hover:text-indigo-800 font-bold underline transition-colors"
                >
                  Reset to default Render server
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminUnlocked(false)}
                  className="text-slate-500 hover:text-slate-700 font-bold text-[11px]"
                >
                  Lock Settings
                </button>
              </div>
            </div>
          ) : (
            /* Student View: Read-Only Ping Check */
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Test real-time network latency to Cloud Server:</span>
              <button
                type="button"
                onClick={handleTestInputUrl}
                disabled={isTesting}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200 disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce text-amber-500' : 'text-indigo-600'}`} />
                <span>{isTesting ? 'Testing...' : 'Test Ping'}</span>
              </button>
            </div>
          )}

          {/* Sync Operations */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Data Synchronization
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handlePushAllToCloud}
                disabled={isSyncing}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs shadow-2xs transition-all disabled:opacity-50"
              >
                <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                <span>Push Local Papers to Cloud ({questions.length})</span>
              </button>
              <button
                type="button"
                onClick={handlePullFromCloud}
                disabled={isSyncing}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs shadow-2xs transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Pull Latest from Cloud Server</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>K.R. Mangalam University Cloud Security Gate &bull; SSL/TLS Encrypted</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
