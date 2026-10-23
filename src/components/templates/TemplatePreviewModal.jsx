import React, { useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Play, Sparkles, 
  Clock, ShieldCheck, Check, Layers, Star, Download, Copy 
} from 'lucide-react';
import SlideRenderer from '../SlideRenderer';

export default function TemplatePreviewModal({
  isOpen = false,
  onClose,
  template,
  onUseTemplate
}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (!isOpen || !template) return null;

  const slides = template.slides || [];
  const currentSlide = slides[activeSlideIndex] || slides[0] || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 select-none font-sans">
      <div className="bg-[#18191B] border border-stone-800 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in text-stone-100">
        
        {/* MODAL HEADER */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#141517] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm md:text-base text-white line-clamp-1">{template.title}</h3>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {template.category}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                {template.slideCount} Slides • {template.visualStyle} • {template.purpose} • License: {template.license}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUseTemplate(template)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Use This Template</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN PREVIEW STAGE */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-4 md:p-6 overflow-hidden bg-[#121316]">
          
          {/* 16:9 Canvas Rendering */}
          <div className="w-full max-w-3xl aspect-[16/9] shadow-2xl rounded-2xl overflow-hidden border border-white/10 shrink-0">
            {slides.length > 0 ? (
              <SlideRenderer
                slide={currentSlide}
                theme={template.theme || 'kraft'}
                fontStyle="hand"
                highlighterColor="yellow"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs font-mono">
                Loading slide preview...
              </div>
            )}
          </div>

          {/* Right Info & Judge Script Box */}
          <div className="w-full md:w-80 h-full max-h-[440px] bg-[#1A1C20] border border-stone-800 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar shrink-0">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 font-mono text-[11px]">
                <span className="font-bold text-amber-400">Slide {activeSlideIndex + 1} of {slides.length}</span>
                <span className="text-stone-400">~{currentSlide.timeSeconds || 25}s pace</span>
              </div>

              {/* Layout Name */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block mb-0.5">
                  Layout Structure
                </span>
                <span className="font-bold text-stone-200">
                  {currentSlide.badge || currentSlide.layout || 'Hero Slide'}
                </span>
              </div>

              {/* Speaker Notes */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Judge Pitch Script:
                </span>
                <p className="text-stone-300 leading-relaxed font-sans bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 text-[11px]">
                  {currentSlide.speakerNotes || 'Speak clearly about your technical breakthrough. Highlight why existing approaches fail and prove your benchmark.'}
                </p>
              </div>

              {/* Anticipated Judge Q&A */}
              {currentSlide.judgeQA && (
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-2.5 space-y-1">
                  <div className="font-mono text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Expected Judge Question:
                  </div>
                  <div className="text-[11px] font-semibold text-stone-200">
                    "{currentSlide.judgeQA.q}"
                  </div>
                  <div className="text-[10px] text-stone-400 pl-2 border-l border-amber-500/50">
                    {currentSlide.judgeQA.a}
                  </div>
                </div>
              )}
            </div>

            {/* Template Metadata Footer */}
            <div className="pt-3 border-t border-stone-800 text-[10px] font-mono text-stone-500 flex items-center justify-between">
              <span>Author: {template.author}</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" /> {template.rating}
              </span>
            </div>
          </div>

        </div>

        {/* BOTTOM SLIDE FILMSTRIP SELECTOR */}
        <div className="h-20 bg-[#141517] border-t border-stone-800 px-4 py-2 flex items-center justify-between shrink-0 gap-3">
          <button
            onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
            disabled={activeSlideIndex === 0}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
            {slides.map((s, idx) => {
              const isActive = activeSlideIndex === idx;
              return (
                <button
                  key={s.id || idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`shrink-0 w-24 h-14 rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-950/60 ring-2 ring-indigo-500/40'
                      : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold text-stone-400">#{idx + 1}</span>
                  <span className="text-[10px] font-bold text-stone-200 line-clamp-1">{s.title || `Slide ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
            disabled={activeSlideIndex === slides.length - 1}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
