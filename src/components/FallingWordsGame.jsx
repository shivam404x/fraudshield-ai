import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Flame, Trophy, Heart, ArrowLeft, Zap } from 'lucide-react';
import { playKeySound, playErrorSound, playSuccessChime } from '../utils/soundEffects';

const GAME_WORDS_POOL = [
  'fall', 'glad', 'code', 'fast', 'type', 'fire', 'word', 'hand', 'life',
  'desk', 'keys', 'jump', 'flow', 'game', 'quick', 'brown', 'home', 'rock',
  'wind', 'speed', 'star', 'focus', 'click', 'power', 'magic', 'super'
];

export const FallingWordsGame = ({ onExit, soundProfile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentInput, setCurrentInput] = useState('');
  const [fallingWords, setFallingWords] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  const inputRef = useRef(null);

  // Focus input when game begins
  useEffect(() => {
    if (isPlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPlaying]);

  // Start new game
  const handleStartGame = () => {
    setScore(0);
    setLives(3);
    setFallingWords([]);
    setCurrentInput('');
    setGameOver(false);
    setStreak(0);
    setIsPlaying(true);
  };

  // Spawn falling words
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const spawnInterval = setInterval(() => {
      setFallingWords((prev) => {
        if (prev.length >= 5) return prev; // max 5 words on screen
        const randomWord = GAME_WORDS_POOL[Math.floor(Math.random() * GAME_WORDS_POOL.length)];
        const randomLeft = Math.floor(Math.random() * 70) + 10; // 10% to 80% horizontal

        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            word: randomWord,
            x: randomLeft,
            y: 0,
            speed: 0.6 + Math.random() * 0.4
          }
        ];
      });
    }, 1800);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver]);

  // Animation frame loop to move words down
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveInterval = setInterval(() => {
      setFallingWords((prev) => {
        const nextWords = [];
        let lostLife = false;

        prev.forEach((w) => {
          const nextY = w.y + w.speed;
          if (nextY >= 90) {
            // Hit bottom line!
            lostLife = true;
          } else {
            nextWords.push({ ...w, y: nextY });
          }
        });

        if (lostLife) {
          playErrorSound();
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameOver(true);
              setIsPlaying(false);
            }
            return Math.max(0, nextL);
          });
          setStreak(0);
        }

        return nextWords;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isPlaying, gameOver]);

  // Check typed word
  const handleInputChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(e.target.value);
    playKeySound(soundProfile);

    // Check if typed word matches any falling word
    const matchIndex = fallingWords.findIndex((w) => w.word === val);

    if (matchIndex !== -1) {
      playSuccessChime();
      setScore((s) => s + val.length * 10);
      setStreak((st) => st + 1);
      // Remove word
      setFallingWords((prev) => prev.filter((_, idx) => idx !== matchIndex));
      setCurrentInput('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 max-w-4xl mx-auto shadow-2xl space-y-4">
      
      {/* Game Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lessons
        </button>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> Lives: {lives}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Trophy className="w-4 h-4" /> Score: {score}
          </span>
          <span className="flex items-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" /> Streak: {streak}
          </span>
        </div>
      </div>

      {/* Game Canvas Area */}
      <div className="relative h-[360px] sm:h-[400px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner flex flex-col justify-end">
        
        {/* Falling Words */}
        {fallingWords.map((w) => {
          const isTargetPrefix = currentInput.trim() && w.word.startsWith(currentInput.trim().toLowerCase());
          return (
            <div
              key={w.id}
              className={`absolute font-mono text-sm sm:text-base font-black px-3 py-1 rounded-xl transition-all ${
                isTargetPrefix
                  ? 'bg-indigo-600 text-white shadow-glow-accent scale-110'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 shadow-md'
              }`}
              style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {w.word}
            </div>
          );
        })}

        {/* Danger Bottom Line */}
        <div className="w-full h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 shadow-[0_0_10px_#ef4444] opacity-70"></div>

        {/* Overlay when Not Playing or Game Over */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
            {gameOver ? (
              <div className="text-center space-y-2">
                <span className="text-3xl font-black text-rose-500 block">GAME OVER!</span>
                <p className="text-slate-400 text-xs">Final Score: <strong className="text-white text-sm">{score}</strong></p>
                <button
                  onClick={handleStartGame}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 mx-auto transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Meteor Type Challenge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Words will fall from the sky. Type them quickly before they cross the red danger line!
                </p>
                <button
                  onClick={handleStartGame}
                  className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center gap-2 mx-auto shadow-glow-accent transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Game
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Typing Input Box */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={isPlaying ? "Type the falling words here..." : "Click Start to play"}
          value={currentInput}
          onChange={handleInputChange}
          disabled={!isPlaying}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 font-mono text-base text-white focus:outline-none focus:border-indigo-500 shadow-sm"
          autoFocus
        />
        {isPlaying && (
          <button
            onClick={() => {
              setIsPlaying(false);
              setGameOver(true);
            }}
            className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold"
          >
            End
          </button>
        )}
      </div>

    </div>
  );
};
