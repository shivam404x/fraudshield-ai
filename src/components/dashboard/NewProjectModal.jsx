import React, { useState } from 'react';
import { 
  X, Presentation, FileText, Rocket, Cpu, 
  Layout, FileCode, GitFork, Image, ArrowRight, Sparkles 
} from 'lucide-react';

export default function NewProjectModal({ isOpen, onClose, onCreateProject }) {
  const [projectName, setProjectName] = useState('');
  const [selectedType, setSelectedType] = useState('presentation');
  const [track, setTrack] = useState('AI & Developer Tools');

  if (!isOpen) return null;

  const projectTypes = [
    { id: 'presentation', title: 'Hackathon PPT & Slide Deck', icon: Presentation, desc: 'Canva-style slide studio with PPTX & PDF export' },
    { id: 'pitch', title: 'Investor / 3-Min Pitch Deck', icon: Rocket, desc: 'Winning 8-slide stage format with judge defense Q&A' },
    { id: 'report', title: 'SIH / Project Documentation', icon: FileText, desc: 'Abstract, methodology, results, and architecture writeup' },
    { id: 'architecture', title: 'System Architecture Diagram', icon: Cpu, desc: 'Interactive node graph with cloud & database blocks' },
    { id: 'wireframe', title: 'UI/UX Prototype & Wireframe', icon: Layout, desc: 'Mobile and desktop interactive app mockups' },
    { id: 'readme', title: 'GitHub README & Badges', icon: FileCode, desc: 'Shields.io, install steps, and tech stack markdown' },
    { id: 'flowchart', title: 'Flowchart & Mermaid Workflow', icon: GitFork, desc: 'State machines, algorithms, and decision trees' },
    { id: 'poster', title: 'Expo Poster & Project Banner', icon: Image, desc: 'Printable showcase poster and exhibition graphics' }
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    const finalName = projectName.trim() || `Untitled ${projectTypes.find(t => t.id === selectedType)?.title || 'Project'}`;
    onCreateProject(selectedType, { name: finalName, track });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 md:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Start New Creation
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              Create New Hackathon Project
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="space-y-5 py-4 overflow-y-auto flex-1">
          
          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold font-sans text-slate-700 uppercase tracking-wider mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. SonicTrace, PayPulse, WildfireSentinel..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
              autoFocus
            />
          </div>

          {/* Select Type */}
          <div>
            <label className="block text-xs font-bold font-sans text-slate-700 uppercase tracking-wider mb-2">
              Choose Canvas Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {projectTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{type.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{type.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competition Track */}
          <div>
            <label className="block text-xs font-bold font-sans text-slate-700 uppercase tracking-wider mb-1.5">
              Hackathon Track / Category
            </label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-sans bg-white focus:outline-none focus:border-indigo-500"
            >
              <option>AI & Developer Tools</option>
              <option>Web3 & FinTech</option>
              <option>Hardware, IoT & Robotics</option>
              <option>HealthTech & BioHacks</option>
              <option>Smart India Hackathon (SIH) Open Innovation</option>
              <option>Cybersecurity & Zero-Trust</option>
              <option>Sustainability & CleanTech</option>
              <option>Consumer Social & Mobile</option>
            </select>
          </div>

        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-transform active:scale-95"
          >
            <span>Create Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
