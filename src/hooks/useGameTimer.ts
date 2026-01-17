import { useState, useEffect, useRef } from 'react';

export const useGameTimer = (initialMinutes: number, initialSeconds: number) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else {
          if (minutes === 0) {
            setIsRunning(false); // Time's up!
            if (intervalRef.current) clearInterval(intervalRef.current);
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, minutes, seconds]);

  const startStop = () => setIsRunning(!isRunning);
  const reset = (m: number, s: number) => {
    setIsRunning(false);
    setMinutes(m);
    setSeconds(s);
  };

  return { minutes, seconds, isRunning, startStop, reset };
};