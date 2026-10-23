import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Code2, 
  Mic, 
  FileText, 
  RotateCcw, 
  Play, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Terminal,
  Layers,
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime } from '../utils/soundEffects';

const CODE_PRESETS = {
  javascript: {
    name: 'JavaScript / React',
    icon: '⚡',
    code: `const fetchUserData = async (userId) => {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) throw new Error("User not found");
    const data = await res.json();
    return { ...data, timestamp: Date.now() };
  } catch (err) {
    console.error("Fetch error:", err.message);
    return null;
  }
};`
  },
  python: {
    name: 'Python 3',
    icon: '🐍',
    code: `def calculate_fibonacci(n: int) -> list:
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]`
  },
  cpp: {
    name: 'C++ Modern',
    icon: '⚙️',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 2, 9, 1, 7};
    std::sort(numbers.begin(), numbers.end());
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    return 0;
}`
  },
  html: {
    name: 'HTML & CSS',
    icon: '🌐',
    code: `<div class="card-container">
  <h2 class="title">Welcome to TypeMaster</h2>
  <p class="description">Elevate your typing velocity to 100+ WPM.</p>
  <button class="btn btn-primary" onclick="startTest()">Launch</button>
</div>`
  },
  sql: {
    name: 'SQL Database',
    icon: '🗄️',
    code: `SELECT u.id, u.username, COUNT(l.id) AS completed_lessons, AVG(s.wpm) AS average_wpm
