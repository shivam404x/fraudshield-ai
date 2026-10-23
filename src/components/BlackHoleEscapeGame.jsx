import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  RotateCcw, 
  ArrowLeft, 
  Zap, 
  Trophy, 
  Sparkles, 
  Compass, 
  Radio,
  Gauge
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const COSMIC_WORDS = [
  'void', 'graviton', 'quasar', 'orbit', 'plasma', 'singularity', 
  'pulsar', 'horizon', 'warp', 'nebula', 'quantum', 'thrust', 
  'vector', 'hyper', 'gravity', 'velocity', 'particle', 'relativity', 'photon'
];

export const BlackHoleEscapeGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'playing' | 'gameover'
  const [shipDist, setShipDist] = useState(70); // from center singularity (0 to 100%). Game over at <= 10%
  const [gravityPull, setGravityPull] = useState(0.2);
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]); // orbital plasma words
  const [currentInput, setCurrentInput] = useState('');
  const [thrusterBurst, setThrusterBurst] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setTargets([]);
    setCurrentInput('');
    setShipDist(70);
    setGravityPull(0.2);
    setScore(0);
    setGameState('playing');
  };

  // Orbital word spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= 4) return prev;
        const word = COSMIC_WORDS[Math.floor(Math.random() * COSMIC_WORDS.length)];
        if (prev.some((t) => t.word === word)) return prev;

        const angle = Math.random() * Math.PI * 2;
        const newTarget = {
          id: Date.now() + Math.random(),
          word,
          angle,
          dist: 50 + Math.random() * 35
        };
        return [...prev, newTarget];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [gameState]);

  // Gravitational pull loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      setShipDist((dist) => {
        const next = dist - gravityPull;
        if (next <= 12) {
          setGameState('gameover');
          return 0;
        }
        return next;
      });

      // Slowly increase black hole gravitational pull
      setGravityPull((g) => Math.min(0.65, g + 0.001));
    }, 50);

    return () => clearInterval(loop);
  }, [gameState, gravityPull]);

  // Handle typing input
  const handleInputChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(val);
    playKeySound(soundProfile, volume);

    const matched = targets.find((t) => t.word.toLowerCase() === val);
    if (matched) {
      playNitroSound(volume);
      setThrusterBurst(true);
      setTimeout(() => setThrusterBurst(false), 400);

      // Rocket boosts away from the singularity!
      setShipDist((d) => Math.min(88, d + 14));
      setTargets((prev) => prev.filter((t) => t.id !== matched.id));
      setCurrentInput('');

      setScore((s) => s + 120);
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
            <h2 className="text-base sm:text-lg font-black text-purple-400 flex items-center gap-2">
              🌌 Black Hole Gravity: Singularity Escape
            </h2>
            <p className="text-xs text-slate-400">
              Type orbital escape velocity coordinates to boost ion engines away from the event horizon!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-purple-900/50 text-purple-400 font-bold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" /> Orbit Radius: <span className="text-white text-sm">{Math.round(shipDist)} AU</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
              Score: <span className="text-white text-sm">{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Singularity Gravitational Well Box */}
      <div 
        onClick={() => inputRef.current && inputRef.current.focus()}
        className="relative h-[430px] w-full rounded-3xl overflow-hidden border-2 border-purple-800/60 bg-gradient-to-b from-slate-950 via-[#10031d] to-[#040008] shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col justify-between p-6 select-none"
      >
        {/* Event Horizon Danger Gauge */}
        <div className="relative z-10 max-w-sm bg-slate-950/80 border border-purple-900/50 p-2.5 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-purple-400">
              🌀 Event Horizon Proximity
            </span>
            <span className={shipDist < 30 ? 'text-rose-400 font-black animate-ping' : 'text-purple-300 font-mono font-bold'}>
              {Math.max(0, Math.round(shipDist))}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                shipDist < 30 ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-purple-500 to-cyan-400'
              }`}
              style={{ width: `${shipDist}%` }}
            />
          </div>
        </div>

        {/* Central Singularity & Orbit Simulation */}
        <div className="relative flex-1 w-full flex items-center justify-center my-2">
          
          {/* Gravitational Accretion Disk Ring Waves */}
          <div className="absolute w-80 h-80 rounded-full border border-purple-500/20 pointer-events-none animate-pulse" />
          <div className="absolute w-56 h-56 rounded-full border border-purple-500/30 pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full border-2 border-rose-500/40 pointer-events-none animate-ping" style={{ animationDuration: '3s' }} />

          {/* Central Black Hole Singularity */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-black border-4 border-purple-500/80 shadow-[0_0_50px_#a855f7] flex items-center justify-center">
            <div className="text-3xl animate-spin" style={{ animationDuration: '8s' }}>
              🌀
            </div>
          </div>

          {/* Player Starship positioned at shipDist % from center */}
          <div 
            className={`absolute z-20 flex flex-col items-center transition-all duration-300 ${
              thrusterBurst ? 'scale-125 filter drop-shadow-[0_0_20px_#22d3ee]' : ''
            }`}
            style={{ 
              top: '50%',
              left: `${50 + (shipDist * 0.42)}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className="text-3xl filter drop-shadow-[0_0_12px_#38bdf8] rotate-90">
              🚀
            </div>
            {thrusterBurst && (
              <div className="text-lg animate-ping absolute -left-4">
                🔥
              </div>
            )}
            <span className="text-[9px] font-black uppercase text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30 mt-1">
              Your Ship
            </span>
          </div>

          {/* Orbital Targets */}
          {targets.map((tgt) => {
            const posX = 50 + (tgt.dist * Math.cos(tgt.angle)) * 0.42;
            const posY = 50 + (tgt.dist * Math.sin(tgt.angle)) * 0.42;
            const isTargeted = tgt.word.startsWith(currentInput) && currentInput.length > 0;

            return (
              <div
                key={tgt.id}
                className="absolute flex flex-col items-center transition-all duration-75 z-20 pointer-events-none"
                style={{ left: `${posX}%`, top: `${posY}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className={`px-2 py-0.5 rounded-lg text-xs font-mono font-black border shadow-lg whitespace-nowrap mb-0.5 transition-all ${
                  isTargeted 
                    ? 'bg-purple-400 text-slate-950 border-white scale-110 shadow-purple-400/50' 
                    : 'bg-slate-950/90 text-purple-200 border-purple-500/40'
                }`}>
                  <span className="text-emerald-400">{currentInput.slice(0, tgt.word.length)}</span>
                  <span>{tgt.word.slice(currentInput.length)}</span>
                </div>
                <div className="text-xl filter drop-shadow-[0_0_8px_#c084fc]">
                  ⚡
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
              placeholder="Type orbital coordinate word to fire thrusters..."
              className="w-full max-w-md px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-purple-500/60 text-white font-mono text-center text-lg focus:outline-none focus:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] placeholder:text-slate-600"
              autoFocus
            />
            <span className="text-[11px] text-purple-400/80 font-bold">
              Warning: Gravitational tidal forces increase the longer you remain in orbit!
            </span>
          </div>
        )}

        {/* BRIEFING MODAL */}
        {gameState === 'briefing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-purple-500/30">
              🌌
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Black Hole Gravity: Singularity Escape
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
              Your starship is caught in the relativistic gravitational pull of a supermassive black hole. Type orbital escape velocity keywords to fire ion plasma thrusters and avoid the event horizon!
            </p>

            <button
              onClick={startGame}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/30 transition-all active:scale-95"
            >
              Engage Orbital Thrusters
            </button>
          </div>
        )}

        {/* GAME OVER MODAL */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="text-5xl mb-2">🌀</div>
            <h3 className="text-2xl sm:text-3xl font-black text-purple-300">
              Crossed the Event Horizon!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your ship was pulled into the cosmic singularity.
            </p>

            <div className="flex gap-4 my-4">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Score</span>
                <span className="text-2xl font-black text-purple-400 font-mono">{score}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Gravity Survived</span>
                <span className="text-2xl font-black text-white font-mono">{(gravityPull * 10).toFixed(1)}G</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Try Escape Again
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
