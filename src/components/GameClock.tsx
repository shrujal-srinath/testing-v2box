import React, { useEffect } from 'react';
import { useGameTimer } from '../hooks/useGameTimer';

interface GameClockProps {
  onTimeUpdate?: (minutes: number, seconds: number, tenths: number) => void;
}

const formatTime = (num: number) => num.toString().padStart(2, '0');

export const GameClock: React.FC<GameClockProps> = ({ onTimeUpdate }) => {
  const { minutes, seconds, tenths, isRunning, startStop, reset } = useGameTimer(10, 0);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(minutes, seconds, tenths);
    }
  }, [minutes, seconds, tenths]); 

  // --- FIBA DISPLAY LOGIC ---
  // If > 1 minute: MM:SS (e.g., 10:00)
  // If < 1 minute: SS.t  (e.g., 59.9)
  const showTenths = minutes === 0 && seconds < 60;

  return (
    <div style={{
      textAlign: 'center', background: '#222', color: '#fff', 
      padding: '20px', borderRadius: '10px', maxWidth: '300px', margin: '0 auto'
    }}>
      <div style={{ 
        fontSize: '4.5rem', fontFamily: 'monospace', fontWeight: 'bold',
        color: isRunning ? '#0f0' : '#fff', lineHeight: 1, marginBottom: '10px'
      }}>
        {showTenths ? (
          // Under 1 Minute Display
          <span>{seconds}.{tenths}</span>
        ) : (
          // Normal Display
          <span>{formatTime(minutes)}:{formatTime(seconds)}</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={startStop}
          style={{ 
            padding: '8px 20px', fontSize: '1rem', cursor: 'pointer',
            background: isRunning ? '#e53935' : '#4caf50',
            color: 'white', border: 'none', borderRadius: '5px'
          }}
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        
        <button 
          onClick={() => reset(10, 0)}
          style={{ 
            padding: '8px 20px', fontSize: '1rem', cursor: 'pointer',
            background: 'transparent', color: '#aaa', 
            border: '1px solid #555', borderRadius: '5px'
          }}
        >
          RESET
        </button>
      </div>
    </div>
  );
};