import React, { useState } from 'react';
import { HACKATHON_TOOLS } from '../../data/hackforgeData';
import { 
  Wrench, Cpu, FileText, Presentation, 
  Rocket, GitFork, Layout, Palette, FileCode, 
  Kanban, Database, Terminal, Video, Compass, 
  Image, Users, CheckSquare, ChevronRight, Search 
} from 'lucide-react';

export default function ToolkitGrid({ onLaunchTool }) {
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Presentations', 'Documentation', 'Diagrams', 'Design', 'Developer', 'Management', 'Strategy'];

  const filteredTools = HACKATHON_TOOLS.filter(t => {
    const matchesCat = filterCat === 'All' || t.category === filterCat;
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-sm">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Complete Hackathon Toolkit (All 16 Specialized Tools)
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Specialized creation tools built to deliver every requirement of your hackathon submission.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="bg-white/80 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              filterCat === c 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid of Tools */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onLaunchTool(tool.id)}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500/80 shadow-xs hover:shadow-xl transition-all cursor-pointer p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {tool.category}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>Launch Tool</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
