// src/pages/TabletController.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/hardware.css';
import { BootSequence } from '../features/tablet/BootSequence';
import { HardwareUI } from '../features/tablet/HardwareUI';
import { StatusBar } from '../features/tablet/StatusBar';
import { DiagnosticConsole } from '../features/tablet/DiagnosticConsole';
import { saveGameAction, loadLocalGame } from '../services/hybridService';
import type { BasketballGame } from '../types';
import { subscribeToGame } from '../services/gameService';

export const TabletController: React.FC = () => {
  const { gameCode } = useParams();
  const [game, setGame] = useState<BasketballGame | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState<number | null>(null);

  // === INITIALIZATION ===
  useEffect(() => {
    if (!gameCode) return;

    // Try local load first (instant)
    const local = loadLocalGame();
    if (local && local.code === gameCode) {
      setGame(local);
    }

    // Subscribe to cloud updates
    const unsubscribe = subscribeToGame(gameCode, (cloudData) => {
      setGame(cloudData);
    });

    // Monitor sync queue
    const queueInterval = setInterval(() => {
      const queueJson = localStorage.getItem('BOX_V2_SYNC_QUEUE');
      if (queueJson) {
        setSyncQueue(JSON.parse(queueJson));
      }
    }, 1000);

    return () => {
      unsubscribe && unsubscribe();
      clearInterval(queueInterval);
    };
  }, [gameCode]);

  // === TRIPLE-TAP DETECTION ===
  const handleTripleTap = () => {
    if (tapTimer) clearTimeout(tapTimer);

    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 3) {
      setShowDiagnostics(!showDiagnostics);
      setTapCount(0);
      return;
    }

    const timer = setTimeout(() => {
      setTapCount(0);
    }, 500);
    setTapTimer(timer);
  };

  // === GAME STATE UPDATER ===
  const updateGame = (updater: (g: BasketballGame) => void) => {
    if (!game) return;

    const newGame = JSON.parse(JSON.stringify(game));
    updater(newGame);
    newGame.lastUpdate = Date.now();

    setGame(newGame);
    saveGameAction(newGame);
  };

  // === HANDLERS ===
  const handleAction = (team: 'A' | 'B', type: 'points' | 'foul' | 'timeout', val: number) => {
    updateGame((g) => {
      if (type === 'points') {
        if (team === 'A') g.teamA.score = Math.max(0, g.teamA.score + val);
        else g.teamB.score = Math.max(0, g.teamB.score + val);
      }
      if (type === 'foul') {
        if (team === 'A') g.teamA.fouls = Math.max(0, g.teamA.fouls + val);
        else g.teamB.fouls = Math.max(0, g.teamB.fouls + val);
      }
      if (type === 'timeout') {
        if (team === 'A') g.teamA.timeouts = Math.max(0, Math.min(7, g.teamA.timeouts + val));
        else g.teamB.timeouts = Math.max(0, Math.min(7, g.teamB.timeouts + val));
      }
    });
  };

  const handleToggleClock = () => {
    updateGame((g) => {
      g.gameState.gameRunning = !g.gameState.gameRunning;
    });
  };

  const handleResetShotClock = (seconds: number) => {
    updateGame((g) => {
      g.gameState.shotClock = seconds;
    });
  };

  const handleTogglePossession = () => {
    updateGame((g) => {
      g.gameState.possession = g.gameState.possession === 'A' ? 'B' : 'A';
    });
  };

  const handleNextPeriod = () => {
    updateGame((g) => {
      g.gameState.period = (g.gameState.period % 4) + 1;
      g.gameState.gameTime.minutes = g.settings.periodDuration;
      g.gameState.gameTime.seconds = 0;
      g.gameState.shotClock = g.settings.shotClockDuration;
    });
  };

  // === CLOCK TIMER ===
  useEffect(() => {
    if (!game || !game.gameState.gameRunning) return;

    const interval = setInterval(() => {
      updateGame((g) => {
        const totalSec = g.gameState.gameTime.minutes * 60 + g.gameState.gameTime.seconds;
        
        if (totalSec > 0) {
          const newTotal = totalSec - 1;
          g.gameState.gameTime.minutes = Math.floor(newTotal / 60);
          g.gameState.gameTime.seconds = newTotal % 60;
          
          if (g.gameState.shotClock > 0) {
            g.gameState.shotClock = Math.max(0, g.gameState.shotClock - 1);
          }
        } else {
          g.gameState.gameRunning = false;
          if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.gameState.gameRunning]);

  // === LOADING ===
  if (!game) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="led-indicator led-on-amber mx-auto mb-4"></div>
          <p className="embossed-label">INITIALIZING HARDWARE INTERFACE...</p>
        </div>
      </div>
    );
  }

  // === RENDER ===
  return (
    <>
      {/* Boot Sequence */}
      {isBooting && (
        <BootSequence onComplete={() => setIsBooting(false)} />
      )}

      {/* Main UI */}
      {!isBooting && (
        <>
          <StatusBar 
            syncPending={syncQueue.length}
            lastSyncTime={game.lastUpdate}
          />
          
          <div onClick={handleTripleTap}>
            <HardwareUI
              game={game}
              onAction={handleAction}
              onToggleClock={handleToggleClock}
              onResetShotClock={handleResetShotClock}
              onTogglePossession={handleTogglePossession}
              onNextPeriod={handleNextPeriod}
              onOpenDiagnostics={() => setShowDiagnostics(!showDiagnostics)}
            />
          </div>

          {/* Diagnostic Console */}
          {showDiagnostics && (
            <DiagnosticConsole
              game={game}
              syncQueue={syncQueue}
              isOpen={showDiagnostics}
              onClose={() => setShowDiagnostics(false)}
            />
          )}
        </>
      )}
    </>
  );
};