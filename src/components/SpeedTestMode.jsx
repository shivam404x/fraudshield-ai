import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Timer, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  FileText, 
  Target, 
  Zap, 
  CheckCircle2, 
  Flame,
  Award,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { playKeySound, playErrorSound, playSuccessChime } from '../utils/soundEffects';

const COMMON_WORDS_ENGLISH = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 
  'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 
  'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because'
];

const COMMON_WORDS_HINGLISH = [
  'namaste', 'bharat', 'mehnat', 'zindagi', 'sapne', 'dost', 'samay', 'kamyabi', 
  'vishwas', 'desh', 'hausla', 'raasta', 'dil', 'dosti', 'manzil', 'safar', 
  'umeed', 'shakti', 'pyar', 'khushi', 'himmat', 'junoon', 'koshish', 'apna', 
  'duniya', 'khoj', 'soch', 'sach', 'saath', 'aage', 'jeet', 'shuruaat'
];

const COMMON_WORDS_CODE = [
  'const', 'let', 'function', 'return', 'async', 'await', 'import', 'export', 
  'default', 'class', 'extends', 'promise', 'resolve', 'reject', 'typeof', 
  'try', 'catch', 'throw', 'finally', 'console', 'log', 'document', 'window', 
  'react', 'state', 'effect', 'props', 'render', 'filter', 'reduce', 'slice'
];

