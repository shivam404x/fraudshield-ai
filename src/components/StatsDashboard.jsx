import React from 'react';
import { BarChart3, X, FileText, Bookmark, Ghost, GraduationCap } from 'lucide-react';

export default function StatsDashboard({ questions = [], onClose }) {
  const total = questions.length;
  const bookmarked = questions.filter((q) => q.isBookmarked).length;
  const anonymousDrops = questions.filter((q) => q.isAnonymousDrop).length;
  const midTermCount = questions.filter((q) => q.examType?.includes('Mid') || q.marks?.includes('20')).length;
  const endTermCount = questions.filter((q) => q.examType?.includes('End') || q.marks?.includes('40')).length;

  // Breakdown by School
  const schoolMap = {};
  questions.forEach((q) => {
    const sch = q.school || 'Other';
    schoolMap[sch] = (schoolMap[sch] || 0) + 1;
  });

  // Breakdown by Subject
  const subjectMap = {};
  questions.forEach((q) => {
    const s = q.subject || 'General';
    subjectMap[s] = (subjectMap[s] || 0) + 1;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Question Paper Vault Analytics &amp; Stats</h2>
            <p className="text-xs text-slate-500 font-medium">Live breakdown of exam papers across KRMU schools and semesters</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Papers</div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">{total}</div>
        </div>

        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Bookmarked</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{bookmarked}</div>
        </div>

        <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200">
          <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Anonymous Drops</div>
          <div className="text-3xl font-extrabold text-rose-600 mt-1">{anonymousDrops}</div>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">MTE (20M) / ETE (40M)</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{midTermCount} / {endTermCount}</div>
        </div>
      </div>

      {/* Breakdown by School */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Papers by School &amp; Faculty
        </div>
        <div className="space-y-2">
          {Object.entries(schoolMap).map(([schoolName, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={schoolName} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-semibold">{schoolName}</span>
                  <span className="text-slate-500 font-mono">{count} Papers ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown by Subject */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Top Exam Subjects
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(subjectMap).slice(0, 9).map(([sub, count]) => (
            <div key={sub} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
              <span className="font-semibold text-slate-800 truncate block">{sub}</span>
              <span className="text-[11px] text-indigo-600 font-bold">{count} question papers</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
