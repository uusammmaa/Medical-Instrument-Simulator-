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
  const { signals, columns, distortion, updateCurrentTime, getCurrentTime } = useSimulatorStore();

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

  const drawSignal = useCallback((ctx: CanvasRenderingContext2D, signal: SignalData, index: number) => {
    if (!signal.visible) return;
    
    const signalHeight = height / 4;
    const yOffset = index * signalHeight;
    const timeScale = width / 60; // 60 seconds window
    const amplitude = signal.amplitude * (signalHeight / 4);
    const centerY = yOffset + signalHeight / 2;
    const currentTime = getCurrentTime();
    
    ctx.strokeStyle = signal.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Draw the signal from right to left, but only show data from the start of simulation
    // This creates the effect of signals starting from scratch
    for (let x = 0; x < width; x++) {
      // Calculate the time for this x position (moving from right to left)
      const timeOffset = (width - x) / timeScale; // Time offset from current time
      const time = currentTime - timeOffset;
      
      // Only draw if the time is positive (from start of simulation forward)
      // and within the current time window
      if (time >= 0 && time <= currentTime) {
        let y = centerY;
        
        if (signal.type === 'breathing1' || signal.type === 'breathing2') {
          y = centerY + Math.sin(time * signal.frequency + signal.phase) * amplitude;
        } else if (signal.type === 'eda') {
          y = centerY + Math.sin(time * signal.frequency) * amplitude + 
              Math.sin(time * signal.frequency * 0.3) * amplitude * 0.5;
        } else if (signal.type === 'pulse') {
          y = centerY + Math.sin(time * signal.frequency * 2) * amplitude * 0.8 +
              Math.sin(time * signal.frequency * 4) * amplitude * 0.3;
        }
        
        // Apply distortion if active
        if (distortion) {
          y += (Math.random() - 0.5) * amplitude * 0.5;
        }
        
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
  }, [width, height, distortion, getCurrentTime]);

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
    
    // Draw signals
    signals.forEach((signal, index) => {
      drawSignal(ctx, signal, index);
    });
  }, [width, height, signals, drawGrid, drawColumns, drawSignal, updateCurrentTime]);

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
