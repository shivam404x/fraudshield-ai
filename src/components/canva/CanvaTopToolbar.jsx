import React from 'react';
import { 
  Trash2, Copy, ArrowUp, ArrowDown, Clock, 
  RotateCw, ZoomIn, ZoomOut, Maximize2, Sparkles, Bold, Italic 
} from 'lucide-react';

export default function CanvaTopToolbar({
  selectedElement,
  onUpdateSelectedElement,
  onDuplicateSelectedElement,
  onDeleteSelectedElement,
  onBringForward,
  onSendBackward,
  slideTiming = 25,
  onUpdateSlideTiming
}) {
  return (
    <div className="h-11 bg-[#18191B] border-b border-stone-800 px-4 flex items-center justify-between text-xs select-none z-10 shrink-0">
      
      {/* LEFT: Contextual Element Controls */}
      <div className="flex items-center gap-2">
        {selectedElement ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {selectedElement.type || 'element'}
            </span>

            {/* If Text or Sticky: Font Size Controls */}
            {(selectedElement.type === 'text' || selectedElement.type === 'sticky') && (
              <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5">
                <span className="text-[10px] text-stone-400 font-mono">Size:</span>
                <input 
                  type="number" 
                  min="10" 
                  max="72"
                  value={selectedElement.fontSize || (selectedElement.type === 'sticky' ? 14 : 24)}
                  onChange={(e) => onUpdateSelectedElement({ fontSize: parseInt(e.target.value) || 16 })}
                  className="w-10 bg-transparent text-white font-mono text-center focus:outline-none"
                />
              </div>
            )}

            {/* Rotation Control */}
            <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5">
              <RotateCw className="w-3 h-3 text-stone-400" />
              <input 
                type="number" 
                min="-180" 
                max="180"
                value={selectedElement.rotation || 0}
                onChange={(e) => onUpdateSelectedElement({ rotation: parseInt(e.target.value) || 0 })}
                className="w-10 bg-transparent text-white font-mono text-center focus:outline-none"
              />
              <span className="text-stone-500 text-[10px]">°</span>
            </div>

            {/* Layer Ordering */}
            <div className="flex items-center gap-0.5 bg-stone-900 border border-stone-800 rounded p-0.5">
              <button
                onClick={onBringForward}
                title="Bring Forward"
                className="p-1 hover:bg-stone-800 rounded text-stone-300 hover:text-white"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onSendBackward}
                title="Send Backward"
                className="p-1 hover:bg-stone-800 rounded text-stone-300 hover:text-white"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Duplicate */}
            <button
              onClick={onDuplicateSelectedElement}
              title="Duplicate Element"
              className="p-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 hover:bg-stone-800 rounded text-stone-300 hover:text-white flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Duplicate</span>
            </button>

            {/* Delete */}
            <button
              onClick={onDeleteSelectedElement}
              title="Delete (Backspace / Del)"
              className="p-1.5 bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 rounded text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Delete</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Select any element on the slide to format, reposition, or layer</span>
          </div>
        )}
      </div>

      {/* RIGHT: Slide Duration & Canvas Quick Settings */}
      <div className="flex items-center gap-3">
        {/* Slide Duration Picker */}
        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg px-2 py-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-mono text-stone-300">Slide Timing:</span>
          <select
            value={slideTiming}
            onChange={(e) => onUpdateSlideTiming(parseInt(e.target.value))}
            className="bg-transparent text-amber-300 font-mono font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="15" className="bg-stone-900 text-white">15 sec (Punchy)</option>
            <option value="20" className="bg-stone-900 text-white">20 sec (Fast)</option>
            <option value="25" className="bg-stone-900 text-white">25 sec (Standard)</option>
            <option value="30" className="bg-stone-900 text-white">30 sec (Detailed)</option>
            <option value="45" className="bg-stone-900 text-white">45 sec (Deep Dive)</option>
            <option value="60" className="bg-stone-900 text-white">60 sec (Live Demo)</option>
          </select>
        </div>

        {/* 16:9 Aspect Tag */}
        <span className="hidden md:inline font-mono text-[10px] font-bold text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
          16:9 PRESENTATION
        </span>
      </div>

    </div>
  );
}
