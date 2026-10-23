import React, { useState } from 'react';
import { 
  Plus, Copy, Trash2, ChevronUp, ChevronDown, 
  Layers, LayoutGrid, Wand2, Clock, Sparkles 
} from 'lucide-react';
import { HACKATHON_LAYOUTS } from '../../data/hackathonLayouts';

export default function SlideThumbnailsSidebar({
  slides = [],
  activeSlideIndex = 0,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  onApplyLayout,
  onOpenAIWizard
}) {
  const [activeTab, setActiveTab] = useState('slides'); // 'slides' | 'layouts'

  return (
    <aside className="w-64 bg-[#18191B] border-r border-stone-800 flex flex-col h-full select-none shrink-0 z-20">
      
      {/* SIDEBAR TABS */}
      <div className="p-2 border-b border-stone-800 flex items-center gap-1 bg-[#141517]">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'slides'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Slides ({slides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('layouts')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'layouts'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Layouts</span>
        </button>
      </div>

      {/* BODY CONTENT */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        
        {/* VIEW 1: SLIDE THUMBNAILS LIST */}
        {activeTab === 'slides' && (
          <div className="space-y-2">
            {slides.map((s, idx) => {
              const isActive = activeSlideIndex === idx;

              return (
                <div
                  key={s.id || idx}
                  onClick={() => onSelectSlide(idx)}
                  className={`group relative rounded-xl border p-2.5 cursor-pointer transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/30'
                      : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900'
                  }`}
                >
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-stone-800 text-stone-400'
                    }`}>
                      {idx + 1}
                    </span>

                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> ~{s.timeSeconds || 25}s
                    </span>
                  </div>

                  {/* Title Preview */}
                  <h4 className="text-xs font-bold text-stone-200 line-clamp-1 mb-1 font-sans">
                    {s.title || `Slide ${idx + 1}`}
                  </h4>

                  {/* Subtitle / Layout pill */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
                    <span className="px-1.5 py-0.5 rounded bg-stone-800/80 truncate max-w-[140px]">
                      {s.badge || s.layout || 'Slide'}
                    </span>
                  </div>

                  {/* HOVER QUICK ACTION BUTTONS */}
                  <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 rounded-lg p-0.5 border border-stone-700 shadow-md">
                    {idx > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onMoveSlide(idx, idx - 1); }}
                        title="Move Up"
                        className="p-1 hover:bg-stone-800 text-stone-300 hover:text-white rounded"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                    )}

                    {idx < slides.length - 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onMoveSlide(idx, idx + 1); }}
                        title="Move Down"
                        className="p-1 hover:bg-stone-800 text-stone-300 hover:text-white rounded"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicateSlide(idx); }}
                      title="Duplicate Slide"
                      className="p-1 hover:bg-stone-800 text-stone-300 hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    {slides.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSlide(idx); }}
                        title="Delete Slide"
                        className="p-1 hover:bg-red-950/80 text-red-400 hover:text-red-300 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ADD SLIDE BUTTON */}
            <button
              onClick={onAddSlide}
              className="w-full py-2.5 rounded-xl border border-dashed border-stone-700 hover:border-indigo-500 bg-stone-900/30 hover:bg-stone-900 text-stone-400 hover:text-indigo-400 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>
        )}

        {/* VIEW 2: 10+ HACKATHON LAYOUTS SELECTOR */}
        {activeTab === 'layouts' && (
          <div className="space-y-2">
            <p className="text-[11px] text-stone-400 mb-2">
              Select any of the 12 battle-tested hackathon layouts to apply to the current active slide:
            </p>

            {HACKATHON_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => onApplyLayout(layout.id)}
                className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-stone-900 hover:border-indigo-500/60 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400">
                    {layout.badge}
                  </span>
                  <span className="text-[9px] font-mono text-stone-500">
                    ~{layout.defaultData.timeSeconds}s
                  </span>
                </div>
                <h5 className="text-xs font-bold text-stone-200 group-hover:text-white">
                  {layout.name}
                </h5>
                <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                  {layout.description}
                </p>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* BOTTOM QUICK ACTIONS: AI GENERATE SHORTCUT */}
      <div className="p-3 border-t border-stone-800 bg-[#141517]">
        <button
          onClick={onOpenAIWizard}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5 fill-white" />
          <span>AI Deck Generator</span>
        </button>
      </div>

    </aside>
  );
}
