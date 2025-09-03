'use client';

import React, { useCallback, useMemo } from 'react';
import { SignalData } from '@/types';

interface SignalRendererProps {
  ctx: CanvasRenderingContext2D;
  signal: SignalData;
  index: number;
  width: number;
  height: number;
  currentTime: number;
  distortion: boolean;
  signalBuffer?: number[];
}

export const SignalRenderer: React.FC<SignalRendererProps> = ({
  ctx,
  signal,
  index,
  width,
  height,
  currentTime,
  distortion,
  signalBuffer,
}) => {
  const signalHeight = height / 4;
  const yOffset = index * signalHeight;
  const timeScale = width / 180; // 3 minutes = 180 seconds
  const amplitude = signal.amplitude * (signalHeight / 4);
  const centerY = yOffset + signalHeight / 2;

  // Generate signal data if buffer not provided
  const generateSignalData = useCallback((time: number): number => {
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
    
    return value;
  }, [signal, distortion]);

  // Draw signal using buffer or real-time generation
  const drawSignal = useCallback(() => {
    if (!signal.visible) return;
    
    ctx.strokeStyle = signal.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    if (signalBuffer && signalBuffer.length > 0) {
      // Use buffer for better performance
      const bufferLength = signalBuffer.length;
      const timeStep = 180 / bufferLength; // Time step per buffer point
      
      for (let i = 0; i < bufferLength; i++) {
        const x = (i / bufferLength) * width;
        const y = centerY + signalBuffer[i] * amplitude;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    } else {
      // Real-time generation
      for (let x = 0; x < width; x++) {
        const time = (x / timeScale) + currentTime;
        const y = centerY + generateSignalData(time) * amplitude;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    
    ctx.stroke();
    
    // Draw signal label
    ctx.fillStyle = signal.color;
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(signal.type.toUpperCase(), 10, yOffset + 20);
    
    // Draw signal value indicator
    const currentValue = signalBuffer && signalBuffer.length > 0 
      ? signalBuffer[signalBuffer.length - 1] 
      : generateSignalData(currentTime);
    
    ctx.fillStyle = signal.color;
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(
      `${(currentValue * 100).toFixed(1)}%`, 
      width - 10, 
      yOffset + 20
    );
  }, [
    signal,
    ctx,
    width,
    height,
    currentTime,
    distortion,
    signalBuffer,
    generateSignalData,
    yOffset,
    centerY,
    amplitude,
    timeScale,
  ]);

  // Memoize the drawing function to prevent unnecessary re-renders
  const memoizedDraw = useMemo(() => {
    drawSignal();
  }, [drawSignal]);

  return null; // This component doesn't render anything, it just draws to canvas
};
