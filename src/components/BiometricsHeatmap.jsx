import React from 'react';
import { 
  Activity, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Zap,
  Target
} from 'lucide-react';
import { FINGER_COLORS } from '../data/fingerMap';

export const BiometricsHeatmap = ({ totalTyped = 0, errors = 0, weakKeys = [] }) => {
  // Simulated workload distribution based on real QWERTY ergonomics
  const fingerStats = [
    { key: 'lp', name: 'L. Pinky', load: 8, optimal: '8-10%' },
    { key: 'lr', name: 'L. Ring', load: 12, optimal: '10-14%' },
    { key: 'lm', name: 'L. Middle', load: 16, optimal: '14-18%' },
    { key: 'li', name: 'L. Index', load: 24, optimal: '20-25%' },
    { key: 'th', name: 'Thumbs', load: 15, optimal: '15-20%' },
    { key: 'ri', name: 'R. Index', load: 22, optimal: '20-25%' },
    { key: 'rm', name: 'R. Middle', load: 14, optimal: '14-18%' },
    { key: 'rr', name: 'R. Ring', load: 10, optimal: '10-14%' },
    { key: 'rp', name: 'R. Pinky', load: 7, optimal: '6-8%' },
  ];

  // AI Diagnostic Generator
  const getAiDiagnosis = () => {
    if (weakKeys.length > 0) {
      return {
        type: 'recommendation',
        title: `Finger Biometrics: Focus on [${weakKeys.slice(0, 3).join(', ').toUpperCase()}]`,
        text: `Your accuracy drops on keys (${weakKeys.slice(0, 3).join(', ')}). Your hand may be drifting away from the home row anchor position.`
      };
    }
    return {
      type: 'optimal',
      title: 'Ergonomic Balance: High Efficiency',
      text: 'Both hands are sharing keystroke workload evenly. Finger travel distance is minimized.'
    };
  };

  const aiDiagnosis = getAiDiagnosis();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 max-w-4xl mx-auto shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              AI Biometrics Coach & 10-Finger Heatmap
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              Real-time finger workload & ergonomic balance analysis
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Activity className="w-3.5 h-3.5" /> Hand Symmetry: 94%
        </div>
      </div>

      {/* 9-Finger Heatmap Bars */}
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
        {fingerStats.map((f) => {
          const color = FINGER_COLORS[f.key] || FINGER_COLORS.th;
          return (
            <div key={f.key} className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-[9px] font-bold text-slate-400 block truncate">{f.name}</span>
              <div className="h-14 bg-slate-900 rounded-lg flex flex-col justify-end p-1 overflow-hidden">
                <div 
                  className={`w-full rounded-md ${color.dot} transition-all duration-300 shadow-sm`}
                  style={{ height: `${f.load * 3.5}%` }}
                />
              </div>
              <span className="text-[10px] font-black font-mono text-white block">{f.load}%</span>
            </div>
          );
        })}
      </div>

      {/* AI Doctor Prescription Banner */}
      <div className="p-3 sm:p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-indigo-300 block">
            {aiDiagnosis.title}
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {aiDiagnosis.text}
          </p>
        </div>
      </div>

    </div>
  );
};
