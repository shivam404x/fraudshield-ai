// Key-to-finger mapping for standard QWERTY Touch Typing
// Fingers:
// LP = Left Pinky (Red / Rose)
// LR = Left Ring (Orange)
// LM = Left Middle (Yellow)
// LI = Left Index (Green)
// TH = Thumbs (Sky Blue - Spacebar)
// RI = Right Index (Indigo)
// RM = Right Middle (Purple)
// RR = Right Ring (Pink)
// RP = Right Pinky (Rose)

export const FINGER_MAP = {
  // Numbers row
  '`': { finger: 'lp', hand: 'left', name: 'Left Pinky' },
  '1': { finger: 'lp', hand: 'left', name: 'Left Pinky' },
  '2': { finger: 'lr', hand: 'left', name: 'Left Ring' },
  '3': { finger: 'lm', hand: 'left', name: 'Left Middle' },
  '4': { finger: 'li', hand: 'left', name: 'Left Index' },
  '5': { finger: 'li', hand: 'left', name: 'Left Index' },
  '6': { finger: 'ri', hand: 'right', name: 'Right Index' },
  '7': { finger: 'ri', hand: 'right', name: 'Right Index' },
  '8': { finger: 'rm', hand: 'right', name: 'Right Middle' },
  '9': { finger: 'rr', hand: 'right', name: 'Right Ring' },
  '0': { finger: 'rp', hand: 'right', name: 'Right Pinky' },
  '-': { finger: 'rp', hand: 'right', name: 'Right Pinky' },
  '=': { finger: 'rp', hand: 'right', name: 'Right Pinky' },

  // Top row
  'q': { finger: 'lp', hand: 'left', name: 'Left Pinky' },
  'w': { finger: 'lr', hand: 'left', name: 'Left Ring' },
  'e': { finger: 'lm', hand: 'left', name: 'Left Middle' },
  'r': { finger: 'li', hand: 'left', name: 'Left Index' },
  't': { finger: 'li', hand: 'left', name: 'Left Index' },
  'y': { finger: 'ri', hand: 'right', name: 'Right Index' },
  'u': { finger: 'ri', hand: 'right', name: 'Right Index' },
  'i': { finger: 'rm', hand: 'right', name: 'Right Middle' },
  'o': { finger: 'rr', hand: 'right', name: 'Right Ring' },
  'p': { finger: 'rp', hand: 'right', name: 'Right Pinky' },
  '[': { finger: 'rp', hand: 'right', name: 'Right Pinky' },
  ']': { finger: 'rp', hand: 'right', name: 'Right Pinky' },
  '\\': { finger: 'rp', hand: 'right', name: 'Right Pinky' },

  // Home row (Most Important!)
  'a': { finger: 'lp', hand: 'left', name: 'Left Pinky', isHome: true },
  's': { finger: 'lr', hand: 'left', name: 'Left Ring', isHome: true },
  'd': { finger: 'lm', hand: 'left', name: 'Left Middle', isHome: true },
  'f': { finger: 'li', hand: 'left', name: 'Left Index', isHome: true, hasBump: true },
  'g': { finger: 'li', hand: 'left', name: 'Left Index' },
  'h': { finger: 'ri', hand: 'right', name: 'Right Index' },
  'j': { finger: 'ri', hand: 'right', name: 'Right Index', isHome: true, hasBump: true },
  'k': { finger: 'rm', hand: 'right', name: 'Right Middle', isHome: true },
  'l': { finger: 'rr', hand: 'right', name: 'Right Ring', isHome: true },
  ';': { finger: 'rp', hand: 'right', name: 'Right Pinky', isHome: true },
  "'": { finger: 'rp', hand: 'right', name: 'Right Pinky' },

  // Bottom row
  'z': { finger: 'lp', hand: 'left', name: 'Left Pinky' },
  'x': { finger: 'lr', hand: 'left', name: 'Left Ring' },
  'c': { finger: 'lm', hand: 'left', name: 'Left Middle' },
  'v': { finger: 'li', hand: 'left', name: 'Left Index' },
  'b': { finger: 'li', hand: 'left', name: 'Left Index' },
  'n': { finger: 'ri', hand: 'right', name: 'Right Index' },
  'm': { finger: 'ri', hand: 'right', name: 'Right Index' },
  ',': { finger: 'rm', hand: 'right', name: 'Right Middle' },
  '.': { finger: 'rr', hand: 'right', name: 'Right Ring' },
  '/': { finger: 'rp', hand: 'right', name: 'Right Pinky' },

  // Space
  ' ': { finger: 'th', hand: 'both', name: 'Thumb' }
};

export const FINGER_COLORS = {
  lp: { bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400', dot: 'bg-rose-500', hex: '#f43f5e' },
  lr: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', dot: 'bg-orange-500', hex: '#fb923c' },
  lm: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', dot: 'bg-amber-500', hex: '#facc15' },
  li: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', dot: 'bg-emerald-500', hex: '#4ade80' },
  th: { bg: 'bg-sky-500/20', border: 'border-sky-500', text: 'text-sky-400', dot: 'bg-sky-500', hex: '#38bdf8' },
  ri: { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-400', dot: 'bg-indigo-500', hex: '#818cf8' },
  rm: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', dot: 'bg-purple-500', hex: '#c084fc' },
  rr: { bg: 'bg-pink-500/20', border: 'border-pink-500', text: 'text-pink-400', dot: 'bg-pink-500', hex: '#f472b6' },
  rp: { bg: 'bg-rose-400/20', border: 'border-rose-400', text: 'text-rose-300', dot: 'bg-rose-400', hex: '#fb7185' },
};

export const KEYBOARD_LAYOUT = [
  // Row 1: Numbers
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  // Row 2: Top row
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  // Row 3: Home row
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  // Row 4: Bottom row
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  // Row 5: Space
  ['Ctrl', 'Alt', ' ', 'Alt', 'Ctrl']
];
