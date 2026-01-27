// src/features/tablet/HardwareUI.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { BasketballGame } from '../../types';

interface HardwareUIProps {
  game: BasketballGame;
  onAction: (team: 'A' | 'B', type: 'points' | 'foul' | 'timeout', value: number) => void;
  onToggleClock: () => void;
  onResetShotClock: (seconds: number) => void;
  onTogglePossession: () => void;
  onNextPeriod: () => void;
  onOpenDiagnostics: () => void;
}

export const HardwareUI: React.FC<HardwareUIProps> = ({
  game,
  onAction,
  onToggleClock,
  onResetShotClock,
  onTogglePossession,
  onNextPeriod,
  onOpenDiagnostics
}) => {
  const [actionLog, setActionLog] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Haptic feedback
  const vibrate = (pattern: number | number[] = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // Log action
  const logAction = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setActionLog(prev => [...prev.slice(-5), `[${timestamp}] ${message}`]);
  };

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [actionLog]);

  // Wrapped handlers with haptics and logging
  const handleScore = (team: 'A' | 'B', points: number) => {
    vibrate([30, 20, 30]);
    logAction(`${team === 'A' ? game.teamA.name : game.teamB.name} +${points} PTS`);
    onAction(team, 'points', points);
  };

  const handleFoul = (team: 'A' | 'B') => {
    vibrate(80);
    logAction(`${team === 'A' ? game.teamA.name : game.teamB.name} FOUL`);
    onAction(team, 'foul', 1);
  };

  const handleTimeout = (team: 'A' | 'B') => {
    vibrate([50, 30, 50, 30, 50]);
    logAction(`${team === 'A' ? game.teamA.name : game.teamB.name} TIMEOUT`);
    onAction(team, 'timeout', -1);
  };

  const handleClockToggle = () => {
    vibrate(60);
    logAction(game.gameState.gameRunning ? 'CLOCK STOPPED' : 'CLOCK STARTED');
    onToggleClock();
  };

  const handleShotReset = (seconds: number) => {
    vibrate(40);
    logAction(`SHOT CLOCK RESET → ${seconds}s`);
    onResetShotClock(seconds);
  };

  const handlePossessionToggle = () => {
    vibrate(30);
    const newPoss = game.gameState.possession === 'A' ? game.teamB.name : game.teamA.name;
    logAction(`POSSESSION → ${newPoss}`);
    onTogglePossession();
  };

  const handlePeriodAdvance = () => {
    vibrate([60, 40, 60]);
    logAction(`ADVANCE TO Q${game.gameState.period + 1}`);
    onNextPeriod();
  };

  const formatTime = () => {
    const { minutes, seconds } = game.gameState.gameTime;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="hardware-container h-screen w-screen overflow-hidden fixed inset-0 flex flex-col">
      {/* CRT Scanlines */}
      <div className="crt-overlay"></div>

      {/* === TOP DISPLAY PANEL === */}
      <div className="bg-zinc-950 border-b-4 border-zinc-900 relative z-10 shadow-2xl">
        <div className="grid-pattern absolute inset-0 opacity-20"></div>
        
        <div className="relative z-10 grid grid-cols-3 gap-6 px-8 py-6">
          {/* HOME SCORE */}
          <div className="metal-panel p-6">
            <div className="embossed-label mb-3">HOME TEAM</div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black italic text-white uppercase truncate">
                {game.teamA.name}
              </h3>
              {game.gameState.possession === 'A' && (
                <div className="led-indicator led-on-green animate-pulse"></div>
              )}
            </div>
            <div className="segment-display">
              {game.teamA.score.toString().padStart(3, '0')}
            </div>
            <div className="mt-4 flex justify-between text-xs font-bold text-zinc-400">
              <span>FOULS: <span className="text-red-500">{game.teamA.fouls}</span></span>
              <span>TO: <span className="text-amber-500">{game.teamA.timeouts}</span></span>
            </div>
          </div>

          {/* CENTER CLOCK */}
          <div className="space-y-4">
            <div className="metal-panel p-6 text-center">
              <div className="embossed-label mb-3">GAME TIME</div>
              <div 
                className={`segment-display ${game.gameState.gameRunning ? '' : 'segment-display-amber'}`}
                style={{ fontSize: '64px' }}
              >
                {formatTime()}
              </div>
              <div className="mt-3 embossed-label">
                PERIOD {game.gameState.period}
              </div>
            </div>

            <div className="metal-panel p-4">
              <div className="embossed-label mb-2 text-center">SHOT CLOCK</div>
              <div 
                className={`segment-display ${game.gameState.shotClock <= 5 ? 'segment-display-red' : 'segment-display-amber'}`}
                style={{ fontSize: '48px' }}
              >
                {game.gameState.shotClock}
              </div>
            </div>
          </div>

          {/* GUEST SCORE */}
          <div className="metal-panel p-6">
            <div className="embossed-label mb-3">GUEST TEAM</div>
            <div className="flex items-center justify-between mb-4">
              {game.gameState.possession === 'B' && (
                <div className="led-indicator led-on-green animate-pulse"></div>
              )}
              <h3 className="text-2xl font-black italic text-white uppercase truncate ml-auto">
                {game.teamB.name}
              </h3>
            </div>
            <div className="segment-display">
              {game.teamB.score.toString().padStart(3, '0')}
            </div>
            <div className="mt-4 flex justify-between text-xs font-bold text-zinc-400">
              <span>FOULS: <span className="text-red-500">{game.teamB.fouls}</span></span>
              <span>TO: <span className="text-amber-500">{game.teamB.timeouts}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* === CONTROL PANEL === */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-8 p-8 bg-black overflow-hidden">
        {/* LEFT: HOME CONTROLS */}
        <div className="metal-panel p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-green-700">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: game.teamA.color, boxShadow: `0 0 12px ${game.teamA.color}` }}
            ></div>
            <h3 className="text-xl font-black italic text-white uppercase">
              {game.teamA.name}
            </h3>
          </div>

          {/* Score Buttons */}
          <div className="space-y-3">
            <div className="embossed-label mb-2">SCORING</div>
            <button 
              onClick={() => handleScore('A', 1)}
              className="hw-button hw-button-green w-full"
            >
              +1 POINT
            </button>
            <button 
              onClick={() => handleScore('A', 2)}
              className="hw-button hw-button-green w-full"
            >
              +2 POINTS
            </button>
            <button 
              onClick={() => handleScore('A', 3)}
              className="hw-button hw-button-green w-full"
            >
              +3 POINTS
            </button>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-3">
            <button 
              onClick={() => handleFoul('A')}
              className="hw-button hw-button-red w-full"
            >
              FOUL
            </button>
            <button 
              onClick={() => handleTimeout('A')}
              className="hw-button hw-button-amber w-full"
              disabled={game.teamA.timeouts === 0}
            >
              TIMEOUT ({game.teamA.timeouts})
            </button>
          </div>
        </div>

        {/* CENTER: MASTER CONTROLS */}
        <div className="w-80 flex flex-col gap-6">
          {/* Big Clock Button */}
          <button
            onClick={handleClockToggle}
            className={`h-80 rounded-full border-8 flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 ${
              game.gameState.gameRunning
                ? 'bg-gradient-to-b from-red-600 to-red-800 border-red-900'
                : 'bg-gradient-to-b from-green-600 to-green-800 border-green-900'
            }`}
            style={{
              boxShadow: game.gameState.gameRunning
                ? '0 0 60px rgba(239, 68, 68, 0.5)'
                : '0 0 60px rgba(34, 197, 94, 0.5)'
            }}
          >
            <div className="text-7xl font-black text-white mb-4">
              {game.gameState.gameRunning ? '■' : '▶'}
            </div>
            <div className="text-2xl font-black uppercase tracking-widest text-white">
              {game.gameState.gameRunning ? 'STOP' : 'START'}
            </div>
          </button>

          {/* Shot Clock Controls */}
          <div className="metal-panel p-4">
            <div className="embossed-label mb-3 text-center">SHOT CLOCK</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShotReset(24)}
                className="hw-button bg-gradient-to-b from-amber-600 to-amber-800 border-amber-700 text-white text-3xl font-black h-16"
              >
                24
              </button>
              <button
                onClick={() => handleShotReset(14)}
                className="hw-button bg-gradient-to-b from-amber-600 to-amber-800 border-amber-700 text-white text-3xl font-black h-16"
              >
                14
              </button>
            </div>
          </div>

          {/* Possession & Period */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePossessionToggle}
              className="hw-button"
            >
              <div className="embossed-label mb-1">POSS</div>
              <div className="text-2xl">
                {game.gameState.possession === 'A' ? '◄' : '►'}
              </div>
            </button>
            <button
              onClick={handlePeriodAdvance}
              className="hw-button"
            >
              <div className="embossed-label mb-1">PERIOD</div>
              <div className="text-2xl font-black">
                Q{game.gameState.period} →
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT: GUEST CONTROLS */}
        <div className="metal-panel p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-700">
            <h3 className="text-xl font-black italic text-white uppercase ml-auto">
              {game.teamB.name}
            </h3>
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: game.teamB.color, boxShadow: `0 0 12px ${game.teamB.color}` }}
            ></div>
          </div>

          {/* Score Buttons */}
          <div className="space-y-3">
            <div className="embossed-label mb-2 text-right">SCORING</div>
            <button 
              onClick={() => handleScore('B', 1)}
              className="hw-button hw-button-green w-full"
            >
              +1 POINT
            </button>
            <button 
              onClick={() => handleScore('B', 2)}
              className="hw-button hw-button-green w-full"
            >
              +2 POINTS
            </button>
            <button 
              onClick={() => handleScore('B', 3)}
              className="hw-button hw-button-green w-full"
            >
              +3 POINTS
            </button>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-3">
            <button 
              onClick={() => handleFoul('B')}
              className="hw-button hw-button-red w-full"
            >
              FOUL
            </button>
            <button 
              onClick={() => handleTimeout('B')}
              className="hw-button hw-button-amber w-full"
              disabled={game.teamB.timeouts === 0}
            >
              TIMEOUT ({game.teamB.timeouts})
            </button>
          </div>
        </div>
      </div>

      {/* === BOTTOM TERMINAL === */}
      <div className="bg-black border-t-2 border-zinc-900 h-24 p-4 shrink-0 relative z-10">
        <div className="terminal-output h-full">
          {actionLog.length === 0 ? (
            <div className="terminal-line text-zinc-700">
              [SYSTEM] Awaiting operator commands...
            </div>
          ) : (
            <>
              {actionLog.map((log, idx) => (
                <div key={idx} className="terminal-line">
                  TX &gt;&gt; {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Triple-tap area for diagnostics */}
      <div
        className="fixed top-0 left-0 w-32 h-32 z-[60]"
        onClick={onOpenDiagnostics}
        style={{ cursor: 'pointer', opacity: 0 }}
      ></div>
    </div>
  );
};