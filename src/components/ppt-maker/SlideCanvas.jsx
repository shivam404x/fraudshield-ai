import React, { useRef, useState } from 'react';
import { 
  Zap, Move, Trash2, CheckCircle2, ShieldCheck, 
  Terminal, ExternalLink, Clock, Sparkles 
} from 'lucide-react';
import { 
  HandArrow, HandLightbulb, HandRocket, HandCoffee, 
  HandFire, HandStar, HandCheck, HandCross, StickyNote, RubberStamp, WashiTape 
} from '../HandmadeDoodles';

export default function SlideCanvas({
  slide,
  theme = 'kraft',
  fontStyle = 'hand',
  highlighterColor = 'yellow',
  zoomLevel = 100,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onUpdateSlideContent,
  remoteSelections = {},
  isReadOnly = false
}) {
  const stageRef = useRef(null);
  const [draggingElemId, setDraggingElemId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  if (!slide) return null;

  // Zoom transform style
  const scale = zoomLevel / 100;

  // Dragging custom overlay elements
  const handlePointerDownElement = (e, el) => {
    if (isReadOnly) return;
    e.stopPropagation();
    onSelectElement(el.id);

    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    setDraggingElemId(el.id);
    setDragOffset({
      x: (e.clientX - stageRect.left) / scale - (el.x || 100),
      y: (e.clientY - stageRect.top) / scale - (el.y || 100)
    });
  };

  const handlePointerMove = (e) => {
    if (!draggingElemId) return;
    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    const newX = Math.round((e.clientX - stageRect.left) / scale - dragOffset.x);
    const newY = Math.round((e.clientY - stageRect.top) / scale - dragOffset.y);

    onUpdateElement(draggingElemId, {
      x: Math.max(0, Math.min(960 - 60, newX)),
      y: Math.max(0, Math.min(540 - 40, newY))
    });
  };

  const handlePointerUp = () => {
    setDraggingElemId(null);
  };

  // Canvas Theme styling
  const isDark = theme === 'blueprint' || theme === 'chalkboard';
  const themeClasses = {
    kraft: 'paper-kraft text-stone-900 border-amber-900/30',
    blueprint: 'paper-blueprint text-blue-50 border-blue-400/40',
    chalkboard: 'paper-chalkboard text-stone-100 border-stone-600/40',
    grid: 'paper-grid text-slate-900 border-slate-900/30'
  }[theme] || 'paper-kraft text-stone-900 border-amber-900/30';

  const fontClass = fontStyle === 'marker' ? 'font-marker' : fontStyle === 'kalam' ? 'font-kalam' : 'font-hand';

  return (
    <div 
      className="flex-1 bg-[#121316] flex items-center justify-center p-4 md:p-8 overflow-auto relative select-none font-sans"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerDown={() => onSelectElement(null)}
    >
      {/* SCALED 16:9 CANVAS VIEWPORT */}
      <div 
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: draggingElemId ? 'none' : 'transform 0.15s ease'
        }}
        className="shrink-0"
      >
        <div 
          ref={stageRef}
          className={`relative w-[960px] h-[540px] rounded-2xl overflow-hidden shadow-2xl border-4 ${themeClasses} p-8 flex flex-col justify-between select-text`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Decorative Washi Tapes */}
          <WashiTape color="white" angle="-10deg" className="-top-3 -left-3 w-28 h-6 opacity-75" />
          <WashiTape color="yellow" angle="12deg" className="-top-3 -right-3 w-28 h-6 opacity-75" />
          <WashiTape color="coral" angle="6deg" className="-bottom-3 -left-3 w-24 h-5 opacity-60" />

          {/* SLIDE HEADER */}
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Category Badge & Duration */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`inline-block font-mono text-[11px] font-bold tracking-wider px-3 py-0.5 rounded-full border-2 ${
                  isDark ? 'border-amber-300 text-amber-300 bg-amber-950/40' : 'border-stone-800 text-stone-900 bg-amber-200/80'
                } wobbly-badge`}>
                  {slide.badge || 'HACKATHON PITCH'}
                </span>

                {slide.timeSeconds && (
                  <span className={`font-mono text-[10px] opacity-75 px-2 py-0.5 rounded ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-stone-700'}`}>
                    ⏱️ ~{slide.timeSeconds}s
                  </span>
                )}
              </div>

              {/* Title Input / Display */}
              <h2 className={`${fontClass} text-3xl font-extrabold tracking-tight leading-tight`}>
                <span className="highlighter-yellow">{slide.title || 'Slide Title'}</span>
              </h2>

              {/* Subtitle */}
              {slide.subtitle && (
                <p className={`font-sans text-xs md:text-sm font-medium opacity-90 max-w-2xl mt-1 leading-snug ${isDark ? 'text-blue-100' : 'text-stone-700'}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Stamp if available */}
            {slide.stamp && (
              <RubberStamp text={slide.stamp} color={isDark ? 'amber' : 'red'} angle="-6deg" className="text-xs shrink-0" />
            )}
          </div>

          {/* MAIN SLIDE CONTENT AREA (DEPENDING ON LAYOUT) */}
          <div className="relative z-10 flex-1 my-2 flex flex-col justify-center">
            
            {/* 1. TITLE-HERO */}
            {slide.layout === 'title-hero' && (
              <div className="grid grid-cols-12 gap-4 items-center h-full">
                <div className="col-span-8">
                  <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-blue-950/40 border-blue-400/50' : 'bg-white/85 border-stone-800'} wobbly-border space-y-2`}>
                    <h4 className="font-mono text-xs font-bold uppercase text-amber-500 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> The Hackathon Breakthrough:
                    </h4>
                    <ul className="space-y-1.5">
                      {(slide.bulletList || []).map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-sans">
                          <span className="text-amber-500 font-bold">➜</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-span-4 flex flex-col items-center justify-center">
                  <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-amber-100/90 border-amber-300'} text-center w-full shadow-md`}>
                    <HandRocket className="w-12 h-12 mx-auto mb-1" />
                    <span className="font-mono text-xs font-black uppercase tracking-wider block text-amber-600">
                      LIVE WORKING PROTOTYPE
                    </span>
                    <p className="text-[10px] text-stone-600 mt-1">
                      Tested live in simulated production environment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. OLD-VS-NEW */}
            {slide.layout === 'old-vs-new' && (
              <div className="grid grid-cols-2 gap-4 h-full items-stretch">
                <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-red-950/20 border-red-500/40' : 'bg-red-50/80 border-red-600/50'} wobbly-border flex flex-col justify-between`}>
                  <div>
                    <h3 className="font-mono text-xs font-bold text-red-600 mb-2">❌ {slide.leftCol?.title || 'The Broken Way'}</h3>
                    <ul className="space-y-1 text-xs font-sans">
                      {(slide.leftCol?.items || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-emerald-50/80 border-emerald-600/50'} wobbly-border flex flex-col justify-between`}>
                  <div>
                    <h3 className="font-mono text-xs font-bold text-emerald-600 mb-2">✅ {slide.rightCol?.title || 'Our Hackathon Fix'}</h3>
                    <ul className="space-y-1 text-xs font-sans">
                      {(slide.rightCol?.items || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SOLUTION PILLARS / BENTO GRID */}
            {(slide.layout === 'solution-pillars' || slide.layout === 'bento-grid') && (
              <div className="grid grid-cols-3 gap-3 h-full items-stretch">
                {(slide.cards || []).map((card, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/85 border-stone-800'} wobbly-border flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{card.icon || '⚡'}</span>
                        <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                          {card.tag || 'PILLAR'}
                        </span>
                      </div>
                      <h4 className={`${fontClass} text-base font-bold mb-1`}>{card.title}</h4>
                      <p className="font-sans text-xs leading-relaxed opacity-85">{card.description}</p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-mono opacity-70">
                      <span>Verified MVP</span>
                      <HandCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. ARCHITECTURE FLOW */}
            {slide.layout === 'architecture-flow' && (
              <div className="grid grid-cols-4 gap-3">
                {(slide.steps || []).map((step, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border-2 ${isDark ? 'bg-blue-950/50 border-blue-400/60' : 'bg-white/90 border-stone-800'} wobbly-border flex flex-col justify-between`}>
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-stone-900 w-fit mb-2">
                      STEP {step.number}
                    </span>
                    <h5 className={`${fontClass} text-sm font-bold mb-1`}>{step.title}</h5>
                    <p className="font-sans text-xs opacity-85 leading-snug">{step.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 5. METRICS TRACTION */}
            {slide.layout === 'metrics-traction' && (
              <div className="grid grid-cols-3 gap-4 text-center">
                {(slide.stats || []).map((st, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border-2 ${isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white/90 border-stone-800'} wobbly-border`}>
                    <div className="font-mono text-4xl font-black text-amber-500">{st.value}</div>
                    <div className={`${fontClass} text-base font-bold mt-1`}>{st.label}</div>
                    <div className="font-sans text-xs opacity-75 mt-0.5">{st.note}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. TECH STACK */}
            {slide.layout === 'tech-stack' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(slide.cards || []).map((card, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border-2 ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/85 border-stone-800'} wobbly-border flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{card.icon || '💻'}</span>
                        <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-stone-900 border border-stone-700">
                          {card.tag}
                        </span>
                      </div>
                      <h4 className={`${fontClass} text-sm font-bold mb-1`}>{card.title}</h4>
                      <p className="font-sans text-xs opacity-85 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. BUSINESS & MARKET SIZING */}
            {slide.layout === 'business-market' && (
              <div className="grid grid-cols-3 gap-3">
                {(slide.cards || []).map((card, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/85 border-stone-800'} wobbly-border text-center`}>
                    <span className="text-2xl block mb-2">{card.icon || '🌐'}</span>
                    <span className="font-mono text-xs font-bold text-amber-500 block mb-1">{card.tag}</span>
                    <h4 className={`${fontClass} text-base font-bold mb-1`}>{card.title}</h4>
                    <p className="font-sans text-xs opacity-85">{card.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 8. ROADMAP FUTURE */}
            {slide.layout === 'roadmap-future' && (
              <div className="grid grid-cols-3 gap-3">
                {(slide.steps || []).map((step, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/85 border-stone-800'} wobbly-border`}>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white block w-fit mb-2">
                      {step.number}
                    </span>
                    <h4 className={`${fontClass} text-sm font-bold mb-1`}>{step.title}</h4>
                    <p className="font-sans text-xs opacity-85 leading-snug">{step.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 9. TEAM CREDENTIALS */}
            {slide.layout === 'team-credentials' && (
              <div className="grid grid-cols-3 gap-3 text-center">
                {(slide.members || []).map((m, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/85 border-stone-800'} wobbly-border`}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-stone-800 bg-amber-100 text-stone-900 flex items-center justify-center font-bold text-base">
                      {m.name.charAt(0)}
                    </div>
                    <h4 className={`${fontClass} text-base font-bold`}>{m.name}</h4>
                    <div className="font-mono text-xs font-bold text-amber-500 mb-1">{m.role}</div>
                    <p className="font-sans text-xs opacity-85">{m.bio}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 10. JUDGE DEFENSE */}
            {slide.layout === 'judge-defense' && (
              <div className="space-y-2">
                {(slide.defensePoints || []).map((pt, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border-2 ${isDark ? 'bg-blue-950/40 border-blue-400/50' : 'bg-white/85 border-stone-800'} wobbly-border flex items-start gap-3`}>
                    <HandCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className={`${fontClass} text-sm font-bold`}>{pt.title}</div>
                      <div className="font-sans text-xs opacity-85">{pt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 11. PROBLEM STATEMENT */}
            {slide.layout === 'problem-statement' && (
              <div className={`p-5 rounded-xl border-2 ${isDark ? 'bg-red-950/20 border-red-500/40' : 'bg-white/85 border-stone-800'} wobbly-border space-y-3`}>
                <h4 className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider">
                  ⚠️ Critical Inefficiencies & Market Pain:
                </h4>
                <ul className="space-y-2">
                  {(slide.bulletList || []).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-sans">
                      <span className="text-red-500 font-bold mt-0.5">💥</span>
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 12. DEMO CTA */}
            {slide.layout === 'demo-cta' && (
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white/90 border-stone-800'} wobbly-border space-y-2`}>
                  <h4 className="font-mono text-xs font-bold uppercase text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Testing:
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {(slide.bulletList || []).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✔</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center p-4 rounded-xl border-2 border-dashed border-stone-700 bg-stone-900/30">
                  <div className="w-24 h-24 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center font-mono font-bold text-black text-xs">
                    [QR CODE]
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">SCAN FOR LIVE DEMO</span>
                </div>
              </div>
            )}

          </div>

          {/* DYNAMIC USER-ADDED OVERLAY ELEMENTS (TEXT, SHAPES, IMAGES, STICKIES) */}
          {(slide.elements || []).map((el) => {
            const isSelected = selectedElementId === el.id;
            const remoteLock = remoteSelections[el.id];

            return (
              <div
                key={el.id}
                onPointerDown={(e) => handlePointerDownElement(e, el)}
                style={{
                  position: 'absolute',
                  left: `${el.x || 100}px`,
                  top: `${el.y || 100}px`,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  zIndex: el.zIndex || 30,
                  outline: remoteLock ? `2px solid ${remoteLock.color || '#EC4899'}` : undefined
                }}
                className={`transition-shadow ${
                  isReadOnly ? 'cursor-default' : 'cursor-move'
                } ${
                  isSelected 
                    ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent shadow-xl' 
                    : 'hover:ring-1 hover:ring-indigo-400/50'
                }`}
              >
                {/* REMOTE COLLABORATOR LOCK BADGE */}
                {remoteLock && (
                  <div
                    style={{ backgroundColor: remoteLock.color || '#EC4899' }}
                    className="absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold text-white shadow-xs whitespace-nowrap z-50 pointer-events-none flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{remoteLock.userName} is editing</span>
                  </div>
                )}
                {/* 1. TEXT ELEMENT */}
                {el.type === 'text' && (
                  <div
                    style={{
                      fontSize: `${el.fontSize || 20}px`,
                      fontWeight: el.fontWeight || '700',
                      color: el.color || '#18191B',
                      fontFamily: el.fontFamily === 'hand' ? "'Caveat', cursive" : 'inherit'
                    }}
                    className="px-2 py-1 max-w-md whitespace-pre-wrap leading-tight select-text"
                  >
                    {el.content || 'Text Box'}
                  </div>
                )}

                {/* 2. RECTANGLE / CARD SHAPE */}
                {el.type === 'shape' && (
                  <div
                    style={{
                      width: `${el.width || 140}px`,
                      height: `${el.height || 100}px`,
                      backgroundColor: el.fill || '#4F46E5',
                      borderRadius: el.shapeType === 'circle' ? '9999px' : '12px'
                    }}
                    className="shadow-md border border-black/10 flex items-center justify-center"
                  />
                )}

                {/* 3. IMAGE ELEMENT */}
                {el.type === 'image' && (
                  <img
                    src={el.url}
                    alt="Slide element"
                    style={{
                      width: `${el.width || 240}px`,
                      height: `${el.height || 160}px`
                    }}
                    className="rounded-xl shadow-lg object-cover pointer-events-none"
                  />
                )}

                {/* 4. STICKY NOTE */}
                {el.type === 'sticky' && (
                  <div
                    className={`p-3 rounded shadow-md border border-black/10 w-44 font-sans text-xs ${
                      el.color === 'coral' ? 'bg-rose-200 text-stone-900' :
                      el.color === 'cyan' ? 'bg-cyan-200 text-stone-900' :
                      'bg-amber-200 text-stone-900'
                    }`}
                  >
                    <div className="font-mono text-[9px] font-bold uppercase opacity-60 mb-0.5">
                      {el.title || 'NOTE'}
                    </div>
                    <p className="font-medium leading-snug">{el.text || 'Add note...'}</p>
                  </div>
                )}

                {/* ACTIVE SELECTION ANCHOR */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 p-1 rounded-full bg-indigo-600 text-white shadow-md">
                    <Move className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* SLIDE FOOTER */}
          <div className="relative z-10 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-mono opacity-70">
            <span>HackForge AI • Hackathon Studio</span>
            <span>CONFIDENTIAL HACKATHON SLIDE</span>
          </div>

        </div>
      </div>
    </div>
  );
}
