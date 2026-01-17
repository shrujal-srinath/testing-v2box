import React from 'react';
import { GameClock } from './GameClock';
import { TeamScoreCard } from './TeamScoreCard';
import { useBasketballGame } from '../hooks/useBasketballGame';

export const Scoreboard: React.FC = () => {
  const game = useBasketballGame("TEST_GAME_1");

  // --- LOGIC: Period Transition ---
  const handleNextPeriod = () => {
    const current = game.gameState.period;
    
    // Logic for Regular Game End (Quarter 4 or Half 2)
    if (current === 4) { // Assuming Quarters
      const goOT = window.confirm("End of Regulation!\n\nClick OK for OVERTIME.\nClick Cancel to RESET to Quarter 1.");
      if (goOT) {
        game.setPeriod(5); // 5 = OT1
      } else {
        game.setPeriod(1); // Back to start
      }
    } 
    // Logic for Overtime (Period 5+)
    else if (current >= 5) {
      const goNextOT = window.confirm(`End of OT ${current - 4}!\n\nClick OK for NEXT OVERTIME.\nClick Cancel to RESET to Quarter 1.`);
      if (goNextOT) {
        game.setPeriod(current + 1);
      } else {
        game.setPeriod(1);
      }
    } 
    // Regular Period Change (1 -> 2, 2 -> 3)
    else {
      game.setPeriod(current + 1);
    }
  };

  // Helper to display period name
  const getPeriodName = (p: number) => {
    if (p <= 4) return `Q${p}`;
    return `OT${p - 4}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* --- TOP ROW: SCORES & CLOCK --- */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '30px', flexWrap: 'wrap', gap: '20px'
      }}>
        {/* Team A Score */}
        <TeamScoreCard 
          name={game.teamA.name} 
          color={game.teamA.color} 
          score={game.teamA.score} 
          onUpdateScore={(pts) => game.updateScore('A', pts)} 
        />

        {/* Center: Clock & Period */}
        <div style={{ textAlign: 'center', minWidth: '200px' }}>
          <div style={{ 
            background: '#333', color: 'white', padding: '5px 15px', 
            borderRadius: '20px', display: 'inline-block', marginBottom: '10px',
            fontSize: '1.2rem', fontWeight: 'bold'
          }}>
            {getPeriodName(game.gameState.period)}
          </div>
          
          <GameClock />

          <button 
            onClick={handleNextPeriod} 
            style={{ 
              marginTop: '15px', padding: '8px 20px', cursor: 'pointer',
              background: '#444', color: '#ccc', border: '1px solid #666', borderRadius: '6px'
            }}
          >
            Next Period {'>'}
          </button>
        </div>

        {/* Team B Score */}
        <TeamScoreCard 
          name={game.teamB.name} 
          color={game.teamB.color} 
          score={game.teamB.score} 
          onUpdateScore={(pts) => game.updateScore('B', pts)} 
        />
      </div>


      {/* --- BOTTOM ROW: STATS & CONTROLS --- */}
      <div style={{ 
        background: '#222', borderRadius: '15px', padding: '20px',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center',
        borderTop: '4px solid #444'
      }}>
        
        {/* Left: Team A Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="stat-row">
            <span style={{ color: '#aaa' }}>FOULS</span>
            <div className="counter">
              <button onClick={() => game.updateFouls('A', -1)}>-</button>
              <span style={{ color: game.teamA.color }}>{game.teamA.fouls}</span>
              <button onClick={() => game.updateFouls('A', 1)}>+</button>
            </div>
          </div>
          <div className="stat-row">
            <span style={{ color: '#aaa' }}>TIMEOUTS</span>
            <div className="counter">
              <button onClick={() => game.updateTimeouts('A', -1)}>-</button>
              <span style={{ color: 'white' }}>{game.teamA.timeouts}</span>
              <button onClick={() => game.updateTimeouts('A', 1)}>+</button>
            </div>
          </div>
        </div>


        {/* Center: POSSESSION ARROW */}
        <div 
          onClick={game.togglePossession}
          style={{ 
            cursor: 'pointer', textAlign: 'center', padding: '10px',
            background: '#111', borderRadius: '10px', border: '1px solid #333',
            width: '120px'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>POSSESSION</div>
          <div style={{ 
            fontSize: '3rem', lineHeight: 1,
            color: game.gameState.possession === 'A' ? game.teamA.color : game.teamB.color,
            transition: 'transform 0.3s ease'
          }}>
            {/* The Arrow flips based on state */}
            {game.gameState.possession === 'A' ? '◄' : '►'}
          </div>
        </div>


        {/* Right: Team B Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
          <div className="stat-row right">
            <div className="counter">
              <button onClick={() => game.updateFouls('B', -1)}>-</button>
              <span style={{ color: game.teamB.color }}>{game.teamB.fouls}</span>
              <button onClick={() => game.updateFouls('B', 1)}>+</button>
            </div>
            <span style={{ color: '#aaa' }}>FOULS</span>
          </div>
          <div className="stat-row right">
            <div className="counter">
              <button onClick={() => game.updateTimeouts('B', -1)}>-</button>
              <span style={{ color: 'white' }}>{game.teamB.timeouts}</span>
              <button onClick={() => game.updateTimeouts('B', 1)}>+</button>
            </div>
            <span style={{ color: '#aaa' }}>TIMEOUTS</span>
          </div>
        </div>

      </div>

      {/* Internal CSS for the Stats Section */}
      <style>{`
        .stat-row { display: flex; align-items: center; gap: 15px; font-size: 1.1rem; font-weight: bold; }
        .stat-row.right { justify-content: flex-end; }
        
        .counter { 
          display: flex; align-items: center; gap: 10px; 
          background: #333; padding: 5px 10px; borderRadius: 8px; 
        }
        .counter button {
          width: 30px; height: 30px; border: none; background: #555; color: white;
          border-radius: 4px; cursor: pointer; font-size: 1.2rem; line-height: 1;
        }
        .counter button:hover { background: #777; }
        .counter span { min-width: 20px; text-align: center; font-size: 1.4rem; }
      `}</style>

    </div>
  );
};