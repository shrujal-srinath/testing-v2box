import React from 'react';
import { useParams } from 'react-router-dom';
import { GameClock } from './GameClock';
import { ShotClock } from './ShotClock'; // NEW IMPORT
import { TeamScoreCard } from './TeamScoreCard';
import { useBasketballGame } from '../hooks/useBasketballGame';

export const Scoreboard: React.FC = () => {
  const { gameCode } = useParams(); 
  const game = useBasketballGame(gameCode || "DEMO");

  const handleNextPeriod = () => {
    const current = game.gameState.period;
    if (current === 4) { 
      const goOT = window.confirm("End of Regulation! Overtime?");
      game.setPeriod(goOT ? 5 : 1); 
    } else if (current >= 5) {
      const goNextOT = window.confirm("Next Overtime?");
      game.setPeriod(goNextOT ? current + 1 : 1);
    } else {
      game.setPeriod(current + 1);
    }
  };

  const getPeriodName = (p: number) => p <= 4 ? `Q${p}` : `OT${p - 4}`;

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '20px', padding: '10px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', color: '#888' }}>
        GAME CODE: <span style={{ color: '#4285F4', fontWeight: 'bold', fontSize: '1.5rem', marginLeft: '10px' }}>{gameCode}</span>
      </div>

      {/* SCORE AREA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <TeamScoreCard 
          name={game.teamA.name} color={game.teamA.color} score={game.teamA.score} 
          onUpdateScore={(pts) => game.updateScore('A', pts)} 
        />

        {/* CENTER CONSOLE */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          
          <div style={{ background: '#333', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {getPeriodName(game.gameState.period)}
          </div>
          
          {/* GAME CLOCK (Passes tenths now) */}
          <GameClock onTimeUpdate={(m, s, t) => game.updateGameTime(m, s, t)} />

          {/* NEW: SHOT CLOCK */}
          <ShotClock 
            seconds={game.gameState.shotClock} 
            onReset={game.resetShotClock} 
          />

          <button onClick={handleNextPeriod} style={{ padding: '8px 20px', cursor: 'pointer', background: '#444', color: '#ccc', border: '1px solid #666', borderRadius: '6px' }}>
            Next Period {'>'}
          </button>
        </div>

        <TeamScoreCard 
          name={game.teamB.name} color={game.teamB.color} score={game.teamB.score} 
          onUpdateScore={(pts) => game.updateScore('B', pts)} 
        />
      </div>

      {/* STATS AREA (Same as before) */}
      <div style={{ background: '#222', borderRadius: '15px', padding: '20px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center', borderTop: '4px solid #444' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <StatRow label="FOULS" value={game.teamA.fouls} color={game.teamA.color} onMinus={() => game.updateFouls('A', -1)} onPlus={() => game.updateFouls('A', 1)} />
          <StatRow label="TIMEOUTS" value={game.teamA.timeouts} color="white" onMinus={() => game.updateTimeouts('A', -1)} onPlus={() => game.updateTimeouts('A', 1)} />
        </div>

        <div onClick={game.togglePossession} style={{ cursor: 'pointer', textAlign: 'center', padding: '10px', background: '#111', borderRadius: '10px', border: '1px solid #333', width: '120px' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>POSSESSION</div>
          <div style={{ fontSize: '3rem', lineHeight: 1, color: game.gameState.possession === 'A' ? game.teamA.color : game.teamB.color }}>
            {game.gameState.possession === 'A' ? '◄' : '►'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
          <StatRow label="FOULS" value={game.teamB.fouls} color={game.teamB.color} onMinus={() => game.updateFouls('B', -1)} onPlus={() => game.updateFouls('B', 1)} right />
          <StatRow label="TIMEOUTS" value={game.teamB.timeouts} color="white" onMinus={() => game.updateTimeouts('B', -1)} onPlus={() => game.updateTimeouts('B', 1)} right />
        </div>
      </div>
    </div>
  );
};

// Helper for Stats (Clean code!)
const StatRow = ({ label, value, color, onPlus, onMinus, right }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', fontWeight: 'bold', justifyContent: right ? 'flex-end' : 'flex-start' }}>
    {!right && <span style={{ color: '#aaa' }}>{label}</span>}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#333', padding: '5px 10px', borderRadius: '8px' }}>
      <button onClick={onMinus} style={{ width: '30px', height: '30px', border: 'none', background: '#555', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>-</button>
      <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '1.4rem', color }}>{value}</span>
      <button onClick={onPlus} style={{ width: '30px', height: '30px', border: 'none', background: '#555', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>+</button>
    </div>
    {right && <span style={{ color: '#aaa' }}>{label}</span>}
  </div>
);