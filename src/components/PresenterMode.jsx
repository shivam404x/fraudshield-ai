import React, { useState, useEffect } from 'react';
import SlideRenderer from './SlideRenderer';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, 
  RotateCcw, Clock, FileText, AlertTriangle, ShieldCheck, Zap 
} from 'lucide-react';

export default function PresenterMode({
  slides = [],
  activeSlideIndex = 0,
  theme = 'kraft',
  fontStyle = 'hand',
  highlighterColor = 'yellow',
  onClose,
  onSlideChange
}) {
  const [currentIdx, setCurrentIdx] = useState(activeSlideIndex);
  const [showNotes, setShowNotes] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Sync index
  useEffect(() => {
    setCurrentIdx(activeSlideIndex);
  }, [activeSlideIndex]);

  // Stopwatch timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'n') {
        setShowNotes((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, slides.length]);

  const handleNext = () => {
    if (currentIdx < slides.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      if (onSlideChange) onSlideChange(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      if (onSlideChange) onSlideChange(prevIdx);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentSlide = slides[currentIdx] || slides[0];

  // 3-minute hackathon time warning threshold
  const isOverTime = seconds >= 180;
  const isWarning = seconds >= 150 && !isOverTime;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0E] text-stone-100 flex flex-col justify-between p-4 md:p-6 select-none font-sans">
      
      {/* 1. TOP PRESENTER STATUS BAR */}
      <div className="h-12 flex items-center justify-between px-2 shrink-0 border-b border-stone-800 pb-3">
        {/* Slide Counter */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold bg-stone-900 border border-stone-700 px-3 py-1 rounded-lg">
            Slide {currentIdx + 1} of {slides.length}
          </span>
          <span className="text-xs text-stone-400 font-mono hidden sm:inline">
            Use [← / →] or Spacebar to navigate • [Esc] to exit
          </span>
        </div>

        {/* Stopwatch Hackathon Timer */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-bold border transition-colors ${
            isOverTime 
              ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse' 
              : isWarning 
              ? 'bg-amber-950/60 border-amber-500 text-amber-300' 
              : 'bg-stone-900 border-stone-700 text-emerald-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(seconds)}</span>
            <span className="text-[10px] text-stone-400 font-normal">/ 3:00 Target</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-300"
            title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setSeconds(0)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-300"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Notes Toggle & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors border ${
              showNotes 
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' 
                : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Speaker Notes (N)</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-700 hover:bg-red-950 hover:border-red-500 text-stone-400 hover:text-red-400 transition-colors"
            title="Close Stage (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN CENTER STAGE AREA */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 p-2 overflow-hidden my-2">
        {/* Slide Canvas */}
        <div className="w-full max-w-4xl aspect-[16/9] shadow-2xl rounded-2xl overflow-hidden border border-white/10 shrink-0">
          <SlideRenderer
            slide={currentSlide}
            theme={theme}
            fontStyle={fontStyle}
            highlighterColor={highlighterColor}
            className="w-full h-full"
          />
        </div>

        {/* Collapsible Speaker Notes Sidebar */}
        {showNotes && (
          <div className="w-full lg:w-96 max-h-[480px] bg-[#16181D] border border-stone-800 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="font-mono text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> What to Say to Judges
                </span>
                <span className="text-[10px] font-mono text-stone-500">~{currentSlide.timeSeconds || 25}s pace</span>
              </div>

              {/* Verbal Script */}
              <div className="text-xs text-stone-200 leading-relaxed font-sans bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                {currentSlide.speakerNotes || 'Speak clearly about this technical accomplishment. Highlight the problem, your architecture, and the measurable impact without jargon overload.'}
              </div>

              {/* Anticipated Judge Q&A Defense */}
              {currentSlide.judgeQA && (
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="font-mono text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Trap Question & Answer:
                  </div>
                  <div className="font-semibold text-stone-200 text-[11px]">
                    Q: "{currentSlide.judgeQA.q}"
                  </div>
                  <div className="text-stone-400 text-[11px] pl-2 border-l-2 border-amber-500/50">
                    A: {currentSlide.judgeQA.a}
                  </div>
                </div>
              )}
            </div>

            {/* Next Slide Preview Hint */}
            <div className="pt-3 mt-3 border-t border-stone-800 text-[11px] text-stone-500 font-mono flex items-center justify-between">
              <span>Next Slide:</span>
              <span className="text-stone-300 font-bold truncate max-w-[180px]">
                {slides[currentIdx + 1]?.title || 'End of Presentation'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM SLIDE NAVIGATION CONTROLS */}
      <div className="h-14 flex items-center justify-between px-4 shrink-0 bg-[#16181D] border border-stone-800 rounded-2xl">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            currentIdx === 0 
              ? 'text-stone-600 bg-stone-900 cursor-not-allowed' 
              : 'text-stone-200 bg-stone-800 hover:bg-stone-700 hover:text-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        {/* Slide Dots / Progress */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIdx(i);
                if (onSlideChange) onSlideChange(i);
              }}
              className={`h-2 rounded-full transition-all ${
                currentIdx === i ? 'w-6 bg-indigo-500' : 'w-2 bg-stone-700 hover:bg-stone-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIdx === slides.length - 1}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            currentIdx === slides.length - 1 
              ? 'text-stone-600 bg-stone-900 cursor-not-allowed' 
              : 'text-white bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
