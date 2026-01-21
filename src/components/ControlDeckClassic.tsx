import React from 'react';
import type { TeamData, GameState } from '../types';

interface ControlDeckProps {
  teamA: TeamData;
  teamB: TeamData;
  gameState: GameState;
  onAction: (team: 'A' | 'B', type: 'points' | 'foul' | 'timeout', value: number) => void;
  onGameClock: (action: 'start' | 'stop' | 'toggle' | 'adjust', value?: number) => void;
  onShotClock: (action: 'reset-24' | 'reset-14' | 'start' | 'stop') => void;
  onPossession: () => void;
  onUndo: () => void;
  onSwitchMode: () => void;
}

export const ControlDeckClassic: React.FC<ControlDeckProps> = ({
  teamA,
  teamB,
  gameState,
  onAction,
  onGameClock,
  onShotClock,
  onPossession,
  onUndo,
  onSwitchMode
}) => {
  return (
    <div className="bg-zinc-900 border-t border-zinc-800 p-6 shadow-2xl relative z-40">
      
      {/* HEADER / SETTINGS */}
      <div className="absolute top-4 left-4">
        <button onClick={onSwitchMode} className="text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <span>⚙️</span> Switch to Pro
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch justify-center">
        
        {/* === TEAM A PANEL (Legacy Style) === */}
        <div className="flex-1 bg-black border border-zinc-800 rounded-xl p-4 flex flex-col gap-4">
          <div className="text-center border-b border-zinc-800 pb-2">
             <h3 className="font-bold text-white uppercase text-lg truncate">{teamA.name}</h3>
             <div className="text-4xl font-mono font-bold text-red-500 my-2">{teamA.score}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
             {[1,2,3].map(v => (
               <button key={v} onClick={() => onAction('A', 'points', v)} className="py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded">+{v}</button>
             ))}
             <button onClick={() => onAction('A', 'points', -1)} className="py-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 font-bold rounded">-1</button>
          </div>
          <div className="flex justify-between items-center mt-auto bg-zinc-900/50 p-2 rounded">
             <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-500 uppercase font-bold">Fouls</span>
                <div className="flex items-center gap-2">
                   <button onClick={() => onAction('A', 'foul', -1)} className="text-zinc-500 hover:text-white px-2">-</button>
                   <span className="font-mono font-bold text-xl">{teamA.fouls}</span>
                   <button onClick={() => onAction('A', 'foul', 1)} className="text-zinc-500 hover:text-white px-2">+</button>
                </div>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-500 uppercase font-bold">Timeouts</span>
                <div className="flex items-center gap-2">
                   <button onClick={() => onAction('A', 'timeout', -1)} className="text-zinc-500 hover:text-white px-2">-</button>
                   <span className="font-mono font-bold text-xl">{teamA.timeouts}</span>
                   <button onClick={() => onAction('A', 'timeout', 1)} className="text-zinc-500 hover:text-white px-2">+</button>
                </div>
             </div>
          </div>
        </div>

        {/* === CENTER CLOCK PANEL (Legacy Style) === */}
        <div className="flex-[1.2] flex flex-col gap-4">
           <div className="bg-zinc-800 rounded-xl p-1 flex items-stretch h-24 shadow-lg">
              <button 
                onClick={() => onGameClock('toggle')} 
                className={`flex-1 rounded-lg font-black text-2xl uppercase tracking-widest transition-all ${gameState.gameRunning ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
              >
                {gameState.gameRunning ? 'STOP' : 'START'}
              </button>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-black border border-zinc-700 rounded-lg p-3 flex flex-col items-center justify-center gap-2">
                 <span className="text-[9px] text-zinc-500 uppercase font-bold">Shot Clock</span>
                 <div className="flex gap-2 w-full">
                    <button onClick={() => onShotClock('reset-24')} className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded">24</button>
                    <button onClick={() => onShotClock('reset-14')} className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-black font-bold rounded">14</button>
                 </div>
              </div>
              <div className="bg-black border border-zinc-700 rounded-lg p-3 flex flex-col items-center justify-center gap-2">
                 <span className="text-[9px] text-zinc-500 uppercase font-bold">Possession</span>
                 <button onClick={onPossession} className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded font-bold text-white flex justify-between px-4">
                    <span className={gameState.possession === 'A' ? 'text-white' : 'text-zinc-700'}>◀</span>
                    <span className={gameState.possession === 'B' ? 'text-white' : 'text-zinc-700'}>▶</span>
                 </button>
              </div>
           </div>
           <button onClick={onUndo} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold uppercase text-xs rounded tracking-widest">
             Undo Last Action (Z)
           </button>
        </div>

        {/* === TEAM B PANEL (Legacy Style) === */}
        <div className="flex-1 bg-black border border-zinc-800 rounded-xl p-4 flex flex-col gap-4">
          <div className="text-center border-b border-zinc-800 pb-2">
             <h3 className="font-bold text-white uppercase text-lg truncate">{teamB.name}</h3>
             <div className="text-4xl font-mono font-bold text-blue-500 my-2">{teamB.score}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
             <button onClick={() => onAction('B', 'points', -1)} className="py-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 font-bold rounded">-1</button>
             {[1,2,3].map(v => (
               <button key={v} onClick={() => onAction('B', 'points', v)} className="py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded">+{v}</button>
             ))}
          </div>
          <div className="flex justify-between items-center mt-auto bg-zinc-900/50 p-2 rounded">
             <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-500 uppercase font-bold">Fouls</span>
                <div className="flex items-center gap-2">
                   <button onClick={() => onAction('B', 'foul', -1)} className="text-zinc-500 hover:text-white px-2">-</button>
                   <span className="font-mono font-bold text-xl">{teamB.fouls}</span>
                   <button onClick={() => onAction('B', 'foul', 1)} className="text-zinc-500 hover:text-white px-2">+</button>
                </div>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-500 uppercase font-bold">Timeouts</span>
                <div className="flex items-center gap-2">
                   <button onClick={() => onAction('B', 'timeout', -1)} className="text-zinc-500 hover:text-white px-2">-</button>
                   <span className="font-mono font-bold text-xl">{teamB.timeouts}</span>
                   <button onClick={() => onAction('B', 'timeout', 1)} className="text-zinc-500 hover:text-white px-2">+</button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};