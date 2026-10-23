import React from 'react';
import { 
  Plus, Copy, Trash2, ChevronLeft, ChevronRight, 
  ChevronDown, ChevronUp, Clock, Sparkles 
} from 'lucide-react';

export default function CanvaBottomTimeline({
  slides = [],
  activeSlideIndex = 0,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  isCollapsed = false,
  onToggleCollapse
}) {
  const totalSeconds = slides.reduce((acc, s) => acc + (s.timeSeconds || 25), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSecs = totalSeconds % 60;

  return (
    <div className="bg-[#18191B] border-t border-stone-800 flex flex-col select-none shrink-0 z-20 transition-all">
      
      {/* TIMELINE TOP HEADER BAR */}
      <div className="h-8 px-4 flex items-center justify-between border-b border-stone-800 text-[11px] font-mono text-stone-400">
        <div className="flex items-center gap-3">
          <span className="font-bold text-stone-300">SLIDES ({slides.length})</span>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Clock className="w-3 h-3" />
            <span>PITCH RUNTIME: {minutes}m {remainingSecs}s</span>
            <span className="text-[10px] text-stone-500 font-normal">
              ({totalSeconds <= 180 ? 'Perfect for 3-min hackathon pitch' : 'Approaching 3m limit'})
            </span>
          </div>
        </div>

        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-1 hover:text-white text-stone-400 text-xs px-2 py-0.5 rounded hover:bg-stone-800 transition-colors"
        >
          <span>{isCollapsed ? 'Show Filmstrip' : 'Collapse'}</span>
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* HORIZONTAL FILMSTRIP OF SLIDES */}
      {!isCollapsed && (
        <div className="h-28 px-4 py-2.5 flex items-center gap-3 overflow-x-auto custom-scrollbar">
          {slides.map((s, idx) => {
            const isActive = activeSlideIndex === idx;

            return (
              <div
                key={s.id || idx}
                onClick={() => onSelectSlide(idx)}
                className={`group relative shrink-0 w-36 h-22 rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                    : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                {/* Slide Number & Timing */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-amber-400 font-bold">
                    ~{s.timeSeconds || 25}s
                  </span>
                </div>

                {/* Slide Title preview */}
                <div className="font-sans text-[11px] font-semibold text-stone-200 line-clamp-1">
                  {s.title || `Slide ${idx + 1}`}
                </div>

                {/* Slide Badge */}
                <div className="text-[9px] font-mono text-stone-400 truncate opacity-70">
                  {s.badge || s.layout || 'PITCH SLIDE'}
                </div>

                {/* HOVER QUICK ACTIONS */}
                <div className="absolute inset-0 bg-black/85 backdrop-blur-xs rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity p-1">
                  {idx > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveSlide(idx, idx - 1); }}
                      title="Move Left"
                      className="p-1.5 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); onDuplicateSlide(idx); }}
                    title="Duplicate Slide"
                    className="p-1.5 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {slides.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteSlide(idx); }}
                      title="Delete Slide"
                      className="p-1.5 rounded hover:bg-red-950/60 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {idx < slides.length - 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveSlide(idx, idx + 1); }}
                      title="Move Right"
                      className="p-1.5 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* ADD SLIDE BUTTON */}
          <button
            onClick={onAddSlide}
            className="shrink-0 w-28 h-22 rounded-xl border border-dashed border-stone-700 hover:border-indigo-500 bg-stone-900/40 hover:bg-stone-900/80 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-indigo-400 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold font-mono">Add Slide</span>
          </button>
        </div>
      )}

    </div>
  );
}