FROM users u
LEFT JOIN lessons l ON u.id = l.user_id
LEFT JOIN speed_stats s ON u.id = s.user_id
GROUP BY u.id, u.username
HAVING AVG(s.wpm) >= 80
ORDER BY average_wpm DESC;`
  }
};

const AUDIO_DICTATION_PRESETS = [
  { text: "Consistency and daily deliberate practice form the foundation of high-speed touch typing.", category: "Proverb" },
  { text: "The artificial intelligence algorithm processes neural network weights with lightning speed.", category: "Technology" },
  { text: "Stay hungry, stay foolish, and never compromise on your creative vision.", category: "Inspiration" },
  { text: "Quantum computing harnesses superposition and entanglement to solve intractable problems.", category: "Science" },
  { text: "Precision keyboard reflexes allow professional developers to code at the speed of thought.", category: "Productivity" }
];

const BOOK_EXCERPTS = [
  {
    title: "Steve Jobs Stanford Speech",
    text: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma, which is living with the results of other people's thinking. Have the courage to follow your heart and intuition."
  },
  {
    title: "Cyberpunk 2077: Night City Lore",
    text: "Night City was founded with a dream of a gleaming utopia where corporations and technology would liberate humanity from decay. Instead, towering neon monoliths cast deep shadows across chrome-plated streets."
  },
  {
    title: "Neil Armstrong Moon Landing (1969)",
    text: "That's one small step for man, one giant leap for mankind. The lunar module has touched down on the Sea of Tranquility, surrounded by ancient cosmic dust."
  }
];

export const CustomCodeStudio = ({ soundProfile, volume = 0.5, onAddXp }) => {
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'audio' | 'custom'
  
  // Code Tab state
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [targetCode, setTargetCode] = useState(CODE_PRESETS.javascript.code);
  const [codeTyped, setCodeTyped] = useState('');
  const [codeStartTime, setCodeStartTime] = useState(null);
  const [codeFinished, setCodeFinished] = useState(false);
  const [codeErrors, setCodeErrors] = useState(0);

  // Audio Dictation state
  const [audioIndex, setAudioIndex] = useState(0);
  const [audioInput, setAudioInput] = useState('');
  const [audioSpeechRate, setAudioSpeechRate] = useState(1.0);
  const [audioRevealedHint, setAudioRevealedHint] = useState(false);
  const [audioScore, setAudioScore] = useState(0);
  const [audioSuccess, setAudioSuccess] = useState(false);

  // Custom Text state
  const [customInputArea, setCustomInputArea] = useState('');
  const [activeCustomPractice, setActiveCustomPractice] = useState('');
  const [customTyped, setCustomTyped] = useState('');
  const [customStartTime, setCustomStartTime] = useState(null);
  const [customFinished, setCustomFinished] = useState(false);

  const codeInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const customInputRef = useRef(null);

  // Switch code preset
  const handleSelectLang = (key) => {
    setSelectedLang(key);
    setTargetCode(CODE_PRESETS[key].code);
    setCodeTyped('');
    setCodeStartTime(null);
    setCodeFinished(false);
    setCodeErrors(0);
  };

  // Handle typing in Code Lab
  const handleCodeChange = (e) => {
    if (codeFinished) return;
    const val = e.target.value;

    if (!codeStartTime) setCodeStartTime(Date.now());
    playKeySound(soundProfile, volume);

    // Track errors
    const lastChar = val[val.length - 1];
    const expectedChar = targetCode[val.length - 1];
    if (lastChar && expectedChar && lastChar !== expectedChar) {
      setCodeErrors((er) => er + 1);
      playErrorSound(soundProfile, volume);
    }

    setCodeTyped(val);

    if (val.length >= targetCode.length) {
      setCodeFinished(true);
      playSuccessChime(volume);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onAddXp) onAddXp(200);
    }
  };

  // Calculate Code Stats
  const codeStats = useMemo(() => {
    if (!codeStartTime) return { wpm: 0, accuracy: 100, time: 0 };
    const elapsedMinutes = (Date.now() - codeStartTime) / 60000;
    const words = codeTyped.length / 5;
    const wpm = elapsedMinutes > 0 ? Math.round(words / elapsedMinutes) : 0;
    const accuracy = codeTyped.length > 0 
      ? Math.max(0, Math.round(((codeTyped.length - codeErrors) / codeTyped.length) * 100))
      : 100;
    return { wpm, accuracy, time: Math.round(elapsedMinutes * 60) };
  }, [codeStartTime, codeTyped, codeErrors]);

  // Audio Speech Synthesis Trigger
  const speakCurrentText = () => {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(AUDIO_DICTATION_PRESETS[audioIndex].text);
    utterance.rate = audioSpeechRate;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Handle audio dictation input
  const handleAudioInput = (e) => {
    const val = e.target.value;
    setAudioInput(val);
    playKeySound(soundProfile, volume);

    const target = AUDIO_DICTATION_PRESETS[audioIndex].text;
    if (val.trim().toLowerCase() === target.trim().toLowerCase()) {
      setAudioSuccess(true);
      playSuccessChime(volume);
      setAudioScore((s) => s + 100);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      if (onAddXp) onAddXp(150);

      setTimeout(() => {
        setAudioSuccess(false);
        setAudioInput('');
        setAudioRevealedHint(false);
        setAudioIndex((idx) => (idx + 1) % AUDIO_DICTATION_PRESETS.length);
      }, 1500);
    }
  };

  // Custom practice load
  const loadCustomText = (text) => {
    setActiveCustomPractice(text);
    setCustomTyped('');
    setCustomStartTime(null);
    setCustomFinished(false);
  };

  const handleCustomChange = (e) => {
    if (customFinished) return;
    const val = e.target.value;
    if (!customStartTime) setCustomStartTime(Date.now());
    playKeySound(soundProfile, volume);
    setCustomTyped(val);

    if (val.length >= activeCustomPractice.length) {
      setCustomFinished(true);
      playSuccessChime(volume);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onAddXp) onAddXp(150);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Studio Header & Sub Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Code & Dictation Studio
              </h2>
              <p className="text-xs text-slate-400">
                Practice real-world programming languages, audio transcription, or custom texts.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Studio Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" /> Developer Code Lab
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audio' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" /> Listen & Type (Dictation)
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Custom Books & Text
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DEVELOPER CODE LAB */}
      {/* ============================================================== */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          
          {/* Language Selector Bar & Live Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {Object.keys(CODE_PRESETS).map((key) => {
                const lang = CODE_PRESETS[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectLang(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedLang === key 
                        ? 'bg-slate-800 text-indigo-300 border border-indigo-500/50 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{lang.icon}</span> {lang.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">
                Speed: <strong className="text-emerald-400 font-bold">{codeStats.wpm} WPM</strong>
              </span>
              <span className="text-slate-400">
                Accuracy: <strong className="text-indigo-400 font-bold">{codeStats.accuracy}%</strong>
              </span>
              <button
                onClick={() => handleSelectLang(selectedLang)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Reset Code Practice"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code IDE Window */}
          <div 
            onClick={() => codeInputRef.current && codeInputRef.current.focus()}
            className="relative rounded-3xl bg-[#0d1117] border-2 border-slate-800 p-6 font-mono text-sm leading-relaxed shadow-2xl overflow-hidden cursor-text min-h-[300px]"
          >
            {/* Top Mac-style dots */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-400 font-bold">{CODE_PRESETS[selectedLang].name} snippet</span>
              </div>
              <span>Click anywhere inside editor to type</span>
            </div>

            {/* Hidden Textarea */}
            <textarea
              ref={codeInputRef}
              value={codeTyped}
              onChange={handleCodeChange}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              autoFocus
              spellCheck="false"
            />

            {/* Code Display with Syntax Feedback */}
            <pre className="whitespace-pre-wrap select-none text-base">
              {targetCode.split('').map((char, idx) => {
                const typedChar = codeTyped[idx];
                const isCurrent = idx === codeTyped.length;
                let color = 'text-slate-600';

                if (typedChar !== undefined) {
                  color = typedChar === char ? 'text-emerald-400 font-bold' : 'text-rose-500 bg-rose-950/60 font-black';
                }

                return (
                  <span key={idx} className={`relative ${color} ${isCurrent ? 'bg-indigo-600/40 text-white underline font-bold' : ''}`}>
                    {char}
                  </span>
                );
              })}
            </pre>

            {/* Completion Ribbon */}
            {codeFinished && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-black text-white">Code Snippet Completed!</h4>
                    <p className="text-xs text-emerald-300">
                      Velocity: {codeStats.wpm} WPM • Accuracy: {codeStats.accuracy}% • Earned +200 XP
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectLang(selectedLang)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase"
                >
                  Type Next Snippet
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: AUDIO DICTATION MODE */}
      {/* ============================================================== */}
      {activeTab === 'audio' && (
        <div className="max-w-3xl mx-auto space-y-4">
          
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-cyan-900/50 shadow-2xl text-center space-y-6">
            
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
                🎙️ Audio Dictation & Transcription Training
              </span>
              <h3 className="text-2xl font-black text-white">
                Listen to the Voice & Type What You Hear!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Train your professional transcription skills. Press the audio button to hear the sentence spoken, then type it with perfect spelling.
              </p>
            </div>

            {/* Audio Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
              <button
                onClick={speakCurrentText}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition-all"
              >
                <Volume2 className="w-5 h-5 fill-slate-950" /> Play Voice Audio
              </button>

              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold">Speech Rate:</span>
                {[0.75, 1.0, 1.25].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setAudioSpeechRate(rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      audioSpeechRate === rate ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setAudioRevealedHint(!audioRevealedHint)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-800"
              >
                {audioRevealedHint ? 'Hide Hint' : 'Reveal Hint 💡'}
              </button>
            </div>

            {/* Hint Box (if revealed) */}
            {audioRevealedHint && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono max-w-lg mx-auto">
                Hint: "{AUDIO_DICTATION_PRESETS[audioIndex].text}"
              </div>
            )}

            {/* Typing Box */}
            <div className="space-y-3 max-w-xl mx-auto">
              <input
                ref={audioInputRef}
                type="text"
                value={audioInput}
                onChange={handleAudioInput}
                placeholder="Listen and type sentence here..."
                className={`w-full px-5 py-3.5 rounded-2xl bg-slate-950 border-2 text-white font-mono text-center text-base focus:outline-none transition-all ${
                  audioSuccess 
                    ? 'border-emerald-400 shadow-[0_0_25px_#10b981]' 
                    : 'border-slate-800 focus:border-cyan-400'
                }`}
                autoFocus
              />

              {audioSuccess && (
                <div className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" /> Perfect Audio Match! Next sentence loading...
                </div>
              )}
            </div>

            {/* Bottom Progress */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
              <span>Sentence {audioIndex + 1} of {AUDIO_DICTATION_PRESETS.length}</span>
              <span className="text-cyan-400 font-bold">Score: {audioScore} pts</span>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CUSTOM TEXT & BOOK EXCERPTS */}
      {/* ============================================================== */}
      {activeTab === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Preset Excerpts or Paste Box */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" /> Classic Literature
              </h3>
              <div className="space-y-2">
                {BOOK_EXCERPTS.map((b, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadCustomText(b.text)}
                    className="w-full text-left p-3 rounded-2xl bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800/80 hover:border-purple-500/40 transition-all text-xs text-slate-300 font-bold block"
                  >
                    {b.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Paste Your Own Text
              </h3>
              <textarea
                value={customInputArea}
                onChange={(e) => setCustomInputArea(e.target.value)}
                placeholder="Paste any article, homework, or speech to practice..."
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => {
                  if (customInputArea.trim()) loadCustomText(customInputArea.trim());
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase"
              >
                Load Custom Practice
              </button>
            </div>
          </div>

          {/* Right 2 Columns: Practice Arena */}
          <div className="md:col-span-2">
            {activeCustomPractice ? (
              <div 
                onClick={() => customInputRef.current && customInputRef.current.focus()}
                className="p-6 rounded-3xl bg-slate-950 border-2 border-purple-900/60 min-h-[350px] flex flex-col justify-between cursor-text"
              >
                <div className="pb-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-purple-400">Custom Reading Passage</span>
                  <span>Typed: {customTyped.length} / {activeCustomPractice.length} characters</span>
                </div>

                <textarea
                  ref={customInputRef}
                  value={customTyped}
                  onChange={handleCustomChange}
                  className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  autoFocus
                />

                <div className="py-4 text-lg font-serif leading-relaxed text-slate-400 select-none">
                  {activeCustomPractice.split('').map((char, idx) => {
                    const typed = customTyped[idx];
                    let style = 'text-slate-500';
                    if (typed !== undefined) {
                      style = typed === char ? 'text-emerald-400 font-bold' : 'text-rose-500 font-black underline';
                    }
                    return (
                      <span key={idx} className={style}>
                        {char}
                      </span>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Click anywhere to resume typing</span>
                  {customFinished && (
                    <span className="text-emerald-400 font-bold">
                      🎉 Reading Passage Completed! +150 XP
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-950/50 border-2 border-dashed border-slate-800 text-center flex flex-col items-center justify-center min-h-[350px]">
                <FileText className="w-12 h-12 text-slate-700 mb-3" />
                <h4 className="text-base font-bold text-white">No Reading Passage Loaded</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Pick a classic book excerpt from the left, or paste your own custom document to start.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
