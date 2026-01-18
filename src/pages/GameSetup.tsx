import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../services/gameService';
import { BasketballGame, TeamData, Player } from '../types';

export const GameSetup: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [gameName, setGameName] = useState("Championship Final");
  const [teamAName, setTeamAName] = useState("LAKERS");
  const [teamBName, setTeamBName] = useState("CELTICS");
  
  // Simple Roster Input (Comma separated for speed)
  const [rosterA, setRosterA] = useState("23 James, 3 Davis");
  const [rosterB, setRosterB] = useState("0 Tatum, 7 Brown");

  const parseRoster = (input: string): Player[] => {
    return input.split(',').map((entry, index) => {
      const parts = entry.trim().split(' ');
      const number = parts[0] || '0';
      const name = parts.slice(1).join(' ') || `Player ${index + 1}`;
      return { id: `p-${Date.now()}-${index}`, number, name, points: 0, fouls: 0 };
    });
  };

  const handleStartGame = async () => {
    setIsSubmitting(true);
    const gameCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newGame: BasketballGame = {
      hostId: "host-user",
      code: gameCode,
      gameType: "standard",
      sport: "basketball",
      status: "live",
      settings: { 
        gameName, 
        periodDuration: 10, 
        shotClockDuration: 24, 
        periodType: "quarter" 
      },
      teamA: { 
        name: teamAName, color: "#EA4335", score: 0, timeouts: 7, fouls: 0,
        players: parseRoster(rosterA)
      } as TeamData,
      teamB: { 
        name: teamBName, color: "#4285F4", score: 0, timeouts: 7, fouls: 0, 
        players: parseRoster(rosterB)
      } as TeamData,
      gameState: { 
        period: 1, 
        gameTime: { minutes: 10, seconds: 0, tenths: 0 }, 
        shotClock: 24.0, 
        possession: 'A', 
        gameRunning: false, 
        shotClockRunning: false 
      },
      lastUpdate: Date.now()
    };

    await createGame(gameCode, newGame);
    navigate(`/host/${gameCode}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          GAME SETUP
        </h1>

        <div className="space-y-6">
          {/* Game Name */}
          <div>
            <label className="block text-gray-500 text-sm tracking-widest mb-2">MATCH TITLE</label>
            <input 
              value={gameName} onChange={(e) => setGameName(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team A Setup */}
            <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
              <label className="block text-red-400 text-xs font-bold mb-2">HOME TEAM</label>
              <input 
                value={teamAName} onChange={(e) => setTeamAName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 mb-4 text-lg font-bold uppercase"
              />
              <label className="block text-gray-500 text-xs mb-1">ROSTER (Num Name, ...)</label>
              <textarea 
                value={rosterA} onChange={(e) => setRosterA(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm h-24 font-mono"
                placeholder="23 James, 3 Davis..."
              />
            </div>

            {/* Team B Setup */}
            <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
              <label className="block text-blue-400 text-xs font-bold mb-2">AWAY TEAM</label>
              <input 
                value={teamBName} onChange={(e) => setTeamBName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 mb-4 text-lg font-bold uppercase"
              />
              <label className="block text-gray-500 text-xs mb-1">ROSTER (Num Name, ...)</label>
              <textarea 
                value={rosterB} onChange={(e) => setRosterB(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm h-24 font-mono"
                placeholder="30 Curry, 11 Thompson..."
              />
            </div>
          </div>

          <button 
            onClick={handleStartGame}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 text-xl"
          >
            {isSubmitting ? 'INITIALIZING...' : 'START MATCH'}
          </button>
        </div>
      </div>
    </div>
  );
};