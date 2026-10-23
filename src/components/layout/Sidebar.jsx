import React from 'react';
import { 
  LayoutDashboard, Presentation, Rocket, FileText, 
  Cpu, Wrench, Bot, Folder, Plus, Users, 
  Crown, Sparkles, ChevronRight, Layers, ShieldCheck, CheckSquare 
} from 'lucide-react';

export default function Sidebar({
  activeView,
  onSelectView,
  projectFolders = ['AI Innovations', 'Web3 & Crypto', 'Smart India Hackathon'],
  activeFolder,
  onSelectFolder,
  onOpenNewProject
}) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'presentation', label: 'PPT & Slide Studio', icon: Presentation, badge: 'Pro' },
    { id: 'pitch', label: 'Pitch Deck Builder', icon: Rocket },
    { id: 'templates', label: '10,000+ PPT Templates', icon: Layers, badge: '10K+' },
    { id: 'team-workspace', label: 'Team Workspace', icon: Users, badge: 'Live Sync' },
    { id: 'report', label: 'Project Reports', icon: FileText },
    { id: 'architecture', label: 'Architecture Diagrams', icon: Cpu },
    { id: 'toolkit', label: 'All 16 Tools', icon: Wrench },
    { id: 'copilot', label: 'Hackathon Copilot', icon: Bot, badge: 'AI' },
    { id: 'checklist', label: 'Submission Checklist', icon: CheckSquare }
  ];

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-300 border-r border-slate-800/80 flex flex-col justify-between select-none z-30 shrink-0">
      
      {/* 1. BRAND HEADER */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div 
            onClick={() => onSelectView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-sans">
                  HackForge<span className="text-indigo-400">AI</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                Hackathon OS
              </span>
            </div>
          </div>

          <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            PRO
          </span>
        </div>

        {/* 2. PRIMARY NAVIGATION */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Studio Navigation
          </div>

          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. PROJECT FOLDERS */}
        <div className="px-3 pt-2">
          <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            <span>Project Folders</span>
            <button 
              onClick={onOpenNewProject}
              className="text-slate-400 hover:text-white"
              title="Add Folder"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 mt-1">
            {projectFolders.map((fld, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFolder(fld)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeFolder === fld 
                    ? 'bg-slate-800 text-indigo-300 font-bold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{fld}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SQUAD WORKSPACE */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080D1A]">
        <div 
          onClick={() => onSelectView('team-workspace')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 cursor-pointer transition-all hover:bg-slate-850 group"
          title="Open Team Workspace & Squad Presence"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Squad Sync Live</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 font-bold group-hover:underline">Open &rarr;</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex -space-x-1.5 overflow-hidden">
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-indigo-500 text-white font-bold flex items-center justify-center text-[10px]">A</span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-purple-500 text-white font-bold flex items-center justify-center text-[10px]">P</span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-teal-500 text-white font-bold flex items-center justify-center text-[10px]">D</span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">S</span>
            </div>
            <span className="font-mono text-emerald-400 font-semibold">4 Online</span>
          </div>
        </div>
      </div>

    </aside>
  );
}
