import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  Zap,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime } from '../utils/soundEffects';

const DUEL_PASSAGES = [
  "True champions are built with patience, precise finger discipline, and relentless determination.",
  "Lightning fast keystrokes require relaxed hands, calm posture, and steady focused breathing.",
  "Victory belongs to the typist who makes zero errors while maintaining blistering rhythm.",
  "Never look down at the keyboard. Trust your muscle memory to carry you across the finish line."
];

export const Local1v1Duel = ({ onExit, soundProfile, volume = 0.5, onAddXp }) => {
  const [passageIndex, setPassageIndex] = useState(0);
  const targetText = DUEL_PASSAGES[passageIndex];

  const [activePlayer, setActivePlayer] = useState('p1'); // 'p1' | 'p2' | 'turn-based-racing'
  const [p1Input, setP1Input] = useState('');
  const [p2Input, setP2Input] = useState('');
  const [p1Time, setP1Time] = useState(0);
  const [p2Time, setP2Time] = useState(0);
  const [p1Wpm, setP1Wpm] = useState(0);
  const [p2Wpm, setP2Wpm] = useState(0);

  const [duelState, setDuelState] = useState('p1_turn'); // 'p1_turn' | 'p2_turn' | 'result'
  const [winner, setWinner] = useState(null);

  const p1Ref = useRef(null);
  const p2Ref = useRef(null);

  // Reset duel
  const resetDuel = () => {
    setP1Input('');
    setP2Input('');
    setP1Time(0);
    setP2Time(0);
    setP1Wpm(0);
    setP2Wpm(0);
    setWinner(null);
    setDuelState('p1_turn');
    setPassageIndex(Math.floor(Math.random() * DUEL_PASSAGES.length));
  };

  // Timer loop for active player
  useEffect(() => {
    let interval = null;
    if (duelState === 'p1_turn' && p1Input.length > 0 && p1Input.length < targetText.length) {
      interval = setInterval(() => setP1Time((t) => t + 0.1), 100);
    } else if (duelState === 'p2_turn' && p2Input.length > 0 && p2Input.length < targetText.length) {
      interval = setInterval(() => setP2Time((t) => t + 0.1), 100);
    }
    return () => clearInterval(interval);
  }, [duelState, p1Input, p2Input, targetText]);

  // Handle Player 1 input
  const handleP1Change = (e) => {
    if (duelState !== 'p1_turn') return;
    const val = e.target.value;
    const lastChar = val[val.length - 1];
    const expected = targetText[val.length - 1];

    if (val.length < p1Input.length) {
      setP1Input(val);
      playKeySound(soundProfile, volume);
      return;
    }

    if (lastChar === expected) {
      playKeySound(soundProfile, volume);
      setP1Input(val);

      if (val.length >= targetText.length) {
        // Player 1 finished!
        playSuccessChime(volume);
        const wpmCalc = Math.round((val.length / 5) / (Math.max(1, p1Time) / 60));
        setP1Wpm(wpmCalc);
        setDuelState('p2_turn');
      }
    } else {
      playErrorSound(volume);
    }
  };

  // Handle Player 2 input
  const handleP2Change = (e) => {
    if (duelState !== 'p2_turn') return;
    const val = e.target.value;
    const lastChar = val[val.length - 1];
    const expected = targetText[val.length - 1];

    if (val.length < p2Input.length) {
      setP2Input(val);
      playKeySound(soundProfile, volume);
      return;
    }

    if (lastChar === expected) {
      playKeySound(soundProfile, volume);
      setP2Input(val);

      if (val.length >= targetText.length) {
        // Player 2 finished!
        playSuccessChime(volume);
        const wpmCalc = Math.round((val.length / 5) / (Math.max(1, p2Time) / 60));
        setP2Wpm(wpmCalc);

        // Determine winner
        const p1Score = p1Wpm;
        const p2Score = wpmCalc;
        setWinner(p1Score > p2Score ? 'Player 1 (Blue)' : p2Score > p1Score ? 'Player 2 (Red)' : 'Tie');
        setDuelState('result');

        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {}
      }
    } else {
      playErrorSound(volume);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-5xl mx-auto shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Arena
        </button>

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
            1v1 Local Showdown Duel
          </h3>
        </div>

        <span className="text-xs text-slate-400 font-bold">Same Screen 2-Player</span>
      </div>

      {/* RESULT SCREEN */}
      {duelState === 'result' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-6 animate-pop">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <div>
            <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-widest block">
              Match Result
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              🏆 {winner} Wins the Championship!
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-center">
              <span className="text-xs font-bold text-indigo-300 block">Player 1 (Blue)</span>
              <span className="text-3xl font-black font-mono text-indigo-400 mt-1 block">{p1Wpm} WPM</span>
              <span className="text-[10px] text-slate-400 font-mono">{p1Time.toFixed(1)}s</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center">
              <span className="text-xs font-bold text-rose-300 block">Player 2 (Red)</span>
              <span className="text-3xl font-black font-mono text-rose-400 mt-1 block">{p2Wpm} WPM</span>
              <span className="text-[10px] text-slate-400 font-mono">{p2Time.toFixed(1)}s</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={resetDuel}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Rematch
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Exit Arena
            </button>
          </div>
        </div>
      ) : (
        /* DUEL PLAYGROUND */
        <div className="space-y-6">
          
          {/* Target Passage */}
          <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-base sm:text-lg leading-relaxed text-slate-300 text-center select-none">
            {targetText}
          </div>

          {/* 2 Player Split Screen Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Player 1 (Blue) */}
            <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
              duelState === 'p1_turn' 
                ? 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)]' 
                : 'bg-slate-950/60 border-slate-800 opacity-60'
            }`}>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  🔵 Player 1 (Blue)
                </span>
                <span className="font-mono text-slate-400">
                  {p1Wpm > 0 ? `${p1Wpm} WPM` : duelState === 'p1_turn' ? 'Typing now...' : 'Waiting'}
                </span>
              </div>

              {/* Progress */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all"
                  style={{ width: `${(p1Input.length / targetText.length) * 100}%` }}
                />
              </div>

              {/* Input */}
              <input
                ref={p1Ref}
                type="text"
                disabled={duelState !== 'p1_turn'}
                value={p1Input}
                onChange={handleP1Change}
                placeholder={duelState === 'p1_turn' ? "Player 1: Type here to start!" : "Completed"}
                className="w-full bg-slate-900 border border-indigo-500/40 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none"
                autoFocus={duelState === 'p1_turn'}
              />
            </div>

            {/* Player 2 (Red) */}
            <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
              duelState === 'p2_turn' 
                ? 'bg-rose-950/30 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.25)]' 
                : 'bg-slate-950/60 border-slate-800 opacity-60'
            }`}>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-1.5 text-rose-400">
                  🔴 Player 2 (Red)
                </span>
                <span className="font-mono text-slate-400">
                  {p2Wpm > 0 ? `${p2Wpm} WPM` : duelState === 'p2_turn' ? 'Typing now...' : 'Turn up next'}
                </span>
              </div>

              {/* Progress */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: `${(p2Input.length / targetText.length) * 100}%` }}
                />
              </div>

              {/* Input */}
              <input
                ref={p2Ref}
                type="text"
                disabled={duelState !== 'p2_turn'}
                value={p2Input}
                onChange={handleP2Change}
                placeholder={duelState === 'p2_turn' ? "Player 2: Type here to beat Player 1!" : "Waiting for Player 1..."}
                className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none"
                autoFocus={duelState === 'p2_turn'}
              />
            </div>

          </div>

          <div className="text-center text-xs text-slate-500">
            💡 Take turns on the same keyboard: Player 1 types first, then Player 2 tries to beat their WPM speed!
          </div>

        </div>
      )}

    </div>
  );
};
