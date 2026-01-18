import React from 'react';

interface TeamScoreCardProps {
  name: string;
  score: number;
  color: string;
  onUpdateScore?: (points: number) => void; // Made optional
  readonly?: boolean; // NEW PROP
}

export const TeamScoreCard: React.FC<TeamScoreCardProps> = ({ 
  name, score, color, onUpdateScore, readonly = false 
}) => {
  return (
    <div 
      className="relative flex flex-col items-center p-6 rounded-2xl bg-gray-900 border-2 shadow-2xl transition-transform hover:scale-105"
      style={{ borderColor: color, boxShadow: `0 0 20px ${color}40` }}
    >
      <h2 className="text-2xl font-bold tracking-wider mb-4 uppercase" style={{ color: color }}>
        {name}
      </h2>
      
      <div className="text-9xl font-bold text-white mb-8 font-mono leading-none drop-shadow-lg">
        {score}
      </div>

      {/* Only show buttons if NOT readonly */}
      {!readonly && onUpdateScore && (
        <div className="grid grid-cols-2 gap-3 w-full">
          <button onClick={() => onUpdateScore(1)} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg border border-gray-700 transition-colors">+1</button>
          <button onClick={() => onUpdateScore(2)} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg border border-gray-700 transition-colors">+2</button>
          <button onClick={() => onUpdateScore(3)} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg border border-gray-700 transition-colors">+3</button>
          <button onClick={() => onUpdateScore(-1)} className="bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold py-3 rounded-lg border border-red-900/50 transition-colors">-1</button>
        </div>
      )}
    </div>
  );
};