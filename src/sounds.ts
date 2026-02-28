// Simple Web Audio API Synthesizer for 30-month toddler game
let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;
let speechUnlocked: boolean = false;
let dummyUtterance: SpeechSynthesisUtterance | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export const setMuted = (muted: boolean) => {
  isMuted = muted;
};

export const getIsMuted = () => isMuted;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Explicitly resume audio context (needed for mobile browsers)
export const resumeAudio = () => {
  getAudioContext();
  
  // Unlock Speech Synthesis on iOS/Mobile
  if (!speechUnlocked && window.speechSynthesis) {
    // iOS Safari sometimes ignores empty strings or volume 0. A silent tiny utterance works best.
    // MUST keep a global reference to prevent Safari's aggressive garbage collection from breaking the speech engine
    dummyUtterance = new SpeechSynthesisUtterance('아');
    dummyUtterance.volume = 0.01;
    dummyUtterance.rate = 10;
    dummyUtterance.lang = 'ko-KR';
    window.speechSynthesis.speak(dummyUtterance);
    speechUnlocked = true;
  }
};

// Cute 'Pop' sound when touching the box
export const playPopSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

// Cheerful 'Ta-da!' sound when character appears
export const playTadaSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  
  // Play a quick arpeggio (C major chord: C, E, G, C)
  const notes = [523.25, 659.25, 783.99, 1046.50];
  const startTime = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Choose a softer waveform
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    // Timing spacing
    const noteTime = startTime + i * 0.1;
    
    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.3, noteTime + 0.05); // Fade in
    gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.3); // Fade out
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(noteTime);
    osc.stop(noteTime + 0.3);
  });
};

// Voice Synthesis (TTS) for character names
export const playCharacterVoice = (name: string) => {
  if (isMuted || !window.speechSynthesis) return;

  // Cancel any ongoing speech to prevent overlapping only if currently speaking/pending
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }

  const nameMap: Record<string, string> = {
    poli: '안녕! 난 폴리야.',
    amber: '안녕! 난 엠버야.',
    roy: '안녕! 난 로이야.',
    helly: '안녕! 난 헬리야.'
  };

  currentUtterance = new SpeechSynthesisUtterance(nameMap[name] || name);
  currentUtterance.lang = 'ko-KR';
  currentUtterance.rate = 1.1; // Slightly faster for energy
  currentUtterance.pitch = 1.2; // Slightly higher for a friendly kid-game feel

  window.speechSynthesis.speak(currentUtterance);
};
