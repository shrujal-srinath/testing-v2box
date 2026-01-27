// src/features/tablet/StatusBar.tsx
import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  syncPending: number;
  lastSyncTime?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ syncPending, lastSyncTime }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [latency, setLatency] = useState<number | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Monitor online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Measure latency (ping Firebase)
  useEffect(() => {
    if (!isOnline) {
      setLatency(null);
      return;
    }

    const measureLatency = async () => {
      const start = Date.now();
      try {
        await fetch('https://firebasestorage.googleapis.com/v0/b/boxv2-1.appspot.com/o/ping', { mode: 'no-cors' });
        setLatency(Date.now() - start);
      } catch {
        setLatency(null);
      }
    };

    measureLatency();
    const interval = setInterval(measureLatency, 5000);
    return () => clearInterval(interval);
  }, [isOnline]);

  // Get battery status (if supported)
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => setBatteryLevel(Math.round(battery.level * 100));
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
      });
    }
  }, []);

  const getStatusColor = () => {
    if (!isOnline) return 'red';
    if (syncPending > 0) return 'amber';
    return 'green';
  };

  const getStatusText = () => {
    if (!isOnline) return 'OFFLINE MODE';
    if (syncPending > 0) return `SYNCING (${syncPending})`;
    return latency ? `CONNECTED (${latency}ms)` : 'CONNECTED';
  };

  const statusColor = getStatusColor();

  return (
    <div className="fixed top-0 right-0 z-50 m-4">
      <div className="metal-panel px-4 py-2 flex items-center gap-4 min-w-[280px]">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`led-indicator led-on-${statusColor}`}></div>
          <span className="embossed-label text-xs font-bold tracking-wider">
            {getStatusText()}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-700"></div>

        {/* Signal Strength */}
        {isOnline && latency !== null && (
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-zinc-700 transition-all"
                style={{
                  height: `${(i + 1) * 4}px`,
                  backgroundColor: latency < 100 || i < (latency < 200 ? 3 : 2) 
                    ? '#22c55e' 
                    : '#3f3f46'
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Battery (if available) */}
        {batteryLevel !== null && (
          <>
            <div className="h-6 w-px bg-zinc-700"></div>
            <div className="flex items-center gap-1">
              <div className="embossed-label text-xs">BAT</div>
              <div className="text-xs font-bold text-white font-mono">
                {batteryLevel}%
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};