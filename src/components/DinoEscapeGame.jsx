import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Zap,
  Gauge,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const DINO_WORDS = [
  'roar', 'run', 'sprint', 'leap', 'chase', 'jungle', 'fossil', 
  'teeth', 'claw', 'raptor', 'volcano', 'stomp', 'predator', 'escape', 
  'amber', 'jurassic', 'tyrant', 'carnivore', 'survival', 'thunder', 'velocity'
];

export const DinoEscapeGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'playing' | 'gameover'
  const [distance, setDistance] = useState(0); // in meters
  const [dinoGap, setDinoGap] = useState(25); // meters behind player (game over at 0)
  const [score, setScore] = useState(0);
  const [hurdles, setHurdles] = useState([]); // { id, word, x (from right 100% to left 15%) }
  const [currentInput, setCurrentInput] = useState('');
  const [screenRumble, setScreenRumble] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setHurdles([]);
    setCurrentInput('');
    setDistance(0);
    setDinoGap(25);
    setScore(0);
    setGameState('playing');
  };

  // Spawn incoming jurassic hurdles
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setHurdles((prev) => {
        if (prev.length >= 4) return prev;
        const word = DINO_WORDS[Math.floor(Math.random() * DINO_WORDS.length)];
        if (prev.some((h) => h.word === word)) return prev;

        const newHurdle = {
          id: Date.now() + Math.random(),
          word,
          x: 95,
          speed: 0.3 + (distance / 2000) * 0.15
        };
        return [...prev, newHurdle];
      });
    }, 1700);

    return () => clearInterval(interval);
  }, [gameState, distance]);

  // Game loop: track movement, distance, and T-Rex pursuit
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      // T-Rex creeps closer continuously
      setDinoGap((gap) => {
        const nextGap = gap - 0.08;
        if (nextGap <= 0) {
          setGameState('gameover');
          return 0;
        }
        return nextGap;
      });

      // Advance hurdles toward the runner
      setHurdles((prev) => {
        let tripped = false;
        const remaining = [];

        prev.forEach((h) => {
          const nextX = h.x - h.speed;
          if (nextX <= 28) {
            // Tripped over obstacle! T-Rex gains ground quickly!
            tripped = true;
          } else {
            remaining.push({ ...h, x: nextX });
          }
        });

        if (tripped) {
          playErrorSound(soundProfile, volume);
          setScreenRumble(true);
          setTimeout(() => setScreenRumble(false), 300);
          setDinoGap((g) => {
            const nextG = Math.max(0, g - 6);
            if (nextG <= 0) setGameState('gameover');
            return nextG;
          });
        }

        return remaining;
      });

      // Increase distance sprinted
      setDistance((d) => d + 2);
    }, 50);

    return () => clearInterval(loop);
  }, [gameState, soundProfile, volume, distance]);

  // Handle typing input
  const handleInputChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(val);
    playKeySound(soundProfile, volume);

    const matched = hurdles.find((h) => h.word.toLowerCase() === val);
    if (matched) {
      playNitroSound(volume);

      // Dash forward and gain ground from the T-Rex!
      setDinoGap((g) => Math.min(35, g + 4));
      setHurdles((prev) => prev.filter((h) => h.id !== matched.id));
      setCurrentInput('');

      setScore((s) => s + 100);
      playSuccessChime(volume);
    }
  };

  useEffect(() => {
    if (gameState === 'gameover' && score > 300) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      if (onAddXp) onAddXp(Math.floor(score / 2));
    }
  }, [gameState]);

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
            <h2 className="text-base sm:text-lg font-black text-amber-400 flex items-center gap-2">
              🦖 Dino Escape: Prehistoric T-Rex Chase
            </h2>
            <p className="text-xs text-slate-400">
              A monstrous T-Rex is roaring at your heels! Type obstacles to vault lava pits and stay alive!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-amber-400 font-bold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" /> Sprint: <span className="text-white text-sm">{distance}m</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
              Score: <span className="text-white text-sm">{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Jurassic Chase Stage */}
      <div 
        onClick={() => inputRef.current && inputRef.current.focus()}
        className={`relative h-[410px] w-full rounded-3xl overflow-hidden border-2 border-amber-900/50 bg-gradient-to-b from-slate-950 via-[#1c0f06] to-[#0d0702] shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col justify-between p-6 select-none transition-transform ${
          screenRumble ? 'translate-y-1 scale-[0.99] filter contrast-125' : ''
        }`}
      >
        {/* T-Rex Proximity Distance Bar */}
        <div className="relative z-10 max-w-sm bg-slate-950/80 border border-amber-900/50 p-2.5 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-amber-400">
              🦖 T-Rex Distance Gap
            </span>
            <span className={dinoGap < 10 ? 'text-rose-400 font-black animate-ping' : 'text-emerald-400 font-mono font-bold'}>
              {Math.max(0, Math.round(dinoGap))} meters
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                dinoGap < 10 ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-orange-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (dinoGap / 35) * 100)}%` }}
            />
          </div>
        </div>

        {/* Jurassic Track: T-Rex on Left, Explorer in Middle, Hurdles on Right */}
        <div className="relative flex-1 w-full my-2 flex items-center">
          
          {/* Track Ground Line */}
          <div className="absolute left-0 right-0 bottom-8 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-amber-700 pointer-events-none opacity-40 shadow-[0_0_15px_#f59e0b]" />

          {/* Roaring T-Rex (Left) */}
          <div 
            className="absolute bottom-6 flex flex-col items-center z-10 transition-all duration-300"
            style={{ left: `${Math.max(2, 28 - (dinoGap * 0.75))}%` }}
          >
            <div className="text-6xl sm:text-7xl filter drop-shadow-[0_0_20px_#ef4444] animate-pulse">
              🦖
            </div>
            <span className="text-[10px] font-black uppercase text-rose-400 bg-slate-950/80 px-2 py-0.5 rounded border border-rose-500/30 mt-1">
              Apex Tyrant
            </span>
          </div>

          {/* Prehistoric Explorer Runner (Position: ~30%) */}
          <div className="absolute left-[30%] bottom-6 flex flex-col items-center z-20">
            <div className="text-4xl filter drop-shadow-[0_0_10px_#fbbf24] animate-bounce" style={{ animationDuration: '0.4s' }}>
              🏃‍♂️
            </div>
            <span className="text-[9px] font-black uppercase text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-amber-500/30 mt-0.5">
              Explorer
            </span>
          </div>

          {/* Oncoming Obstacles & Hurdles */}
          {hurdles.map((h) => {
            const isTargeted = h.word.startsWith(currentInput) && currentInput.length > 0;
            return (
              <div
                key={h.id}
                className="absolute bottom-7 flex flex-col items-center transition-all duration-75 z-20 pointer-events-none"
                style={{ left: `${h.x}%` }}
              >
                <div className={`px-2 py-0.5 rounded-lg text-xs font-mono font-black border shadow-lg whitespace-nowrap mb-1 transition-all ${
                  isTargeted 
                    ? 'bg-amber-400 text-slate-950 border-white scale-110 shadow-amber-400/50' 
                    : 'bg-slate-950/90 text-amber-200 border-amber-500/40'
                }`}>
                  <span className="text-emerald-400">{currentInput.slice(0, h.word.length)}</span>
                  <span>{h.word.slice(currentInput.length)}</span>
                </div>
                <div className="text-3xl filter drop-shadow-[0_0_8px_#f59e0b]">
                  🌋
                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom Typing Bar */}
        {gameState === 'playing' && (
          <div className="relative z-20 flex flex-col items-center gap-2 pt-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type hurdle word to vault obstacle and gain speed..."
              className="w-full max-w-md px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-amber-500/60 text-white font-mono text-center text-lg focus:outline-none focus:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] placeholder:text-slate-600"
              autoFocus
            />
            <span className="text-[11px] text-amber-400/80 font-bold">
              Danger: Never let the T-Rex gap reach 0 meters!
            </span>
          </div>
        )}

        {/* BRIEFING MODAL */}
        {gameState === 'briefing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-amber-500/30">
              🦖
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Dino Escape: Prehistoric T-Rex Chase
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
              You are caught in a jurassic volcanic valley! An 8-ton Tyrannosaurus Rex is charging right behind you. Type obstacle words to leap over volcanic craters and sprint toward safety!
            </p>

            <button
              onClick={startGame}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95"
            >
              Start Jurassic Sprint Now
            </button>
          </div>
        )}

        {/* GAME OVER MODAL */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="text-5xl mb-2">🦖</div>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-400">
              The T-Rex Caught Up!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              You sprinted a heroic {distance} meters through the jurassic valley.
            </p>

            <div className="flex gap-4 my-4">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Score</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{score}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Distance Escaped</span>
                <span className="text-2xl font-black text-white font-mono">{distance}m</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Sprint Again
              </button>
              <button
                onClick={onExit}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Exit Game
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
