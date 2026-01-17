import { useState, useEffect } from 'react';
// FIXED LINE BELOW: Added 'type' keyword
import type { BasketballGame } from '../types';
import { subscribeToGame, updateGameField, createGame } from '../services/gameService';

// ... rest of the file stays the same
const INITIAL_GAME: BasketballGame = {
  hostId: null,
  code: "DEMO",
  gameType: "friendly",
  sport: "basketball",
  status: "live",
  settings: { gameName: "Demo Game", periodDuration: 12, shotClockDuration: 24, periodType: "quarter" },
  teamA: { name: "Team A", color: "#EA4335", score: 0, timeouts: 7, fouls: 0 },
  teamB: { name: "Team B", color: "#4285F4", score: 0, timeouts: 7, fouls: 0 },
  gameState: { 
    period: 1, 
    gameTime: { minutes: 12, seconds: 0 }, 
    shotClock: 24, 
    possession: "A", // Now matches 'A' | 'B' in types.ts
    gameRunning: false, 
    shotClockRunning: false 
  },
  lastUpdate: Date.now()
};

export const useBasketballGame = (gameCode: string) => {
  const [game, setGame] = useState<BasketballGame | null>(null);

  useEffect(() => {
    // 1. Try to create the game. If it fails (because it exists), that's fine.
    createGame(gameCode, INITIAL_GAME).catch((err) => console.log("Game check:", err));

    // 2. Subscribe to updates
    const unsubscribe = subscribeToGame(gameCode, (data) => {
      setGame(data);
    });

    return () => unsubscribe();
  }, [gameCode]);

  // If loading, return the default structure immediately so the app doesn't crash
  if (!game) return { 
    ...INITIAL_GAME, 
    updateScore: () => {}, 
    updateFouls: () => {}, 
    updateTimeouts: () => {},
    togglePossession: () => {}, 
    setPeriod: () => {} 
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
    // Read from gameState, NOT the root
    const currentPoss = game.gameState.possession; 
    const newPoss = currentPoss === 'A' ? 'B' : 'A';
    updateGameField(gameCode, 'gameState.possession', newPoss);
  };

  const setPeriod = (newPeriod: number) => {
    updateGameField(gameCode, 'gameState.period', newPeriod);
  };

  return {
    ...game,
    updateScore,
    updateFouls,
    updateTimeouts,
    togglePossession,
    setPeriod
  };
};