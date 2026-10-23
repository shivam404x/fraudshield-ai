import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  RotateCcw, 
  ArrowLeft, 
  Zap, 
  Flame, 
  Sparkles, 
  Trophy,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const LANES = [
  { key: 'd', label: 'D', color: 'from-cyan-500 to-blue-500', border: 'border-cyan-400', glow: 'shadow-cyan-400' },
  { key: 'f', label: 'F', color: 'from-emerald-500 to-teal-500', border: 'border-emerald-400', glow: 'shadow-emerald-400' },
  { key: 'j', label: 'J', color: 'from-amber-500 to-orange-500', border: 'border-amber-400', glow: 'shadow-amber-400' },
  { key: 'k', label: 'K', color: 'from-fuchsia-500 to-rose-500', border: 'border-fuchsia-400', glow: 'shadow-fuchsia-400' }
];

export const RhythmBeatGame = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [gameState, setGameState] = useState('intro'); // 'intro' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [health, setHealth] = useState(100);
  const [notes, setNotes] = useState([]); // { id, laneIdx (0-3), y (0% to 100%), speed }
  const [hitFeedback, setHitFeedback] = useState(null); // { text, color, id }
  const [activeLanePress, setActiveLanePress] = useState([false, false, false, false]);

  const containerRef = useRef(null);

  const isFever = combo >= 15;

  const startGame = () => {
    setNotes([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHealth(100);
    setGameState('playing');
  };

  // Keyboard listener for D, F, J, K
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const laneIdx = LANES.findIndex((l) => l.key === key);
      if (laneIdx === -1) return;

      e.preventDefault();
      playKeySound(soundProfile, volume);

      // Light up lane indicator
      setActiveLanePress((prev) => {
        const next = [...prev];
        next[laneIdx] = true;
        return next;
      });

      // Find lowest note in this lane near hit line (hit line is at y = 85%)
      setNotes((prevNotes) => {
        // Candidate notes in this lane
        const laneNotes = prevNotes.filter((n) => n.laneIdx === laneIdx);
        if (laneNotes.length === 0) return prevNotes;

        // Find note closest to 85%
        let closest = null;
        let minDiff = 999;
        laneNotes.forEach((n) => {
          const diff = Math.abs(n.y - 85);
          if (diff < minDiff) {
            minDiff = diff;
            closest = n;
          }
        });

        if (closest && minDiff <= 14) {
          // HIT!
          const isPerfect = minDiff <= 6;
          const points = (isPerfect ? 100 : 50) * (isFever ? 2 : 1);

          setHitFeedback({
            text: isPerfect ? 'PERFECT! ⚡' : 'GREAT! ✨',
            color: isPerfect ? 'text-amber-400' : 'text-emerald-400',
            id: Date.now()
          });
          setTimeout(() => setHitFeedback(null), 400);

          setScore((s) => s + points);
          setCombo((c) => {
            const nextCombo = c + 1;
            setMaxCombo((m) => Math.max(m, nextCombo));
            return nextCombo;
          });
          setHealth((h) => Math.min(100, h + 3));

          playSuccessChime(volume);

          return prevNotes.filter((n) => n.id !== closest.id);
        }

        return prevNotes;
      });
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      const laneIdx = LANES.findIndex((l) => l.key === key);
      if (laneIdx === -1) return;

      setActiveLanePress((prev) => {
        const next = [...prev];
        next[laneIdx] = false;
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, soundProfile, volume, isFever]);

  // Note spawner loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setNotes((prev) => {
        const randomLane = Math.floor(Math.random() * 4);
        const newNote = {
          id: Date.now() + Math.random(),
          laneIdx: randomLane,
          y: 0,
          speed: 1.2 + Math.min(score / 2000, 0.8)
        };
        return [...prev, newNote];
      });
    }, 650);

    return () => clearInterval(interval);
  }, [gameState, score]);

  // Game tick: notes fall down the 4 highways
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      setNotes((prev) => {
        let missedCount = 0;
        const remaining = [];

        prev.forEach((n) => {
          const nextY = n.y + n.speed;
          if (nextY > 96) {
            // Note fell past the hit zone -> MISS
            missedCount++;
          } else {
            remaining.push({ ...n, y: nextY });
          }
        });

        if (missedCount > 0) {
          setCombo(0);
          setHitFeedback({ text: 'MISS 💥', color: 'text-rose-500', id: Date.now() });
          setTimeout(() => setHitFeedback(null), 400);

          setHealth((h) => {
            const nextHp = Math.max(0, h - missedCount * 12);
            if (nextHp <= 0) setGameState('gameover');
            return nextHp;
          });
          playErrorSound(soundProfile, volume);
        }

        return remaining;
      });
    }, 30);

    return () => clearInterval(loop);
  }, [gameState, soundProfile, volume]);

  useEffect(() => {
    if (gameState === 'gameover' && score > 400) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      if (onAddXp) onAddXp(Math.floor(score / 2));
    }
  }, [gameState]);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
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
            <h2 className="text-base sm:text-lg font-black text-fuchsia-400 flex items-center gap-2">
              ⚡ Neon Synthwave Rhythm: Beat Smasher
            </h2>
            <p className="text-xs text-slate-400">
              Smash falling notes on D, F, J, K keys right as they hit the neon judgment bar!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className={`px-3 py-1.5 rounded-xl border font-bold ${
              isFever 
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 border-amber-300 animate-pulse font-black' 
                : 'bg-slate-950 border-slate-800 text-fuchsia-400'
            }`}>
              {isFever ? '🔥 2X FEVER MODE!' : `Combo: ${combo}x`}
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
              Score: <span className="text-white text-sm">{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Rhythm Highway Box */}
      <div 
        ref={containerRef}
        className={`relative h-[440px] w-full rounded-3xl overflow-hidden border-2 transition-all duration-300 bg-gradient-to-b from-slate-950 via-slate-900 to-[#120421] shadow-2xl flex flex-col justify-between p-4 select-none ${
          isFever ? 'border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.25)]' : 'border-fuchsia-900/60'
        }`}
      >
        {/* Health Bar Top */}
        <div className="relative z-10 w-full max-w-sm mx-auto bg-slate-950/80 border border-slate-800 p-2 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1 text-fuchsia-400">
              <Zap className="w-3.5 h-3.5" /> Rhythm Groove Energy
            </span>
            <span className={health > 30 ? 'text-emerald-400' : 'text-rose-500 font-black'}>
              {health}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                health > 40 ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400' : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        {/* 4 Track Vertical Highway */}
        <div className="relative flex-1 w-full max-w-md mx-auto grid grid-cols-4 gap-2 my-2 border-x-2 border-slate-800/80 bg-slate-950/60 rounded-2xl p-2">
          
          {/* 4 Lanes */}
          {LANES.map((lane, idx) => (
            <div 
              key={lane.key}
              className={`relative h-full rounded-xl border border-slate-800/50 flex flex-col justify-between items-center pb-2 transition-colors ${
                activeLanePress[idx] ? 'bg-slate-800/60' : 'bg-slate-950/30'
              }`}
            >
              {/* Vertical Guide Line */}
              <div className="absolute inset-y-0 w-[1px] bg-slate-800/40 left-1/2 -translate-x-1/2" />

              {/* Bottom Key Button Indicator */}
              <div className={`mt-auto w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-all ${
                activeLanePress[idx] 
                  ? `bg-gradient-to-tr ${lane.color} text-slate-950 scale-110 shadow-lg ${lane.glow}` 
                  : `bg-slate-900 ${lane.border} text-white`
              }`}>
                {lane.label}
              </div>
            </div>
          ))}

          {/* Glowing Judgment Hit Line (at 85% Y height) */}
          <div className="absolute left-2 right-2 top-[82%] h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 shadow-[0_0_15px_#ec4899] pointer-events-none rounded-full" />

          {/* Falling Musical Notes */}
          {notes.map((note) => {
            const lane = LANES[note.laneIdx];
            // Compute horizontal percentage for lane: laneIdx * 25% + offset
            const leftPercent = note.laneIdx * 25 + 12.5;

            return (
              <div
                key={note.id}
                className="absolute -translate-x-1/2 flex items-center justify-center pointer-events-none z-20"
                style={{ left: `${leftPercent}%`, top: `${note.y}%` }}
              >
                <div className={`w-10 h-6 rounded-lg bg-gradient-to-r ${lane.color} border border-white flex items-center justify-center text-xs font-black text-slate-950 shadow-md animate-pulse`}>
                  ♫
                </div>
              </div>
            );
          })}

          {/* Hit Feedback Text Floating */}
          {hitFeedback && (
            <div className={`absolute top-[70%] left-1/2 -translate-x-1/2 text-2xl font-black font-mono tracking-wider drop-shadow-md z-30 pointer-events-none animate-bounce ${hitFeedback.color}`}>
              {hitFeedback.text}
            </div>
          )}

        </div>

        {/* Bottom Help Text */}
        <div className="relative z-10 text-center text-[11px] text-slate-500 font-mono">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">D</kbd>{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">F</kbd>{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">J</kbd>{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 font-bold">K</kbd> on your keyboard
        </div>

        {/* INTRO BRIEFING MODAL */}
        {gameState === 'intro' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-fuchsia-500/30">
              ⚡
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Neon Synthwave Rhythm: Beat Smasher
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
              Step into the neon synthwave grid! Use home-row finger rhythm to smash falling beat notes right as they hit the glowing judgment line. Build a 15+ combo to ignite 2X Rainbow Fever!
            </p>

            <button
              onClick={startGame}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-fuchsia-500/30 transition-all active:scale-95"
            >
              Start Rhythm Highway Now
            </button>
          </div>
        )}

        {/* GAME OVER MODAL */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="text-5xl mb-2">⚡</div>
            <h3 className="text-2xl sm:text-3xl font-black text-fuchsia-400">
              Rhythm Track Complete!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your timing and finger groove were tested!
            </p>

            <div className="flex gap-4 my-4">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Score</span>
                <span className="text-2xl font-black text-fuchsia-400 font-mono">{score}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Max Combo</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{maxCombo}x</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Play Again
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
