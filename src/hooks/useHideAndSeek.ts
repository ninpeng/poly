import confetti from 'canvas-confetti';
import { useState } from 'react';
import { Character, getRandomCharacter } from '../config/constants';
import { playCharacterVoice, playTadaSound } from '../sounds';

export const useHideAndSeek = () => {
  const [hiddenCharacter, setHiddenCharacter] = useState<Character>(getRandomCharacter());
  const [isFound, setIsFound] = useState(false);
  const [boxes] = useState([0, 1, 2]); // Three boxes
  const [winningBox, setWinningBox] = useState(Math.floor(Math.random() * 3));

  const resetGame = () => {
    setIsFound(false);
    setHiddenCharacter(getRandomCharacter());
    setWinningBox(Math.floor(Math.random() * 3));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2196f3', '#e91e63', '#f44336', '#4caf50', '#ffeb3b']
    });
  };

  const handleBoxTap = (index: number) => {
    if (isFound) return; // Prevent multiple taps

    // Force the tapped box to be the winning box for toddler simplicity
    setWinningBox(index);
    setIsFound(true);
    
    // Trigger Effects
    triggerConfetti();
    playTadaSound();
    playCharacterVoice(hiddenCharacter);

    // Auto-reset after a few seconds (reduced for faster pace)
    setTimeout(() => {
      resetGame();
    }, 2000);
  };

  return {
    boxes,
    winningBox,
    hiddenCharacter,
    isFound,
    handleBoxTap
  };
};
