import React from 'react';

interface ShotClockProps {
  seconds: number;
  onReset?: (val: number) => void;
  readonly?: boolean; // NEW PROP
}

export const ShotClock: React.FC<ShotClockProps> = ({ seconds, onReset, readonly = false }) => {
  const display = seconds > 9 ? Math.ceil(seconds) : seconds.toFixed(1);
  const isDanger = seconds <= 5;

  return (
    <div className="flex flex-col items-center bg-black border border-gray-800 rounded-xl p-3 w-32 shadow-lg">
      <div className="text-gray-600 text-[10px] tracking-widest mb-1">SHOT CLOCK</div>
      <div className={`text-5xl font-mono font-bold leading-none ${!readonly ? 'mb-3' : ''} ${isDanger ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
        {display}
      </div>

      {!readonly && onReset && (
        <div className="flex gap-2 w-full">
          <button onClick={() => onReset(24)} className="flex-1 bg-gray-800 text-white text-xs py-1 rounded border border-gray-700">24</button>
          <button onClick={() => onReset(14)} className="flex-1 bg-gray-800 text-white text-xs py-1 rounded border border-gray-700">14</button>
        </div>
      )}
    </div>
  );
};