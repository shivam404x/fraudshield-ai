import React, { useState, useEffect } from 'react';
import { 
  Undo2, Redo2, CloudCheck, Wand2, ShieldCheck, 
  Play, Download, Sparkles, Trophy, Edit3, Check 
} from 'lucide-react';

export default function CanvaHeader({
  deckTitle = 'Untitled Hackathon Pitch',
  onUpdateDeckTitle,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  judgeScore = 98,
  onOpenAIWizard,
  onOpenJudgeAudit,
  onOpenExport,
  onOpenPresenter
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(deckTitle);

  useEffect(() => {
    setTitleInput(deckTitle);
  }, [deckTitle]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && onUpdateDeckTitle) {
      onUpdateDeckTitle(titleInput.trim());
    }
  };

  return (
    <header className="h-14 bg-[#18191B] border-b border-stone-800 px-4 flex items-center justify-between shrink-0 select-none z-30">
      
      {/* LEFT SECTION: Logo, Title, Undo/Redo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-stone-800">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white hidden sm:inline">
            HackForge<span className="text-indigo-400">Studio</span>
          </span>
        </div>

        {/* Editable Title */}
        <div className="flex items-center gap-1.5">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="bg-stone-900 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white font-medium focus:outline-none w-52 md:w-72"
              />
              <button 
                onClick={handleTitleSubmit}
                className="p-1 hover:bg-stone-800 text-emerald-400 rounded"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-1.5 px-2 py-1 rounded hover:bg-stone-800/80 text-left transition-colors"
              title="Click to rename presentation"
            >
              <span className="text-xs md:text-sm font-semibold text-stone-200 max-w-[200px] md:max-w-xs truncate">
                {deckTitle}
              </span>
              <Edit3 className="w-3 h-3 text-stone-500 group-hover:text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {/* Cloud Auto-Save Pill */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Saved</span>
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 ml-2 border-l border-stone-800 pl-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded hover:bg-stone-800 transition-colors ${
              canUndo ? 'text-stone-300 hover:text-white' : 'text-stone-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded hover:bg-stone-800 transition-colors ${
              canRedo ? 'text-stone-300 hover:text-white' : 'text-stone-600 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CENTER: Hackathon Score Badge */}
      <button
        onClick={onOpenJudgeAudit}
        className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 transition-all text-xs font-mono font-bold"
        title="Open Hackathon Judge Audit & Scoring Defense"
      >
        <Trophy className="w-3.5 h-3.5 text-amber-400" />
        <span>JUDGE WIN SCORE: {judgeScore}%</span>
        <span className="text-[10px] text-amber-400/70 underline ml-1">Audit</span>
      </button>

      {/* RIGHT SECTION: AI Wizard, Judge Audit, Present, Export */}
      <div className="flex items-center gap-2">
        
        {/* Judge Audit Button */}
        <button
          onClick={onOpenJudgeAudit}
          className="px-2.5 py-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Audit presentation against hackathon judging criteria"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Judge Defense</span>
        </button>

        {/* AI Pitch Wizard */}
        <button
          onClick={onOpenAIWizard}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-transform active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5 fill-white" />
          <span className="hidden sm:inline">AI Pitch Wizard</span>
        </button>

        {/* Present Button */}
        <button
          onClick={onOpenPresenter}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
          title="Launch Fullscreen Pitch Stage with Timer & Notes"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Present</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
          title="Export PPTX, PDF, Pitch Markdown, or PNG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

      </div>

    </header>
  );
}
