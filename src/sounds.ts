// Simple Web Audio API Synthesizer for 30-month toddler game
let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

// Preload Character Voice Files
const characterAudios: Record<string, HTMLAudioElement> = {
  poli: new Audio('/sounds/poli.m4a'),
  amber: new Audio('/sounds/amber.m4a'),
  roy: new Audio('/sounds/roy.m4a'),
  helly: new Audio('/sounds/helly.m4a')
};

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

export const resumeAudio = () => {
  getAudioContext();
  
  // Unlock HTML5 Audio on iOS/Mobile by playing and immediately pausing a silent file (or first available audio)
  // We play one of the voices muted/silenced to unlock the Audio element restriction
  const testAudio = characterAudios['poli'];
  if (testAudio) {
    testAudio.play().then(() => {
      testAudio.pause();
      testAudio.currentTime = 0;
    }).catch(() => {
      // Ignore initial play errors
    });
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

// Play Voice Audio files
export const playCharacterVoice = (name: string) => {
  if (isMuted) return;

  const audio = characterAudios[name];
  if (audio) {
    // Stop currently playing voice if any
    audio.pause();
    audio.currentTime = 0;
    
    // Play new voice
    audio.play().catch(e => {
      console.error(`Failed to play ${name} voice:`, e);
    });
  }
};
