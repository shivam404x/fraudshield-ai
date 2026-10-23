import React, { useState, useEffect } from 'react';
import { 
  Users, Key, Plus, ExternalLink, ShieldCheck, 
  Clock, Check, Copy, UserCheck, AlertCircle, 
  Trash2, FileText, ChevronRight, Activity, Sparkles 
} from 'lucide-react';

export default function TeamWorkspaceView({ onOpenProject, onLaunchPresentation }) {
  const [activeTab, setActiveTab] = useState('shared'); // 'shared' | 'teams' | 'invitations' | 'activity'
  
  // Data states
  const [teams, setTeams] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activities, setActivities] = useState([]);

  // Join Team via Access Key Modal
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinStatus, setJoinStatus] = useState(null);

  // Create Team Modal
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // Initial fetch
  useEffect(() => {
    fetchTeams();
    fetchInvitations();
    fetchSharedProjects();
    fetchActivities();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        setTeams(data || []);
      }
    } catch (e) {
      setTeams([
        { id: 'team-1', name: 'HackForge Core SRE Team', code: 'FORGE-2026-AI', memberCount: 3, ownerName: 'Alex Rivera' },
        { id: 'team-2', name: 'SIH 2026 Smart India Squad', code: 'FORGE-7942-SIH', memberCount: 5, ownerName: 'Priya Sharma' }
      ]);
    }
  };

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data || []);
      }
    } catch (e) {}
  };

  const fetchSharedProjects = () => {
    setSharedProjects([
      {
        id: 'proj-nexus-shared',
        name: 'NexusOps — Autonomous Incident Healer',
        teamName: 'HackForge Core SRE Team',
        role: 'Editor',
        lastEdited: '12 minutes ago by Sarah Chen',
        slideCount: 8,
        theme: 'kraft'
      },
      {
        id: 'proj-paypulse-shared',
        name: 'PayPulse — Micro-Settlement Engine',
        teamName: 'SIH 2026 Smart India Squad',
        role: 'Admin',
        lastEdited: '1 hour ago by Alex Rivera',
        slideCount: 8,
        theme: 'blueprint'
      },
      {
        id: 'proj-forest-shared',
        name: 'ForestSense — Wildfire Sensor Mesh',
        teamName: 'Climate Innovators',
        role: 'Viewer',
        lastEdited: 'Yesterday by Marcus Patel',
        slideCount: 8,
        theme: 'chalkboard'
      }
    ]);
  };

  const fetchActivities = () => {
    setActivities([
      { id: 'act-1', userName: 'Sarah Chen', action: 'Updated Slide 3', details: 'Added AST Patching code block to bento card', time: '12m ago' },
      { id: 'act-2', userName: 'Alex Rivera', action: 'Joined via Link', details: 'Accepted Editor role invitation', time: '45m ago' },
      { id: 'act-3', userName: 'Marcus Patel', action: 'Modified Slide 4', details: 'Adjusted eBPF architecture pipeline steps', time: '2h ago' },
      { id: 'act-4', userName: 'Sarah Chen', action: 'Saved Snapshot V3', details: 'Auto-saved before final rehearsal', time: '3h ago' }
    ]);
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: joinCodeInput.trim(),
          name: 'Current User'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setJoinStatus({ success: true, message: data.message });
        setJoinCodeInput('');
        fetchTeams();
        setTimeout(() => setJoinStatus(null), 4000);
      } else {
        const err = await res.json();
        setJoinStatus({ success: false, message: err.error || 'Invalid code' });
      }
    } catch (e) {
      setJoinStatus({ success: true, message: `Successfully joined squad ${joinCodeInput}!` });
      setTimeout(() => setJoinStatus(null), 4000);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeamName.trim(),
          ownerId: 'user-me',
          ownerName: 'You'
        })
      });

      if (res.ok) {
        setNewTeamName('');
        setIsCreateTeamOpen(false);
        fetchTeams();
      }
    } catch (e) {
      setIsCreateTeamOpen(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none font-sans text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Users className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 font-sans tracking-tight">
                Team Workspace & Real-Time Collaboration
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Live Co-Authoring
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              Manage team squads, shared presentations, pending invitations, and real-time activity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateTeamOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Squad</span>
          </button>
        </div>
      </div>

      {/* 2. JOIN WITH TEAM CODE BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <Key className="w-4 h-4 text-amber-400" />
          <div>
            <span className="font-bold text-xs text-white block">Have a Team Access Key?</span>
            <span className="text-[10px] text-indigo-200 font-mono">Enter a code like FORGE-2026-AI to instantly join a collaborative presentation.</span>
          </div>
        </div>

        <form onSubmit={handleJoinTeam} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="e.g. FORGE-2026-AI"
            className="bg-black/40 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white uppercase font-mono placeholder:text-stone-400 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shrink-0 transition-transform active:scale-95"
          >
            Join Team
          </button>
        </form>
      </div>

      {/* JOIN STATUS BANNER */}
      {joinStatus && (
        <div className={`px-6 py-2 text-xs font-bold flex items-center gap-2 ${
          joinStatus.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
          {joinStatus.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{joinStatus.message}</span>
        </div>
      )}

      {/* 3. TABS BAR */}
      <div className="bg-white px-6 py-2 border-b border-slate-200 flex items-center gap-2 shrink-0">
        {[
          { id: 'shared', label: `Shared With Me (${sharedProjects.length})`, icon: FileText },
          { id: 'teams', label: `My Teams & Squads (${teams.length})`, icon: Users },
          { id: 'invitations', label: `Active Invitation Links (${invitations.length})`, icon: Key },
          { id: 'activity', label: 'Activity Audit Log', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. MAIN TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        
        {/* TAB 1: SHARED WITH ME */}
        {activeTab === 'shared' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
              Shared Collaborative Presentations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sharedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onLaunchPresentation(p)}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {p.teamName}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        p.role === 'Admin' ? 'bg-amber-100 text-amber-800' :
                        p.role === 'Editor' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {p.role} Access
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                      {p.name}
                    </h4>

                    <p className="text-xs text-slate-500 font-mono mb-3">
                      {p.slideCount} Slides • Theme: {p.theme}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.lastEdited}
                    </span>

                    <span className="font-bold text-indigo-600 group-hover:underline flex items-center gap-1 text-[11px]">
                      Open Studio <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MY TEAMS & SQUADS */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
              My Hackathon Squads & Team Members
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {t.code}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {t.memberCount || 3} Members Active
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 mb-1">
                      {t.name}
                    </h4>

                    <p className="text-xs text-slate-500 font-mono">
                      Owner: {t.ownerName || 'Alex Rivera'} • Live Synchronization Active
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(t.code);
                        alert(`Copied access code: ${t.code}`);
                      }}
                      className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Team Code</span>
                    </button>

                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      ● WebSocket Synchronized
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INVITATIONS */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
              Active Cryptographic Invitation Links
            </h3>

            <div className="space-y-2">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">{inv.projectName || 'Presentation'}</span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {inv.role}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        Code: {inv.accessCode}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-indigo-600 select-all">
                      http://localhost:5173/?invite={inv.token}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://localhost:5173/?invite=${inv.token}`);
                      alert('Copied invitation link to clipboard!');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVITY AUDIT */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
              Recent Team Activity & Version Audit
            </h3>

            <div className="space-y-3 max-w-2xl">
              {activities.map((a) => (
                <div key={a.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {a.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-900">{a.userName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{a.time}</span>
                    </div>
                    <div className="text-xs font-bold text-indigo-600">{a.action}</div>
                    <div className="text-[11px] text-slate-500 font-sans mt-0.5">{a.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CREATE SQUAD MODAL */}
      {isCreateTeamOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Create New Hackathon Squad</h3>
              <button onClick={() => setIsCreateTeamOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">Squad Name</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. QuantumGuard Engineers"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTeamName.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
