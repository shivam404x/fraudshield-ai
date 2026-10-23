import React, { useRef, useState, useEffect } from 'react';
import SlideRenderer from '../SlideRenderer';
import { 
  HandArrow, HandLightbulb, HandRocket, HandCoffee, 
  HandFire, HandStar, HandCheck, HandCross, StickyNote, RubberStamp 
} from '../HandmadeDoodles';
import { Trash2, Move, RotateCw } from 'lucide-react';

export default function CanvaStage({
  slide,
  theme = 'kraft',
  fontStyle = 'hand',
  highlighterColor = 'yellow',
  selectedElementId = null,
  onSelectElement,
  onUpdateElement,
  drawSettings,
  isDrawMode = false,
  onAddDrawingStroke
}) {
  const stageRef = useRef(null);
  const [draggingElemId, setDraggingElemId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Freehand drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(null);

  // Dragging elements
  const handlePointerDownElement = (e, el) => {
    if (isDrawMode) return;
    e.stopPropagation();
    onSelectElement(el.id);

    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    setDraggingElemId(el.id);
    setDragOffset({
      x: e.clientX - (stageRect.left + (el.x || 100)),
      y: e.clientY - (stageRect.top + (el.y || 100))
    });
  };

  const handlePointerMove = (e) => {
    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    // Element Dragging
    if (draggingElemId) {
      const newX = Math.max(10, Math.min(stageRect.width - 80, e.clientX - stageRect.left - dragOffset.x));
      const newY = Math.max(10, Math.min(stageRect.height - 60, e.clientY - stageRect.top - dragOffset.y));
      onUpdateElement(draggingElemId, { x: Math.round(newX), y: Math.round(newY) });
      return;
    }

    // Freehand Drawing
    if (isDrawMode && isDrawing && currentStroke) {
      const x = Math.round(e.clientX - stageRect.left);
      const y = Math.round(e.clientY - stageRect.top);
      setCurrentStroke(prev => ({
        ...prev,
        points: [...prev.points, `${x},${y}`]
      }));
    }
  };

  const handlePointerUp = () => {
    if (draggingElemId) {
      setDraggingElemId(null);
    }

    if (isDrawMode && isDrawing && currentStroke) {
      if (currentStroke.points.length > 1) {
        onAddDrawingStroke({
          path: `M ${currentStroke.points.join(' L ')}`,
          color: drawSettings?.color || '#EF4444',
          thickness: drawSettings?.thickness || 4
        });
      }
      setIsDrawing(false);
      setCurrentStroke(null);
    }
  };

  // Drawing start
  const handlePointerDownStage = (e) => {
    if (!isDrawMode) {
      onSelectElement(null);
      return;
    }

    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    const startX = Math.round(e.clientX - stageRect.left);
    const startY = Math.round(e.clientY - stageRect.top);

    setIsDrawing(true);
    setCurrentStroke({
      color: drawSettings?.color || '#EF4444',
      thickness: drawSettings?.thickness || 4,
      points: [`${startX},${startY}`]
    });
  };

  if (!slide) return null;

  return (
    <div 
      className="flex-1 bg-[#121316] p-4 md:p-8 flex items-center justify-center overflow-hidden relative select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* 16:9 Canvas Stage Wrapper */}
      <div 
        ref={stageRef}
        onPointerDown={handlePointerDownStage}
        className={`relative w-full max-w-5xl aspect-[16/9] shadow-2xl rounded-2xl overflow-hidden transition-all ${
          isDrawMode ? 'cursor-crosshair' : 'cursor-default'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* BASE SLIDE CONTENT */}
        <SlideRenderer 
          slide={slide} 
          theme={theme} 
          fontStyle={fontStyle} 
          highlighterColor={highlighterColor} 
          className="w-full h-full"
        />

        {/* FREEHAND DRAWINGS SVG OVERLAY */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
          {/* Saved Drawings */}
          {(slide.drawings || []).map((dr, idx) => (
            <path
              key={idx}
              d={dr.path}
              stroke={dr.color || '#EF4444'}
              strokeWidth={dr.thickness || 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.9"
            />
          ))}

          {/* Active Live Stroke */}
          {currentStroke && currentStroke.points.length > 1 && (
            <path
              d={`M ${currentStroke.points.join(' L ')}`}
              stroke={currentStroke.color}
              strokeWidth={currentStroke.thickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.95"
            />
          )}
        </svg>

        {/* INTERACTIVE DRAGGABLE OVERLAY ELEMENTS */}
        {(slide.elements || []).map((el) => {
          const isSelected = selectedElementId === el.id;

          return (
            <div
              key={el.id}
              onPointerDown={(e) => handlePointerDownElement(e, el)}
              style={{
                position: 'absolute',
                left: `${el.x || 100}px`,
                top: `${el.y || 100}px`,
                transform: `rotate(${el.rotation || 0}deg)`,
                zIndex: el.zIndex || 25
              }}
              className={`cursor-move group transition-shadow ${
                isSelected 
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent' 
                  : 'hover:ring-1 hover:ring-indigo-400/50'
              }`}
            >
              {/* STICKY NOTE */}
              {el.type === 'sticky' && (
                <div 
                  className={`p-3 rounded shadow-md border border-black/10 w-44 font-sans text-xs ${
                    el.color === 'coral' ? 'bg-rose-200 text-stone-900' :
                    el.color === 'cyan' ? 'bg-cyan-200 text-stone-900' :
                    el.color === 'green' ? 'bg-emerald-200 text-stone-900' :
                    'bg-amber-200 text-stone-900'
                  }`}
                  style={{ fontSize: `${el.fontSize || 13}px` }}
                >
                  <div className="font-mono text-[10px] font-bold uppercase opacity-60 mb-1">
                    {el.title || 'NOTE'}
                  </div>
                  <p className="font-medium leading-snug">{el.text}</p>
                </div>
              )}

              {/* STICKER */}
              {el.type === 'sticker' && (
                <div className="flex flex-col items-center">
                  {el.stickerType === 'rocket' && <HandRocket className="w-12 h-12" />}
                  {el.stickerType === 'fire' && <HandFire className="w-10 h-10" />}
                  {el.stickerType === 'lightbulb' && <HandLightbulb className="w-10 h-10" />}
                  {el.stickerType === 'coffee' && <HandCoffee className="w-10 h-10" />}
                  {el.stickerType === 'star' && <HandStar className="w-9 h-9" />}
                  {el.stickerType === 'check' && <HandCheck className="w-9 h-9" />}
                  {el.stickerType === 'cross' && <HandCross className="w-9 h-9" />}
                  {el.label && (
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white mt-1">
                      {el.label}
                    </span>
                  )}
                </div>
              )}

              {/* STAMP */}
              {el.type === 'stamp' && (
                <div 
                  className="px-3 py-1.5 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider bg-white/70 shadow-sm"
                  style={{
                    borderColor: el.color === 'green' ? '#10B981' : el.color === 'blue' ? '#3B82F6' : '#EF4444',
                    color: el.color === 'green' ? '#10B981' : el.color === 'blue' ? '#3B82F6' : '#EF4444'
                  }}
                >
                  {el.label || 'VERIFIED'}
                </div>
              )}

              {/* ARROW */}
              {el.type === 'arrow' && (
                <HandArrow direction={el.direction || 'curve-down-right'} color={el.color || '#D97706'} className="w-16 h-12" />
              )}

              {/* CUSTOM TEXT */}
              {el.type === 'text' && (
                <div 
                  style={{
                    fontSize: `${el.fontSize || 20}px`,
                    fontWeight: el.fontWeight || '700',
                    color: el.color || '#18191B',
                    fontFamily: el.fontFamily === 'hand' ? "'Caveat', cursive" : 'inherit'
                  }}
                  className="px-2 py-1 max-w-md whitespace-pre-wrap"
                >
                  {el.content}
                </div>
              )}

              {/* CODE BLOCK */}
              {el.type === 'code' && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 font-mono text-xs text-emerald-400 shadow-xl max-w-sm">
                  <div className="flex items-center gap-1.5 mb-2 opacity-60">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre">{el.code}</pre>
                </div>
              )}

              {/* METRIC PILL */}
              {el.type === 'metric' && (
                <div className="px-4 py-2 rounded-xl bg-amber-100 border border-amber-300 shadow-md text-stone-900 font-sans">
                  <div className="font-mono text-2xl font-black text-amber-600">{el.value || '10x'}</div>
                  <div className="text-xs font-bold">{el.label || 'Speedup'}</div>
                </div>
              )}

              {/* CARD */}
              {el.type === 'card' && (
                <div className="p-3.5 rounded-xl bg-white border border-stone-800 shadow-lg text-stone-900 w-56">
                  <h4 className="font-bold text-xs mb-1">{el.title || 'Feature'}</h4>
                  <p className="text-[11px] text-stone-600">{el.text}</p>
                </div>
              )}

              {/* SELECTION BOUNDING INDICATOR */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 flex items-center gap-1">
                  <span className="p-1 rounded-full bg-indigo-600 text-white shadow-md">
                    <Move className="w-2.5 h-2.5" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
