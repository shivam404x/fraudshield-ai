import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles, Download, Layers } from 'lucide-react';

const PALETTES = [
  { name: 'Cyberpunk Neon', colors: ['#4F46E5', '#A855F7', '#EC4899', '#06B6D4', '#0F172A'] },
  { name: 'Deep Enterprise', colors: ['#1E3A8A', '#3B82F6', '#60A5FA', '#10B981', '#0F172A'] },
  { name: 'Eco ClimateTech', colors: ['#065F46', '#10B981', '#34D399', '#F59E0B', '#111827'] },
  { name: 'FinTech Mint', colors: ['#0F766E', '#14B8A6', '#2DD4BF', '#F97316', '#042F2E'] },
  { name: 'Solar Sunset', colors: ['#9A3412', '#EA580C', '#F97316', '#FBBF24', '#18181B'] }
];

export default function LogoBrandingStudio() {
  const [brandName, setBrandName] = useState('NexusOps AI');
  const [selectedSymbol, setSelectedSymbol] = useState('⚡');
  const [activePalette, setActivePalette] = useState(PALETTES[0]);
  const [copiedHex, setCopiedHex] = useState(null);

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-sm">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Logo & Project Branding Studio
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Create logos, color harmonies, and brand kits to give your hackathon pitch a cohesive SaaS look.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center">
        <div className="max-w-3xl w-full space-y-6">
          
          {/* Logo Builder Stage */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/20"
                style={{ background: `linear-gradient(135deg, ${activePalette.colors[0]}, ${activePalette.colors[1]})` }}
              >
                {selectedSymbol}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{brandName}</h3>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                  Brand Identity Kit
                </p>
              </div>
            </div>

            {/* Quick Symbol Picker */}
            <div className="flex items-center gap-2">
              {['⚡', '🚀', '🧠', '🛡️', '🌲', '💎', '🔥'].map(sym => (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={`w-9 h-9 rounded-xl border text-base flex items-center justify-center transition-transform ${
                    selectedSymbol === sym ? 'border-indigo-600 bg-indigo-50 scale-110 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Harmonious Color Palettes:
            </div>
            <div className="space-y-3">
              {PALETTES.map((pal) => (
                <div
                  key={pal.name}
                  onClick={() => setActivePalette(pal)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    activePalette.name === pal.name ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900">{pal.name}</span>
                  <div className="flex items-center gap-1.5">
                    {pal.colors.map((c, i) => (
                      <div
                        key={i}
                        onClick={(e) => { e.stopPropagation(); copyHex(c); }}
                        className="w-7 h-7 rounded-lg shadow-xs cursor-pointer hover:scale-110 transition-transform relative group"
                        style={{ backgroundColor: c }}
                        title={`Click to copy: ${c}`}
                      >
                        {copiedHex === c && (
                          <div className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Pairings */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Recommended Font Pairing:
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Heading Font</span>
                <div className="font-sans font-black text-lg text-slate-900 mt-1">Plus Jakarta Sans</div>
                <p className="text-xs text-slate-500 mt-0.5">Clean, modern SaaS readability</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Code / Metric Font</span>
                <div className="font-mono font-bold text-lg text-indigo-600 mt-1">JetBrains Mono</div>
                <p className="text-xs text-slate-500 mt-0.5">High technical credibility</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
