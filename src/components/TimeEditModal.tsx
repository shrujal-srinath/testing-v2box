import React, { useState, useEffect } from 'react';

interface TimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTime: { minutes: number; seconds: number };
  shotClock: number;
  onSave: (min: number, sec: number, shot: number) => void;
}

export const TimeEditModal: React.FC<TimeEditModalProps> = ({ isOpen, onClose, gameTime, shotClock, onSave }) => {
  const [min, setMin] = useState(gameTime.minutes);
  const [sec, setSec] = useState(gameTime.seconds);
  const [shot, setShot] = useState(shotClock);

  useEffect(() => {
    if (isOpen) {
      setMin(gameTime.minutes);
      setSec(gameTime.seconds);
      setShot(shotClock);
    }
  }, [isOpen, gameTime, shotClock]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl w-full max-w-sm shadow-2xl">
        <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">Edit Clocks</h3>
        
        {/* GAME CLOCK */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Game Clock (MM:SS)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={min} 
              onChange={(e) => setMin(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 bg-black border border-zinc-700 rounded p-3 text-2xl font-mono font-bold text-center text-white focus:border-white outline-none" 
            />
            <span className="text-2xl text-zinc-600">:</span>
            <input 
              type="number" 
              value={sec} 
              onChange={(e) => setSec(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="flex-1 bg-black border border-zinc-700 rounded p-3 text-2xl font-mono font-bold text-center text-white focus:border-white outline-none" 
            />
          </div>
        </div>

        {/* SHOT CLOCK */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Shot Clock (Seconds)</label>
          <input 
            type="number" 
            value={shot} 
            onChange={(e) => setShot(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-black border border-zinc-700 rounded p-3 text-2xl font-mono font-bold text-center text-yellow-500 focus:border-yellow-500 outline-none" 
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-zinc-700 rounded text-zinc-400 font-bold uppercase hover:bg-zinc-800 transition-all">Cancel</button>
          <button 
            onClick={() => { onSave(min, sec, shot); onClose(); }} 
            className="flex-1 py-3 bg-white text-black rounded font-bold uppercase hover:bg-zinc-200 transition-all"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};