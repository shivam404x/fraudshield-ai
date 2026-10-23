import React, { useState } from 'react';
import { Compass, Check, X } from 'lucide-react';

export default function ResearchAnalysis() {
  const [features, setFeatures] = useState([
    { name: 'Sub-90s Autonomous Healing', us: true, compA: false, compB: false },
    { name: 'eBPF Kernel-Level Probe', us: true, compA: false, compB: true },
    { name: 'Deterministic AST Code Diff', us: true, compA: false, compB: false },
    { name: 'Ephemeral Sandbox Test Run', us: true, compA: false, compB: false },
    { name: '1-Click Slack / Teams Approval', us: true, compA: true, compB: false },
    { name: 'Pricing per Incident (Not GB Logged)', us: true, compA: false, compB: false }
  ]);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-700 to-yellow-600 text-white flex items-center justify-center shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Problem Research & Competitor Matrix
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Validate target user personas and prove your competitive moat to hackathon judges.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
        
        {/* Market Sizing Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TAM (Total Addressable)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">$42 Billion</div>
            <p className="text-xs text-slate-500 mt-0.5">Global cloud observability & downtime costs</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase">SAM (Serviceable Addressable)</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">$14 Billion</div>
            <p className="text-xs text-slate-500 mt-0.5">Mid-market SaaS companies on Kubernetes</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">SOM (Initial Beachhead)</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">$480 Million</div>
            <p className="text-xs text-slate-500 mt-0.5">Series A-C startups struggling with on-call</p>
          </div>
        </div>

        {/* Competitor Moat Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Competitive Moat Matrix</h3>
            <span className="text-xs font-mono text-emerald-600 font-bold">● Unfair Advantage Verified</span>
          </div>

          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3.5">Capability / Feature</th>
                <th className="p-3.5 text-center font-bold text-indigo-600">NexusOps AI (Us)</th>
                <th className="p-3.5 text-center">Datadog / APM</th>
                <th className="p-3.5 text-center">PagerDuty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-medium text-slate-800">{f.name}</td>
                  <td className="p-3.5 text-center bg-indigo-50/40">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="p-3.5 text-center">
                    {f.compA ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-rose-400 mx-auto" />}
                  </td>
                  <td className="p-3.5 text-center">
                    {f.compB ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-rose-400 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
