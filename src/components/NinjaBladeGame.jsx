import React, { useState, useEffect, useRef } from 'react';
import { 
  Swords, 
  RotateCcw, 
  ArrowLeft, 
  Zap, 
  Flame, 
  Sparkles, 
  Trophy, 
  Heart,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const NINJA_WORDS = [
  'slash', 'katana', 'blade', 'ninja', 'strike', 'shadow', 'swift', 
  'stealth', 'scroll', 'smoke', 'steel', 'shuriken', 'reflex', 'honor', 
  'dojo', 'zenith', 'master', 'frenzy', 'phantom', 'warrior', 'sakura'
];

export const NinjaBladeGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('intro'); // 'intro' | 'playing' | 'gameover'
  const [flyingTargets, setFlyingTargets] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [sliceEffect, setSliceEffect] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setFlyingTargets([]);
    setCurrentInput('');
    setScore(0);
    setCombo(0);
    setLives(3);
    setGameState('playing');
  };

  // Flying targets spawner (targets launch up from bottom)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawner = setInterval(() => {
      setFlyingTargets((prev) => {
        if (prev.length >= 5) return prev;
        const word = NINJA_WORDS[Math.floor(Math.random() * NINJA_WORDS.length)];
        const randomX = Math.floor(Math.random() * 70) + 15;
        const id = Date.now() + Math.random();

        return [
          ...prev,
          {
            id: id,
            word: word,
            x: randomX,
            y: 90, // starts at bottom
            vy: -1.2, // initial upward velocity
            gravity: 0.035,
            icon: ['🍉', '🍎', '🗡️', '🎋', '💎'][Math.floor(Math.random() * 5)]
          }
        ];
      });
    }, 1400);

    return () => clearInterval(spawner);
  }, [gameState]);

  // Physics animation loop (arcs upward then falls back down)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const physicsLoop = setInterval(() => {
      setFlyingTargets((prev) => {
        const nextList = [];
        let missed = false;

        prev.forEach((t) => {
          const nextY = t.y + t.vy;
          const nextVy = t.vy + t.gravity;

          // If fell below screen after arc
          if (nextY > 95 && nextVy > 0) {
            missed = true;
          } else {
            nextList.push({
              ...t,
              y: nextY,
              vy: nextVy
            });
          }
        });

        if (missed) {
          playErrorSound(volume);
          setCombo(0);
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextL;
          });
        }

        return nextList;
      });
    }, 45);

    return () => clearInterval(physicsLoop);
  }, [gameState, volume]);

  // Handle typing to slice targets
  const handleInputChange = (e) => {
    if (gameState !== 'playing') return;

    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(e.target.value);
    playKeySound(soundProfile, volume);

    const matchIdx = flyingTargets.findIndex((t) => t.word === val);

    if (matchIdx !== -1) {
      const sliced = flyingTargets[matchIdx];

      // Slice visual effect
      setSliceEffect({ x: sliced.x, y: sliced.y });
      playNitroSound(volume);
      setTimeout(() => setSliceEffect(null), 300);

      // Score and combos
      const bonus = combo >= 3 ? 30 : 0;
      setScore((s) => s + sliced.word.length * 20 + bonus);
      setCombo((c) => c + 1);
      if (onAddXp) onAddXp(sliced.word.length * 2);

      // Remove target
      setFlyingTargets((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setCurrentInput('');
    }
  };

  return (
    <div className="bg-slate-950 border-2 border-rose-500/40 rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl relative overflow-hidden font-mono space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-500/30 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Dojo
        </button>

        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="font-black text-white uppercase tracking-wider">
            Ninja Katana: Word Slicer Dojo
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500" /> Lives: {lives}
          </span>
          <span className="flex items-center gap-1 text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-orange-400" /> Combo: x{combo}
          </span>
          <span className="text-amber-400 font-mono">Score: {score}</span>
        </div>
      </div>

      {/* DOJO SLICING CANVAS */}
      <div className="relative h-80 sm:h-96 bg-gradient-to-b from-slate-950 via-slate-900 to-rose-950/20 rounded-2xl border-2 border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        
        {/* Flying Airborne Targets */}
        {flyingTargets.map((target) => {
          const isTargetPrefix = currentInput.trim() && target.word.startsWith(currentInput.trim().toLowerCase());
          return (
            <div
              key={target.id}
              className={`absolute transition-all duration-75 flex flex-col items-center ${
                isTargetPrefix ? 'scale-125 z-20' : 'z-10'
              }`}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                {target.icon}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-black tracking-wider uppercase mt-0.5 ${
                isTargetPrefix
                  ? 'bg-rose-500 text-white shadow-[0_0_15px_#f43f5e] animate-pulse'
                  : 'bg-slate-900/90 text-rose-300 border border-rose-500/40'
              }`}>
                {target.word}
              </span>
            </div>
          );
        })}

        {/* Katana Blade Slash Graphic */}
        {sliceEffect && (
          <div
            className="absolute w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_#ffffff] rotate-45 pointer-events-none z-30 animate-ping"
            style={{
              left: `${sliceEffect.x}%`,
              top: `${sliceEffect.y}%`,
              transform: 'translate(-50%, -50%) rotate(45deg)'
            }}
          />
        )}

        {/* Dojo Katana Master at Bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <span className="text-4xl filter drop-shadow-[0_0_15px_#f43f5e] animate-bounce">
            🥷
          </span>
          <span className="text-[9px] uppercase font-black tracking-widest text-rose-300 bg-slate-950/80 px-2 py-0.5 rounded border border-rose-500/40">
            Katana Grandmaster
          </span>
        </div>

        {/* Intro / Game Over Overlays */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {gameState === 'gameover' ? (
              <div className="space-y-3 animate-pop">
                <span className="text-4xl">🎋</span>
                <h3 className="text-3xl font-black text-rose-500">KATANA BLADE DROPPED</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Too many airborne targets touched the ground. Final score: <strong className="text-white font-mono">{score} points</strong>.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 shadow-[0_0_15px_#f43f5e]"
                  >
                    <RotateCcw className="w-4 h-4" /> Slice Again
                  </button>
                  <button
                    onClick={onExit}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
                  <Swords className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white">Ninja Katana: Word Slicer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Targets are propelled into the air! Type the words to slash them with razor katana strikes before they fall back to earth. Maintain combos for Blade Frenzy!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-lg shadow-rose-500/30 active:scale-95 transition-all"
                >
                  <Swords className="w-4 h-4" /> Draw Katana & Play
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Slicing Input Box */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-rose-400" /> Katana Strike Command
        </label>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          disabled={gameState !== 'playing'}
          placeholder={gameState === 'playing' ? "Type airborne words to slash them in half..." : "Katana sheathed"}
          className="w-full bg-slate-900 border-2 border-rose-500/50 rounded-xl px-4 py-3 font-mono text-base text-rose-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 shadow-inner"
        />
      </div>

    </div>
  );
};
