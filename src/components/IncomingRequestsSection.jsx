import React, { useState } from 'react';
import { 
  HelpCircle, Sparkles, Ghost, ArrowRight, ShieldCheck, 
  Clock, CheckCircle, Plus, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

export default function IncomingRequestsSection({
  requests = [],
  onOpenAnonymousDrop,
  onOpenRequestModal,
  onViewAllRequests
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const openRequests = requests.filter((r) => r.status === 'open');
  const fulfilledRequests = requests.filter((r) => r.status === 'fulfilled');

  if (requests.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-amber-200/80 shadow-md p-5 sm:p-6 transition-all animate-fade-in">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 shadow-xs">
            <HelpCircle className="w-5 h-5" />
            {openRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Incoming Paper Requests</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                  {openRequests.length} Seeking Paper
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Identity strictly hidden &bull; Masked ghost aliases &bull; Zero roll numbers or personal data</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onOpenRequestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Request a Paper</span>
          </button>

          <button
            type="button"
            onClick={onViewAllRequests}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-xs"
          >
            <span>View All Board ({requests.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand Requests' : 'Collapse Requests'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Request Cards Grid */}
      {!isCollapsed && (
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {requests.slice(0, 3).map((req) => {
              const isOpen = req.status === 'open';
              return (
                <div
                  key={req.id}
                  className={`relative rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between space-y-3 border ${
                    isOpen 
                      ? 'bg-slate-50/70 border-amber-200 hover:border-amber-300 hover:shadow-xs' 
                      : 'bg-slate-50/40 border-slate-200 opacity-80'
                  }`}
                >
                  {/* Status & School Pill */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {req.school} &bull; {req.semester}
                      </span>
                      
                      {isOpen ? (
                        <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          SEEKING PAPER
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle className="w-3 h-3" /> FULFILLED
                        </span>
                      )}
                    </div>

                    {/* Course & Subject Heading */}
                    <div>
                      <h3 className="text-xs font-black text-slate-900 line-clamp-1">
                        {req.subject}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {req.course} &bull; {req.examType}
                      </p>
                    </div>

                    {/* Paper Statement / Need */}
                    <p className="text-xs text-slate-700 bg-white border border-slate-200 rounded-xl p-2.5 font-sans leading-relaxed line-clamp-3 shadow-xs">
                      "{req.requestText}"
                    </p>
                  </div>

                  {/* Requester Masked Ghost Info & Action */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Ghost className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="font-mono text-purple-700 font-bold truncate max-w-[120px]">
                        {req.seekerAlias || 'Ghost Student'}
                      </span>
                    </div>

                    {isOpen ? (
                      <button
                        type="button"
                        onClick={() => onOpenAnonymousDrop(req)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-[11px] shadow-sm shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Drop Paper</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Solved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Have past questions for these exams? Click <strong>Drop Paper</strong> to share them 100% anonymously.</span>
            </span>

            {requests.length > 3 && (
              <button
                type="button"
                onClick={onViewAllRequests}
                className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
              >
                + {requests.length - 3} more paper requests on board &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
