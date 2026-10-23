import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Flame, 
  RotateCcw, 
  ArrowLeft, 
  Crosshair, 
  Trophy, 
  Sparkles, 
  Heart,
  Volume2,
  Hammer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const SIEGE_WORDS = [
  'ram', 'iron', 'gate', 'fire', 'siege', 'wall', 'flame', 'arrow', 
  'knight', 'armor', 'shield', 'tower', 'boulder', 'catapult', 'trebuchet', 
  'ballista', 'fortress', 'bastion', 'parapet', 'crossbow', 'garrison', 'defend'
];

export const CatapultSiegeGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'playing' | 'gameover'
  const [wallHp, setWallHp] = useState(100);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [enemies, setEnemies] = useState([]); // { id, word, x (from left 85% towards 15%), speed, type: 'ram'|'ladder'|'catapult' }
  const [currentInput, setCurrentInput] = useState('');
  const [catapultFiring, setCatapultFiring] = useState(false);
  const [impactExplosion, setImpactExplosion] = useState(null); // { x, y }

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Start or restart game
  const startGame = () => {
    setEnemies([]);
    setCurrentInput('');
    setScore(0);
    setWave(1);
    setWallHp(100);
    setGameState('playing');
  };

  // Spawn incoming siege war machines
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setEnemies((prev) => {
        if (prev.length >= 5) return prev;
        const types = ['ram', 'ladder', 'catapult'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const word = SIEGE_WORDS[Math.floor(Math.random() * SIEGE_WORDS.length)];
        
        // Prevent duplicate word on screen
        if (prev.some((e) => e.word === word)) return prev;

        const newEnemy = {
          id: Date.now() + Math.random(),
          word,
          x: 90, // starts at right 90%
          speed: 0.15 + wave * 0.05 + (randomType === 'ladder' ? 0.08 : 0),
          type: randomType,
          hp: 1
        };
        return [...prev, newEnemy];
      });
    }, Math.max(1600, 3200 - wave * 250));

    return () => clearInterval(interval);
  }, [gameState, wave]);

  // Game loop: advance enemies toward castle wall (x = 18%)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      setEnemies((prev) => {
        let wallDamaged = 0;
        const remaining = [];

        prev.forEach((enemy) => {
          const nextX = enemy.x - enemy.speed;
          if (nextX <= 18) {
            // Reached castle wall!
            wallDamaged += enemy.type === 'ram' ? 20 : 12;
            playErrorSound(soundProfile, volume);
          } else {
            remaining.push({ ...enemy, x: nextX });
          }
        });

        if (wallDamaged > 0) {
          setWallHp((curr) => {
            const next = Math.max(0, curr - wallDamaged);
            if (next <= 0) {
              setGameState('gameover');
            }
            return next;
          });
        }

        return remaining;
      });
    }, 50);

    return () => clearInterval(loop);
  }, [gameState, soundProfile, volume]);

  // Handle typing input
  const handleInputChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(val);
    playKeySound(soundProfile, volume);

    // Check if matches any enemy word
    const matched = enemies.find((en) => en.word.toLowerCase() === val);
    if (matched) {
      // Fire catapult boulder!
      setCatapultFiring(true);
      setTimeout(() => setCatapultFiring(false), 350);

      setImpactExplosion({ x: matched.x, id: Date.now() });
      setTimeout(() => setImpactExplosion(null), 600);

      playNitroSound(volume);

      setEnemies((prev) => prev.filter((en) => en.id !== matched.id));
      setCurrentInput('');
      
      const points = matched.type === 'ram' ? 150 : 100;
      setScore((s) => {
        const nextScore = s + points;
        if (nextScore >= wave * 600) {
          setWave((w) => w + 1);
          playSuccessChime(volume);
          // Wall repair bonus
          setWallHp((hp) => Math.min(100, hp + 15));
        }
        return nextScore;
      });
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
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
              🏰 Castle Siege: Catapult Defense
            </h2>
            <p className="text-xs text-slate-400">
              Type siege words to launch fiery catapult boulders and protect your citadel!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-amber-400 font-bold">
              Wave: <span className="text-white text-sm">{wave}</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
              Score: <span className="text-white text-sm">{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Battlefield Stage */}
      <div 
        onClick={() => inputRef.current && inputRef.current.focus()}
        className="relative h-96 w-full rounded-3xl overflow-hidden border-2 border-amber-900/50 bg-gradient-to-b from-slate-950 via-amber-950/20 to-stone-900 shadow-2xl flex flex-col justify-between p-6 select-none"
      >
        {/* Castle Wall HP Bar */}
        <div className="relative z-10 max-w-xs bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Shield className="w-4 h-4 fill-amber-500/20" /> Castle Fortress Gate
            </span>
            <span className={wallHp > 40 ? 'text-emerald-400' : 'text-rose-400 font-black'}>
              {wallHp}% HP
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                wallHp > 50 ? 'bg-gradient-to-r from-emerald-500 to-amber-500' : 'bg-gradient-to-r from-orange-500 to-rose-600 animate-pulse'
              }`}
              style={{ width: `${wallHp}%` }}
            />
          </div>
        </div>

        {/* Battlefield Area: Castle Wall on Left (15%), Field in Middle, Enemies advancing from Right */}
        <div className="relative flex-1 w-full mt-4">
          
          {/* Castle Rampart graphic (Left) */}
          <div className="absolute left-0 bottom-0 top-0 w-24 sm:w-32 bg-stone-800/90 border-r-4 border-stone-600 rounded-r-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between items-center py-4 z-10">
            <div className="text-2xl">🚩</div>
            
            {/* Animated Catapult Trebuchet */}
            <div className={`transition-transform duration-300 ${catapultFiring ? '-rotate-45 scale-110' : 'rotate-0'}`}>
              <div className="text-4xl filter drop-shadow-[0_0_10px_#f59e0b]">
                🪵
              </div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block text-center mt-1">
                Catapult
              </span>
            </div>

            <div className="text-3xl">🛡️</div>
          </div>

          {/* Enemies marching from right to left */}
          {enemies.map((enemy) => {
            const isTargeted = enemy.word.startsWith(currentInput) && currentInput.length > 0;
            return (
              <div
                key={enemy.id}
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-75 z-20"
                style={{ left: `${enemy.x}%` }}
              >
                {/* Word Label */}
                <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border shadow-lg whitespace-nowrap mb-1.5 transition-all ${
                  isTargeted 
                    ? 'bg-amber-500 text-slate-950 border-amber-300 scale-110 shadow-amber-500/50' 
                    : 'bg-slate-900/90 text-amber-200 border-amber-500/40'
                }`}>
                  <span className="text-emerald-400 font-extrabold">{currentInput.slice(0, enemy.word.length)}</span>
                  <span>{enemy.word.slice(currentInput.length)}</span>
                </div>

                {/* Machine Graphic */}
                <div className="text-4xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] animate-bounce" style={{ animationDuration: '0.8s' }}>
                  {enemy.type === 'ram' ? '🐗' : enemy.type === 'catapult' ? '🎯' : '🪜'}
                </div>

                <span className="text-[9px] font-black uppercase text-amber-400/80 bg-slate-950/80 px-1.5 py-0.5 rounded mt-0.5 border border-amber-500/20">
                  {enemy.type === 'ram' ? 'Battering Ram' : enemy.type === 'catapult' ? 'Siege Engine' : 'Ladder Troop'}
                </span>
              </div>
            );
          })}

          {/* Impact Explosion */}
          {impactExplosion && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 text-5xl animate-ping z-30 pointer-events-none"
              style={{ left: `${impactExplosion.x}%` }}
            >
              💥🔥
            </div>
          )}

        </div>

        {/* Bottom Typing Bar */}
        {gameState === 'playing' && (
          <div className="relative z-20 flex flex-col items-center gap-2 pt-2">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type word to launch catapult boulder..."
              className="w-full max-w-md px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-amber-500/60 text-white font-mono text-center text-lg focus:outline-none focus:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] placeholder:text-slate-600"
              autoFocus
            />
            <span className="text-[11px] text-amber-400/80 font-bold">
              Tip: Aim for Battering Rams first before they crush the fortress gate!
            </span>
          </div>
        )}

        {/* BRIEFING MODAL */}
        {gameState === 'briefing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-amber-500/30">
              🏰
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Castle Siege: Catapult Defense
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
              Enemy warlords are marching heavy battering rams and siege ladders toward the royal citadel! Type words with speed to load and catapult blazing stone boulders before the gate falls.
            </p>

            <button
              onClick={startGame}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95"
            >
              Defend the Citadel Now
            </button>
          </div>
        )}

        {/* GAME OVER MODAL */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="text-5xl mb-2">🔥</div>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-400">
              Citadel Gates Breached!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your garrison stood bravely through Wave {wave}.
            </p>

            <div className="flex gap-4 my-4">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Score</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{score}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Wave Reached</span>
                <span className="text-2xl font-black text-white font-mono">{wave}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
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
