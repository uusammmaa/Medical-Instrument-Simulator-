'use client';

import { useCallback, useMemo } from 'react';
import { useSimulatorStore } from '@/store/simulatorStore';
import { SignalData } from '@/types';

export const useSignalGenerator = () => {
  const { signals, currentTime, distortion } = useSimulatorStore();

  // Generate signal data points for a specific time range
  const generateSignalData = useCallback((
    signal: SignalData,
    startTime: number,
    endTime: number,
    sampleRate: number = 60 // 60 samples per second for 60fps
  ): number[] => {
    const dataPoints: number[] = [];
    const timeStep = 1 / sampleRate;
    
    for (let time = startTime; time <= endTime; time += timeStep) {
      let value = 0;
      
      switch (signal.type) {
        case 'breathing1':
          // Upper belly breathing - sinusoidal with slight variations
          value = Math.sin(time * signal.frequency + signal.phase) * signal.amplitude;
          // Add slight random variation for natural movement
          value += (Math.random() - 0.5) * 0.1 * signal.amplitude;
          break;
          
        case 'breathing2':
          // Lower belly breathing - phase-shifted sinusoidal (connected to Pattern 1)
          value = Math.sin(time * signal.frequency + signal.phase) * signal.amplitude;
          // Add slight random variation
          value += (Math.random() - 0.5) * 0.1 * signal.amplitude;
          break;
          
        case 'eda':
          // Skin response - smooth undulating pattern with occasional peaks
          value = Math.sin(time * signal.frequency) * signal.amplitude;
          // Add slower undulation
          value += Math.sin(time * signal.frequency * 0.3) * signal.amplitude * 0.5;
          // Add occasional peaks (every 10-15 seconds)
          if (Math.sin(time * 0.1) > 0.8) {
            value += signal.amplitude * 0.3;
          }
          break;
          
        case 'pulse':
          // Pulse rate - high-frequency oscillations
          value = Math.sin(time * signal.frequency * 2) * signal.amplitude * 0.8;
          // Add higher frequency component
          value += Math.sin(time * signal.frequency * 4) * signal.amplitude * 0.3;
          // Add slight variation for realistic pulse
          value += (Math.random() - 0.5) * 0.05 * signal.amplitude;
          break;
      }
      
      // Apply distortion if active
      if (distortion) {
        value += (Math.random() - 0.5) * signal.amplitude * 0.5;
      }
      
      dataPoints.push(value);
    }
    
    return dataPoints;
  }, [distortion]);

  // Generate signal buffer for real-time rendering
  const generateSignalBuffer = useCallback((
    signal: SignalData,
    bufferSize: number = 1000 // Number of data points to keep in buffer
  ): number[] => {
    const sampleRate = 60;
    const timeWindow = bufferSize / sampleRate; // Time window in seconds
    const startTime = currentTime - timeWindow;
    const endTime = currentTime;
    
    return generateSignalData(signal, startTime, endTime, sampleRate);
  }, [currentTime, generateSignalData]);

  // Get current signal values for all signals
  const getCurrentSignalValues = useMemo(() => {
    return signals.map(signal => {
      const buffer = generateSignalBuffer(signal, 1);
      return buffer.length > 0 ? buffer[buffer.length - 1] : 0;
    });
  }, [signals, generateSignalBuffer]);

  // Calculate signal statistics
  const getSignalStats = useCallback((signal: SignalData, timeWindow: number = 10) => {
    const buffer = generateSignalBuffer(signal, timeWindow * 60);
    if (buffer.length === 0) return { min: 0, max: 0, avg: 0, rms: 0 };
    
    const min = Math.min(...buffer);
    const max = Math.max(...buffer);
    const avg = buffer.reduce((sum, val) => sum + val, 0) / buffer.length;
    const rms = Math.sqrt(buffer.reduce((sum, val) => sum + val * val, 0) / buffer.length);
    
    return { min, max, avg, rms };
  }, [generateSignalBuffer]);

  return {
    generateSignalData,
    generateSignalBuffer,
    getCurrentSignalValues,
    getSignalStats,
  };
};
