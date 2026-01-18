import React from 'react';
import { useParams } from 'react-router-dom';
import { GameClock } from './GameClock';
import { ShotClock } from './ShotClock';
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
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
        <div className="text-gray-400 text-sm tracking-widest">
          GAME CODE: <span className="text-blue-400 font-bold text-xl ml-2 font-mono">{gameCode}</span>
        </div>
        <div className="text-gray-500 text-xs">BOX-V2 SYSTEM • LIVE</div>
      </div>

      {/* MAIN ARENA (Scores & Clocks) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start mb-8">
        
        {/* TEAM A */}
        <TeamScoreCard 
          name={game.teamA.name} 
          color={game.teamA.color} 
          score={game.teamA.score} 
          onUpdateScore={(pts) => game.updateScore('A', pts)} 
        />

        {/* CENTER CONSOLE */}
        <div className="flex flex-col items-center gap-6">
          {/* Period Badge */}
          <div className="bg-gray-800 text-white px-6 py-2 rounded-full text-xl font-bold border border-gray-700 shadow-lg">
            {getPeriodName(game.gameState.period)}
          </div>
          
          {/* Clocks */}
          <div className="space-y-6 w-full flex flex-col items-center">
            <GameClock onTimeUpdate={(m, s, t) => game.updateGameTime(m, s, t)} />
            
            <div className="scale-110">
              <ShotClock 
                seconds={game.gameState.shotClock} 
                onReset={game.resetShotClock} 
              />
            </div>
          </div>

          <button 
            onClick={handleNextPeriod} 
            className="mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors font-semibold"
          >
            Next Period &rarr;
          </button>
        </div>

        {/* TEAM B */}
        <TeamScoreCard 
          name={game.teamB.name} 
          color={game.teamB.color} 
          score={game.teamB.score} 
          onUpdateScore={(pts) => game.updateScore('B', pts)} 
        />
      </div>

      {/* STATS CONTROL DECK */}
      <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl p-6 border-t-4 border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-2xl">
        
        {/* Left Stats */}
        <div className="space-y-4">
          <StatRow label="FOULS" value={game.teamA.fouls} color={game.teamA.color} onMinus={() => game.updateFouls('A', -1)} onPlus={() => game.updateFouls('A', 1)} />
          <StatRow label="TIMEOUTS" value={game.teamA.timeouts} color="white" onMinus={() => game.updateTimeouts('A', -1)} onPlus={() => game.updateTimeouts('A', 1)} />
        </div>

        {/* Possession Arrow */}
        <div 
          onClick={game.togglePossession}
          className="cursor-pointer flex flex-col items-center justify-center p-4 bg-black rounded-xl border border-gray-800 hover:border-gray-600 transition-colors group"
        >
          <div className="text-gray-500 text-xs mb-2 tracking-widest group-hover:text-white">POSSESSION</div>
          <div 
            className="text-6xl transition-transform duration-300"
            style={{ color: game.gameState.possession === 'A' ? game.teamA.color : game.teamB.color }}
          >
            {game.gameState.possession === 'A' ? '◄' : '►'}
          </div>
        </div>

        {/* Right Stats */}
        <div className="space-y-4">
          <StatRow label="FOULS" value={game.teamB.fouls} color={game.teamB.color} onMinus={() => game.updateFouls('B', -1)} onPlus={() => game.updateFouls('B', 1)} right />
          <StatRow label="TIMEOUTS" value={game.teamB.timeouts} color="white" onMinus={() => game.updateTimeouts('B', -1)} onPlus={() => game.updateTimeouts('B', 1)} right />
        </div>

      </div>
    </div>
  );
};

// Reusable Stat Component
const StatRow = ({ label, value, color, onPlus, onMinus, right }: any) => (
  <div className={`flex items-center gap-4 font-bold ${right ? 'justify-end' : 'justify-start'}`}>
    {!right && <span className="text-gray-500 w-20 text-sm">{label}</span>}
    
    <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
      <button 
        onClick={onMinus} 
        className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
      >
        -
      </button>
      <span 
        className="w-12 text-center text-xl font-mono"
        style={{ color: color }}
      >
        {value}
      </span>
      <button 
        onClick={onPlus} 
        className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
      >
        +
      </button>
    </div>

    {right && <span className="text-gray-500 w-20 text-sm text-right">{label}</span>}
  </div>
);