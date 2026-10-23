import React, { useState, useEffect, useRef } from 'react';
import { 
  Swords, 
  Shield, 
  Heart, 
  Flame, 
  Zap, 
  Trophy, 
  RotateCcw, 
  ArrowLeft,
  Sparkles,
  AlertOctagon,
  Skull,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const SPELL_WORDS = [
  'firebolt', 'thunder', 'blizzard', 'strike', 'meteor', 'divine', 
  'shield', 'avalanche', 'phoenix', 'inferno', 'radiance', 'vortex', 
  'dragon', 'tempest', 'lightning', 'shadow', 'cleave', 'sorcery', 'wrath'
];

export const BossBattleGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('intro'); // 'intro' | 'combat' | 'victory' | 'defeat'
  const [bossHp, setBossHp] = useState(1000);
  const maxBossHp = 1000;
  const [heroHp, setHeroHp] = useState(100);
  const maxHeroHp = 100;
  const [mana, setMana] = useState(0); // 0 to 100

  // Active combat spell
  const [currentWord, setCurrentWord] = useState('firebolt');
  const [currentInput, setCurrentInput] = useState('');
  const [bossTimer, setBossTimer] = useState(7); // countdown seconds before boss attacks
  const [attackAnimation, setAttackAnimation] = useState(null); // 'hero-hit' | 'boss-hit' | 'crit'
  const [combo, setCombo] = useState(0);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);

  const inputRef = useRef(null);

  // Focus input when combat starts
  useEffect(() => {
    if (gameState === 'combat' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentWord]);

  // Start new battle
  const startBattle = () => {
    setBossHp(1000);
    setHeroHp(100);
    setMana(0);
    setCombo(0);
    setTotalDamageDealt(0);
    setCurrentInput('');
    setBossTimer(6);
    const firstWord = SPELL_WORDS[Math.floor(Math.random() * SPELL_WORDS.length)];
    setCurrentWord(firstWord);
    setGameState('combat');
  };

  // Boss attack countdown loop
  useEffect(() => {
    if (gameState !== 'combat') return;

    const timer = setInterval(() => {
      setBossTimer((prev) => {
        if (prev <= 1) {
          // Boss strikes hero!
          setAttackAnimation('boss-attack');
          playErrorSound(volume);

          setHeroHp((hp) => {
            const nextHp = hp - 18;
            if (nextHp <= 0) {
              setGameState('defeat');
              return 0;
            }
            return nextHp;
          });

          setTimeout(() => setAttackAnimation(null), 800);
          return 6; // reset boss timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, volume]);

  // Handle typing attack words
  const handleInputChange = (e) => {
    if (gameState !== 'combat') return;

    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(e.target.value);
    playKeySound(soundProfile, volume);

    // If typed word matches the spell
    if (val === currentWord) {
      playSuccessChime(volume);

      const isCrit = combo >= 3;
      const damage = isCrit ? currentWord.length * 15 + 40 : currentWord.length * 12;

      setAttackAnimation(isCrit ? 'crit' : 'hero-attack');
      setTimeout(() => setAttackAnimation(null), 600);

      setTotalDamageDealt((d) => d + damage);
      setCombo((c) => c + 1);
      setMana((m) => Math.min(100, m + 20));

      // Damage boss
      setBossHp((prev) => {
        const nextHp = prev - damage;
        if (nextHp <= 0) {
          // Victory!
          setGameState('victory');
          if (onAddXp) onAddXp(350);
          try {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
          } catch {}
          return 0;
        }
        return nextHp;
      });

      // Reset boss timer partially on successful hit
      setBossTimer(6);

      // Next word
      let nextW = SPELL_WORDS[Math.floor(Math.random() * SPELL_WORDS.length)];
      while (nextW === currentWord) {
        nextW = SPELL_WORDS[Math.floor(Math.random() * SPELL_WORDS.length)];
      }
      setCurrentWord(nextW);
      setCurrentInput('');
    }
  };

  // Cast Hero Ultimate
  const castUltimateSmite = () => {
    if (mana < 100 || gameState !== 'combat') return;

    playNitroSound(volume);
    setAttackAnimation('ultimate');
    setMana(0);
    const ultDamage = 250;
    setTotalDamageDealt((d) => d + ultDamage);

    setBossHp((prev) => {
      const nextHp = prev - ultDamage;
      if (nextHp <= 0) {
        setGameState('victory');
        if (onAddXp) onAddXp(500);
        try {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        } catch {}
        return 0;
      }
      return nextHp;
    });

    setTimeout(() => setAttackAnimation(null), 1000);
  };

  return (
    <div className="bg-slate-900 border-2 border-red-500/40 rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Arena
        </button>

        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="text-sm font-black text-white uppercase tracking-wider">
            Titan Slayer: Dragon Boss Raid
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" /> Combo: x{combo}
          </span>
          <span className="text-slate-400">
            DMG: <strong className="text-white font-mono">{totalDamageDealt}</strong>
          </span>
        </div>
      </div>

      {/* BOSS ARENA BATTLEFIELD */}
      <div className={`relative h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-red-950/30 rounded-2xl border-2 border-slate-800 overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 ${
        attackAnimation === 'boss-attack' ? 'ring-4 ring-rose-500/80 bg-rose-950/40' : attackAnimation === 'ultimate' ? 'ring-4 ring-amber-400 shadow-[0_0_30px_#f59e0b]' : ''
      }`}>
        
        {/* Boss Status Bar (Top) */}
        <div className="max-w-md mx-auto w-full space-y-1 text-center">
          <div className="flex items-center justify-between text-xs font-extrabold text-red-400">
            <span className="flex items-center gap-1">
              🐉 Ignis The Flame Tyrant
            </span>
            <span className="font-mono">{bossHp} / {maxBossHp} HP</span>
          </div>

          {/* Boss HP Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-red-500/30">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-200"
              style={{ width: `${Math.max(0, (bossHp / maxBossHp) * 100)}%` }}
            />
          </div>

          {/* Boss Attack Countdown Indicator */}
          {gameState === 'combat' && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 pt-0.5">
              <AlertOctagon className="w-3.5 h-3.5 text-orange-400 animate-spin" />
              <span>Boss Attack in: <strong className="text-orange-400 font-mono">{bossTimer}s</strong></span>
            </div>
          )}
        </div>

        {/* Center Arena Visuals (Boss & Hero Animations) */}
        <div className="flex items-center justify-around py-2">
          {/* Hero */}
          <div className={`text-center space-y-1 transition-transform duration-200 ${
            attackAnimation === 'hero-attack' ? 'scale-125 translate-x-4' : attackAnimation === 'ultimate' ? 'scale-150 translate-x-8' : ''
          }`}>
            <div className="text-4xl sm:text-5xl">🧙‍♂️</div>
            <span className="text-[10px] font-black uppercase text-indigo-300 block">Spellblade Hero</span>
          </div>

          {/* Clash Projectile Center */}
          <div className="text-center font-black">
            {attackAnimation === 'hero-attack' && (
              <span className="text-2xl animate-ping block">💥 -65 DMG</span>
            )}
            {attackAnimation === 'crit' && (
              <span className="text-3xl text-amber-400 font-black animate-bounce block">⚡ CRITICAL HIT! -120</span>
            )}
            {attackAnimation === 'boss-attack' && (
              <span className="text-2xl text-rose-500 font-black animate-ping block">🔥 INFERNO HIT! -18</span>
            )}
            {attackAnimation === 'ultimate' && (
              <span className="text-4xl text-amber-300 font-black animate-bounce block">🌟 ULTIMATE SMITE! -250</span>
            )}
          </div>

          {/* Dragon Boss */}
          <div className={`text-center space-y-1 transition-transform duration-200 ${
            attackAnimation === 'boss-attack' ? 'scale-125 -translate-x-4' : ''
          }`}>
            <div className="text-5xl sm:text-6xl animate-pulse">🐉</div>
            <span className="text-[10px] font-black uppercase text-red-400 block">Ignis The Titan</span>
          </div>
        </div>

        {/* Hero Health Bar & Mana (Bottom) */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full text-xs font-bold">
          {/* Hero HP */}
          <div className="space-y-1">
            <div className="flex justify-between text-emerald-400">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-emerald-500" /> Hero HP</span>
              <span className="font-mono">{heroHp} / {maxHeroHp}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-emerald-500/30">
              <div 
                className="h-full bg-emerald-500 transition-all duration-200"
                style={{ width: `${Math.max(0, (heroHp / maxHeroHp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-cyan-400">
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 fill-cyan-400" /> Mana</span>
              <span className="font-mono">{mana}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-cyan-500/30">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-200"
                style={{ width: `${mana}%` }}
              />
            </div>
          </div>
        </div>

        {/* Intro / Victory / Defeat Overlays */}
        {gameState !== 'combat' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {gameState === 'victory' ? (
              <div className="space-y-3 animate-pop">
                <Trophy className="w-14 h-14 text-amber-400 mx-auto animate-bounce" />
                <h3 className="text-3xl font-black text-amber-400">TITAN SLAIN! VICTORY!</h3>
                <p className="text-xs text-slate-300 max-w-sm">
                  You defeated Ignis with devastating keystroke incantations! Earned <strong className="text-amber-400 font-bold">+500 XP</strong> and Dragon Slayer Title.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={startBattle}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-95 text-white font-black text-xs flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Battle Again
                  </button>
                  <button
                    onClick={onExit}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Exit Arena
                  </button>
                </div>
              </div>
            ) : gameState === 'defeat' ? (
              <div className="space-y-3">
                <Skull className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
                <h3 className="text-2xl font-black text-rose-500">HERO FALLEN IN BATTLE</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  The Dragon's inferno overwhelmed your defenses. Boost your WPM and strike faster next time!
                </p>
                <button
                  onClick={startBattle}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" /> Revive & Retry
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
                  <Swords className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white">Titan Slayer: Dragon Raid</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Face the legendary fire titan Ignis! Type magical spell incantations to cast firebolts and lightning strikes. Charge 100% Mana to unleash the Ultimate Dragon Smite before he incinerates you!
                </p>
                <button
                  onClick={startBattle}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-lg shadow-red-500/30 active:scale-95 transition-all"
                >
                  <Swords className="w-4 h-4" /> Enter Dragon Lair
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* SPELL INCANTATION INPUT AREA */}
      {gameState === 'combat' && (
        <div className="space-y-4">
          
          {/* Target Spell Word Display */}
          <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border-2 border-slate-800 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest block">
              Active Spell Incantation
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-white select-none">
              {currentWord.split('').map((char, idx) => {
                const typedChar = currentInput[idx];
                let style = 'text-slate-500';
                if (typedChar !== undefined) {
                  style = typedChar === char ? 'text-emerald-400' : 'text-rose-500 underline';
                }
                return (
                  <span key={idx} className={style}>
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Typing Input Box + Ultimate Button */}
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type the spell above to strike the dragon..."
              className="flex-1 bg-slate-950 border-2 border-red-500/60 rounded-xl px-4 py-3 font-mono text-base text-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/30"
              autoFocus
            />

            <button
              onClick={castUltimateSmite}
              disabled={mana < 100}
              className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 ${
                mana >= 100
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-slate-950 shadow-[0_0_20px_#f59e0b] animate-pulse cursor-pointer'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Ultimate Smite (100%)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
