import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  Zap, 
  Flame, 
  Gauge, 
  Award, 
  ArrowLeft,
  Crown,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const RACE_PASSAGES = [
  "Speed is great, but consistency and accuracy win every championship race on the keyboard track.",
  "Keep your eyes ahead on the horizon. Do not look down at the pedals or keys, feel the rhythm flow.",
  "The turbo engine roars as you cross into maximum velocity with smooth keystrokes and zero errors.",
  "Precision finger movement creates lightning-fast reflexes that leave your digital opponents behind.",
  "Chasing the checkered flag requires focus, calm hands, and steady breathing under intense pressure."
];

export const TurboRacerGame = ({ onExit, soundProfile, volume = 0.5 }) => {
  const [raceState, setRaceState] = useState('idle'); // 'idle' | 'countdown' | 'racing' | 'finished'
  const [countdown, setCountdown] = useState(3);
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' | 'medium' | 'hard'
  const [passageIndex, setPassageIndex] = useState(0);

  // Typing state
  const targetText = RACE_PASSAGES[passageIndex];
  const [userInput, setUserInput] = useState('');
  const [wordStreak, setWordStreak] = useState(0);
  const [isNitro, setIsNitro] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Player and Bot progress (0% to 100%)
  const [playerProgress, setPlayerProgress] = useState(0);
  const [bot1Progress, setBot1Progress] = useState(0);
  const [bot2Progress, setBot2Progress] = useState(0);
  const [bot3Progress, setBot3Progress] = useState(0);

  const inputRef = useRef(null);

  // Bot speed profiles based on difficulty
  const botSpeeds = {
    easy: { bot1: 35, bot2: 28, bot3: 20 },
    medium: { bot1: 52, bot2: 40, bot3: 30 },
    hard: { bot1: 75, bot2: 60, bot3: 45 }
  }[difficulty];

  // Start race countdown
  const startCountdown = () => {
    setUserInput('');
    setPlayerProgress(0);
    setBot1Progress(0);
    setBot2Progress(0);
    setBot3Progress(0);
    setWordStreak(0);
    setIsNitro(false);
    setStartTime(null);
    setEndTime(null);
    setCountdown(3);
    setRaceState('countdown');

    const nextPassage = Math.floor(Math.random() * RACE_PASSAGES.length);
    setPassageIndex(nextPassage);
  };

  // Countdown timer logic
  useEffect(() => {
    if (raceState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setRaceState('racing');
      setStartTime(Date.now());
      if (inputRef.current) inputRef.current.focus();
    }
  }, [raceState, countdown]);

  // AI Bots movement simulation
  useEffect(() => {
    if (raceState !== 'racing') return;

    const interval = setInterval(() => {
      setBot1Progress((prev) => {
        const increment = (botSpeeds.bot1 / 60) * (5 / targetText.length) * 100 * 0.1;
        return Math.min(100, prev + increment);
      });
      setBot2Progress((prev) => {
        const increment = (botSpeeds.bot2 / 60) * (5 / targetText.length) * 100 * 0.1;
        return Math.min(100, prev + increment);
      });
      setBot3Progress((prev) => {
        const increment = (botSpeeds.bot3 / 60) * (5 / targetText.length) * 100 * 0.1;
        return Math.min(100, prev + increment);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [raceState, botSpeeds, targetText]);

  // Handle typing input
  const handleInputChange = (e) => {
    if (raceState !== 'racing') return;

    const val = e.target.value;
    const lastChar = val[val.length - 1];
    const expectedChar = targetText[val.length - 1];

    if (val.length < userInput.length) {
      // Backspace
      setUserInput(val);
      playKeySound(soundProfile, volume);
      return;
    }

    if (lastChar === expectedChar) {
      // Correct
      playKeySound(soundProfile, volume);

      // Check for completed word
      if (lastChar === ' ' || val.length === targetText.length) {
        setWordStreak((prev) => {
          const next = prev + 1;
          if (next >= 4 && !isNitro) {
            setIsNitro(true);
            playNitroSound(volume);
            setTimeout(() => setIsNitro(false), 2500);
          }
          return next;
        });
      }
    } else {
      // Mistake
      playErrorSound(volume);
      setWordStreak(0);
      setIsNitro(false);
      return; // Force correct character before moving forward
    }

    setUserInput(val);

    const progress = Math.min(100, (val.length / targetText.length) * 100);
    setPlayerProgress(progress);

    // Player finished the race!
    if (val.length >= targetText.length) {
      const now = Date.now();
      setEndTime(now);
      setRaceState('finished');
      playSuccessChime(volume);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  // Calculate live player WPM
  const timeElapsedSec = startTime ? ((endTime || Date.now()) - startTime) / 1000 : 0;
  const playerWpm = timeElapsedSec > 1 
    ? Math.round((userInput.length / 5) / (timeElapsedSec / 60)) 
    : 0;

  // Calculate Positions
  const racers = [
    { name: 'You (Player)', icon: '🏎️', progress: playerProgress, wpm: playerWpm, isPlayer: true },
    { name: 'Blitz Fox', icon: '🦊', progress: bot1Progress, wpm: botSpeeds.bot1, isPlayer: false },
    { name: 'Cyber Bot', icon: '🤖', progress: bot2Progress, wpm: botSpeeds.bot2, isPlayer: false },
    { name: 'Turbo Snail', icon: '🐌', progress: bot3Progress, wpm: botSpeeds.bot3, isPlayer: false },
  ];

  const sortedRacers = [...racers].sort((a, b) => b.progress - a.progress);
  const playerRank = sortedRacers.findIndex((r) => r.isPlayer) + 1;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Typing
        </button>

        <div className="flex items-center gap-3">
          {/* Difficulty selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 font-bold text-[10px] uppercase">Bots:</span>
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                disabled={raceState === 'racing' || raceState === 'countdown'}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize transition-all ${
                  difficulty === d
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Current Rank Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Position:</span>
            <span className={`text-sm ${
              playerRank === 1 ? 'text-amber-400 font-black' : playerRank === 2 ? 'text-slate-300 font-bold' : 'text-slate-400'
            }`}>
              {playerRank === 1 ? '🥇 1st' : playerRank === 2 ? '🥈 2nd' : playerRank === 3 ? '🥉 3rd' : '4th'}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic 4-Lane Race Track */}
      <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 p-4 relative overflow-hidden space-y-3 shadow-inner">
        
        {/* Track Lines and Background Glow */}
        <div className="absolute right-12 top-0 bottom-0 w-3 bg-gradient-to-b from-amber-400 via-white to-amber-400 opacity-40 border-r-2 border-dashed border-white/60 pointer-events-none"></div>
        <div className="absolute right-4 top-2 text-[10px] font-black text-amber-400 uppercase tracking-widest pointer-events-none">
          FINISH
        </div>

        {/* 4 Lanes */}
        {racers.map((racer, index) => (
          <div key={index} className="relative h-12 flex items-center bg-slate-900/60 rounded-xl px-2 border border-slate-800/80">
            {/* Lane label */}
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <span className="text-base">{racer.icon}</span>
              <span className="truncate">{racer.isPlayer ? 'You' : racer.name}</span>
            </div>

            {/* Lane Track */}
            <div className="flex-1 relative h-6 mx-2">
              <div
                className="absolute top-0 bottom-0 flex items-center transition-all duration-150 ease-out"
                style={{ left: `calc(${racer.progress}% - ${racer.progress * 0.35}px)` }}
              >
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black shadow-lg ${
                  racer.isPlayer
                    ? isNitro
                      ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white animate-pulse shadow-orange-500/50'
                      : 'bg-indigo-600 text-white shadow-indigo-600/50'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  <span>{racer.icon}</span>
                  {racer.isPlayer && isNitro && (
                    <span className="text-[10px] font-black tracking-wider text-amber-300 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-300" /> NITRO
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* WPM / Progress */}
            <div className="w-16 text-right font-mono text-xs text-slate-400 font-bold shrink-0">
              {Math.round(racer.progress)}%
            </div>
          </div>
        ))}
      </div>

      {/* Typing & Dashboard Area */}
      {raceState === 'racing' && (
        <div className="space-y-4">
          {/* Passage Display */}
          <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-lg sm:text-xl leading-relaxed tracking-wide select-none">
            {targetText.split('').map((char, idx) => {
              let style = 'text-slate-500';
              if (idx < userInput.length) {
                style = 'text-emerald-400 font-bold';
              } else if (idx === userInput.length) {
                style = 'bg-indigo-500 text-white px-0.5 rounded underline';
              }
              return (
                <span key={idx} className={style}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Hidden/Active Input */}
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Keep typing with 100% accuracy to boost speed..."
              className="flex-1 bg-slate-950 border border-indigo-500/80 rounded-xl px-4 py-3 font-mono text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              autoFocus
            />

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Speed</span>
                <span className="text-lg font-black font-mono text-white">{playerWpm} WPM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Countdown Overlay */}
      {raceState === 'countdown' && (
        <div className="py-12 text-center space-y-3">
          <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-widest block">
            Revving Engines...
          </span>
          <div className="text-6xl font-black text-white font-mono animate-bounce">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
          <p className="text-xs text-slate-400">Get your fingers on the home row keys!</p>
        </div>
      )}

      {/* Idle / Pre-Start Screen */}
      {raceState === 'idle' && (
        <div className="text-center py-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/30">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Turbo Racer Championship</h3>
            <p className="text-xs text-slate-400 mt-1">
              Race against 3 AI ghost bots in real-time! Hit 5 words without mistakes to unleash a blazing Nitro Boost.
            </p>
          </div>
          <button
            onClick={startCountdown}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-black text-sm flex items-center gap-2 mx-auto shadow-glow-accent transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" /> Start Race!
          </button>
        </div>
      )}

      {/* Finished / Victory Screen */}
      {raceState === 'finished' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-5">
          <div className="space-y-2">
            <span className="text-4xl">{playerRank === 1 ? '🏆' : playerRank === 2 ? '🥈' : '🥉'}</span>
            <h3 className="text-2xl font-black text-white">
              {playerRank === 1 ? 'VICTORY! 1st Place Champion!' : `Finished in ${playerRank}th Place!`}
            </h3>
            <p className="text-xs text-slate-400">
              Time: {timeElapsedSec.toFixed(1)}s • Average Speed: <strong className="text-emerald-400 text-sm">{playerWpm} WPM</strong>
            </p>
          </div>

          {/* Podium Standings */}
          <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
            {sortedRacers.map((r, i) => (
              <div key={i} className={`p-3 rounded-xl border text-center ${
                r.isPlayer ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-slate-800'
              }`}>
                <span className="text-lg block">{r.icon}</span>
                <span className="text-[10px] font-bold text-slate-400 block truncate">{r.name}</span>
                <span className="text-xs font-black font-mono text-white mt-1 block">#{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={startCountdown}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Race Again
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
