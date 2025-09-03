'use client';

import { useCallback, useEffect, useRef } from 'react';

export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const isActiveRef = useRef<boolean>(true);

  const animate = useCallback((time: number) => {
    if (!isActiveRef.current) return;
    
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  const start = useCallback(() => {
    isActiveRef.current = true;
    requestRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    isActiveRef.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const pause = useCallback(() => {
    isActiveRef.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (!isActiveRef.current) {
      isActiveRef.current = true;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    start,
    stop,
    pause,
    resume,
    isActive: isActiveRef.current,
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);

  const updateFPS = useCallback((currentTime: number) => {
    frameCountRef.current++;
    
    if (currentTime - lastTimeRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
  }, []);

  return {
    fps: fpsRef.current,
    updateFPS,
  };
};
