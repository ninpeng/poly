import { playCharacterVoice, resumeAudio } from '../sounds';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="start-screen" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'
    }}>
      <h1 className="title-banner">자동차<br/>까꿍 놀이!</h1>
      <button className="btn-primary" onPointerDown={() => {
        resumeAudio(); // Non-blocking audio unlock
        playCharacterVoice('poli'); // Call a silent/low-vol voice if needed, or just play poli 
        onStart();
      }}>시작하기</button>
    </div>
  );
};
