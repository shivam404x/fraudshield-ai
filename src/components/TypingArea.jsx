import React, { useRef, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const TypingArea = ({ 
  targetText, 
  userInput, 
  onInputChange, 
  onRestart, 
  isFocused, 
  setIsFocused 
}) => {
  const inputRef = useRef(null);

  // Auto focus input on mount and text change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [targetText]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const currentIndex = userInput.length;

  return (
    <div 
      onClick={handleContainerClick}
      className={`relative bg-slate-900 border-2 rounded-3xl p-6 sm:p-8 min-h-[160px] sm:min-h-[190px] flex flex-col justify-between cursor-text transition-all ${
        isFocused ? 'border-indigo-500/80 shadow-glow-accent' : 'border-slate-800'
      }`}
    >
      {/* Hidden real input for mobile keyboard and keystroke capture */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={onInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Focus Lost Overlay Reminder */}
      {!isFocused && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-3xl flex items-center justify-center z-20">
          <div className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg animate-pulse flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Click here or press any key to focus & type
          </div>
        </div>
      )}

      {/* Text Rendering Display */}
      <div className="font-mono text-xl sm:text-2xl lg:text-3xl leading-relaxed tracking-wider break-all select-none">
        {targetText.split('').map((char, index) => {
          let charStyle = 'text-slate-500'; // pending
          const isCurrent = index === currentIndex;

          if (index < currentIndex) {
            const userChar = userInput[index];
            if (userChar === char) {
              charStyle = 'text-emerald-400 font-bold';
            } else {
              charStyle = 'text-rose-500 bg-rose-500/20 rounded px-0.5 underline font-bold';
            }
          }

          return (
            <span key={index} className="relative">
              {isCurrent && <span className="cursor-caret mr-0.5"></span>}
              <span className={charStyle}>
                {char === ' ' ? ' ' : char}
              </span>
            </span>
          );
        })}
      </div>

      {/* Restart / Reset Tip */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Tab</kbd>
          or click reset button to restart lesson
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
            if (inputRef.current) inputRef.current.focus();
          }}
          className="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 font-bold transition-colors"
          title="Restart Lesson"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Restart</span>
        </button>
      </div>

    </div>
  );
};
