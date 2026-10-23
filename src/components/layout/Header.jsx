import React, { useState } from 'react';
import { 
  Search, Plus, Wand2, Bell, Clock, 
  Crown, Sparkles, Command, HelpCircle 
} from 'lucide-react';

export default function Header({
  searchQuery,
  onSearchChange,
  onOpenNewProject,
  onOpenAIWizard,
  onOpenCopilot
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between z-20 shrink-0">
      
      {/* 1. GLOBAL SEARCH */}
      <div className="relative w-80 md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, templates, PPTs, diagrams..."
          className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
          <Command className="w-2.5 h-2.5" /> K
        </div>
      </div>

      {/* 2. CENTER HACKATHON COUNTDOWN BADGE */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold shadow-xs">
        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>HACKATHON SPRINT: 14h 22m REMAINING</span>
      </div>

      {/* 3. RIGHT ACTIONS */}
      <div className="flex items-center gap-3">
        
        {/* Hackathon Copilot Trigger */}
        <button
          onClick={onOpenCopilot}
          className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold font-sans flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* AI Pitch Wizard */}
        <button
          onClick={onOpenAIWizard}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5 fill-white" />
          <span>AI Pitch Wizard</span>
        </button>

        {/* Create Project Button */}
        <button
          onClick={onOpenNewProject}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs border border-white">
          HF
        </div>

      </div>

    </header>
  );
}
