import React from 'react';
import { useParams } from 'react-router-dom';
import { useBasketballGame } from '../hooks/useBasketballGame';

// A simple display card for spectators (No buttons)
const ReadOnlyCard = ({ name, score, color, fouls }: any) => (
  <div style={{ 
    textAlign: 'center', border: `2px solid ${color}`, borderRadius: '12px',
    padding: '20px', minWidth: '200px', background: '#1a1a1a'
  }}>
    <h2 style={{ color: color, fontSize: '1.5rem' }}>{name}</h2>
    <div style={{ fontSize: '5rem', fontWeight: 'bold', color: 'white' }}>{score}</div>
    <div style={{ color: '#888' }}>FOULS: <span style={{ color: 'white' }}>{fouls}</span></div>
  </div>
);

export const SpectatorView: React.FC = () => {
  const { gameCode } = useParams(); // Get code from URL
  const game = useBasketballGame(gameCode || "DEMO");

  const getPeriodName = (p: number) => (p <= 4 ? `Q${p}` : `OT${p - 4}`);

  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        <div>LIVE GAME</div>
        <div style={{ fontSize: '2rem', color: 'white', letterSpacing: '5px' }}>{gameCode}</div>
      </div>

      {/* SCOREBOARD */}
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        gap: '20px', flexWrap: 'wrap' 
      }}>
        <ReadOnlyCard 
          name={game.teamA.name} 
          score={game.teamA.score} 
          color={game.teamA.color} 
          fouls={game.teamA.fouls}
        />

        {/* CLOCK AREA */}
        <div style={{ textAlign: 'center', minWidth: '150px' }}>
           <div style={{ 
            background: '#333', color: 'white', padding: '5px 15px', 
            borderRadius: '20px', display: 'inline-block', marginBottom: '10px'
          }}>
            {getPeriodName(game.gameState.period)}
          </div>
          
          <div style={{ fontSize: '4rem', fontFamily: 'monospace', color: '#0f0' }}>
             {/* We can reuse GameClock here later, but simple text for now */}
             {String(game.gameState.gameTime.minutes).padStart(2,'0')}:
             {String(game.gameState.gameTime.seconds).padStart(2,'0')}
          </div>

          <div style={{ marginTop: '20px', fontSize: '2rem', color: 'white' }}>
             {game.gameState.possession === 'A' ? '◄' : '►'}
          </div>
        </div>

        <ReadOnlyCard 
          name={game.teamB.name} 
          score={game.teamB.score} 
          color={game.teamB.color} 
          fouls={game.teamB.fouls}
        />
      </div>
    </div>
  );
};