import React, { useState } from 'react';
import { Users, Code2, Globe, Award, Plus, Trash2 } from 'lucide-react';

export default function TeamPortfolio() {
  const [members, setMembers] = useState([
    { name: 'Alex Rivera', role: 'Fullstack & Agent Logic', bio: 'Ex-Stripe intern. Built the AST synthesis engine & Claude loop.', github: 'alexrivera', linkedin: 'in/alexrivera' },
    { name: 'Priya Sharma', role: 'eBPF & Kernel Telemetry', bio: 'Open source contributor to Cilium. Built our real-time kernel probe daemon.', github: 'priyasharma', linkedin: 'in/priyasharma' },
    { name: 'David Chen', role: 'DevOps & Ephemeral Infra', bio: 'Kubernetes certified. Architected the Docker sandbox tester and Kafka pipeline.', github: 'davidchen', linkedin: 'in/davidchen' }
  ]);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 to-slate-800 text-white flex items-center justify-center shadow-sm">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Team Portfolio & Member Profile Cards
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Highlight member engineering skills, GitHub links, and hackathon responsibilities.
            </p>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {members.map((m, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-center relative hover:shadow-md transition-shadow">
              <div>
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-2xl font-black flex items-center justify-center shadow-md mb-3">
                  {m.name.charAt(0)}
                </div>
                <h3 className="font-black text-base text-slate-900">{m.name}</h3>
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 mt-1">
                  {m.role}
                </span>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {m.bio}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-slate-400">
                <span className="flex items-center gap-1 text-xs font-mono hover:text-slate-900 cursor-pointer">
                  <Code2 className="w-3.5 h-3.5" /> @{m.github}
                </span>
                <span className="flex items-center gap-1 text-xs font-mono hover:text-indigo-600 cursor-pointer">
                  <Globe className="w-3.5 h-3.5" /> LinkedIn
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
