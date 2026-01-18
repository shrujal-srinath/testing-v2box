import React from 'react';

interface ShotClockProps {
  seconds: number;
  onReset: (val: number) => void;
}

export const ShotClock: React.FC<ShotClockProps> = ({ seconds, onReset }) => {
  // Turn 24.0 into "24" and 5.5 into "5.5"
  const display = seconds > 9 ? Math.ceil(seconds) : seconds.toFixed(1);
  
  // Style: Red if under 5 seconds
  const isDanger = seconds <= 5;

  return (
    <div style={{
      background: '#111', border: '1px solid #333', borderRadius: '10px',
      padding: '10px', textAlign: 'center', width: '120px'
    }}>
      <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '5px' }}>SHOT CLOCK</div>
      
      <div style={{ 
        fontSize: '3rem', fontWeight: 'bold', 
        color: isDanger ? '#ff3333' : '#ff9800',
        fontFamily: 'monospace', lineHeight: 1
      }}>
        {display}
      </div>

      <div style={{ display: 'flex', gap: '5px', marginTop: '10px', justifyContent: 'center' }}>
        <button 
          onClick={() => onReset(24)}
          style={{ background: '#333', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
        >
          24
        </button>
        <button 
          onClick={() => onReset(14)}
          style={{ background: '#333', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
        >
          14
        </button>
      </div>
    </div>
  );
};