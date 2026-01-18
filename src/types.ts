export interface GameState {
  period: number;
  gameTime: {
    minutes: number;
    seconds: number;
    tenths: number; // NEW
  };
  shotClock: number; // Stays as a number (e.g. 24.0)
  possession: 'A' | 'B';
  gameRunning: boolean;
  shotClockRunning: boolean;
}

// ... (Keep TeamData and BasketballGame exactly as they were)
export interface TeamData {
  name: string;
  color: string;
  score: number;
  timeouts: number;
  fouls: number;
}

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