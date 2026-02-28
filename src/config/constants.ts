export type Character = 'poli' | 'amber' | 'roy' | 'helly';

export const CHARACTERS: Character[] = ['poli', 'amber', 'roy', 'helly'];

// Randomly select a character
export const getRandomCharacter = (): Character => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
