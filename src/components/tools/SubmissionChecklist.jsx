import React, { useState } from 'react';
import { CheckSquare, CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubmissionChecklist() {
  const [items, setItems] = useState([
    { id: '1', title: 'Public GitHub Repo with MIT License', desc: 'Code committed, clean git log, and zero API keys in public view.', checked: true },
    { id: '2', title: 'Clean README.md with Architecture Diagram', desc: 'Step-by-step install instructions and shields.io status badges.', checked: true },
    { id: '3', title: 'Live Deployed Demo URL Active', desc: 'Accessible via web browser with sample data pre-loaded for judges.', checked: true },
    { id: '4', title: '2-Minute Video Demo Uploaded', desc: 'Hosted on YouTube or Loom without permission restrictions.', checked: false },
    { id: '5', title: 'Pitch Deck Exported to PDF & PPTX', desc: '16:9 slides ready on USB drive and uploaded to submission portal.', checked: true },
    { id: '6', title: 'Sponsor Track APIs Tagged', desc: 'Marked relevant sponsor bounty categories in submission form.', checked: false },
    { id: '7', title: 'Devpost / Unstop Form Fields Filled', desc: 'Project tagline, inspiration, challenges, and tech stack details.', checked: false }
  ]);

  const toggleCheck = (id) => {
    const updated = items.map(it => it.id === id ? { ...it, checked: !it.checked } : it);
    setItems(updated);

    const completed = updated.filter(i => i.checked).length;
    if (completed === updated.length) {
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const completedCount = items.filter(i => i.checked).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-700 text-white flex items-center justify-center shadow-sm">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Devpost & SIH Final Submission Checklist
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Verify all mandatory submission deliverables before the hackathon clock strikes zero.
            </p>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{completedCount} of {items.length} Ready ({progressPercent}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
        <div 
          className="bg-emerald-500 h-full transition-all duration-300" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {/* Checklist Items */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center">
        <div className="max-w-3xl w-full space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                item.checked
                  ? 'border-emerald-500 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {item.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <div className={`font-bold text-sm ${item.checked ? 'text-slate-900 line-through opacity-70' : 'text-slate-900'}`}>
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.desc}
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                item.checked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {item.checked ? 'Complete' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
