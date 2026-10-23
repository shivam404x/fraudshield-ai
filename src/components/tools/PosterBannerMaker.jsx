import React, { useState } from 'react';
import { Image, Printer, Download, Sparkles } from 'lucide-react';

export default function PosterBannerMaker() {
  const [title, setTitle] = useState('NexusOps AI');
  const [tagline, setTagline] = useState('Autonomous Cloud Incident Healing in 90 Seconds');
  const [techStack, setTechStack] = useState('Claude 3.5 • eBPF • Fastify • Docker Sandbox');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-600 text-white flex items-center justify-center shadow-sm">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Expo Poster & Exhibition Showcase Banner
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Printable poster for hackathon expo tables and judge walk-arounds.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save Poster PDF</span>
        </button>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex items-center justify-center">
        
        {/* Printable Poster Canvas */}
        <div className="w-full max-w-2xl aspect-[1/1.414] bg-white rounded-3xl border-4 border-slate-800 shadow-2xl p-8 md:p-12 flex flex-col justify-between text-slate-900 relative overflow-hidden">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-blue-600">
                🚀 HACKATHON 2026 EXHIBITION
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">
                BOOTH #42
              </span>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-black text-slate-900 w-full border-none outline-none focus:bg-slate-50 rounded"
            />
            <textarea
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={2}
              className="text-sm font-semibold text-slate-600 w-full border-none outline-none resize-none focus:bg-slate-50 rounded"
            />
          </div>

          {/* Core Visual Box */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-inner">
            <div className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              Under The Hood Architecture:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xl block mb-1">⚡</span>
                <span>eBPF Radar</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xl block mb-1">🧠</span>
                <span>AST Diff AI</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xl block mb-1">🛡️</span>
                <span>Docker Test</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
              {techStack}
            </div>
          </div>

          {/* Bottom QR & Proof Section */}
          <div className="flex items-center justify-between border-t-2 border-slate-900 pt-4">
            <div>
              <div className="font-black text-sm text-slate-900">Scan to Test Live Demo</div>
              <div className="font-mono text-xs text-blue-600 font-bold mt-0.5">https://hack-demo.live</div>
            </div>

            {/* QR box representation */}
            <div className="w-16 h-16 rounded border-2 border-slate-900 p-1 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
