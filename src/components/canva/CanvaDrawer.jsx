import React from 'react';
import { 
  X, Layers, Shapes, Type, LayoutGrid, PenTool, 
  Palette, Plus, Sparkles, Check, Trash2, Sliders 
} from 'lucide-react';
import { 
  HandArrow, HandLightbulb, HandRocket, HandCoffee, 
  HandFire, HandStar, HandCheck, HandCross, WashiTape 
} from '../HandmadeDoodles';

export default function CanvaDrawer({
  isOpen = true,
  onClose,
  activeTab = 'elements',
  allDecks = [],
  currentDeck,
  onSelectDeck,
  onAddElement,
  onUpdateDeckTheme,
  onApplyLayout,
  drawSettings,
  onUpdateDrawSettings,
  onClearDrawings
}) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-[#1E2024] border-r border-stone-800 flex flex-col h-full select-none z-20 shrink-0">
      
      {/* DRAWER HEADER */}
      <div className="p-3.5 border-b border-stone-800 flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-300 font-mono flex items-center gap-2">
          {activeTab === 'templates' && <><Layers className="w-4 h-4 text-indigo-400" /> Hackathon Decks</>}
          {activeTab === 'elements' && <><Shapes className="w-4 h-4 text-purple-400" /> Elements & Doodles</>}
          {activeTab === 'text' && <><Type className="w-4 h-4 text-amber-400" /> Text & Typography</>}
          {activeTab === 'layouts' && <><LayoutGrid className="w-4 h-4 text-emerald-400" /> Slide Layouts</>}
          {activeTab === 'draw' && <><PenTool className="w-4 h-4 text-pink-400" /> Draw & Marker</>}
          {activeTab === 'brand' && <><Palette className="w-4 h-4 text-cyan-400" /> Canvas & Styling</>}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* DRAWER BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        
        {/* TAB 1: TEMPLATES / DECKS */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-400">
              Battle-tested hackathon decks with real winning pitches, judge Q&A, and technical architecture flows.
            </p>

            <div className="space-y-3">
              {allDecks.map((d) => {
                const isCurrent = currentDeck?.id === d.id;
                return (
                  <div 
                    key={d.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent 
                        ? 'border-indigo-500 bg-indigo-950/30' 
                        : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-xs font-bold text-stone-200 line-clamp-1">{d.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 shrink-0">
                        {d.slides?.length || 0} slides
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-mono mb-2">{d.track}</p>
                    
                    <button
                      onClick={() => onSelectDeck(d)}
                      disabled={isCurrent}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isCurrent 
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isCurrent ? 'Currently Active' : 'Load This Deck'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ELEMENTS & DOODLES */}
        {activeTab === 'elements' && (
          <div className="space-y-5">
            {/* Sticky Notes */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Handmade Sticky Notes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { color: 'yellow', label: 'Yellow Note', bg: 'bg-amber-200 text-stone-900' },
                  { color: 'coral', label: 'Coral Note', bg: 'bg-rose-200 text-stone-900' },
                  { color: 'cyan', label: 'Cyan Note', bg: 'bg-cyan-200 text-stone-900' },
                  { color: 'green', label: 'Green Note', bg: 'bg-emerald-200 text-stone-900' }
                ].map((note) => (
                  <button
                    key={note.color}
                    onClick={() => onAddElement({
                      type: 'sticky',
                      title: 'NOTE',
                      text: 'Add critical judge talking point here.',
                      color: note.color,
                      rotation: -2 + Math.floor(Math.random() * 5)
                    })}
                    className={`p-2.5 rounded-lg font-sans text-xs font-bold shadow-xs hover:scale-102 transition-transform text-left border border-black/10 ${note.bg}`}
                  >
                    📝 + {note.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hand-drawn Doodles */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Hackathon Doodle Stickers
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => onAddElement({ type: 'sticker', stickerType: 'rocket', label: '10x Speed' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Rocket"
                >
                  <HandRocket className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Rocket</span>
                </button>

                <button
                  onClick={() => onAddElement({ type: 'sticker', stickerType: 'fire', label: 'Trending' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Fire"
                >
                  <HandFire className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Fire</span>
                </button>

                <button
                  onClick={() => onAddElement({ type: 'sticker', stickerType: 'lightbulb', label: 'Innovation' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Lightbulb"
                >
                  <HandLightbulb className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Idea</span>
                </button>

                <button
                  onClick={() => onAddElement({ type: 'sticker', stickerType: 'coffee', label: 'Hackathon Fuel' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Coffee"
                >
                  <HandCoffee className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Coffee</span>
                </button>

                <button
                  onClick={() => onAddElement({ type: 'sticker', stickerType: 'star', label: 'Star' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Star"
                >
                  <HandStar className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Star</span>
                </button>

                <button
                  onClick={() => onAddElement({ type: 'sticker', stickerType: 'check', label: 'Solved' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Checkmark"
                >
                  <HandCheck className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Check</span>
                </button>

                <button
                  onClick={() => onAddElement({ type: 'sticker', stickerType: 'cross', label: 'Problem' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Cross"
                >
                  <HandCross className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Cross</span>
                </button>

                <button
                  onClick={() => onAddElement({ type: 'arrow', direction: 'curve-down-right', color: '#D97706' })}
                  className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 group"
                  title="Arrow"
                >
                  <HandArrow className="w-8 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-stone-400 font-mono">Arrow</span>
                </button>
              </div>
            </div>

            {/* Hand Stamps */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Rubber Stamps
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '100% WORKING MVP', color: 'red' },
                  { label: 'VERIFIED CODE', color: 'amber' },
                  { label: 'LIVE DEMO READY', color: 'green' },
                  { label: 'PATENT PENDING', color: 'blue' }
                ].map((stamp) => (
                  <button
                    key={stamp.label}
                    onClick={() => onAddElement({
                      type: 'stamp',
                      label: stamp.label,
                      color: stamp.color,
                      rotation: -8 + Math.floor(Math.random() * 16)
                    })}
                    className="p-2 rounded border border-dashed border-stone-700 bg-stone-900/50 hover:border-stone-500 text-[10px] font-mono font-black text-stone-300 tracking-wider text-center"
                  >
                    🏷️ {stamp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shapes & Callout Cards */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Shapes & Cards
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddElement({
                    type: 'card',
                    title: 'Key Innovation Card',
                    text: 'Describe your core technical breakthrough or benchmark.',
                    bg: 'bg-white',
                    borderColor: 'border-stone-800'
                  })}
                  className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 hover:border-indigo-500 text-xs font-semibold text-stone-300 text-left"
                >
                  🔲 Feature Card
                </button>

                <button
                  onClick={() => onAddElement({
                    type: 'metric',
                    value: '10x',
                    label: 'Faster Execution',
                    bg: 'bg-amber-100',
                    textColor: 'text-amber-600'
                  })}
                  className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 hover:border-indigo-500 text-xs font-semibold text-stone-300 text-left"
                >
                  ⚡ Metric Pill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEXT & TYPOGRAPHY */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-400">
              Click any text block to insert onto the current slide.
            </p>

            <button
              onClick={() => onAddElement({
                type: 'text',
                content: 'Bold Hackathon Headline',
                fontSize: 36,
                fontWeight: '800',
                color: '#18191B',
                fontFamily: 'hand'
              })}
              className="w-full p-4 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 text-left group"
            >
              <div className="text-xl font-extrabold text-white group-hover:text-indigo-300">
                Add a Main Headline
              </div>
              <span className="text-[10px] text-stone-500 font-mono">36px • Bold Display</span>
            </button>

            <button
              onClick={() => onAddElement({
                type: 'text',
                content: 'Explain your unfair advantage and key metrics in one concise line.',
                fontSize: 18,
                fontWeight: '600',
                color: '#334155',
                fontFamily: 'sans'
              })}
              className="w-full p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 text-left group"
            >
              <div className="text-sm font-semibold text-stone-200 group-hover:text-indigo-300">
                Add a Sub-headline
              </div>
              <span className="text-[10px] text-stone-500 font-mono">18px • Subtitle</span>
            </button>

            <button
              onClick={() => onAddElement({
                type: 'text',
                content: '• Sub-second response time\n• Zero runtime dependencies\n• 100% verified test suite',
                fontSize: 14,
                fontWeight: '500',
                color: '#475569',
                fontFamily: 'sans'
              })}
              className="w-full p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 text-left group"
            >
              <div className="text-xs text-stone-300 group-hover:text-indigo-300">
                Add Bullet Points / Checklist
              </div>
              <span className="text-[10px] text-stone-500 font-mono">14px • Paragraph</span>
            </button>

            <button
              onClick={() => onAddElement({
                type: 'code',
                code: 'curl -X POST https://api.nexusops.ai/v1/heal \\\n  -H "Authorization: Bearer $KEY"',
                language: 'bash'
              })}
              className="w-full p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 text-left group"
            >
              <div className="font-mono text-xs text-emerald-400 group-hover:text-emerald-300">
                &gt; Add Code / cURL Snippet
              </div>
              <span className="text-[10px] text-stone-500 font-mono">Terminal block</span>
            </button>
          </div>
        )}

        {/* TAB 4: LAYOUTS */}
        {activeTab === 'layouts' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-400">
              Apply winning pitch structures instantly to your current slide.
            </p>

            <div className="space-y-2">
              {[
                { id: 'bento-grid', name: 'Bento Grid Features', desc: '3 modern high-contrast cards showcasing tech stack pillars' },
                { id: 'old-vs-new', name: 'Old Way vs Our Hack', desc: 'Red vs Green direct competitive superiority split' },
                { id: 'architecture-flow', name: 'Architecture 4-Step Pipeline', desc: 'Client -> Queue -> Inference -> Verified Output flow' },
                { id: 'metrics-traction', name: 'Traction & Proof Metrics', desc: 'Large bold numbers highlighting speed and cost savings' },
                { id: 'team-hackers', name: 'Hacker Team & Credentials', desc: 'Team avatar badges with Github & role highlights' },
                { id: 'judge-defense', name: 'Judge Defense & Moat', desc: 'Preempt the hardest technical judge questions' },
                { id: 'title-hero', name: 'Title Hero & Hook', desc: 'Main stage opening statement with key badges' }
              ].map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => onApplyLayout(layout.id)}
                  className="w-full p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500 text-left transition-all hover:bg-stone-900 group"
                >
                  <h4 className="text-xs font-bold text-stone-200 group-hover:text-indigo-400">{layout.name}</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">{layout.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DRAW & FREEHAND */}
        {activeTab === 'draw' && (
          <div className="space-y-5">
            <p className="text-xs text-stone-400">
              Draw circles, arrows, or annotations directly on your slides during rehearsal or presentation.
            </p>

            {/* Tool Selection */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Drawing Tool
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['pen', 'marker', 'highlighter'].map((tool) => (
                  <button
                    key={tool}
                    onClick={() => onUpdateDrawSettings({ tool })}
                    className={`py-2 px-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      drawSettings?.tool === tool
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Stroke Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
                  '#8B5CF6', '#EC4899', '#FFFFFF', '#18191B'
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateDrawSettings({ color })}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                      drawSettings?.color === color ? 'border-white ring-2 ring-indigo-500 scale-110' : 'border-stone-700'
                    }`}
                  >
                    {drawSettings?.color === color && (
                      <Check className={`w-3.5 h-3.5 ${color === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-stone-400 font-bold mb-2">
                <span>Stroke Size</span>
                <span>{drawSettings?.thickness || 4}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                value={drawSettings?.thickness || 4}
                onChange={(e) => onUpdateDrawSettings({ thickness: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Clear Button */}
            <button
              onClick={onClearDrawings}
              className="w-full py-2 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Slide Annotations</span>
            </button>
          </div>
        )}

        {/* TAB 6: BRAND & THEMES */}
        {activeTab === 'brand' && (
          <div className="space-y-5">
            {/* Paper Themes */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Canvas Paper Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'kraft', name: 'Brown Kraft Paper', color: 'bg-amber-100 text-stone-900' },
                  { id: 'blueprint', name: 'Engineer Blueprint', color: 'bg-blue-900 text-white' },
                  { id: 'chalkboard', name: 'Dark Chalkboard', color: 'bg-stone-900 text-white' },
                  { id: 'grid', name: 'Technical Grid', color: 'bg-slate-100 text-slate-900' },
                  { id: 'dotgrid', name: 'Modern Dot Grid', color: 'bg-stone-100 text-stone-900' },
                  { id: 'vanilla', name: 'Clean Vanilla', color: 'bg-stone-50 text-stone-900' }
                ].map((th) => {
                  const isCurrent = currentDeck?.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => onUpdateDeckTheme('theme', th.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        isCurrent
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                          : 'border-stone-800 hover:border-stone-700'
                      } ${th.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{th.name}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Style */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Handwritten Font Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hand', name: 'Hand (Caveat)' },
                  { id: 'marker', name: 'Marker' },
                  { id: 'kalam', name: 'Kalam Pen' }
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => onUpdateDeckTheme('fontStyle', font.id)}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                      currentDeck?.fontStyle === font.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Highlighter Color */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
                Highlighter Color Accent
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'yellow', name: 'Yellow', bg: 'bg-amber-300 text-stone-900' },
                  { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-300 text-stone-900' },
                  { id: 'pink', name: 'Pink', bg: 'bg-pink-300 text-stone-900' },
                  { id: 'green', name: 'Green', bg: 'bg-emerald-300 text-stone-900' }
                ].map((hl) => (
                  <button
                    key={hl.id}
                    onClick={() => onUpdateDeckTheme('highlighterColor', hl.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                      currentDeck?.highlighterColor === hl.id
                        ? 'border-white ring-2 ring-indigo-500 scale-105'
                        : 'border-stone-800'
                    } ${hl.bg}`}
                  >
                    {hl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
