import React from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  ArrowRight,
  Code,
  Flame,
  Zap,
  Lock
} from 'lucide-react';
import { LESSON_STAGES } from '../data/lessonsData';

export const LessonSelector = ({ 
  isOpen, 
  onClose, 
  activeLessonId, 
  onSelectLesson, 
  completedLessons = {} 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Typing Curriculum & Lessons
              </h2>
              <span className="text-xs text-slate-400">
                5 Stages • 24 Structured Practice Lessons
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lessons List (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {LESSON_STAGES.map((stage) => (
            <div key={stage.id} className="space-y-3">
              
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    {stage.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{stage.subtitle}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {stage.level}
                </span>
              </div>

              {/* Stage Lessons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stage.lessons.map((lesson) => {
                  const isActive = activeLessonId === lesson.id;
                  const record = completedLessons[lesson.id];
                  const isDone = !!record;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        onSelectLesson(lesson);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-glow-accent'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`text-xs font-bold ${isActive ? 'text-indigo-400' : 'text-slate-200'}`}>
                            {lesson.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {lesson.description}
                          </p>
                        </div>

                        {isDone && (
                          <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="text-[10px] font-bold">{record.stars}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                        <span className="font-mono">Keys: {lesson.keys.slice(0, 4).join(', ')}...</span>
                        <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                          Start <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Completed lessons earn up to 3 stars ⭐</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
