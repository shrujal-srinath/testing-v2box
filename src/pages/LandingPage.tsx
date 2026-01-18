import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const handleHost = () => {
    // Go to Setup instead of generating code immediately
    navigate('/setup');
  };

  const handleWatch = () => {
    if (joinCode.length === 6) {
      navigate(`/watch/${joinCode}`);
    } else {
      alert("Please enter a valid 6-digit code");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      
      {/* HERO SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
          BOX V2
        </h1>
        <p className="text-gray-400 text-lg tracking-[0.2em] uppercase">Next Gen Sports Telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* HOST CARD */}
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all group cursor-pointer" onClick={handleHost}>
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-400">Host a Game</h2>
          <p className="text-gray-500 mb-6">Create a new match, control the scoreboard, and broadcast live.</p>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors">
            Create New Game
          </button>
        </div>

        {/* WATCH CARD */}
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 transition-all">
          <div className="text-4xl mb-4">👁️</div>
          <h2 className="text-2xl font-bold mb-2 text-white">Spectator View</h2>
          <p className="text-gray-500 mb-6">Enter a game code to watch the live scoreboard sync in real-time.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="123456" 
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 text-center text-xl font-mono focus:border-purple-500 focus:outline-none"
            />
            <button 
              onClick={handleWatch}
              className="px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors"
            >
              GO
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};