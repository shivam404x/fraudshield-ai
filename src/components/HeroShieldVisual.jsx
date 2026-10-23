import React from 'react';

export default function HeroShieldVisual() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" className="w-full h-auto select-none" fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb"/>
          <stop offset="50%" stopColor="#4f46e5"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="shieldGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08"/>
        </linearGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a"/>
          <stop offset="100%" stopColor="#1e293b"/>
        </linearGradient>
        <linearGradient id="goldChip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#d97706"/>
        </linearGradient>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.18"/>
        </filter>
        <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#3b82f6" floodOpacity="0.35"/>
        </filter>
      </defs>

      {/* Ambient Backdrop */}
      <rect width="600" height="400" rx="20" fill="#f8fafc"/>

      {/* Grid Pattern */}
      <g opacity="0.4" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="4 4">
        <line x1="40" y1="80" x2="560" y2="80"/>
        <line x1="40" y1="160" x2="560" y2="160"/>
        <line x1="40" y1="240" x2="560" y2="240"/>
        <line x1="40" y1="320" x2="560" y2="320"/>
        <line x1="150" y1="30" x2="150" y2="370"/>
        <line x1="300" y1="30" x2="300" y2="370"/>
        <line x1="450" y1="30" x2="450" y2="370"/>
      </g>

      {/* Platform Ellipse */}
      <ellipse cx="300" cy="340" rx="200" ry="32" fill="#e2e8f0" opacity="0.6"/>
      <ellipse cx="300" cy="336" rx="160" ry="24" fill="#cbd5e1" opacity="0.4"/>

      {/* Payment Card (Behind Shield) */}
      <g transform="translate(130, 95) rotate(-6)" filter="url(#cardShadow)">
        <rect width="320" height="195" rx="16" fill="url(#cardGrad)"/>
        <rect width="320" height="195" rx="16" fill="none" stroke="#334155" strokeWidth="1.5"/>
        
        {/* Decorative Wave */}
        <path d="M 0,80 Q 160,20 320,70 L 320,195 L 0,195 Z" fill="#3b82f6" opacity="0.15"/>
        <circle cx="280" cy="45" r="30" fill="#6366f1" opacity="0.25"/>

        {/* EMV Chip */}
        <rect x="32" y="55" width="42" height="34" rx="6" fill="url(#goldChip)"/>
        <path d="M 32,72 L 74,72 M 53,55 L 53,89" stroke="#92400e" strokeWidth="1"/>

        {/* Contactless wave */}
        <path d="M 90,62 A 12 12 0 0 1 90,82 M 97,58 A 18 18 0 0 1 97,86" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round"/>

        {/* Card text */}
        <text x="32" y="135" fill="#f8fafc" fontFamily="monospace" fontSize="14" fontWeight="700" letterSpacing="2">•••• •••• •••• 4242</text>
        <text x="32" y="165" fill="#94a3b8" fontFamily="sans-serif" fontSize="10" fontWeight="600" letterSpacing="1">VERIFIED SHOPPER</text>
        <text x="210" y="165" fill="#94a3b8" fontFamily="sans-serif" fontSize="10" fontWeight="600">EXP 08/29</text>

        {/* Mastercard circles */}
        <circle cx="260" cy="145" r="16" fill="#ef4444" opacity="0.9"/>
        <circle cx="282" cy="145" r="16" fill="#f59e0b" opacity="0.9"/>
      </g>

      {/* Central Luminous Defense Shield */}
      <g transform="translate(230, 45)" filter="url(#glowFilter)">
        {/* Shield Outer */}
        <path d="M 70,0 C 130,0 140,25 140,80 C 140,150 90,205 70,225 C 50,205 0,150 0,80 C 0,25 10,0 70,0 Z" 
              fill="url(#shieldGrad)"/>
        
        {/* Shield Inner Glass */}
        <path d="M 70,8 C 122,8 132,30 132,80 C 132,143 88,193 70,212 C 52,193 8,143 8,80 C 8,30 18,8 70,8 Z" 
              fill="url(#shieldGlass)" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6"/>

        {/* White Check Circle */}
        <circle cx="70" cy="95" r="32" fill="#ffffff" opacity="0.95"/>
        <path d="M 57,95 L 66,104 L 84,84" stroke="#2563eb" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        
        <text x="70" y="152" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif" fontSize="11" fontWeight="800" letterSpacing="1">FRAUDSHIELD</text>
      </g>

      {/* Floating Badge 1: 0-100 Risk Score */}
      <g transform="translate(45, 175)" filter="url(#cardShadow)">
        <rect width="160" height="60" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5"/>
        <circle cx="28" cy="30" r="13" fill="#ecfdf5"/>
        <path d="M 23,30 L 27,34 L 33,27" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <text x="48" y="25" fill="#64748b" fontFamily="sans-serif" fontSize="9" fontWeight="700">FRAUD RISK SCORE</text>
        <text x="48" y="45" fill="#0f172a" fontFamily="sans-serif" fontSize="17" fontWeight="800">4.0 <tspan fontSize="11" fill="#10b981" fontWeight="700">LOW RISK</tspan></text>
      </g>

      {/* Floating Badge 2: Latency */}
      <g transform="translate(385, 220)" filter="url(#cardShadow)">
        <rect width="170" height="60" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5"/>
        <circle cx="28" cy="30" r="13" fill="#eff6ff"/>
        <path d="M 28,23 L 28,30 L 33,30" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <text x="48" y="25" fill="#64748b" fontFamily="sans-serif" fontSize="9" fontWeight="700">INLINE EVALUATION</text>
        <text x="48" y="45" fill="#0f172a" fontFamily="sans-serif" fontSize="17" fontWeight="800">&lt; 15ms <tspan fontSize="10" fill="#3b82f6" fontWeight="700">REAL-TIME</tspan></text>
      </g>

      {/* Floating Badge 3: 3DS Intervention */}
      <g transform="translate(390, 50)" filter="url(#cardShadow)">
        <rect width="165" height="50" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5"/>
        <circle cx="24" cy="25" r="10" fill="#fdf4ff"/>
        <path d="M 24,19 L 24,27 M 20,23 L 28,23" stroke="#c026d3" strokeWidth="2" strokeLinecap="round"/>
        <text x="42" y="22" fill="#64748b" fontFamily="sans-serif" fontSize="8.5" fontWeight="700">3DS 2.0 PROTOCOL</text>
        <text x="42" y="37" fill="#9333ea" fontFamily="sans-serif" fontSize="11" fontWeight="800">ZERO FRICTION</text>
      </g>
    </svg>
  );
}
