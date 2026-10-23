import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  Flame, 
  Trophy, 
  Volume2, 
  FlaskConical,
  Beaker,
  Thermometer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const POTION_WORDS = [
  'herb', 'moss', 'root', 'brew', 'glow', 'fire', 'lapis', 'ember', 
  'lotus', 'pearl', 'venom', 'shard', 'clover', 'crystal', 'elixir', 
  'alchemy', 'essence', 'phoenix', 'cauldron', 'transmute', 'philosopher'
];

const POTION_RECIPES = [
  { name: 'Elixir of Swift Reflexes', color: 'from-amber-500 to-emerald-500', icon: '🧪' },
  { name: 'Phoenix Flame Draught', color: 'from-orange-500 to-rose-600', icon: '🔥' },
  { name: 'Celestial Astral Tonic', color: 'from-indigo-500 to-purple-600', icon: '✨' },
  { name: 'Philosopher’s Golden Brew', color: 'from-yellow-400 to-amber-500', icon: '👑' }
];

export const PotionBrewerGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [heat, setHeat] = useState(50); // 0 (frozen) to 100 (overheated/exploded)
  const [potionsBrewed, setPotionsBrewed] = useState(0);
  const [ingredients, setIngredients] = useState([]); // { id, word, y (0 to 80), x, speed }
  const [currentInput, setCurrentInput] = useState('');
  const [cauldronBubbling, setCauldronBubbling] = useState(false);
  const [activeRecipeIdx, setActiveRecipeIdx] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setIngredients([]);
    setCurrentInput('');
    setScore(0);
    setHeat(50);
    setPotionsBrewed(0);
    setActiveRecipeIdx(0);
    setGameState('playing');
  };

  // Ingredient spawner loop: words descend toward bubbling cauldron
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setIngredients((prev) => {
        if (prev.length >= 5) return prev;
        const word = POTION_WORDS[Math.floor(Math.random() * POTION_WORDS.length)];
        if (prev.some((ing) => ing.word === word)) return prev;

        const newIngredient = {
          id: Date.now() + Math.random(),
          word,
          x: 15 + Math.random() * 70, // % across cauldron
          y: 0,
          speed: 0.35 + (potionsBrewed * 0.05)
        };
        return [...prev, newIngredient];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [gameState, potionsBrewed]);

  // Game loop: ingredients fall & heat creeps up
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      setIngredients((prev) => {
        let missedCount = 0;
        const remaining = [];

        prev.forEach((ing) => {
          const nextY = ing.y + ing.speed;
          if (nextY >= 82) {
            // Ingredient fell past cauldron without being brewed!
            missedCount++;
          } else {
            remaining.push({ ...ing, y: nextY });
          }
        });

        if (missedCount > 0) {
          playErrorSound(soundProfile, volume);
          setHeat((h) => {
            const nextH = Math.min(100, h + missedCount * 12);
            if (nextH >= 100) setGameState('gameover');
            return nextH;
          });
        }

        return remaining;
      });

      // Ambient heat stability fluctuation
      setHeat((h) => {
        if (h <= 0 || h >= 100) {
          setGameState('gameover');
        }
        return Math.min(100, Math.max(0, h + (Math.random() > 0.5 ? 0.3 : -0.2)));
      });
    }, 50);

    return () => clearInterval(loop);
  }, [gameState, soundProfile, volume]);

  // Handle ingredient typing
  const handleInputChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(val);
    playKeySound(soundProfile, volume);

    const matched = ingredients.find((ing) => ing.word.toLowerCase() === val);
    if (matched) {
      playNitroSound(volume);
      setCauldronBubbling(true);
      setTimeout(() => setCauldronBubbling(false), 400);

      setIngredients((prev) => prev.filter((ing) => ing.id !== matched.id));
      setCurrentInput('');

      // Regulate heat and score
      setHeat((h) => Math.max(20, Math.min(80, h - 8)));
      setScore((s) => s + 100);

      // Check if finished recipe
      setPotionsBrewed((p) => {
        const next = p + 1;
        if (next % 3 === 0) {
          playSuccessChime(volume);
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
          setActiveRecipeIdx((idx) => (idx + 1) % POTION_RECIPES.length);
        }
        return next;
      });
    }
  };

  useEffect(() => {
    if (gameState === 'gameover' && score > 300) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      if (onAddXp) onAddXp(Math.floor(score / 2));
    }
  }, [gameState]);

  const activeRecipe = POTION_RECIPES[activeRecipeIdx];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-2">
              🧙‍♂️ Spellcraft Alchemy: Potion Brewer
            </h2>
            <p className="text-xs text-slate-400">
              Type descending mystic ingredient runes to transmute legendary alchemical draughts!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-amber-400 font-bold">
              Brewed: <span className="text-white text-sm">{potionsBrewed} 🧪</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
              Score: <span className="text-white text-sm">{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Alchemical Laboratory Cauldron Stage */}
      <div 
        onClick={() => inputRef.current && inputRef.current.focus()}
        className="relative h-[430px] w-full rounded-3xl overflow-hidden border-2 border-emerald-900/50 bg-gradient-to-b from-slate-950 via-[#0a1811] to-[#040c08] shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col justify-between p-6 select-none"
      >
        {/* Top Indicators: Cauldron Heat & Active Recipe */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          
          {/* Active Recipe Banner */}
          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-2 text-xs">
            <span className="text-lg">{activeRecipe.icon}</span>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Draught</span>
              <span className="text-white font-black">{activeRecipe.name}</span>
            </div>
          </div>

          {/* Cauldron Temperature Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl backdrop-blur-sm min-w-[200px]">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <Thermometer className="w-3.5 h-3.5" /> Cauldron Heat
              </span>
              <span className={heat > 75 ? 'text-rose-400 font-black animate-pulse' : 'text-emerald-400 font-bold'}>
                {Math.round(heat)}°C
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className={`h-full transition-all duration-200 ${
                  heat > 75 
                    ? 'bg-rose-500 animate-pulse' 
                    : heat < 30 
                    ? 'bg-cyan-400' 
                    : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                }`}
                style={{ width: `${heat}%` }}
              />
            </div>
          </div>

        </div>

        {/* Cauldron & Descending Ingredients Field */}
        <div className="relative flex-1 w-full my-2">
          
          {/* Falling Ingredients */}
          {ingredients.map((ing) => {
            const isTargeted = ing.word.startsWith(currentInput) && currentInput.length > 0;
            return (
              <div
                key={ing.id}
                className="absolute flex flex-col items-center transition-all duration-75 z-20 pointer-events-none"
                style={{ left: `${ing.x}%`, top: `${ing.y}%`, transform: 'translateX(-50%)' }}
              >
                <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border shadow-lg whitespace-nowrap mb-1 transition-all ${
                  isTargeted 
                    ? 'bg-emerald-400 text-slate-950 border-white scale-110 shadow-emerald-400/50' 
                    : 'bg-slate-950/90 text-emerald-200 border-emerald-500/40'
                }`}>
                  <span className="text-white font-extrabold">{currentInput.slice(0, ing.word.length)}</span>
                  <span>{ing.word.slice(currentInput.length)}</span>
                </div>
                <div className="text-3xl filter drop-shadow-[0_0_8px_#10b981] animate-bounce" style={{ animationDuration: '1.2s' }}>
                  🌿
                </div>
              </div>
            );
          })}

          {/* Large Bubbling Magic Cauldron (Bottom Center) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
            {/* Glowing Brew Steam / Bubbles */}
            <div className={`text-4xl transition-all duration-300 mb-1 ${cauldronBubbling ? 'scale-125 filter drop-shadow-[0_0_20px_#10b981]' : 'animate-pulse'}`}>
              🫧✨
            </div>
            
            {/* Cauldron Vessel */}
            <div className={`w-44 sm:w-56 h-20 rounded-b-full border-4 border-slate-700 bg-gradient-to-b ${activeRecipe.color} p-2 shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all`}>
              <div className="w-full h-4 rounded-full bg-emerald-300/40 blur-xs" />
            </div>

            <span className="text-[10px] font-black uppercase text-emerald-400/80 tracking-widest mt-1">
              Arcane Cauldron
            </span>
          </div>

        </div>

        {/* Bottom Typing Bar */}
        {gameState === 'playing' && (
          <div className="relative z-20 flex flex-col items-center gap-2 pt-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type ingredient word to drop into cauldron..."
              className="w-full max-w-md px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-emerald-500/60 text-white font-mono text-center text-lg focus:outline-none focus:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] placeholder:text-slate-600"
              autoFocus
            />
            <span className="text-[11px] text-emerald-400/80 font-bold">
              Tip: Keep the heat regulated between 30°C and 75°C to prevent an alchemical explosion!
            </span>
          </div>
        )}

        {/* BRIEFING MODAL */}
        {gameState === 'briefing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-emerald-500/30">
              🧙‍♂️
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Spellcraft Alchemy: Potion Brewer
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
              Step into the ancient alchemical laboratory! Mystic ingredient runes are falling from the sky. Type them quickly to drop herbs into your cauldron and brew legendary elixirs before the brew destabilizes!
            </p>

            <button
              onClick={startGame}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
            >
              Ignite the Alchemy Fire Now
            </button>
          </div>
        )}

        {/* GAME OVER MODAL */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="text-5xl mb-2">💥</div>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-400">
              Cauldron Destabilized!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your alchemical experiment concluded after {potionsBrewed} successful draughts.
            </p>

            <div className="flex gap-4 my-4">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Score</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{score}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Potions Brewed</span>
                <span className="text-2xl font-black text-white font-mono">{potionsBrewed}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Brew Again
              </button>
              <button
                onClick={onExit}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Exit Lab
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
