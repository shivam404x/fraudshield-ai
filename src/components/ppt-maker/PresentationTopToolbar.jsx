import React, { useState } from 'react';
import { 
  Undo2, Redo2, Type, Shapes, Image as ImageIcon, 
  ZoomIn, ZoomOut, Maximize2, Play, Download, 
  Sparkles, Check, ChevronDown, ArrowLeft, Plus, 
  Square, Circle, AlertCircle, Wand2, FileDown, Users, Share2 
} from 'lucide-react';

export default function PresentationTopToolbar({
  deckTitle = 'Untitled Hackathon Pitch',
  onUpdateDeckTitle,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  zoomLevel = 100,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onAddText,
  onAddShape,
  onAddImage,
  onOpenPresenter,
  onOpenAIWizard,
  onExportPptx,
  onExportPdf,
  onBackToDashboard,
  isAutosaved = true,
  onOpenShare,
  activeCollaborators = []
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(deckTitle);

  // Menus toggles
  const [isShapesOpen, setIsShapesOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(false);
  const [isImagesOpen, setIsImagesOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && onUpdateDeckTitle) {
      onUpdateDeckTitle(titleInput.trim());
    }
  };

  const handleInsertImageUrl = () => {
    if (imageUrlInput.trim()) {
      onAddImage(imageUrlInput.trim());
      setImageUrlInput('');
      setIsImagesOpen(false);
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          onAddImage(uploadEvent.target.result);
          setIsImagesOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="h-14 bg-[#18191B] border-b border-stone-800 px-3 md:px-5 flex items-center justify-between select-none z-30 shrink-0 gap-2 font-sans">
      
      {/* 1. LEFT SECTION: Back, Deck Title, Undo/Redo */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onBackToDashboard}
          className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Editable Title */}
        <div className="flex items-center gap-1.5">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-stone-900 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white font-medium focus:outline-none w-44 md:w-60"
            />
          ) : (
            <button
              onClick={() => { setTitleInput(deckTitle); setIsEditingTitle(true); }}
              className="text-xs md:text-sm font-bold text-stone-200 hover:text-white px-2 py-1 rounded hover:bg-stone-800/80 max-w-[160px] md:max-w-xs truncate text-left"
              title="Click to rename"
            >
              {deckTitle}
            </button>
          )}

          {/* Autosave status indicator */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autosaved</span>
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-l border-stone-800 pl-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded hover:bg-stone-800 transition-colors ${
              canUndo ? 'text-stone-300 hover:text-white' : 'text-stone-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded hover:bg-stone-800 transition-colors ${
              canRedo ? 'text-stone-300 hover:text-white' : 'text-stone-600 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. CENTER SECTION: Tools (Text, Shapes, Images, Zoom) */}
      <div className="flex items-center gap-1.5">
        
        {/* TEXT TOOL DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => { setIsTextOpen(!isTextOpen); setIsShapesOpen(false); setIsImagesOpen(false); }}
            className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Type className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Text</span>
            <ChevronDown className="w-3 h-3 text-stone-500" />
          </button>

          {isTextOpen && (
            <div className="absolute top-10 left-0 w-44 bg-[#1E2024] border border-stone-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
              <button
                onClick={() => { onAddText('headline'); setIsTextOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-stone-800 text-white font-bold"
              >
                Add Headline (H1)
              </button>
              <button
                onClick={() => { onAddText('subtitle'); setIsTextOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-stone-800 text-stone-200 font-semibold text-[11px]"
              >
                Add Subtitle (H2)
              </button>
              <button
                onClick={() => { onAddText('bullets'); setIsTextOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-stone-800 text-stone-300 text-[11px]"
              >
                Add Bullet Points
              </button>
            </div>
          )}
        </div>

        {/* SHAPES TOOL DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => { setIsShapesOpen(!isShapesOpen); setIsTextOpen(false); setIsImagesOpen(false); }}
            className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Shapes className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Shapes</span>
            <ChevronDown className="w-3 h-3 text-stone-500" />
          </button>

          {isShapesOpen && (
            <div className="absolute top-10 left-0 w-48 bg-[#1E2024] border border-stone-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <button
                onClick={() => { onAddShape('rect'); setIsShapesOpen(false); }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-stone-800 text-stone-200 flex items-center gap-2"
              >
                <Square className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rectangle Card</span>
              </button>
              <button
                onClick={() => { onAddShape('circle'); setIsShapesOpen(false); }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-stone-800 text-stone-200 flex items-center gap-2"
              >
                <Circle className="w-3.5 h-3.5 text-pink-400" />
                <span>Circle</span>
              </button>
              <button
                onClick={() => { onAddShape('badge'); setIsShapesOpen(false); }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-stone-800 text-stone-200 flex items-center gap-2"
              >
                <span className="w-3.5 h-2 bg-amber-400 rounded-full inline-block" />
                <span>Badge Pill</span>
              </button>
              <button
                onClick={() => { onAddShape('sticky'); setIsShapesOpen(false); }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-stone-800 text-stone-200 flex items-center gap-2"
              >
                <span className="w-3.5 h-3.5 bg-yellow-300 rounded-xs inline-block" />
                <span>Sticky Note</span>
              </button>
            </div>
          )}
        </div>

        {/* IMAGES TOOL DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => { setIsImagesOpen(!isImagesOpen); setIsTextOpen(false); setIsShapesOpen(false); }}
            className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Image</span>
            <ChevronDown className="w-3 h-3 text-stone-500" />
          </button>

          {isImagesOpen && (
            <div className="absolute top-10 left-0 w-64 bg-[#1E2024] border border-stone-800 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                Insert Image
              </label>

              {/* Upload file */}
              <label className="w-full py-2 px-3 rounded-lg border border-dashed border-stone-700 hover:border-indigo-500 text-stone-300 hover:text-white bg-stone-900/60 flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px]">
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Image File</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageFileUpload}
                />
              </label>

              {/* URL Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Or paste Image URL..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInsertImageUrl()}
                  className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleInsertImageUrl}
                  className="w-full py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                >
                  Insert from URL
                </button>
              </div>

              {/* Presets */}
              <div>
                <span className="text-[9px] font-mono text-stone-500 block mb-1">Preset Hackathon Graphics:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Architecture', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80' },
                    { label: 'Cloud Server', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80' },
                    { label: 'AI Neural', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80' },
                    { label: 'Hacker Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { onAddImage(preset.url); setIsImagesOpen(false); }}
                      className="px-2 py-1 rounded bg-stone-900 hover:bg-stone-800 text-[10px] text-stone-300 text-left border border-stone-800 truncate"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ZOOM CONTROLS */}
        <div className="hidden md:flex items-center gap-0.5 bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white rounded"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onZoomReset}
            title="Reset Zoom"
            className="px-1.5 text-[11px] font-mono text-stone-300 hover:text-white"
          >
            {zoomLevel}%
          </button>
          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-white rounded"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. RIGHT SECTION: Collaborators, Share, AI Generate, Present, Export PPTX, Export PDF */}
      <div className="flex items-center gap-1.5 md:gap-2">
        
        {/* Collaborators Avatar Stack */}
        {activeCollaborators && activeCollaborators.length > 0 && (
          <div className="hidden sm:flex items-center -space-x-1.5 mr-0.5">
            {activeCollaborators.slice(0, 3).map((collab, i) => (
              <div
                key={i}
                style={{ backgroundColor: collab.color || '#4F46E5' }}
                className="w-6 h-6 rounded-full border border-[#18191B] text-white text-[9px] font-bold flex items-center justify-center shadow-xs relative"
                title={`${collab.name} (${collab.role || 'Editor'})`}
              >
                {collab.name ? collab.name.charAt(0).toUpperCase() : 'U'}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border border-[#18191B]" />
              </div>
            ))}
          </div>
        )}

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="px-2.5 md:px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
          title="Share presentation & invite team collaborators"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Share</span>
        </button>
        
        {/* AI Generate Button */}
        <button
          onClick={onOpenAIWizard}
          className="px-2.5 md:px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-transform active:scale-95"
          title="Generate Complete Deck from Description"
        >
          <Wand2 className="w-3.5 h-3.5 fill-white" />
          <span className="hidden sm:inline">AI Generate</span>
        </button>

        {/* Present Mode Button */}
        <button
          onClick={onOpenPresenter}
          className="px-2.5 md:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
          title="Fullscreen Presentation Mode"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Present</span>
        </button>

        {/* Export PPTX Button (PptxGenJS) */}
        <button
          onClick={onExportPptx}
          className="px-2.5 md:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
          title="Download genuine Microsoft PowerPoint (.pptx) file via PptxGenJS"
        >
          <Download className="w-3.5 h-3.5" />
          <span>PPTX</span>
        </button>

        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          className="px-2.5 md:px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Download multi-page Landscape PDF"
        >
          <FileDown className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">PDF</span>
        </button>

      </div>

    </header>
  );
}
