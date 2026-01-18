import React, { useEffect } from 'react';
import { useGameTimer } from '../hooks/useGameTimer';

interface GameClockProps {
  onTimeUpdate?: (minutes: number, seconds: number, tenths: number) => void;
  readonly?: boolean; // NEW PROP
}

const formatTime = (num: number) => num.toString().padStart(2, '0');

export const GameClock: React.FC<GameClockProps> = ({ onTimeUpdate, readonly = false }) => {
  const { minutes, seconds, tenths, isRunning, startStop, reset } = useGameTimer(10, 0);

  useEffect(() => {
    if (!readonly && onTimeUpdate) {
      onTimeUpdate(minutes, seconds, tenths);
    }
  }, [minutes, seconds, tenths, readonly]); 

  const showTenths = minutes === 0 && seconds < 60;

  return (
    <div className="flex flex-col items-center bg-gray-900 border-4 border-gray-800 rounded-xl p-6 w-full max-w-sm mx-auto shadow-2xl">
      <div className={`text-7xl font-mono font-bold tracking-widest ${!readonly ? 'mb-6' : ''} ${isRunning ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-white'}`}>
        {showTenths ? <span>{seconds}.{tenths}</span> : <span>{formatTime(minutes)}:{formatTime(seconds)}</span>}
      </div>

      {!readonly && (
        <div className="flex gap-4">
          <button onClick={startStop} className={`px-6 py-2 rounded-lg font-bold transition-all ${isRunning ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white`}>
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button onClick={() => reset(10, 0)} className="px-6 py-2 rounded-lg font-bold border-2 border-gray-600 text-gray-400 hover:text-white">
            RESET
          </button>
        </div>
      )}
    </div>
  );
};