import confetti from 'canvas-confetti';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playPopSound, playTadaSound, resumeAudio, setMuted } from './sounds';

// Types
type ScreenState = 'START' | 'PLAYING';
type Character = 'poli' | 'amber' | 'roy' | 'helly';

const CHARACTERS: Character[] = ['poli', 'amber', 'roy', 'helly'];

// --- Helper Functions ---
const getRandomCharacter = () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

// --- Components ---

// 0. Sound Toggle
const SoundToggle = () => {
  const [muted, setMutedState] = useState(localStorage.getItem('muted') === 'true');

  const toggle = () => {
    const newState = !muted;
    setMutedState(newState);
    setMuted(newState);
    localStorage.setItem('muted', String(newState));
  };

  useEffect(() => {
    // Initialize utility state
    setMuted(muted);
  }, []);

  return (
    <button className="sound-toggle" onClick={toggle} title="소리 켜기/끄기">
      {muted ? (
        <VolumeX size={24} color="var(--color-poli-blue)" />
      ) : (
        <Volume2 size={24} color="var(--color-poli-blue)" />
      )}
    </button>
  );
};

// 1. Start Screen
const StartScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="start-screen" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'
    }}>
      <h1 className="title-banner">자동차<br/>까꿍 놀이!</h1>
      <button className="btn-primary" onPointerDown={async () => {
        await resumeAudio(); // Unlock audio on first meaningful click
        playPopSound();
        onStart();
      }}>시작하기</button>
    </div>
  );
};

// 2. Play Screen (Hide and Seek)
const PlayScreen = () => {
  const [hiddenCharacter, setHiddenCharacter] = useState<Character>(getRandomCharacter());
  const [isFound, setIsFound] = useState(false);
  const [boxes] = useState([0, 1, 2]); // Three boxes
  const [winningBox, setWinningBox] = useState(Math.floor(Math.random() * 3));

  const resetGame = () => {
    setIsFound(false);
    setHiddenCharacter(getRandomCharacter());
    setWinningBox(Math.floor(Math.random() * 3));
  };

  const handleBoxTap = (index: number) => {
    if (isFound) return; // Prevent multiple taps

    // Force the tapped box to be the winning box for toddler simplicity
    setWinningBox(index);
    setIsFound(true);
    
    // Trigger Effects
    triggerConfetti();
    playTadaSound();

    // Auto-reset after a few seconds (reduced for faster pace)
    setTimeout(() => {
      resetGame();
    }, 2000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2196f3', '#e91e63', '#f44336', '#4caf50', '#ffeb3b']
    });
  };

  // The sound logic is now handled in sounds.ts natively.
  // We can just call it from the handleBoxTap method.

  return (
    <div className="play-screen" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Title / Instruction */}
      <h2 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '3rem', opacity: isFound ? 0 : 1, transition: 'opacity 0.3s' }}>
        누가 숨어있을까?
      </h2>

      {/* Boxes Container */}
      <div className="boxes-container" style={{ 
        display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%'
      }}>
        {boxes.map((boxIndex) => (
          <div 
            key={boxIndex}
            className="box-wrapper"
            onPointerDown={() => handleBoxTap(boxIndex)}
            style={{ position: 'relative', width: '120px', height: '120px', cursor: 'pointer' }}
          >
            {/* The Character (Only visible if found AND it's the winning box, or if we force all open) */}
            {(isFound && boxIndex === winningBox) && (
              <div className="character-reveal" style={{
                position: 'fixed', top: '50%', left: '50%', 
                width: '300px', height: '300px',
                backgroundColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'popCenter 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                zIndex: 1000
              }}>
                <img 
                  src={`/images/${hiddenCharacter}.png`} 
                  alt={hiddenCharacter} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    paddingBottom: '10px'
                  }} 
                />
              </div>
            )}

            {/* The Box / Bush covering it */}
            <div className={`cover-box ${isFound ? 'hidden' : ''}`} style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: '#8d6e63', // Brown box 
              borderRadius: '15px',
              border: '6px solid #5d4037',
              boxShadow: 'var(--shadow-md)',
              transition: 'transform 0.3s, opacity 0.3s',
              opacity: isFound ? 0 : 1,
              transform: isFound ? 'scale(0.5)' : 'scale(1)',
              animation: !isFound ? 'shake 4s infinite' : 'none',
              animationDelay: `${boxIndex * 0.5}s`,
              zIndex: 20
            }}>
               <div style={{ width: '100%', height: '20px', backgroundColor: '#5d4037', marginTop: '20px' }} />
            </div>

          </div>
        ))}
      </div>
      
      {/* Celebration Text */}
      {isFound && (
        <h2 style={{ position: 'absolute', top: '15%', fontSize: '4rem', color: '#ffb300', textShadow: '4px 4px white', animation: 'popIn 0.5s', zIndex: 1001 }}>
          까꿍!!
        </h2>
      )}

    </div>
  );
};

// 3. Main App Container
function App() {
  const [screen, setScreen] = useState<ScreenState>('START');

  // Load Google Font for premium Jua look (Korean playful font)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Jua&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Audio Unlocking for Mobile
    const unlockAudio = () => {
      resumeAudio();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => { 
      document.head.removeChild(link);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    }
  }, []);

  return (
    <main className="app-container">
      <SoundToggle />
      {screen === 'START' && <StartScreen onStart={() => setScreen('PLAYING')} />}
      {screen === 'PLAYING' && <PlayScreen />}
    </main>
  );
}

export default App;
