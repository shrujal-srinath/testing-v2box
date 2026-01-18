import { useState, useEffect } from 'react';
import type { BasketballGame } from '../types';
import { subscribeToGame, updateGameField, createGame } from '../services/gameService';

const INITIAL_GAME: BasketballGame = {
  hostId: null,
  code: "DEMO",
  gameType: "friendly",
  sport: "basketball",
  status: "live",
  settings: { gameName: "Demo Game", periodDuration: 10, shotClockDuration: 24, periodType: "quarter" },
  teamA: { name: "Team A", color: "#EA4335", score: 0, timeouts: 7, fouls: 0 },
  teamB: { name: "Team B", color: "#4285F4", score: 0, timeouts: 7, fouls: 0 },
  gameState: { 
    period: 1, 
    gameTime: { minutes: 10, seconds: 0, tenths: 0 }, 
    shotClock: 24.0, 
    possession: "A", 
    gameRunning: false, 
    shotClockRunning: false 
  },
  lastUpdate: Date.now()
};

export const useBasketballGame = (gameCode: string) => {
  const [game, setGame] = useState<BasketballGame | null>(null);

  useEffect(() => {
    createGame(gameCode, INITIAL_GAME).catch((err) => console.log("Game check:", err));
    const unsubscribe = subscribeToGame(gameCode, (data) => setGame(data));
    return () => unsubscribe();
  }, [gameCode]);

  if (!game) return { 
    ...INITIAL_GAME, 
    updateScore: () => {}, 
    updateFouls: () => {}, 
    updateTimeouts: () => {},
    togglePossession: () => {}, 
    setPeriod: () => {},
    updateGameTime: () => {},
    resetShotClock: () => {} 
  };

  // --- ACTIONS ---

  const updateScore = (team: 'A' | 'B', points: number) => {
    const teamKey = team === 'A' ? 'teamA' : 'teamB';
    const newScore = Math.max(0, game[teamKey].score + points);
    updateGameField(gameCode, `${teamKey}.score`, newScore);
  };

  const updateFouls = (team: 'A' | 'B', change: number) => {
    const teamKey = team === 'A' ? 'teamA' : 'teamB';
    const newFouls = Math.max(0, game[teamKey].fouls + change);
    updateGameField(gameCode, `${teamKey}.fouls`, newFouls);
  };

  const updateTimeouts = (team: 'A' | 'B', change: number) => {
    const teamKey = team === 'A' ? 'teamA' : 'teamB';
    const newTimeouts = Math.max(0, Math.min(7, game[teamKey].timeouts + change));
    updateGameField(gameCode, `${teamKey}.timeouts`, newTimeouts);
  };

  const togglePossession = () => {
    const newPoss = game.gameState.possession === 'A' ? 'B' : 'A';
    updateGameField(gameCode, 'gameState.possession', newPoss);
  };

  const setPeriod = (newPeriod: number) => {
    updateGameField(gameCode, 'gameState.period', newPeriod);
  };

  // === NEW: THE TICK ===
  // This is called every 100ms by the GameClock component
  const updateGameTime = (m: number, s: number, t: number) => {
    // 1. Calculate new Shot Clock
    let newShotClock = game.gameState.shotClock;
    if (newShotClock > 0) {
      // Decrease by 0.1s
      newShotClock = parseFloat((newShotClock - 0.1).toFixed(1));
    }

    // 2. Optimization: Only write to Cloud every 1 second (when tenths is 0)
    // OR if the clock is stopped/very low. 
    // For now, we write every 1 second to save bandwidth, but always write locally.
    // If under 1 minute, we might want to sync more often.
    
    // Simple approach for MVP: Sync on full seconds OR if time is stopped.
    // Ideally, we'd throttle this. For now, let's sync every time to ensure "SS.t" works.
    // If this lags, we will optimize later.
    updateGameField(gameCode, 'gameState', {
      ...game.gameState,
      gameTime: { minutes: m, seconds: s, tenths: t },
      shotClock: newShotClock
    });
  };

  const resetShotClock = (seconds: number) => {
    updateGameField(gameCode, 'gameState.shotClock', seconds);
  };

  return {
    ...game,
    updateScore,
    updateFouls,
    updateTimeouts,
    togglePossession,
    setPeriod,
    updateGameTime, // Renamed to clarify it handles everything
    resetShotClock
  };
};