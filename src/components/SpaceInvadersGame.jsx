import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Shield, 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  Zap, 
  Sparkles, 
  Crosshair,
  Flame,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const ALIEN_WORDS = [
  'star', 'beam', 'laser', 'nova', 'orbit', 'comet', 'alien', 
  'pulse', 'fleet', 'plasma', 'cosmo', 'warp', 'shield', 'titan', 
  'galaxy', 'nebula', 'solaris', 'vortex', 'quasar', 'meteor', 'hyper'
];

export const SpaceInvadersGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'playing' | 'gameover' | 'victory'
  const [aliens, setAliens] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [shipHp, setShipHp] = useState(100);
  const [laserFlash, setLaserFlash] = useState(false);
  const [laserTarget, setLaserTarget] = useState(null);

  const inputRef = useRef(null);

  // Focus input during gameplay
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Start new cosmic game
  const startGame = () => {
    setAliens([]);
    setCurrentInput('');
    setScore(0);
    setWave(1);
    setShipHp(100);
    setGameState('playing');
  };

  // Spawn incoming alien starships
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnDelay = Math.max(1200, 2400 - wave * 250);
    const interval = setInterval(() => {
      setAliens((prev) => {
        if (prev.length >= 7) return prev;
        const randomWord = ALIEN_WORDS[Math.floor(Math.random() * ALIEN_WORDS.length)];
        const alienId = Date.now() + Math.random();
        const randomX = Math.floor(Math.random() * 75) + 12; // 12% to 87% horizontal

        return [
          ...prev,
          {
            id: alienId,
            word: randomWord,
            x: randomX,
            y: 5, // starts at top
            speed: 0.6 + wave * 0.25,
            icon: ['🛸', '👾', '🚀', '🛰️'][Math.floor(Math.random() * 4)]
          }
        ];
      });
    }, spawnDelay);

    return () => clearInterval(interval);
  }, [gameState, wave]);

  // Movement loop: Aliens descend towards player's starship
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      setAliens((prev) => {
        const nextAliens = [];
        let hitShip = false;

        prev.forEach((alien) => {
          const nextY = alien.y + alien.speed;
          if (nextY >= 88) {
            // Reached Earth Defender starship!
            hitShip = true;
          } else {
            nextAliens.push({ ...alien, y: nextY });
          }
        });

        if (hitShip) {
          playErrorSound(volume);
          setShipHp((hp) => {
            const nextHp = hp - 20;
            if (nextHp <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextHp;
          });
        }

        return nextAliens;
      });
    }, 70);

    return () => clearInterval(loop);
  }, [gameState, volume]);

  // Handle typing lasers
  const handleInputChange = (e) => {
    if (gameState !== 'playing') return;

    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(e.target.value);
    playKeySound(soundProfile, volume);

    // Check if typed word matches any descending alien
    const matchIdx = aliens.findIndex((a) => a.word === val);

    if (matchIdx !== -1) {
      const target = aliens[matchIdx];

      // Laser shot visual
      setLaserFlash(true);
      setLaserTarget({ x: target.x, y: target.y });
      playNitroSound(volume);
      setTimeout(() => setLaserFlash(false), 200);

      // Score and XP
      setScore((s) => s + target.word.length * 15);
      if (onAddXp) onAddXp(target.word.length * 2);

      // Remove alien
      setAliens((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setCurrentInput('');

      // Wave advancement
      setScore((s) => {
        if (s > wave * 350) {
          setWave((w) => w + 1);
          playSuccessChime(volume);
        }
        return s;
      });
    }
  };

  return (
    <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-[0_0_40px_rgba(6,182,212,0.2)] font-mono text-cyan-400 space-y-4 relative overflow-hidden">
      
      {/* Starfield Background Animation */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 text-xs relative z-10">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Space Armada
        </button>

        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-black tracking-widest text-white uppercase">
            Galaxy Defender: Space Armada
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500" /> Shield: {shipHp}%
          </span>
          <span className="text-amber-400 font-mono">Score: {score}</span>
          <span className="text-cyan-300">Wave: {wave}</span>
        </div>
      </div>

      {/* COSMIC BATTLEFIELD CANVAS */}
      <div className="relative h-80 sm:h-96 bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950/30 rounded-2xl border-2 border-cyan-500/30 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        
        {/* Descending Alien Starships */}
        {aliens.map((alien) => {
          const isTargetPrefix = currentInput.trim() && alien.word.startsWith(currentInput.trim().toLowerCase());
          return (
            <div
              key={alien.id}
              className={`absolute transition-all duration-75 flex flex-col items-center ${
                isTargetPrefix ? 'scale-125 z-20' : 'z-10'
              }`}
              style={{
                left: `${alien.x}%`,
                top: `${alien.y}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                {alien.icon}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-black tracking-wider uppercase mt-0.5 ${
                isTargetPrefix
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_#22d3ee] animate-pulse'
                  : 'bg-slate-900/90 text-cyan-300 border border-cyan-500/40'
              }`}>
                {alien.word}
              </span>
            </div>
          );
        })}

        {/* Laser Beam Flash Animation */}
        {laserFlash && laserTarget && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            <line
              x1="50%"
              y1="90%"
              x2={`${laserTarget.x}%`}
              y2={`${laserTarget.y}%`}
              stroke="#22d3ee"
              strokeWidth="4"
              strokeDasharray="8 4"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* Earth Defender Starfighter at Bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div className="text-4xl sm:text-5xl filter drop-shadow-[0_0_15px_#38bdf8] animate-bounce">
            🚀
          </div>
          <span className="text-[9px] uppercase font-black tracking-widest text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
            Earth Defender Starfighter
          </span>
        </div>

        {/* Danger Boundary Line */}
        <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-60 border-t border-dashed border-rose-500/50" />

        {/* Briefing / Game Over Overlays */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {gameState === 'gameover' ? (
              <div className="space-y-3 animate-pop">
                <span className="text-4xl">💥</span>
                <h3 className="text-2xl sm:text-3xl font-black text-rose-500">STARFIGHTER DESTROYED!</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Alien armada broke through Earth's orbital perimeter. You reached Wave {wave} with a score of <strong className="text-white font-mono">{score}</strong>.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_15px_#06b6d4]"
                  >
                    <RotateCcw className="w-4 h-4" /> Launch Again
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
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
                  <Rocket className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white">Galaxy Defender: Space Invaders</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Alien formations are descending into Earth's orbit! Type the target word of each ship to fire dual plasma laser cannons before they crash into your starfighter!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-[0_0_20px_#06b6d4] active:scale-95 transition-all"
                >
                  <Rocket className="w-4 h-4" /> Engage Alien Armada
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Laser Targeting Command Input */}
      <div className="relative z-10 space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Plasma Cannon Laser Targeting
        </label>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          disabled={gameState !== 'playing'}
          placeholder={gameState === 'playing' ? "Type alien starship words to fire plasma lasers..." : "Armada in hyperspace"}
          className="w-full bg-slate-900 border-2 border-cyan-500/50 rounded-xl px-4 py-3 font-mono text-base text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 shadow-inner"
        />
      </div>

    </div>
  );
};
