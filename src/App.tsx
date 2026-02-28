import { useEffect, useState } from 'react';
import { PlayScreen } from './components/PlayScreen';
import { SoundToggle } from './components/SoundToggle';
import { StartScreen } from './components/StartScreen';
import { resumeAudio } from './sounds';

// Types
type ScreenState = 'START' | 'PLAYING';

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
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('pointerdown', unlockAudio, { once: true });

    return () => { 
      document.head.removeChild(link);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
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
