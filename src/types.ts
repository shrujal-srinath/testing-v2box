export interface GameState {
  period: number;
  gameTime: {
    minutes: number;
    seconds: number;
  };
  shotClock: number;
  possession: 'A' | 'B';
  gameRunning: boolean;
  shotClockRunning: boolean;
}

export interface TeamData {
  name: string;
  color: string;
  score: number;
  timeouts: number;
  fouls: number;
}

// Ensure 'export' is here!
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