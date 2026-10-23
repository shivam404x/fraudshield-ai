import React from 'react';
import { 
  HandArrow, HandLightbulb, HandRocket, 
  HandCoffee, HandFire, HandStar, HandCheck, HandCross, 
  WashiTape, StickyNote, RubberStamp 
} from './HandmadeDoodles';
import { Zap, Terminal, CheckCircle2 } from 'lucide-react';

export default function SlideRenderer({
  slide,
  theme = 'kraft',
  fontStyle = 'hand',
  highlighterColor = 'yellow',
  editable = false,
  className = ''
}) {
  if (!slide) return null;

  const fontClass = fontStyle === 'marker' ? 'font-marker' : fontStyle === 'kalam' ? 'font-kalam' : 'font-hand';

  const highlighterClass = {
    yellow: 'highlighter-yellow',
    cyan: 'highlighter-cyan',
    pink: 'highlighter-pink',
    green: 'highlighter-green'
  }[highlighterColor] || 'highlighter-yellow';

  const themeClasses = {
    kraft: 'paper-kraft text-stone-900 border-amber-900/30',
    grid: 'paper-grid text-slate-900 border-slate-900/30',
    dotgrid: 'paper-dotgrid text-stone-900 border-stone-800/30',
    blueprint: 'paper-blueprint text-blue-50 border-blue-300/40',
    chalkboard: 'paper-chalkboard text-stone-100 border-stone-600/40',
    vanilla: 'paper-vanilla text-stone-900 border-stone-800/30'
  }[theme] || 'paper-kraft text-stone-900 border-amber-900/30';

  const isDark = theme === 'blueprint' || theme === 'chalkboard';

  return (
    <div 
      className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border-4 ${themeClasses} select-text p-6 md:p-10 flex flex-col justify-between ${className}`}
    >
      <WashiTape color="white" angle="-12deg" className="-top-3 -left-4 w-20 md:w-28 h-6 opacity-75" />
      <WashiTape color="yellow" angle="14deg" className="-top-3 -right-4 w-20 md:w-28 h-6 opacity-75" />
      <WashiTape color="coral" angle="6deg" className="-bottom-3 -left-4 w-16 md:w-24 h-5 opacity-60" />
      <WashiTape color="white" angle="-8deg" className="-bottom-3 -right-4 w-16 md:w-24 h-5 opacity-60" />

      {/* Slide Header */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <span className={`inline-block font-mono text-xs font-bold tracking-wider px-3 py-0.5 rounded-full border-2 ${
              isDark ? 'border-amber-300 text-amber-300 bg-amber-950/40' : 'border-stone-800 text-stone-900 bg-amber-200/70'
            } wobbly-badge`}>
              {slide.badge || 'HACKATHON PITCH'}
            </span>
            {slide.timeSeconds && (
              <span className={`font-mono text-xs opacity-75 px-2 py-0.5 rounded ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-stone-700'}`}>
                ⏱️ ~{slide.timeSeconds}s
              </span>
            )}
          </div>

          <h2 className={`${fontClass} text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight`}>
            <span className={highlighterClass}>{slide.title}</span>
          </h2>
          <p className={`font-sans text-xs md:text-sm lg:text-base font-medium opacity-90 max-w-3xl mt-1 leading-relaxed ${isDark ? 'text-blue-100' : 'text-stone-700'}`}>
            {slide.subtitle}
          </p>
        </div>

        {slide.stamp && (
          <RubberStamp text={slide.stamp} color={isDark ? 'amber' : 'red'} angle="-8deg" className="text-xs" />
        )}
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 flex-1 my-2 flex flex-col justify-center">
        {slide.layout === 'title-hero' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center h-full">
            <div className="md:col-span-8 space-y-3">
              <div className={`p-4 md:p-5 rounded-lg border-2 ${isDark ? 'bg-blue-950/40 border-blue-400/50' : 'bg-white/80 border-stone-800'} wobbly-border`}>
                <h4 className="font-mono text-xs md:text-sm font-bold uppercase mb-2 text-amber-500 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> The Hackathon Breakthrough:
                </h4>
                <ul className="space-y-2">
                  {(slide.bulletList || []).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 font-sans text-xs md:text-base">
                      <span className="shrink-0 mt-0.5 font-bold text-amber-500">➜</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3 justify-center">
              {slide.stickyNotes && slide.stickyNotes[0] && (
                <StickyNote 
                  text={slide.stickyNotes[0].text} 
                  title={slide.stickyNotes[0].title}
                  color={slide.stickyNotes[0].color || 'yellow'} 
                  angle="-2deg"
                />
              )}
            </div>
          </div>
        )}

        {slide.layout === 'old-vs-new' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-stretch">
            <div className={`p-4 rounded-lg border-2 ${isDark ? 'bg-red-950/20 border-red-500/40' : 'bg-red-50/70 border-red-600/50'} wobbly-border`}>
              <h3 className="font-mono text-sm font-bold text-red-600 mb-2">❌ {slide.leftCol?.title || 'The Old Way'}</h3>
              <ul className="space-y-1.5 text-xs font-sans">
                {(slide.leftCol?.items || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`p-4 rounded-lg border-2 ${isDark ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-emerald-50/80 border-emerald-600/50'} wobbly-border`}>
              <h3 className="font-mono text-sm font-bold text-emerald-600 mb-2">✅ {slide.rightCol?.title || 'Our Hack'}</h3>
              <ul className="space-y-1.5 text-xs font-sans">
                {(slide.rightCol?.items || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {slide.layout === 'bento-grid' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full items-stretch">
            {(slide.cards || []).map((card, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-2 ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/85 border-stone-800'} wobbly-border flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{card.icon || '🚀'}</span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-stone-900 border border-stone-700">{card.tag}</span>
                  </div>
                  <h4 className={`${fontClass} text-base font-bold mb-1`}>{card.title}</h4>
                  <p className="font-sans text-xs leading-relaxed opacity-85">{card.description}</p>
                </div>
                <div className="pt-2 mt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-mono opacity-70">
                  <span>Verified</span>
                  <HandCheck className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'architecture-flow' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(slide.steps || []).map((step, idx) => (
              <div key={idx} className={`p-3.5 rounded-lg border-2 ${isDark ? 'bg-blue-950/50 border-blue-400/60' : 'bg-white/90 border-stone-800'} wobbly-border flex flex-col justify-between`}>
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-amber-400 text-stone-900 w-fit mb-2">STEP {step.number}</span>
                <h5 className={`${fontClass} text-sm font-bold mb-1`}>{step.title}</h5>
                <p className="font-sans text-xs opacity-85">{step.detail}</p>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'metrics-traction' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {(slide.stats || []).map((st, idx) => (
              <div key={idx} className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white/90 border-stone-800'} wobbly-border`}>
                <div className="font-mono text-4xl font-black text-amber-500">{st.value}</div>
                <div className={`${fontClass} text-base font-bold mt-1`}>{st.label}</div>
                <div className="font-sans text-xs opacity-75 mt-0.5">{st.note}</div>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'team-hackers' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {(slide.members || []).map((m, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-2 ${isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/85 border-stone-800'} wobbly-border`}>
                <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-stone-800 bg-amber-100 flex items-center justify-center font-bold text-lg">
                  {m.name.charAt(0)}
                </div>
                <h4 className={`${fontClass} text-lg font-bold`}>{m.name}</h4>
                <div className="font-mono text-xs font-bold text-amber-500 mb-1">{m.role}</div>
                <p className="font-sans text-xs opacity-85">{m.bio}</p>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'judge-defense' && (
          <div className="space-y-2.5">
            {(slide.defensePoints || []).map((pt, idx) => (
              <div key={idx} className={`p-3 rounded-lg border-2 ${isDark ? 'bg-blue-950/40 border-blue-400/50' : 'bg-white/85 border-stone-800'} wobbly-border flex items-start gap-3`}>
                <HandCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className={`${fontClass} text-base font-bold`}>{pt.title}</div>
                  <div className="font-sans text-xs opacity-85">{pt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 pt-2 border-t border-black/10 flex items-center justify-between text-xs font-mono opacity-70">
        <span>HackForge AI • Pitch Deck Studio</span>
        <span>CONFIDENTIAL HACKATHON SLIDE</span>
      </div>
    </div>
  );
}
