import { useHideAndSeek } from '../hooks/useHideAndSeek';

export const PlayScreen = () => {
  const {
    boxes,
    winningBox,
    hiddenCharacter,
    isFound,
    handleBoxTap
  } = useHideAndSeek();

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
