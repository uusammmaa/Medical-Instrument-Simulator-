'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useSimulatorStore } from '@/store/simulatorStore';
import { SignalData } from '@/types';

interface SignalCanvasProps {
  width: number;
  height: number;
  onMouseDown?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

// Fast deterministic RNG
function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

function generateSample(sig: SignalData, tMs: number, distortionActive: boolean, distortionStartedAt: number | null) {
  const t = tMs / 1000;

  // per-signal deterministic RNG based on time bucket + seed
  const rng = mulberry32(Math.floor(t * 60) + sig.seed); // new bucket ~every 1/60s
  const smallJitter = (rng() - 0.5) * 0.06 * sig.amplitude; // ±6% amp jitter
  const freqJitter = 1 + (rng() - 0.5) * 0.05;              // ±5% freq jitter
  const slowDrift = 0.5 * Math.sin(2 * Math.PI * sig.driftSpeed * t + sig.seed) * sig.amplitude * 0.08;

  const base = Math.sin(2 * Math.PI * (sig.frequency * freqJitter) * t + sig.phase)
             * sig.amplitude
             + slowDrift
             + smallJitter;

  if (!distortionActive) return base;

  const elapsed = distortionStartedAt ? (tMs - distortionStartedAt) / 1000 : 0;
  const E = easeOutCubic(Math.min(1, elapsed / 0.25)); // 250ms ramp

  switch (sig.type) {
    case 'bvp': {
      const ampLift = 1.8;
      const hf = 0.02 * Math.sin(2 * Math.PI * 20 * t); // shimmer
      return base * (1 + E * (ampLift - 1)) + hf * sig.amplitude;
    }
    case 'gsr': {
      const tonicRise = 1.2 * E * sig.amplitude;
      const slower = Math.sin(2 * Math.PI * (sig.frequency * 0.6) * t) * sig.amplitude;
      return slower + tonicRise + smallJitter;
    }
    case 'resp':
    case 'resp2': {
      const ampDrop = 0.55;
      const freqBump = 1.25;
      return Math.sin(2 * Math.PI * (sig.frequency * freqBump) * t + sig.phase)
             * (sig.amplitude * (1 - E * (1 - ampDrop)));
    }
    case 'pleth': {
      const overshoot = 0.3 * Math.exp(-4 * elapsed) * sig.amplitude;
      return base * (1 + 0.6 * E) + overshoot;
    }
    default:
      return base * (1 + 0.5 * E);
  }
}

export const SignalCanvas: React.FC<SignalCanvasProps> = ({
  width,
  height,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onContextMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  const { 
    isPlaying, 
    signals, 
    columns, 
    buffers, 
    pushSample, 
    trimBuffers, 
    distortionActive, 
    distortionStartedAt,
    updateCurrentTime,
    getCurrentTime 
  } = useSimulatorStore();

  // Drawing helpers
  const timeToX = (t: number, minT: number, maxT: number, w: number) =>
    ((t - minT) / (maxT - minT)) * w;

  const valueToY = (y: number, h: number, row: number, rows: number) => {
    const rowHeight = h / rows;
    const mid = row * rowHeight + rowHeight / 2;
    // scale each signal to ~70% of row height
    return mid - y * (rowHeight * 0.35);
  };

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const gridSize = 20;
    const timeScale = width / 60; // 60 seconds = 1 minute
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (time markers every 10 seconds)
    for (let i = 0; i <= 60; i += 10) {
      const x = i * timeScale;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Time labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 60; i += 20) {
      const x = i * timeScale;
      const seconds = i;
      ctx.fillText(`${seconds}s`, x, 20);
    }
  }, [width, height]);

  const drawColumns = useCallback((ctx: CanvasRenderingContext2D) => {
    const timeScale = width / 60; // 60 seconds window
    const currentTime = getCurrentTime();
    
    columns.forEach((column) => {
      const timeOffset = currentTime - column.x;
      const x = width - (timeOffset * timeScale);
      const columnWidth = column.width * timeScale;
      
      if (x + columnWidth > 0 && x < width) {
        ctx.fillStyle = column.type === 'green' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(x, 0, columnWidth, height);
        
        // Column border
        ctx.strokeStyle = column.type === 'green' ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, 0, columnWidth, height);
      }
    });
  }, [columns, width, height, getCurrentTime]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Update current time for continuous animation
    updateCurrentTime();
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw columns
    drawColumns(ctx);
    
    // Generate and append new samples if playing
    if (isPlaying) {
      const t = performance.now();
      signals.forEach(sig => {
        const y = generateSample(sig, t, distortionActive, distortionStartedAt);
        pushSample(sig.id, { t, y });
      });
      // keep last 2 minutes
      trimBuffers(120_000);
    }

    // Draw signals from buffers
    const all = Object.values(buffers).flat();
    const minT = all.length ? Math.min(...all.map(s => s.t)) : performance.now() - 10_000;
    const maxT = all.length ? Math.max(...all.map(s => s.t)) : performance.now();
    const rows = signals.length;

    signals.forEach((sig, row) => {
      if (!sig.visible) return;
      const arr = buffers[sig.id] ?? [];
      if (arr.length < 2) return;

      ctx.beginPath();
      for (let i = 0; i < arr.length; i++) {
        const x = timeToX(arr[i].t, minT, maxT, width);
        const y = valueToY(arr[i].y, height, row, rows);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = sig.color;
      ctx.stroke();

      // Draw signal label
      ctx.fillStyle = sig.color;
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      const rowHeight = height / rows;
      const yOffset = row * rowHeight;
      let labelText = sig.type.toUpperCase();
      
      if (distortionActive) {
        labelText += ' (DISTORTED)';
        ctx.fillStyle = '#ff6b6b';
      }
      ctx.fillText(labelText, 10, yOffset + 20);
    });
  }, [width, height, signals, buffers, distortionActive, distortionStartedAt, pushSample, trimBuffers, isPlaying, updateCurrentTime, drawGrid, drawColumns]);

  // Animation loop for continuous signal generation
  useEffect(() => {
    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (onContextMenu) {
      onContextMenu(event);
    }
    return false;
  }, [onContextMenu]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 bg-white"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onContextMenu={handleContextMenu}
      style={{ cursor: 'crosshair' }}
    />
  );
};