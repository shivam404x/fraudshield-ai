import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Cpu, 
  AlertTriangle, 
  RotateCcw, 
  ArrowLeft,
  Crosshair,
  Bug,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playKeySound, playErrorSound, playSuccessChime, playNitroSound } from '../utils/soundEffects';

const THREAT_NODES = [
  'trojan', 'payload', 'exploit', 'rootkit', 'malware', 'phishing', 
  'zero_day', 'ddos', 'cipher', 'packet', 'firewall', 'backdoor', 
  'buffer', 'kernel', 'daemon', 'inject', 'proxy', 'matrix', 'crypto'
];

export const CyberHackerGame = ({ onExit, soundProfile, volume = 0.5 }) => {
  const [gameState, setGameState] = useState('briefing'); // 'briefing' | 'active' | 'victory' | 'breached'
  const [firewallHealth, setFirewallHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [empCharge, setEmpCharge] = useState(0); // 0 to 100%
  const [threats, setThreats] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [terminalLog, setTerminalLog] = useState([
    'SYSTEM BOOT: Secure Mainframe Terminal Active.',
    'WARNING: Unauthorized intrusion detected from unknown subnets.',
    'DIRECTIVE: Type threat payloads to neutralize breach vectors.'
  ]);

  const inputRef = useRef(null);

  // Focus input on active game
  useEffect(() => {
    if (gameState === 'active' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Start new game
  const startGame = () => {
    setFirewallHealth(100);
    setScore(0);
    setWave(1);
    setEmpCharge(0);
    setThreats([]);
    setCurrentInput('');
    setTerminalLog(['FIREWALL PROTOCOL INITIATED.', 'Incoming malware packets incoming...']);
    setGameState('active');
  };

  // Threat Spawner
  useEffect(() => {
    if (gameState !== 'active') return;

    const spawnRate = Math.max(1400, 2600 - wave * 300);
    const interval = setInterval(() => {
      setThreats((prev) => {
        if (prev.length >= 6) return prev;
        const randomWord = THREAT_NODES[Math.floor(Math.random() * THREAT_NODES.length)];
        const threatId = Date.now() + Math.random();

        return [
          ...prev,
          {
            id: threatId,
            word: randomWord,
            hp: randomWord.length,
            distance: 100, // 100% (far) -> 0% (breach)
            speed: 0.8 + wave * 0.25
          }
        ];
      });
    }, spawnRate);

    return () => clearInterval(interval);
  }, [gameState, wave]);

  // Threats movement ticker towards Firewall
  useEffect(() => {
    if (gameState !== 'active') return;

    const moveInterval = setInterval(() => {
      setThreats((prev) => {
        const nextList = [];
        let damageToFirewall = 0;

        prev.forEach((t) => {
          const nextDist = t.distance - t.speed;
          if (nextDist <= 0) {
            // Hit firewall!
            damageToFirewall += 15;
            setTerminalLog((log) => [
              `[CRITICAL] Breach vector "${t.word}" damaged firewall! (-15 HP)`,
              ...log.slice(0, 5)
            ]);
            playErrorSound(volume);
          } else {
            nextList.push({ ...t, distance: nextDist });
          }
        });

        if (damageToFirewall > 0) {
          setFirewallHealth((hp) => {
            const nextHp = hp - damageToFirewall;
            if (nextHp <= 0) {
              setGameState('breached');
              return 0;
            }
            return nextHp;
          });
        }

        return nextList;
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [gameState, volume]);

  // Handle typing commands
  const handleInputChange = (e) => {
    if (gameState !== 'active') return;
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(e.target.value);
    playKeySound(soundProfile, volume);

    // Check if typed text matches any threat
    const matchedIdx = threats.findIndex((t) => t.word === val);

    if (matchedIdx !== -1) {
      const neutralized = threats[matchedIdx];
      playSuccessChime(volume);

      setScore((s) => s + neutralized.word.length * 20);
      setEmpCharge((prev) => Math.min(100, prev + 25));
      setTerminalLog((log) => [
        `[SUCCESS] Payload "${neutralized.word}" intercepted and decrypted.`,
        ...log.slice(0, 5)
      ]);

      // Remove from screen
      setThreats((prev) => prev.filter((_, idx) => idx !== matchedIdx));
      setCurrentInput('');

      // Wave advancement check
      setScore((currentScore) => {
        if (currentScore > wave * 300) {
          setWave((w) => w + 1);
          setTerminalLog((log) => [`>>> ADVANCING TO DEFENSE WAVE ${wave + 1} <<<`, ...log.slice(0, 5)]);
        }
        return currentScore;
      });
    }
  };

  // Trigger EMP Surge
  const triggerEmpBlast = () => {
    if (empCharge < 100 || gameState !== 'active') return;

    playNitroSound(volume);
    setThreats([]);
    setEmpCharge(0);
    setScore((s) => s + 200);
    setTerminalLog((log) => [
      '⚡ [EMP SHOCKWAVE FIRED] All active threat nodes wiped from memory!',
      ...log.slice(0, 5)
    ]);

    try {
      confetti({ particleCount: 70, spread: 100, origin: { y: 0.5 } });
    } catch {}
  };

  return (
    <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-[0_0_40px_rgba(16,185,129,0.15)] font-mono text-emerald-400 space-y-4">
      
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Terminal
        </button>

        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-black tracking-widest uppercase">Cyber Defense Mainframe v2.6</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Score: <strong className="text-emerald-300 font-bold">{score}</strong></span>
          <span className="text-slate-400">Wave: <strong className="text-emerald-300 font-bold">{wave}</strong></span>
        </div>
      </div>

      {/* Firewall & EMP Status Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Firewall Health Bar */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldAlert className={`w-3.5 h-3.5 ${firewallHealth < 30 ? 'text-rose-500 animate-ping' : 'text-emerald-400'}`} />
              Firewall Integrity
            </span>
            <span className={firewallHealth < 40 ? 'text-rose-400 font-black' : 'text-emerald-400'}>
              {firewallHealth}%
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-emerald-500/20">
            <div 
              className={`h-full transition-all duration-300 ${
                firewallHealth > 50 ? 'bg-emerald-500' : firewallHealth > 25 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${firewallHealth}%` }}
            />
          </div>
        </div>

        {/* EMP Overclock Surge */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> EMP Overclock Surge
              </span>
              <span className="text-cyan-400">{empCharge}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/20">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${empCharge}%` }}
              />
            </div>
          </div>

          <button
            onClick={triggerEmpBlast}
            disabled={empCharge < 100 || gameState !== 'active'}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 ${
              empCharge >= 100 && gameState === 'active'
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_#06b6d4] animate-pulse cursor-pointer'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            ⚡ EMP Blast
          </button>
        </div>
      </div>

      {/* Cyber Battle Grid / Threat Display */}
      <div className="relative h-64 sm:h-72 bg-slate-950 rounded-2xl border-2 border-emerald-500/30 p-4 overflow-hidden flex flex-col justify-between shadow-inner">
        
        {/* Background Grid Scanlines */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        {/* Threats approaching Firewall Line */}
        <div className="relative flex-1">
          {threats.map((threat) => {
            const isTargetPrefix = currentInput.trim() && threat.word.startsWith(currentInput.trim().toLowerCase());
            return (
              <div
                key={threat.id}
                className={`absolute transition-all duration-150 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black ${
                  isTargetPrefix
                    ? 'bg-cyan-500 text-slate-950 border-white shadow-[0_0_20px_#22d3ee] scale-110'
                    : 'bg-slate-900/90 text-emerald-300 border-emerald-500/50 shadow-md'
                }`}
                style={{
                  left: `${threat.distance}%`,
                  top: `${(threat.id % 5) * 18 + 10}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>{threat.word}</span>
                <span className="text-[10px] text-slate-400 font-mono">[{Math.round(threat.distance)}m]</span>
              </div>
            );
          })}
        </div>

        {/* Firewall Boundary Line */}
        <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-black tracking-widest text-emerald-400 pt-2 border-t-2 border-dashed border-emerald-500/60">
          <span>[🛡️ FIREWALL DEFENSE PERIMETER]</span>
          <span className="text-slate-400">STATUS: {firewallHealth > 0 ? 'ONLINE' : 'BREACHED'}</span>
        </div>

        {/* Overlay for Briefing or Game Over */}
        {gameState !== 'active' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {gameState === 'breached' ? (
              <div className="space-y-3">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-rose-500">MAINFRAME BREACHED!</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Firewall collapsed under threat overload. You neutralized {score / 20} vectors and survived to Wave {wave}.
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 mx-auto shadow-[0_0_15px_#10b981]"
                >
                  <RotateCcw className="w-4 h-4" /> Re-engage Firewall
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white">Operation: Matrix Defense</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cyber attacks are targeting the core mainframe. Type each incoming payload accurately before it reaches your firewall. Charge 100% EMP to release an instant shockwave!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-[0_0_20px_#10b981] active:scale-95 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" /> Launch Defense System
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Input Console & Terminal Log */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Active Command Input */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" /> Command Prompt
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-emerald-400 font-mono font-bold">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              disabled={gameState !== 'active'}
              placeholder={gameState === 'active' ? "Type threat payload to decrypt..." : "System idle"}
              className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl pl-8 pr-4 py-3 font-mono text-sm text-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 shadow-inner"
            />
          </div>
        </div>

        {/* Live Terminal Diagnostic Log */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-2.5 text-[10px] font-mono h-24 overflow-y-auto space-y-1">
          <div className="text-slate-500 uppercase font-black text-[9px] pb-1 border-b border-slate-800">
            Console Log
          </div>
          {terminalLog.map((line, idx) => (
            <div key={idx} className="text-slate-400 truncate">
              {line}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
