import React from 'react';
import { useGameTimer } from '../hooks/useGameTimer';

const formatTime = (num: number) => num.toString().padStart(2, '0');

export const GameClock: React.FC = () => {
  const { minutes, seconds, isRunning, startStop, reset } = useGameTimer(12, 0);

  return (
    <div style={{
      textAlign: 'center', 
      background: '#222', 
      color: '#fff', 
      padding: '2rem', 
      borderRadius: '12px',
      maxWidth: '350px',
      margin: '2rem auto',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ fontSize: '1rem', color: '#888', letterSpacing: '2px', marginBottom: '1rem' }}>
        GAME CLOCK
      </h2>
      
      <div style={{ 
        fontSize: '5rem', 
        fontFamily: 'monospace', 
        fontWeight: 'bold',
        color: isRunning ? '#4caf50' : '#fff', // Green when running
        lineHeight: 1
      }}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button 
          onClick={startStop}
          style={{ 
            padding: '10px 24px', 
            fontSize: '1rem', 
            cursor: 'pointer',
            background: isRunning ? '#e53935' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        
        <button 
          onClick={() => reset(12, 0)}
          style={{ 
            padding: '10px 24px', 
            fontSize: '1rem', 
            cursor: 'pointer',
            background: 'transparent',
            color: '#aaa',
            border: '1px solid #555',
            borderRadius: '6px'
          }}
        >
          RESET
        </button>
      </div>
    </div>
  );
};