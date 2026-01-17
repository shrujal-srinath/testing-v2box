import React from 'react';

interface TeamScoreCardProps {
  name: string;
  score: number;
  color: string;
  onUpdateScore: (points: number) => void;
}

export const TeamScoreCard: React.FC<TeamScoreCardProps> = ({ 
  name, 
  score, 
  color, 
  onUpdateScore
}) => {
  return (
    <div style={{ 
      textAlign: 'center', 
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '20px',
      minWidth: '220px',
      background: '#1a1a1a',
      boxShadow: `0 4px 20px ${color}20` // Subtle glow
    }}>
      <h2 style={{ color: color, margin: '0 0 10px 0', fontSize: '1.5rem' }}>{name}</h2>
      
      {/* SCORE */}
      <div style={{ fontSize: '6rem', fontWeight: 'bold', color: 'white', lineHeight: 1, marginBottom: '20px' }}>
        {score}
      </div>

      {/* SCORE CONTROLS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button onClick={() => onUpdateScore(1)} className="btn-score">+1</button>
        <button onClick={() => onUpdateScore(2)} className="btn-score">+2</button>
        <button onClick={() => onUpdateScore(3)} className="btn-score">+3</button>
        <button onClick={() => onUpdateScore(-1)} className="btn-score-minus">-1</button>
      </div>

      <style>{`
        .btn-score { background: #333; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 1.1rem; font-weight: bold; transition: 0.2s; }
        .btn-score:hover { background: #444; transform: translateY(-2px); }
        .btn-score-minus { background: #3a1111; color: #ff6666; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .btn-score-minus:hover { background: #501111; }
      `}</style>
    </div>
  );
};