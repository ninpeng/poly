// Simple Web Audio API Synthesizer for 30-month toddler game
let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

export const setMuted = (muted: boolean) => {
  isMuted = muted;
};

export const getIsMuted = () => isMuted;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Explicitly resume audio context (needed for mobile browsers)
export const resumeAudio = async () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
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

  // Cancel any ongoing speech to prevent overlapping
  window.speechSynthesis.cancel();

  const nameMap: Record<string, string> = {
    poli: '안녕! 난 폴리야.',
    amber: '안녕! 난 엠버야.',
    roy: '안녕! 난 로이야.',
    helly: '안녕! 난 헬리야.'
  };

  const utterance = new SpeechSynthesisUtterance(nameMap[name] || name);
  utterance.lang = 'ko-KR';
  utterance.rate = 1.1; // Slightly faster for energy
  utterance.pitch = 1.2; // Slightly higher for a friendly kid-game feel

  window.speechSynthesis.speak(utterance);
};
