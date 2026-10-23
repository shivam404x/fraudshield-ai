import React, { useState } from 'react';
import { 
  Plus, Wand2, Search, Star, Clock, Folder, 
  MoreVertical, Copy, Trash2, Edit3, ArrowRight, 
  Presentation, FileText, Rocket, Cpu, Palette, 
  FileCode, Layers, CheckSquare, Sparkles, Download, 
  Eye, Filter, ChevronRight, Award 
} from 'lucide-react';
import { HACKATHON_TOOLS, HACKATHON_TEMPLATES } from '../../data/hackforgeData';

export default function DashboardView({
  projects,
  onOpenProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
  onOpenAIWizard,
  onLaunchTool,
  searchQuery = '',
  activeFolder = null
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'presentations' | 'reports' | 'favorites'

  // Filter projects by search, folder, and tab
  const filteredProjects = projects.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.track && p.track.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFolder = !activeFolder || p.folder === activeFolder;

    if (!matchesSearch || !matchesFolder) return false;

    if (activeTab === 'presentations') return p.type === 'presentation' || p.type === 'pitch';
    if (activeTab === 'reports') return p.type === 'report';
    if (activeTab === 'favorites') return p.starred;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50 select-none">
      
      {/* 1. HERO WELCOME & QUICK ACTIONS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 md:p-10 shadow-xl border border-slate-800">
        {/* Glow backdrop circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Hackathon Creation Studio
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Craft Winning PPTs, Pitch Decks & Docs in Minutes.
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Everything your hackathon team needs to impress the judges: Canva-inspired slide design, system architectures, project reports, and live stage presentation tools.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAIWizard}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Wand2 className="w-4 h-4 fill-white" />
              <span>AI Presentation Wizard</span>
            </button>
            <button
              onClick={() => onCreateProject('presentation')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Blank PPT Studio</span>
            </button>
            <button
              onClick={() => onLaunchTool('report')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Project Report (SIH)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. RECENT PROJECTS SECTION */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
              Recent Projects {activeFolder && <span className="text-indigo-600">in "{activeFolder}"</span>}
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Pick up where you left off or duplicate for your next pitch round.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold">
            {[
              { id: 'all', label: 'All Files' },
              { id: 'presentations', label: 'Presentations' },
              { id: 'reports', label: 'Reports' },
              { id: 'favorites', label: 'Starred' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Presentation className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create a new presentation with the AI Pitch Wizard or choose a winning template below.
            </p>
            <button
              onClick={onOpenAIWizard}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow"
            >
              Generate Deck with AI
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((p) => {
              const isDeck = p.type === 'presentation' || p.type === 'pitch';
              return (
                <div
                  key={p.id}
                  onClick={() => onOpenProject(p)}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500/80 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  {/* Thumbnail Banner */}
                  <div className={`h-36 p-4 relative flex flex-col justify-between overflow-hidden ${
                    p.theme === 'blueprint' 
                      ? 'bg-gradient-to-tr from-blue-900 to-indigo-950 text-white' 
                      : p.type === 'report' 
                      ? 'bg-gradient-to-tr from-emerald-900 to-teal-950 text-white' 
                      : 'bg-gradient-to-tr from-amber-100 to-amber-200 text-stone-900'
                  }`}>
                    {/* Top tags */}
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs">
                        {p.track || p.type}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(p.id); }}
                        className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                          p.starred ? 'text-amber-400 bg-black/30' : 'text-slate-400 hover:text-amber-400 bg-black/10'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.starred ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Miniature Title Preview */}
                    <div className="z-10">
                      <h4 className="font-extrabold text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-xs opacity-75 line-clamp-1 mt-0.5">
                        {p.slides?.[0]?.subtitle || (p.reportData?.abstract ? p.reportData.abstract.substring(0, 50) + '...' : 'Interactive Project')}
                      </p>
                    </div>

                    {/* Decorative slide number pill */}
                    <div className="absolute -bottom-2 -right-2 text-[48px] font-black opacity-10 select-none pointer-events-none">
                      {p.slidesCount || p.slides?.length || 1}
                    </div>
                  </div>

                  {/* Card Meta & Actions */}
                  <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{p.updatedAt || 'Recent'}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">
                        {isDeck ? `${p.slides?.length || p.slidesCount || 8} slides` : 'Report Doc'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicateProject(p.id); }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. COMPLETE HACKATHON TOOLKIT GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
              Complete Hackathon Toolkit (16 Tools)
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Dedicated visual builders for architectures, flowcharts, READMEs, ER schemas, and posters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {HACKATHON_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onLaunchTool(tool.id)}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                <span>Launch Tool</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. POPULAR TEMPLATES GALLERY PREVIEW */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
              Hackathon Presentation Templates
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Tested formats designed to score high on judging rubrics.
            </p>
          </div>
          <button
            onClick={() => onLaunchTool('templates')}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto border border-indigo-200/80 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Explore 10,000+ Templates Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HACKATHON_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onCreateProject('presentation', tpl.id)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {tpl.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    ⏱️ {tpl.duration}
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  {tpl.slidesCount} slides included
                </span>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Use Template <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
