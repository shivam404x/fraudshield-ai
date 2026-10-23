import React from 'react';
import { 
  Trash2, Copy, ArrowUp, ArrowDown, AlignLeft, 
  AlignCenter, AlignRight, Sliders, Palette, Type, 
  Clock, ShieldCheck, FileText, LayoutGrid, Sparkles 
} from 'lucide-react';
import { HACKATHON_LAYOUTS } from '../../data/hackathonLayouts';

export default function ElementPropertiesPanel({
  selectedElement,
  onUpdateSelectedElement,
  onDuplicateSelectedElement,
  onDeleteSelectedElement,
  onBringForward,
  onSendBackward,
  activeSlide,
  onUpdateSlide,
  theme = 'kraft',
  onUpdateTheme,
  onApplyLayout
}) {
  const colorSwatches = [
    '#FFFFFF', '#0F172A', '#4F46E5', '#3B82F6', 
    '#10B981', '#F59E0B', '#EF4444', '#EC4899', 
    '#8B5CF6', '#F8FAFC', '#FEF08A', '#FECDD3'
  ];

  return (
    <aside className="w-72 bg-[#18191B] border-l border-stone-800 flex flex-col h-full select-none shrink-0 z-20 font-sans">
      
      {/* HEADER */}
      <div className="p-3 border-b border-stone-800 flex items-center justify-between bg-[#141517]">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-stone-300 font-mono">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>{selectedElement ? 'Element Properties' : 'Slide Properties'}</span>
        </div>

        {selectedElement && (
          <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {selectedElement.type || 'element'}
          </span>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
        
        {/* CASE 1: AN ELEMENT IS SELECTED */}
        {selectedElement ? (
          <div className="space-y-4">
            
            {/* 1. CONTENT EDITING (IF TEXT OR STICKY) */}
            {(selectedElement.type === 'text' || selectedElement.type === 'sticky') && (
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                  Text Content
                </label>
                <textarea
                  rows="3"
                  value={selectedElement.type === 'sticky' ? (selectedElement.text || '') : (selectedElement.content || '')}
                  onChange={(e) => {
                    if (selectedElement.type === 'sticky') {
                      onUpdateSelectedElement({ text: e.target.value });
                    } else {
                      onUpdateSelectedElement({ content: e.target.value });
                    }
                  }}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>
            )}

            {/* 2. POSITION & SIZE (X, Y, Rotation) */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Position & Transform
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-stone-900 border border-stone-800 rounded px-2 py-1">
                  <span className="text-[9px] text-stone-500 block">X Pos</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x || 0)}
                    onChange={(e) => onUpdateSelectedElement({ x: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded px-2 py-1">
                  <span className="text-[9px] text-stone-500 block">Y Pos</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y || 0)}
                    onChange={(e) => onUpdateSelectedElement({ y: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded px-2 py-1">
                  <span className="text-[9px] text-stone-500 block">Rotate</span>
                  <input
                    type="number"
                    value={Math.round(selectedElement.rotation || 0)}
                    onChange={(e) => onUpdateSelectedElement({ rotation: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. FONT FORMATTING (FOR TEXT) */}
            {selectedElement.type === 'text' && (
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                  Typography
                </label>

                {/* Font Size */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Font Size:</span>
                  <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-2 py-1">
                    <input
                      type="number"
                      min="10"
                      max="96"
                      value={selectedElement.fontSize || 24}
                      onChange={(e) => onUpdateSelectedElement({ fontSize: parseInt(e.target.value) || 24 })}
                      className="w-12 bg-transparent text-white font-mono text-center focus:outline-none"
                    />
                    <span className="text-stone-500 text-[10px]">px</span>
                  </div>
                </div>

                {/* Font Weight */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Weight:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {['normal', '600', '800'].map((w) => (
                      <button
                        key={w}
                        onClick={() => onUpdateSelectedElement({ fontWeight: w })}
                        className={`px-2 py-1 rounded text-[10px] capitalize font-mono ${
                          selectedElement.fontWeight === w
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-stone-900 border border-stone-800 text-stone-400'
                        }`}
                      >
                        {w === '800' ? 'Bold' : w === '600' ? 'Semi' : 'Norm'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Swatches */}
                <div>
                  <span className="text-stone-400 block mb-1.5">Text Color:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {colorSwatches.map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateSelectedElement({ color })}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full border border-stone-700 transition-transform ${
                          selectedElement.color === color ? 'ring-2 ring-indigo-500 scale-110' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SHAPE STYLING */}
            {selectedElement.type === 'shape' && (
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                  Fill & Appearance
                </label>

                {/* Fill Color */}
                <div>
                  <span className="text-stone-400 block mb-1.5">Fill Color:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {colorSwatches.map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateSelectedElement({ fill: color })}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full border border-stone-700 transition-transform ${
                          selectedElement.fill === color ? 'ring-2 ring-indigo-500 scale-110' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-stone-900 border border-stone-800 rounded px-2 py-1">
                    <span className="text-[9px] text-stone-500 block">Width</span>
                    <input
                      type="number"
                      value={selectedElement.width || 140}
                      onChange={(e) => onUpdateSelectedElement({ width: parseInt(e.target.value) || 100 })}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="bg-stone-900 border border-stone-800 rounded px-2 py-1">
                    <span className="text-[9px] text-stone-500 block">Height</span>
                    <input
                      type="number"
                      value={selectedElement.height || 100}
                      onChange={(e) => onUpdateSelectedElement({ height: parseInt(e.target.value) || 80 })}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. IMAGE PROPERTIES */}
            {selectedElement.type === 'image' && (
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                  Image Source
                </label>
                <input
                  type="text"
                  value={selectedElement.url || ''}
                  onChange={(e) => onUpdateSelectedElement({ url: e.target.value })}
                  placeholder="Image URL..."
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-[11px] text-white focus:outline-none focus:border-indigo-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-stone-900 border border-stone-800 rounded px-2 py-1">
                    <span className="text-[9px] text-stone-500 block">Width</span>
                    <input
                      type="number"
                      value={selectedElement.width || 240}
                      onChange={(e) => onUpdateSelectedElement({ width: parseInt(e.target.value) || 120 })}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="bg-stone-900 border border-stone-800 rounded px-2 py-1">
                    <span className="text-[9px] text-stone-500 block">Height</span>
                    <input
                      type="number"
                      value={selectedElement.height || 160}
                      onChange={(e) => onUpdateSelectedElement({ height: parseInt(e.target.value) || 100 })}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. LAYER ORDERING */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Layer Arrangement
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onBringForward}
                  className="py-1.5 px-2 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 flex items-center justify-center gap-1.5"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Bring Forward</span>
                </button>
                <button
                  onClick={onSendBackward}
                  className="py-1.5 px-2 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 flex items-center justify-center gap-1.5"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
                  <span>Send Backward</span>
                </button>
              </div>
            </div>

            {/* 7. ACTIONS: DUPLICATE & DELETE */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <button
                onClick={onDuplicateSelectedElement}
                className="w-full py-2 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Duplicate Element</span>
              </button>

              <button
                onClick={onDeleteSelectedElement}
                className="w-full py-2 rounded-lg bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 text-red-400 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Element</span>
              </button>
            </div>

          </div>
        ) : (
          /* CASE 2: SLIDE PROPERTIES (WHEN NO ELEMENT SELECTED) */
          <div className="space-y-4">
            
            {/* Slide Title */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Slide Title
              </label>
              <input
                type="text"
                value={activeSlide?.title || ''}
                onChange={(e) => onUpdateSlide({ title: e.target.value })}
                placeholder="Enter slide title..."
                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Slide Subtitle */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Slide Subtitle / Hook
              </label>
              <textarea
                rows="2"
                value={activeSlide?.subtitle || ''}
                onChange={(e) => onUpdateSlide({ subtitle: e.target.value })}
                placeholder="Explain the breakthrough or metric..."
                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Slide Badge Pill */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Category Badge
              </label>
              <input
                type="text"
                value={activeSlide?.badge || ''}
                onChange={(e) => onUpdateSlide({ badge: e.target.value })}
                placeholder="e.g. 💡 CORE ARCHITECTURE"
                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Slide Pitch Timing */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1.5">
                Target Pitch Timing
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[15, 20, 25, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onUpdateSlide({ timeSeconds: sec })}
                    className={`py-1 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      (activeSlide?.timeSeconds || 25) === sec
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Theme Selector */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1.5">
                Canvas Paper Theme
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'kraft', label: 'Kraft Paper', bg: 'bg-amber-100 text-stone-900' },
                  { id: 'blueprint', label: 'Blueprint', bg: 'bg-blue-950 text-white' },
                  { id: 'chalkboard', label: 'Chalkboard', bg: 'bg-stone-950 text-white' },
                  { id: 'grid', label: 'Technical Grid', bg: 'bg-slate-100 text-stone-900' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => onUpdateTheme(th.id)}
                    className={`p-2 rounded-lg text-[11px] font-bold text-left border transition-all ${
                      theme === th.id
                        ? 'ring-2 ring-indigo-500 border-white'
                        : 'border-stone-800 hover:border-stone-700'
                    } ${th.bg}`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speaker Notes */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-amber-400" />
                <span>Judge Speaking Script</span>
              </label>
              <textarea
                rows="3"
                value={activeSlide?.speakerNotes || ''}
                onChange={(e) => onUpdateSlide({ speakerNotes: e.target.value })}
                placeholder="What to verbally say to judges when presenting this slide..."
                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>

            {/* Anticipated Judge Q&A */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Hostile Judge Q&A Prep</span>
              </label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={activeSlide?.judgeQA?.q || ''}
                  onChange={(e) => onUpdateSlide({ judgeQA: { ...(activeSlide?.judgeQA || {}), q: e.target.value } })}
                  placeholder="Expected question..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-[11px] text-stone-300 placeholder:text-stone-500 focus:outline-none"
                />
                <textarea
                  rows="2"
                  value={activeSlide?.judgeQA?.a || ''}
                  onChange={(e) => onUpdateSlide({ judgeQA: { ...(activeSlide?.judgeQA || {}), a: e.target.value } })}
                  placeholder="Winning defense answer..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-[11px] text-stone-300 placeholder:text-stone-500 focus:outline-none resize-none"
                />
              </div>
            </div>

          </div>
        )}

      </div>

    </aside>
  );
}
