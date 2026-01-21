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
  teamA: { 
    name: "Team A", color: "#EA4335", score: 0, timeouts: 5, fouls: 0, // FIBA Default: 5
    players: [] 
  },
  teamB: { 
    name: "Team B", color: "#4285F4", score: 0, timeouts: 5, fouls: 0, 
    players: [] 
  },
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
    updateScore: () => {}, updateFouls: () => {}, updateTimeouts: () => {},
    togglePossession: () => {}, setPeriod: () => {}, updateGameTime: () => {},
    resetShotClock: () => {}, updatePlayerStats: () => {}, toggleTimer: () => {}, setGameTime: () => {}
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

  // FIBA Rule: Max 5 Timeouts (2 First Half, 3 Second Half)
  const updateTimeouts = (team: 'A' | 'B', change: number) => {
    const teamKey = team === 'A' ? 'teamA' : 'teamB';
    const newTimeouts = Math.max(0, Math.min(5, game[teamKey].timeouts + change));
    updateGameField(gameCode, `${teamKey}.timeouts`, newTimeouts);
  };

  const togglePossession = () => {
    const newPoss = game.gameState.possession === 'A' ? 'B' : 'A';
    updateGameField(gameCode, 'gameState.possession', newPoss);
  };

  const setPeriod = (newPeriod: number) => {
    updateGameField(gameCode, 'gameState.period', newPeriod);
  };

  // 1. TICK: Used by the interval loop to count down
  const updateGameTime = (m: number, s: number, t: number) => {
    let newShotClock = game.gameState.shotClock;
    if (game.gameState.shotClockRunning && newShotClock > 0) {
      newShotClock = parseFloat((newShotClock - 1).toFixed(1)); // Tick down 1s
    }
    updateGameField(gameCode, 'gameState', {
      ...game.gameState,
      gameTime: { minutes: m, seconds: s, tenths: t },
      shotClock: Math.max(0, newShotClock)
    });
  };

  // 2. SET: Used by Edit Modal to force time without side effects
  const setGameTime = (m: number, s: number, shot: number) => {
    updateGameField(gameCode, 'gameState', {
      ...game.gameState,
      gameTime: { minutes: m, seconds: s, tenths: 0 },
      shotClock: shot
    });
  };

  // 3. TOGGLE: Explicitly flips the running state
  const toggleTimer = () => {
    const newState = !game.gameState.gameRunning;
    updateGameField(gameCode, 'gameState', {
      ...game.gameState,
      gameRunning: newState,
      shotClockRunning: newState // Usually synced
    });
  };

  const resetShotClock = (seconds: number) => {
    updateGameField(gameCode, 'gameState.shotClock', seconds);
  };

  const updatePlayerStats = (team: 'A' | 'B', playerId: string, points: number, fouls: number) => {
    const teamKey = team === 'A' ? 'teamA' : 'teamB';
    const currentTeam = game[teamKey];
    
    const updatedPlayers = currentTeam.players.map(p => {
      if (p.id === playerId) {
        return { ...p, points: p.points + points, fouls: p.fouls + fouls };
      }
      return p;
    });

    const newScore = Math.max(0, currentTeam.score + points);
    const newTeamFouls = Math.max(0, currentTeam.fouls + fouls);

    updateGameField(gameCode, teamKey, {
      ...currentTeam,
      score: newScore,
      fouls: newTeamFouls,
      players: updatedPlayers
    });
  };

  return {
    ...game,
    updateScore,
    updateFouls,
    updateTimeouts,
    togglePossession,
    setPeriod,
    updateGameTime,
    setGameTime, // New export
    toggleTimer, // New export
    resetShotClock,
    updatePlayerStats
  };
};