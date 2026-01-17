import { useState, useEffect } from 'react';
import { BasketballGame } from '../types';
import { subscribeToGame, updateGameField, createGame } from '../services/gameService';

const INITIAL_GAME: BasketballGame = {
  hostId: null,
  code: "DEMO",
  gameType: "friendly",
  sport: "basketball",
  status: "live",
  settings: { gameName: "Demo Game", periodDuration: 12, shotClockDuration: 24, periodType: "quarter" },
  teamA: { name: "Team A", color: "#EA4335", score: 0, timeouts: 7, fouls: 0 },
  teamB: { name: "Team B", color: "#4285F4", score: 0, timeouts: 7, fouls: 0 },
  gameState: { period: 1, gameTime: { minutes: 12, seconds: 0 }, shotClock: 24, possession: "A", gameRunning: false, shotClockRunning: false },
  lastUpdate: Date.now()
};

export const useBasketballGame = (gameCode: string) => {
  const [game, setGame] = useState<BasketballGame | null>(null);

  useEffect(() => {
    createGame(gameCode, INITIAL_GAME).catch(() => console.log("Game likely exists"));
    const unsubscribe = subscribeToGame(gameCode, (data) => setGame(data));
    return () => unsubscribe();
  }, [gameCode]);

  // If loading...
  if (!game) return { 
    ...INITIAL_GAME, 
    updateScore: () => {}, 
    updateFouls: () => {}, 
    updateTimeouts: () => {}, // NEW
    togglePossession: () => {}, 
    setPeriod: () => {}       // NEW
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

  // NEW: Handle Timeouts
  const updateTimeouts = (team: 'A' | 'B', change: number) => {
    const teamKey = team === 'A' ? 'teamA' : 'teamB';
    // Usually timeouts don't go below 0 or above 7
    const newTimeouts = Math.max(0, Math.min(7, game[teamKey].timeouts + change));
    updateGameField(gameCode, `${teamKey}.timeouts`, newTimeouts);
  };

  const togglePossession = () => {
    const newPoss = game.gameState.possession === 'A' ? 'B' : 'A';
    updateGameField(gameCode, 'gameState.possession', newPoss);
  };

  // NEW: Manual Period Setter (for our logic)
  const setPeriod = (newPeriod: number) => {
    updateGameField(gameCode, 'gameState.period', newPeriod);
  };

  return {
    ...game,
    updateScore,
    updateFouls,
    updateTimeouts, // Exported
    togglePossession,
    setPeriod // Exported
  };
};