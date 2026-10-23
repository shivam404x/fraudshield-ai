import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Flame, 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Shield, 
  Gauge,
  Sparkles,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const RUNNER_WORDS = [
  'dash', 'sprint', 'jump', 'slide', 'boost', 'vault', 'leap', 
  'dodge', 'speed', 'turbo', 'surge', 'hyper', 'pulse', 'shift', 
  'glide', 'reflex', 'sonic', 'blitz', 'overdrive', 'velocity'
];

export const CyberRunnerGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('intro'); // 'intro' | 'running' | 'gameover'
  const [distance, setDistance] = useState(0); // in meters
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [hurdles, setHurdles] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [lives, setLives] = useState(3);
  const [runnerLane, setRunnerLane] = useState(1); // 0 (left), 1 (mid), 2 (right)

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'running' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setDistance(0);
    setSpeedMultiplier(1);
    setHurdles([]);
    setCurrentInput('');
    setLives(3);
    setRunnerLane(1);
    setGameState('running');
  };

  // Distance ticker & speed ramp
  useEffect(() => {
    if (gameState !== 'running') return;

    const ticker = setInterval(() => {
      setDistance((d) => d + Math.round(5 * speedMultiplier));
      setSpeedMultiplier((s) => Math.min(2.5, s + 0.01));
    }, 150);

    return () => clearInterval(ticker);
  }, [gameState, speedMultiplier]);

  // Hurdles spawner across 3 lanes
  useEffect(() => {
    if (gameState !== 'running') return;

    const spawner = setInterval(() => {
      setHurdles((prev) => {
        if (prev.length >= 4) return prev;
        const word = RUNNER_WORDS[Math.floor(Math.random() * RUNNER_WORDS.length)];
        const lane = Math.floor(Math.random() * 3); // 0, 1, 2

        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            word: word,
            lane: lane,
            y: 0, // starts at top of lane
            speed: 1.2 * speedMultiplier,
            icon: ['⚡', '🚧', '💥', '🌀'][Math.floor(Math.random() * 4)]
          }
        ];
      });
    }, 1500);

    return () => clearInterval(spawner);
  }, [gameState, speedMultiplier]);

  // Hurdle movement ticker
  useEffect(() => {
    if (gameState !== 'running') return;

    const moveLoop = setInterval(() => {
      setHurdles((prev) => {
        const nextList = [];
        let hit = false;

        prev.forEach((h) => {
          const nextY = h.y + h.speed;
          if (nextY >= 88) {
            // Reached runner line
            hit = true;
          } else {
            nextList.push({ ...h, y: nextY });
          }
        });

        if (hit) {
          playErrorSound(volume);
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
    }, 50);

    return () => clearInterval(moveLoop);
  }, [gameState, speedMultiplier, volume]);

  // Handle typing hurdle words
  const handleInputChange = (e) => {
    if (gameState !== 'running') return;

    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(e.target.value);
    playKeySound(soundProfile, volume);

    const matchIdx = hurdles.findIndex((h) => h.word === val);

    if (matchIdx !== -1) {
      const cleared = hurdles[matchIdx];

      // Shift runner lane to match cleared hurdle
      setRunnerLane(cleared.lane);
      playNitroSound(volume);

      if (onAddXp) onAddXp(cleared.word.length * 2);

      // Remove hurdle
      setHurdles((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setCurrentInput('');
    }
  };

  const lanePositions = ['16%', '50%', '84%'];

  return (
    <div className="bg-slate-950 border-2 border-yellow-500/40 rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl relative overflow-hidden font-mono space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/30 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-yellow-400 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Runner
        </button>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="font-black text-white uppercase tracking-wider">
            Neon Cyber Runner: Endless Dash
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500" /> Lives: {lives}
          </span>
          <span className="text-yellow-400 font-mono">Distance: {distance}m</span>
          <span className="text-cyan-300 font-mono">{speedMultiplier.toFixed(1)}x Speed</span>
        </div>
      </div>

      {/* 3-LANE 3D RUNWAY CANVAS */}
      <div className="relative h-80 sm:h-96 bg-gradient-to-b from-slate-950 via-slate-900 to-yellow-950/20 rounded-2xl border-2 border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        
        {/* 3 Lane Dividers */}
        <div className="absolute top-0 bottom-0 left-1/3 w-0.5 border-r border-dashed border-slate-800 opacity-60" />
        <div className="absolute top-0 bottom-0 left-2/3 w-0.5 border-r border-dashed border-slate-800 opacity-60" />

        {/* Hurdles coming down the lanes */}
        {hurdles.map((h) => {
          const isTargetPrefix = currentInput.trim() && h.word.startsWith(currentInput.trim().toLowerCase());
          return (
            <div
              key={h.id}
              className={`absolute transition-all duration-75 flex flex-col items-center ${
                isTargetPrefix ? 'scale-125 z-20' : 'z-10'
              }`}
              style={{
                left: lanePositions[h.lane],
                top: `${h.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
                {h.icon}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-black tracking-wider uppercase mt-0.5 ${
                isTargetPrefix
                  ? 'bg-yellow-400 text-slate-950 shadow-[0_0_15px_#facc15] animate-pulse'
                  : 'bg-slate-900/90 text-yellow-300 border border-yellow-500/40'
              }`}>
                {h.word}
              </span>
            </div>
          );
        })}

        {/* Cyber Runner Character in Active Lane */}
        <div 
          className="absolute bottom-4 flex flex-col items-center z-20 transition-all duration-200"
          style={{
            left: lanePositions[runnerLane],
            transform: 'translateX(-50%)'
          }}
        >
          <span className="text-4xl filter drop-shadow-[0_0_15px_#facc15] animate-bounce">
            🏃‍♂️
          </span>
          <span className="text-[9px] uppercase font-black tracking-widest text-yellow-300 bg-slate-950/80 px-2 py-0.5 rounded border border-yellow-500/40">
            Speed Runner
          </span>
        </div>

        {/* Danger Threshold Line */}
        <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-60 border-t border-dashed border-rose-500/50" />

        {/* Intro / Game Over Overlays */}
        {gameState !== 'playing' && gameState !== 'running' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {gameState === 'gameover' ? (
              <div className="space-y-3 animate-pop">
                <span className="text-4xl">💥</span>
                <h3 className="text-3xl font-black text-rose-500">RUNNER CRASHED!</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  You collided with a neon laser hurdle. Final sprint distance: <strong className="text-white font-mono">{distance} meters</strong>.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_15px_#eab308]"
                  >
                    <RotateCcw className="w-4 h-4" /> Dash Again
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
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto border border-yellow-500/40">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white">Neon Cyber Runner: Endless Dash</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sprint down a high-velocity 3-lane neon highway! Type the words on incoming obstacles to clear them and switch lanes before you crash!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-lg shadow-yellow-500/30 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" /> Start Sprinting
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Runner Input Box */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> Dash Command Input
        </label>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          disabled={gameState !== 'running'}
          placeholder={gameState === 'running' ? "Type lane hurdle words to dash and leap..." : "At the starting line"}
          className="w-full bg-slate-900 border-2 border-yellow-500/50 rounded-xl px-4 py-3 font-mono text-base text-yellow-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/30 shadow-inner"
        />
      </div>

    </div>
  );
};
