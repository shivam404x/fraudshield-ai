import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  RotateCcw, 
  ArrowLeft, 
  Crosshair, 
  Trophy, 
  Waves, 
  Volume2, 
  Radio,
  Gauge
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const SONAR_WORDS = [
  'ping', 'dive', 'depth', 'sonar', 'torpedo', 'abyss', 'trench', 
  'hull', 'oxygen', 'kraken', 'anchor', 'sub', 'current', 'pressure', 
  'fathom', 'nautilus', 'ballast', 'beacon', 'marina', 'vortex', 'periscope'
];

export const SubmarineSonarGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'playing' | 'gameover'
  const [hullHp, setHullHp] = useState(100);
  const [depth, setDepth] = useState(300); // in meters
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]); // { id, word, angle, distance (100% to 20%), speed, type }
  const [currentInput, setCurrentInput] = useState('');
  const [torpedoImpact, setTorpedoImpact] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setTargets([]);
    setCurrentInput('');
    setScore(0);
    setDepth(300);
    setHullHp(100);
    setGameState('playing');
  };

  // Spawn incoming aquatic targets around the 360-degree sonar radar
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= 5) return prev;
        const types = ['kraken', 'mine', 'angler', 'ghost'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const word = SONAR_WORDS[Math.floor(Math.random() * SONAR_WORDS.length)];

        if (prev.some((t) => t.word === word)) return prev;

        // Position on 2D plane: angle in radians (0 to 2pi), distance from center (100 to 20)
        const angle = Math.random() * Math.PI * 2;
        const newTarget = {
          id: Date.now() + Math.random(),
          word,
          angle,
          dist: 90, // from center 90% out towards 15%
          speed: 0.25 + (depth / 1000) * 0.1,
          type: randomType
        };
        return [...prev, newTarget];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [gameState, depth]);

  // Sonar radar loop: targets move toward center (sub position)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      setTargets((prev) => {
        let hullDamage = 0;
        const remaining = [];

        prev.forEach((tgt) => {
          const nextDist = tgt.dist - tgt.speed;
          if (nextDist <= 18) {
            // Reached submarine center!
            hullDamage += tgt.type === 'mine' ? 25 : 15;
            playErrorSound(soundProfile, volume);
          } else {
            remaining.push({ ...tgt, dist: nextDist });
          }
        });

        if (hullDamage > 0) {
          setHullHp((h) => {
            const nextHp = Math.max(0, h - hullDamage);
            if (nextHp <= 0) setGameState('gameover');
            return nextHp;
          });
        }

        return remaining;
      });

      // Increase depth slowly
      setDepth((d) => d + 1);
    }, 50);

    return () => clearInterval(loop);
  }, [gameState, soundProfile, volume]);

  // Handle typing input
  const handleInputChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(val);
    playKeySound(soundProfile, volume);

    const matched = targets.find((t) => t.word.toLowerCase() === val);
    if (matched) {
      playNitroSound(volume);

      setTorpedoImpact({
        x: 50 + (matched.dist * Math.cos(matched.angle)) * 0.42,
        y: 50 + (matched.dist * Math.sin(matched.angle)) * 0.42,
        id: Date.now()
      });
      setTimeout(() => setTorpedoImpact(null), 500);

      setTargets((prev) => prev.filter((t) => t.id !== matched.id));
      setCurrentInput('');

      setScore((s) => s + 120);
      playSuccessChime(volume);
    }
  };

  useEffect(() => {
    if (gameState === 'gameover' && score > 300) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
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
            <h2 className="text-base sm:text-lg font-black text-cyan-400 flex items-center gap-2">
              🌊 Abyss Submarine: Sonar Torpedo
            </h2>
            <p className="text-xs text-slate-400">
              Lock onto abyssal sonar signatures and launch acoustic homing torpedoes!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-cyan-900/50 text-cyan-400 font-bold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" /> Depth: <span className="text-white text-sm">{depth}m</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
              Score: <span className="text-white text-sm">{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Radar Display Box */}
      <div 
        onClick={() => inputRef.current && inputRef.current.focus()}
        className="relative h-[420px] w-full rounded-3xl overflow-hidden border-2 border-cyan-800/60 bg-gradient-to-b from-slate-950 via-[#031525] to-[#010912] shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col justify-between p-6 select-none"
      >
        {/* Submarine Hull Integrity */}
        <div className="relative z-10 max-w-xs bg-slate-950/80 border border-cyan-900/50 p-2.5 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Compass className="w-4 h-4 text-cyan-400" /> Submarine Hull Integrity
            </span>
            <span className={hullHp > 40 ? 'text-cyan-300 font-bold' : 'text-rose-400 font-black animate-pulse'}>
              {hullHp}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                hullHp > 40 ? 'bg-gradient-to-r from-cyan-500 to-sky-400' : 'bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse'
              }`}
              style={{ width: `${hullHp}%` }}
            />
          </div>
        </div>

        {/* Circular Radar Visual Field */}
        <div className="relative flex-1 w-full flex items-center justify-center my-2">
          
          {/* Radar Circles */}
          <div className="absolute w-72 h-72 rounded-full border border-cyan-500/20 pointer-events-none" />
          <div className="absolute w-52 h-52 rounded-full border border-cyan-500/30 pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full border border-cyan-500/40 pointer-events-none" />
          <div className="absolute w-72 h-[1px] bg-cyan-500/20 pointer-events-none" />
          <div className="absolute h-72 w-[1px] bg-cyan-500/20 pointer-events-none" />

          {/* Sweeping Radar Line */}
          <div className="absolute w-72 h-72 rounded-full pointer-events-none animate-spin" style={{ animationDuration: '4s' }}>
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/20 to-transparent origin-bottom-right rounded-tl-full" />
          </div>

          {/* Center Submarine Icon */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-xl shadow-[0_0_20px_#06b6d4]">
            🚢
          </div>

          {/* Sonar Contacts */}
          {targets.map((tgt) => {
            // Convert polar to Cartesian %
            const posX = 50 + (tgt.dist * Math.cos(tgt.angle)) * 0.42;
            const posY = 50 + (tgt.dist * Math.sin(tgt.angle)) * 0.42;
            const isTargeted = tgt.word.startsWith(currentInput) && currentInput.length > 0;

            return (
              <div
                key={tgt.id}
                className="absolute flex flex-col items-center transition-all duration-75 z-20"
                style={{ left: `${posX}%`, top: `${posY}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className={`px-2 py-0.5 rounded-lg text-xs font-mono font-black border shadow-lg whitespace-nowrap mb-0.5 transition-all ${
                  isTargeted 
                    ? 'bg-cyan-400 text-slate-950 border-white scale-110 shadow-cyan-400/50' 
                    : 'bg-slate-950/90 text-cyan-200 border-cyan-500/40'
                }`}>
                  <span className="text-emerald-400">{currentInput.slice(0, tgt.word.length)}</span>
                  <span>{tgt.word.slice(currentInput.length)}</span>
                </div>

                <div className="text-2xl filter drop-shadow-[0_0_8px_#06b6d4]">
                  {tgt.type === 'kraken' ? '🐙' : tgt.type === 'mine' ? '💣' : tgt.type === 'angler' ? '🐡' : '⚓'}
                </div>
              </div>
            );
          })}

          {/* Torpedo Impact */}
          {torpedoImpact && (
            <div 
              className="absolute text-4xl animate-ping z-30 pointer-events-none"
              style={{ left: `${torpedoImpact.x}%`, top: `${torpedoImpact.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              🫧💥
            </div>
          )}

        </div>

        {/* Bottom Typing Bar */}
        {gameState === 'playing' && (
          <div className="relative z-20 flex flex-col items-center gap-2 pt-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type sonar target word to launch torpedo..."
              className="w-full max-w-md px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/60 text-white font-mono text-center text-lg focus:outline-none focus:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] placeholder:text-slate-600"
              autoFocus
            />
            <span className="text-[11px] text-cyan-400/80 font-bold">
              Sonar Alert: Destroy drifting magnetic mines before they contact the hull!
            </span>
          </div>
        )}

        {/* BRIEFING MODAL */}
        {gameState === 'briefing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-cyan-500/30">
              🌊
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Abyss Submarine: Sonar Torpedo
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
              Descend into the crushing darkness of the Mariana Trench. Read acoustic sonar echoes and type target words to launch acoustic cavitation torpedoes!
            </p>

            <button
              onClick={startGame}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
            >
              Initiate Sonar Dive Now
            </button>
          </div>
        )}

        {/* GAME OVER MODAL */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="text-5xl mb-2">💥</div>
            <h3 className="text-2xl sm:text-3xl font-black text-cyan-300">
              Submarine Hull Compromised!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Final Depth Achieved: {depth} meters below surface.
            </p>

            <div className="flex gap-4 my-4">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Score</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">{score}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Depth Survived</span>
                <span className="text-2xl font-black text-white font-mono">{depth}m</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Dive Again
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
