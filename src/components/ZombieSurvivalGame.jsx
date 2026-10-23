import React, { useState, useEffect, useRef } from 'react';
import { 
  Skull, 
  ShieldAlert, 
  Flame, 
  RotateCcw, 
  ArrowLeft, 
  Crosshair, 
  Trophy,
  Zap,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const ZOMBIE_WORDS = [
  'bite', 'claw', 'grave', 'undead', 'blood', 'flesh', 'virus', 
  'stalk', 'brains', 'toxic', 'horde', 'decay', 'zombie', 'mutant', 
  'shadow', 'terror', 'crawler', 'outbreak', 'quarantine', 'hunter'
];

export const ZombieSurvivalGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'playing' | 'gameover'
  const [zombies, setZombies] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [barricadeHp, setBarricadeHp] = useState(100);
  const [gunFlash, setGunFlash] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setZombies([]);
    setCurrentInput('');
    setScore(0);
    setWave(1);
    setBarricadeHp(100);
    setGameState('playing');
  };

  // Zombie Spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnDelay = Math.max(1300, 2600 - wave * 250);
    const interval = setInterval(() => {
      setZombies((prev) => {
        if (prev.length >= 6) return prev;
        const word = ZOMBIE_WORDS[Math.floor(Math.random() * ZOMBIE_WORDS.length)];
        const randomX = Math.floor(Math.random() * 70) + 15;
        const type = Math.random() > 0.7 ? 'runner' : 'walker';

        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            word: word,
            x: randomX,
            y: 5,
            speed: (type === 'runner' ? 0.9 : 0.5) + wave * 0.2,
            icon: type === 'runner' ? '🧟‍♂️' : '🧟'
          }
        ];
      });
    }, spawnDelay);

    return () => clearInterval(interval);
  }, [gameState, wave]);

  // Movement ticker
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveLoop = setInterval(() => {
      setZombies((prev) => {
        const nextList = [];
        let breach = false;

        prev.forEach((z) => {
          const nextY = z.y + z.speed;
          if (nextY >= 86) {
            breach = true;
          } else {
            nextList.push({ ...z, y: nextY });
          }
        });

        if (breach) {
          playErrorSound(volume);
          setBarricadeHp((hp) => {
            const nextHp = hp - 18;
            if (nextHp <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextHp;
          });
        }

        return nextList;
      });
    }, 70);

    return () => clearInterval(moveLoop);
  }, [gameState, volume]);

  // Handle typing shots
  const handleInputChange = (e) => {
    if (gameState !== 'playing') return;

    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(e.target.value);
    playKeySound(soundProfile, volume);

    const matchIdx = zombies.findIndex((z) => z.word === val);

    if (matchIdx !== -1) {
      const neutralized = zombies[matchIdx];

      // Gunshot flash
      setGunFlash(true);
      playNitroSound(volume);
      setTimeout(() => setGunFlash(false), 150);

      setScore((s) => s + neutralized.word.length * 15);
      if (onAddXp) onAddXp(neutralized.word.length * 2);

      setZombies((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setCurrentInput('');

      // Advance wave
      setScore((s) => {
        if (s > wave * 300) {
          setWave((w) => w + 1);
          playSuccessChime(volume);
        }
        return s;
      });
    }
  };

  return (
    <div className="bg-slate-950 border-2 border-emerald-600/40 rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl relative overflow-hidden font-mono space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-600/30 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Outbreak
        </button>

        <div className="flex items-center gap-2">
          <Skull className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-black text-white uppercase tracking-wider">
            Zombie Apocalypse: Barricade Defense
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500" /> Barricade: {barricadeHp}%
          </span>
          <span className="text-amber-400">Score: {score}</span>
          <span className="text-emerald-300">Wave: {wave}</span>
        </div>
      </div>

      {/* BATTLEFIELD NIGHT VIEW */}
      <div className={`relative h-80 sm:h-96 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/20 rounded-2xl border-2 border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner transition-all ${
        gunFlash ? 'ring-4 ring-amber-400/80 bg-amber-950/20' : ''
      }`}>
        
        {/* Shambling Zombies */}
        {zombies.map((zombie) => {
          const isTargetPrefix = currentInput.trim() && zombie.word.startsWith(currentInput.trim().toLowerCase());
          return (
            <div
              key={zombie.id}
              className={`absolute transition-all duration-75 flex flex-col items-center ${
                isTargetPrefix ? 'scale-125 z-20' : 'z-10'
              }`}
              style={{
                left: `${zombie.x}%`,
                top: `${zombie.y}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                {zombie.icon}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-black tracking-wider uppercase mt-0.5 ${
                isTargetPrefix
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_#f59e0b] animate-pulse'
                  : 'bg-slate-900/90 text-emerald-300 border border-emerald-500/40'
              }`}>
                {zombie.word}
              </span>
            </div>
          );
        })}

        {/* Survivor Barricade at Bottom */}
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-6 z-20">
          <span className="text-3xl animate-bounce">🚧</span>
          <div className="text-center">
            <span className="text-4xl filter drop-shadow-[0_0_10px_#34d399]">🔫</span>
            <span className="text-[9px] uppercase font-black tracking-widest text-emerald-300 block">
              Survivor Defense Turret
            </span>
          </div>
          <span className="text-3xl animate-bounce">🚧</span>
        </div>

        {/* Danger Threshold Line */}
        <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-60 border-t border-dashed border-rose-500/50" />

        {/* Briefing / Game Over Overlays */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {gameState === 'gameover' ? (
              <div className="space-y-3 animate-pop">
                <Skull className="w-14 h-14 text-rose-500 mx-auto animate-pulse" />
                <h3 className="text-3xl font-black text-rose-500">BARRICADE OVERRUN!</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  The infected broke through the shelter perimeter. You survived to Wave {wave} with <strong className="text-white font-mono">{score} points</strong>.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_15px_#10b981]"
                  >
                    <RotateCcw className="w-4 h-4" /> Revive & Retype
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
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Skull className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white">Zombie Apocalypse: Night Outbreak</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The infected horde is advancing towards your survivor camp. Aim your shotgun by typing the words on approaching zombies before they breach the wooden barricade!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-[0_0_20px_#10b981] active:scale-95 transition-all"
                >
                  <Crosshair className="w-4 h-4" /> Defend The Barricade
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Target Aim Input */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-emerald-400" /> Shotgun Crosshair Targeting
        </label>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          disabled={gameState !== 'playing'}
          placeholder={gameState === 'playing' ? "Type zombie words to fire headshots..." : "Safe inside bunker"}
          className="w-full bg-slate-900 border-2 border-emerald-600/50 rounded-xl px-4 py-3 font-mono text-base text-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 shadow-inner"
        />
      </div>

    </div>
  );
};
