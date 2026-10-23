// Zero-Bandwidth Generative Ambient Lo-Fi & Cyberwave Soundscapes
// Uses Web Audio API to synthesize relaxing chill-hop/cyber chords in the background.

let ambientCtx = null;
let isPlaying = false;
let chordTimer = null;
let masterGain = null;

// Lofi / Cyberwave chord progressions (frequencies in Hz)
const CHORD_PROGRESSIONS = [
  // Progression 1: Fmaj7 -> Em7 -> Dm7 -> Cmaj7 (Chill lofi dream)
  [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [164.81, 196.00, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.00, 261.63], // Dm7
    [130.81, 164.81, 196.00, 246.94]  // Cmaj7
  ],
  // Progression 2: Am9 -> Fmaj9 -> Cmaj7 -> Gsus4 (Cyber Synthwave)
  [
    [110.00, 164.81, 220.00, 261.63, 329.63], // Am9
    [87.31, 130.81, 174.61, 220.00, 329.63],  // Fmaj9
    [130.81, 196.00, 246.94, 261.63, 329.63], // Cmaj7
    [98.00, 146.83, 196.00, 261.63]           // Gsus4
  ]
];

export const initAmbientEngine = () => {
  if (!ambientCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      ambientCtx = new AudioContext();
      masterGain = ambientCtx.createGain();
      masterGain.gain.setValueAtTime(0.08, ambientCtx.currentTime); // gentle background level
      masterGain.connect(ambientCtx.destination);
    }
  }
  if (ambientCtx && ambientCtx.state === 'suspended') {
    ambientCtx.resume();
  }
};

export const startAmbientMusic = (genre = 'lofi', userVolume = 0.5) => {
  initAmbientEngine();
  if (!ambientCtx || !masterGain) return;

  stopAmbientMusic();
  isPlaying = true;

  masterGain.gain.setValueAtTime(userVolume * 0.12, ambientCtx.currentTime);

  const chords = genre === 'cyber' ? CHORD_PROGRESSIONS[1] : CHORD_PROGRESSIONS[0];
  let chordIndex = 0;

  const playNextChord = () => {
    if (!isPlaying || !ambientCtx) return;

    const now = ambientCtx.currentTime;
    const currentChord = chords[chordIndex];
    chordIndex = (chordIndex + 1) % chords.length;

    // Create soft sine/triangle oscillators for the chord notes
    currentChord.forEach((freq) => {
      const osc = ambientCtx.createOscillator();
      const noteGain = ambientCtx.createGain();

      osc.type = genre === 'cyber' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Lowpass filter for warm, cozy analog sound
      const filter = ambientCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(genre === 'cyber' ? 480 : 320, now);

      // Smooth attack and release envelope
      const chordDuration = 4.2;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.06, now + 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + chordDuration + 0.1);
    });

    chordTimer = setTimeout(playNextChord, 4000);
  };

  playNextChord();
};

export const stopAmbientMusic = () => {
  isPlaying = false;
  if (chordTimer) {
    clearTimeout(chordTimer);
    chordTimer = null;
  }
};

export const setAmbientVolume = (vol) => {
  if (masterGain && ambientCtx) {
    masterGain.gain.setValueAtTime(vol * 0.12, ambientCtx.currentTime);
  }
};
