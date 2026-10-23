import React, { useState } from 'react';
import { 
  Layout, Smartphone, Monitor, Plus, Trash2, 
  Download, Eye, Sparkles, CheckCircle 
} from 'lucide-react';

export default function UIPrototypeBuilder() {
  const [device, setDevice] = useState('mobile'); // 'mobile' | 'desktop'
  const [appName, setAppName] = useState('PulseAI App');
  const [accentColor, setAccentColor] = useState('#4F46E5');

  const [components, setComponents] = useState([
    { id: '1', type: 'navbar', title: 'Top Navigation', subtitle: 'Search & Profile' },
    { id: '2', type: 'hero', title: 'Fix Outages in 90 Seconds', subtitle: 'Autonomous DevOps agent for Kubernetes' },
    { id: '3', type: 'cta', title: 'Run Live Outage Simulation', subtitle: 'Instant 1-Click Action' },
    { id: '4', type: 'metric-card', title: 'Incident MTTR: 92s', subtitle: '94% Faster than Human Teams' }
  ]);

  const addComponent = (type, title, subtitle) => {
    setComponents([
      ...components,
      { id: String(Date.now()), type, title, subtitle }
    ]);
  };

  const removeComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
  };

  return (
    <div className="flex-1 bg-slate-100 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center shadow-sm">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              UI/UX Wireframe & Prototype Builder
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Quickly mockup your product interface for pitch slides and live judge demos.
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              device === 'mobile' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile App
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              device === 'desktop' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop Web
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 overflow-hidden flex">
        
        {/* Left: Component Palettes */}
        <div className="w-72 bg-white border-r border-slate-200 p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 uppercase mb-1">
              App Brand Name:
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 uppercase mb-2">
              Add UI Components:
            </label>
            <div className="space-y-2">
              <button
                onClick={() => addComponent('hero', 'Main Value Proposition', 'Punchy secondary explanation')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 text-left text-xs font-sans transition-all"
              >
                <div className="font-bold text-slate-800">+ Hero Header</div>
                <div className="text-[10px] text-slate-500">Headline + subheadline</div>
              </button>
              <button
                onClick={() => addComponent('cta', 'Primary Action Button', 'Triggers demo action')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 text-left text-xs font-sans transition-all"
              >
                <div className="font-bold text-slate-800">+ CTA Button</div>
                <div className="text-[10px] text-slate-500">Large colored button</div>
              </button>
              <button
                onClick={() => addComponent('metric-card', 'Key Metric Stat: 10x', 'Faster execution time')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 text-left text-xs font-sans transition-all"
              >
                <div className="font-bold text-slate-800">+ Metric KPI Card</div>
                <div className="text-[10px] text-slate-500">Big highlighted numbers</div>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Device Artboard Preview */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex items-center justify-center">
          
          {/* Mobile Phone Mockup */}
          {device === 'mobile' && (
            <div className="w-80 h-[580px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col justify-between relative">
              {/* Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />

              <div className="flex-1 bg-white rounded-[32px] overflow-hidden flex flex-col justify-between pt-6 p-4">
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-black text-sm text-slate-900">{appName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                {/* Mobile Content Stack */}
                <div className="flex-1 py-3 space-y-3 overflow-y-auto">
                  {components.map((c) => (
                    <div key={c.id} className="relative group">
                      {c.type === 'hero' && (
                        <div className="p-3 rounded-xl bg-slate-50 text-center">
                          <h4 className="font-black text-sm text-slate-900 leading-tight">{c.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-1">{c.subtitle}</p>
                        </div>
                      )}
                      {c.type === 'cta' && (
                        <button className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow">
                          {c.title}
                        </button>
                      )}
                      {c.type === 'metric-card' && (
                        <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 flex items-center justify-between">
                          <div>
                            <div className="font-black text-indigo-700 text-sm">{c.title}</div>
                            <div className="text-[10px] text-slate-500">{c.subtitle}</div>
                          </div>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                      <button
                        onClick={() => removeComponent(c.id)}
                        className="hidden group-hover:flex absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mobile Bottom Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[10px] font-bold text-slate-400">
                  <span className="text-indigo-600">Home</span>
                  <span>Dashboard</span>
                  <span>Settings</span>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Web Browser Mockup */}
          {device === 'desktop' && (
            <div className="w-full max-w-3xl h-[460px] bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col">
              {/* Browser chrome bar */}
              <div className="h-8 bg-slate-100 border-b border-slate-200 px-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 max-w-sm mx-auto h-5 bg-white rounded border border-slate-200 text-[10px] text-slate-500 font-mono flex items-center px-2">
                  https://app.{appName.toLowerCase().replace(/\s+/g, '')}.io
                </div>
              </div>

              {/* Desktop Body */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-black text-lg text-slate-900">{appName}</h3>
                  <button className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                    Get Started
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {components.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="font-bold text-sm text-slate-900">{c.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{c.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
