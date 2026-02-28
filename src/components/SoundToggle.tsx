import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resumeAudio, setMuted } from '../sounds';

export const SoundToggle = () => {
  const [muted, setMutedState] = useState(localStorage.getItem('muted') === 'true');

  const toggle = () => {
    const newState = !muted;
    setMutedState(newState);
    setMuted(newState);
    localStorage.setItem('muted', String(newState));
    
    // Aggressively unlock audio if unmuting mid-game
    if (!newState) {
      resumeAudio();
    }
  };

  useEffect(() => {
    // Initialize utility state
    setMuted(muted);
  }, [muted]);

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
