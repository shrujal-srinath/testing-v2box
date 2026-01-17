// Defines the structure of the Game Timer & Status
export interface GameState {
  period: number;
  gameTime: {
    minutes: number;
    seconds: number;
  };
  shotClock: number;
  possession: 'teamA' | 'teamB';
  gameRunning: boolean;
  shotClockRunning: boolean;
}

// Defines what a Team looks like
export interface TeamData {
  name: string;
  color: string;
  score: number;
  timeouts: number;
  fouls: number;
}

// The Master Object for the entire game
export interface BasketballGame {
  hostId: string | null;
  code: string;
  gameType: string;
  sport: 'basketball';
  status: 'live' | 'final';
  settings: {
    gameName: string;
    periodDuration: number;
    shotClockDuration: number;
    periodType: 'quarter' | 'half';
  };
  teamA: TeamData;
  teamB: TeamData;
  gameState: GameState;
  lastUpdate: number;
}