export const SpeedTestMode = ({ soundProfile, volume = 0.5, weakKeys = [], onAddXp }) => {
  // Config
  const [testType, setTestType] = useState('time'); // 'time' | 'words' | 'custom' | 'weak'
  const [vocabulary, setVocabulary] = useState('english'); // 'english' | 'hinglish' | 'code'
  const [timeLimit, setTimeLimit] = useState(30); // 15, 30, 60, 120
  const [wordCountLimit, setWordCountLimit] = useState(25); // 10, 25, 50, 100
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [customText, setCustomText] = useState('');
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [ghostRival, setGhostRival] = useState('none'); // 'none' | 'bot30' | 'bot60' | 'bot90' | 'bot120'
  const [wpmHistory, setWpmHistory] = useState([]); // [{ second, wpm }]
  const [isBlindMode, setIsBlindMode] = useState(false); // Ghost Ink / Blind typing
  const [isSuddenDeath, setIsSuddenDeath] = useState(false); // 1 error = test fail
  const [suddenDeathFailed, setSuddenDeathFailed] = useState(false);

  // Test state
  const [generatedWords, setGeneratedWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wordResults, setWordResults] = useState([]); // array of 'correct' | 'wrong'
  const [charErrors, setCharErrors] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  // Time & Status
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef(null);

  // Select active dictionary pool
  const activeWordPool = useMemo(() => {
    if (vocabulary === 'hinglish') return COMMON_WORDS_HINGLISH;
    if (vocabulary === 'code') return COMMON_WORDS_CODE;
    return COMMON_WORDS_ENGLISH;
  }, [vocabulary]);

  // Generate words based on settings
  const generateWordsList = () => {
    if (testType === 'custom') {
      const clean = (customText.trim() || "The quick brown fox jumps over the lazy dog.")
        .split(/\s+/)
        .filter(Boolean);
      return clean;
    }

    if (testType === 'weak') {
      const targetWeak = weakKeys.length > 0 ? weakKeys : ['f', 'j', 'd', 'k'];
      const filtered = activeWordPool.filter((w) => 
        targetWeak.some((wk) => w.toLowerCase().includes(wk.toLowerCase()))
      );
      const pool = filtered.length >= 8 ? filtered : activeWordPool;
      const list = [];
      for (let i = 0; i < 40; i++) {
        list.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      return list;
    }

    const count = testType === 'words' ? wordCountLimit : 70;
    const list = [];
    for (let i = 0; i < count; i++) {
      let w = activeWordPool[Math.floor(Math.random() * activeWordPool.length)];
      if (includePunctuation && Math.random() > 0.75) {
        const punc = [',', '.', '!', '?'][Math.floor(Math.random() * 4)];
        w += punc;
      }
      list.push(w);
    }
    return list;
  };

  // Reset & Start Fresh Test
  const resetTest = () => {
    const words = generateWordsList();
    setGeneratedWords(words);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setWordResults([]);
    setCharErrors(0);
    setTotalCharsTyped(0);
    setIsRunning(false);
    setTimeLeft(timeLimit);
    setTimeElapsed(0);
    setIsFinished(false);
    setWpmHistory([]);
    setSuddenDeathFailed(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Initialize or re-generate when modes change
  useEffect(() => {
    resetTest();
  }, [testType, vocabulary, timeLimit, wordCountLimit, includePunctuation]);

  // Timer loop with per-second WPM sampling
  useEffect(() => {
    let interval = null;
    if (isRunning && !isFinished) {
      interval = setInterval(() => {
        setTimeElapsed((t) => {
          const nextSec = t + 1;
          const mins = nextSec / 60;
          const curWpm = mins > 0 ? Math.round((totalCharsTyped / 5) / mins) : 0;
          setWpmHistory((hist) => [...hist, { second: nextSec, wpm: curWpm }]);
          return nextSec;
        });

        if (testType === 'time') {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              finishTest();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isFinished, testType, totalCharsTyped]);

  const finishTest = () => {
    setIsFinished(true);
    setIsRunning(false);
    playSuccessChime(volume);
    if (onAddXp) onAddXp(80);
  };

  // Handle Keystroke
  const handleInputChange = (e) => {
    if (isFinished) return;

    const val = e.target.value;

    // Start timer on first input
    if (!isRunning) {
      setIsRunning(true);
    }

    // Sudden Death check: a single typo terminates immediately!
    if (isSuddenDeath) {
      const expected = generatedWords[currentWordIndex];
      if (val && !expected.startsWith(val.trim())) {
        playErrorSound(volume);
        setSuddenDeathFailed(true);
        setIsFinished(true);
        setIsRunning(false);
        return;
      }
    }

    // Spacebar pressed: submit word
    if (val.endsWith(' ')) {
      const typedWord = val.trim();
      const expectedWord = generatedWords[currentWordIndex];

      const isCorrect = typedWord === expectedWord;
      if (isCorrect) {
        playKeySound(soundProfile, volume);
        setWordResults((prev) => [...prev, 'correct']);
      } else {
        playErrorSound(volume);
        setWordResults((prev) => [...prev, 'wrong']);
        setCharErrors((c) => c + Math.abs(typedWord.length - expectedWord.length) + 1);

        if (isSuddenDeath) {
          setSuddenDeathFailed(true);
          setIsFinished(true);
          setIsRunning(false);
          return;
        }
      }

      setTotalCharsTyped((prev) => prev + typedWord.length + 1);
      setCurrentWordIndex((idx) => {
        const nextIdx = idx + 1;
        // Check end condition for word limit tests
        if (nextIdx >= generatedWords.length) {
          finishTest();
        }
        return nextIdx;
      });
      setCurrentInput('');
      return;
    }

    // Normal character typing
    playKeySound(soundProfile, volume);
    setCurrentInput(val);
  };

  // Keyboard shortcut listener (Tab to reset)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        resetTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testType, vocabulary, timeLimit, wordCountLimit, includePunctuation]);

  // Metric calculations
  const effectiveTime = testType === 'time' ? (timeLimit - timeLeft) : timeElapsed;
  const minutes = Math.max(1, effectiveTime) / 60;
  const wpm = minutes > 0 ? Math.round((totalCharsTyped / 5) / minutes) : 0;
  const accuracy = totalCharsTyped > 0 
    ? Math.max(0, Math.round(((totalCharsTyped - charErrors) / totalCharsTyped) * 100)) 
    : 100;

  // Ghost Rival calculations
  const ghostTargetWpm = ghostRival === 'bot30' ? 30 : ghostRival === 'bot60' ? 60 : ghostRival === 'bot90' ? 90 : ghostRival === 'bot120' ? 120 : 0;
  const ghostWordsTyped = ghostTargetWpm > 0 ? (ghostTargetWpm / 60) * timeElapsed : 0;

  return (
    <div className={`transition-all duration-300 ${isZenMode ? 'max-w-3xl mx-auto py-12' : 'bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-4xl mx-auto shadow-2xl space-y-6'}`}>
      
      {/* Top Filter Bar (Hidden in Zen Mode) */}
      {!isZenMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2 sm:p-2.5 rounded-2xl border border-slate-800 text-xs">
          
          {/* Modes Pill */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setTestType('time')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                testType === 'time' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⏱️ Time
            </button>
            <button
              onClick={() => setTestType('words')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                testType === 'words' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 Words
            </button>
            <button
              onClick={() => setTestType('custom')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                testType === 'custom' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📄 Custom
            </button>
            <button
              onClick={() => setTestType('weak')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                testType === 'weak' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Generates words containing your weakest keys"
            >
              🎯 Weak Keys
            </button>
          </div>

          {/* Dictionary language selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl">
            {[
              { id: 'english', label: 'English' },
              { id: 'hinglish', label: '🇮🇳 Hinglish' },
              { id: 'code', label: '</> Code' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setVocabulary(v.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  vocabulary === v.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Sub-options based on active mode */}
          <div className="flex items-center gap-2">
            {testType === 'time' && (
              <div className="flex items-center gap-1 font-bold text-slate-400">
                {[15, 30, 60, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeLimit(t)}
                    className={`px-2 py-1 rounded-lg ${
                      timeLimit === t ? 'text-indigo-400 font-black underline' : 'hover:text-white'
                    }`}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            )}

            {testType === 'words' && (
              <div className="flex items-center gap-1 font-bold text-slate-400">
                {[10, 25, 50, 100].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWordCountLimit(w)}
                    className={`px-2 py-1 rounded-lg ${
                      wordCountLimit === w ? 'text-indigo-400 font-black underline' : 'hover:text-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}

            {testType === 'custom' && (
              <button
                onClick={() => setIsEditingCustom(!isEditingCustom)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold"
              >
                {isEditingCustom ? 'Close Editor' : 'Edit Text'}
              </button>
            )}

            {/* Punctuation toggle */}
            <button
              onClick={() => setIncludePunctuation(!includePunctuation)}
              className={`px-2 py-1 rounded-lg font-bold border transition-colors ${
                includePunctuation 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              !#
            </button>

            {/* Blind Mode Toggle */}
            <button
              onClick={() => setIsBlindMode(!isBlindMode)}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                isBlindMode 
                  ? 'bg-purple-600/30 text-purple-300 border-purple-500/50' 
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title="Blind Mode (Ghost Ink): Hides keystroke feedback to build pure muscle memory"
            >
              <span>👻</span> <span className="hidden sm:inline">Blind</span>
            </button>

            {/* Sudden Death Mode Toggle */}
            <button
              onClick={() => setIsSuddenDeath(!isSuddenDeath)}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                isSuddenDeath 
                  ? 'bg-rose-600/30 text-rose-300 border-rose-500/50' 
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title="Sudden Death: 1 typo terminates the test immediately"
            >
              <span>🎯</span> <span className="hidden sm:inline">Sudden Death</span>
            </button>

            {/* Ghost Rival Bot Selector */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
              <span className="text-slate-400 font-bold">Rival:</span>
              <select
                value={ghostRival}
                onChange={(e) => setGhostRival(e.target.value)}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="none" className="bg-slate-900 text-slate-300">Off</option>
                <option value="bot30" className="bg-slate-900 text-amber-300">🐢 30 WPM</option>
                <option value="bot60" className="bg-slate-900 text-amber-300">🤖 60 WPM</option>
                <option value="bot90" className="bg-slate-900 text-amber-300">⚡ 90 WPM</option>
                <option value="bot120" className="bg-slate-900 text-amber-300">👑 120 WPM</option>
              </select>
            </div>

            {/* Zen Mode Toggle */}
            <button
              onClick={() => setIsZenMode(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zen Focus Mode (Hide Distractions)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Exit Zen Button (Only when Zen Mode is active) */}
      {isZenMode && (
        <div className="text-right pb-2">
          <button
            onClick={() => setIsZenMode(false)}
            className="text-xs text-slate-500 hover:text-white flex items-center gap-1 ml-auto font-bold"
          >
            <EyeOff className="w-3.5 h-3.5" /> Exit Zen Mode
          </button>
        </div>
      )}

      {/* Custom Text Editor Drawer */}
      {isEditingCustom && testType === 'custom' && (
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-400 block">
            Paste your own text / notes to practice typing:
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste any article, homework, coding notes, or sentences here..."
            className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={() => {
              setIsEditingCustom(false);
              resetTest();
            }}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
          >
            Apply & Practice
          </button>
        </div>
      )}

      {/* Test Results Summary Card (When Finished) */}
      {isFinished ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 animate-pop">
          {suddenDeathFailed && (
            <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
              <span>🎯</span> Sudden Death Triggered: Test terminated immediately on first error!
            </div>
          )}
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
              Speed Test Complete
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {suddenDeathFailed ? 'Sudden Death Run Ended' : 'Your Final Typing Velocity'}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Speed</span>
              <span className="text-3xl font-black font-mono text-emerald-400 block mt-0.5">
                {wpm} <span className="text-xs text-slate-400">WPM</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-3xl font-black font-mono text-indigo-400 block mt-0.5">
                {accuracy}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
              <span className="text-3xl font-black font-mono text-white block mt-0.5">
                {effectiveTime}s
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Characters</span>
              <span className="text-3xl font-black font-mono text-amber-400 block mt-0.5">
                {totalCharsTyped}
              </span>
            </div>
          </div>

          {/* 📈 Interactive WPM Velocity Timeline Graph (Monkeytype signature) */}
          {wpmHistory.length >= 2 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 max-w-xl mx-auto space-y-2 text-left shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> WPM Velocity Curve
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                  Peak: {Math.max(...wpmHistory.map((h) => h.wpm))} WPM
                </span>
              </div>
              <div className="relative h-24 w-full pt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="25" x2="500" y2="25" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.5" />
                  {/* Area Fill & Curve */}
                  {(() => {
                    const maxW = Math.max(...wpmHistory.map((h) => h.wpm), wpm, 30);
                    const pts = wpmHistory.map((h, i) => {
                      const x = (i / Math.max(1, wpmHistory.length - 1)) * 500;
                      const y = 95 - (h.wpm / maxW) * 85;
                      return `${x},${y}`;
                    }).join(' ');
                    const areaPts = `0,100 ${pts} 500,100`;
                    return (
                      <>
                        <polygon points={areaPts} fill="url(#wpmGradient)" />
                        <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          )}

          {/* Ghost Rival Outcome (if active) */}
          {ghostRival !== 'none' && (
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">
                AI Ghost Rival Match ({ghostTargetWpm} WPM):
              </span>
              <span className={`font-black ${wpm >= ghostTargetWpm ? 'text-emerald-400' : 'text-rose-400'}`}>
                {wpm >= ghostTargetWpm ? '🏆 YOU WON THE RACE!' : '🤖 Ghost Rival Won! Keep Practicing!'}
              </span>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={resetTest}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-glow-accent"
            >
              <RotateCcw className="w-4 h-4" /> Try Again (or Tab)
            </button>
          </div>
        </div>
      ) : (
        /* Words Flow Stream */
        <div 
          onClick={() => inputRef.current && inputRef.current.focus()}
          className={`relative rounded-3xl p-6 sm:p-8 cursor-text min-h-[190px] flex flex-col justify-between transition-all ${
            isZenMode ? 'bg-transparent' : 'bg-slate-950 border-2 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Top Live Timer / Word Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-white text-base">
                {testType === 'time' ? `${timeLeft}s` : `${currentWordIndex} / ${generatedWords.length} words`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span>WPM: <strong className="text-emerald-400 font-bold">{wpm}</strong></span>
              <span>Acc: <strong className="text-indigo-400 font-bold">{accuracy}%</strong></span>
            </div>
          </div>

          {/* Live Ghost Rival Bar */}
          {ghostRival !== 'none' && isRunning && (
            <div className="py-2 px-3 bg-slate-900/80 rounded-xl border border-slate-800 my-2 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">
                  🚗 You: {currentWordIndex} words
                </span>
                <span className="text-amber-400 font-bold">
                  🤖 Ghost ({ghostTargetWpm} WPM): {Math.round(ghostWordsTyped)} words
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full transition-all duration-200 z-10"
                  style={{ width: `${Math.min(100, (currentWordIndex / Math.max(1, generatedWords.length)) * 100)}%` }}
                />
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-amber-400/80 rounded-full transition-all duration-500 z-0"
                  style={{ width: `${Math.min(100, (ghostWordsTyped / Math.max(1, generatedWords.length)) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Hidden Typing Input */}
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            autoFocus
          />

          {/* Flowing Word Stream */}
          <div className="py-4 font-mono text-xl sm:text-2xl leading-loose flex flex-wrap gap-x-3 gap-y-1.5 select-none max-h-48 overflow-hidden">
            {generatedWords.map((word, wIdx) => {
              const isPast = wIdx < currentWordIndex;
              const isCurrent = wIdx === currentWordIndex;
              const wordResult = wordResults[wIdx];

              let wordColor = 'text-slate-500';
              if (isPast) {
                wordColor = wordResult === 'correct' ? 'text-emerald-400/80' : 'text-rose-500/80 line-through';
              } else if (isCurrent) {
                wordColor = 'text-white font-bold bg-slate-800/80 px-2 py-0.5 rounded-lg';
              }

              return (
                <span key={wIdx} className={`relative transition-colors ${wordColor}`}>
                  {isCurrent ? (
                    <span>
                      {word.split('').map((char, cIdx) => {
                        const typedChar = currentInput[cIdx];
                        let charStyle = 'text-slate-300';
                        if (typedChar !== undefined) {
                          if (isBlindMode) {
                            charStyle = 'text-purple-400 font-bold';
                          } else {
                            charStyle = typedChar === char ? 'text-emerald-400 font-black' : 'text-rose-500 font-black underline';
                          }
                        }
                        return (
                          <span key={cIdx} className={charStyle}>
                            {isBlindMode && typedChar !== undefined ? '•' : char}
                          </span>
                        );
                      })}
                      {/* Trailing overflow if typed extra letters */}
                      {currentInput.length > word.length && (
                        <span className="text-rose-500 font-black">
                          {currentInput.slice(word.length)}
                        </span>
                      )}
                    </span>
                  ) : (
                    word
                  )}
                </span>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Space</kbd>
              to submit word • <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Tab</kbd> to restart
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                resetTest();
              }}
              className="p-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
