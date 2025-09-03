'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useSimulatorStore } from '@/store/simulatorStore';
import { useSignalGenerator } from '@/hooks/useSignalGenerator';
import { useAnimationFrame, usePerformanceMonitor } from '@/hooks/useAnimationFrame';
import { SignalRenderer } from './SignalRenderer';
import { 
  createCanvasConfig, 
  setupHighDPICanvas, 
  drawGrid, 
  drawSignalBackground, 
  clearCanvas, 
  drawSignalSeparators,
  drawWatermark,
  PerformanceMonitor 
} from '@/lib/canvasUtils';
import { PERFORMANCE_CONFIG } from '@/lib/constants';

interface SignalCanvasProps {
  width: number;
  height: number;
  onMouseDown?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const SignalCanvas: React.FC<SignalCanvasProps> = React.memo(({
  width,
  height,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onContextMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const performanceMonitorRef = useRef<PerformanceMonitor>(new PerformanceMonitor());
  const { signals, columns, currentTime, distortion, isPlaying, updateCurrentTime } = useSimulatorStore();
  const { generateSignalBuffer } = useSignalGenerator();
  const { fps, updateFPS } = usePerformanceMonitor();

  // Create canvas configuration
  const canvasConfig = useMemo(() => 
    createCanvasConfig(width, height), 
    [width, height]
  );

  // Generate signal buffers for performance
  const signalBuffers = useMemo(() => {
    return signals.map(signal => generateSignalBuffer(signal, PERFORMANCE_CONFIG.BUFFER_SIZE));
  }, [signals, generateSignalBuffer]);

  // Draw columns with optimized performance
  const drawColumns = useCallback((ctx: CanvasRenderingContext2D) => {
    const timeScale = width / 180;
    
    columns.forEach((column) => {
      const x = (column.x - currentTime) * timeScale;
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
  }, [columns, currentTime, width, height]);

  // Main drawing function with performance optimization
  const draw = useCallback((deltaTime: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Update current time for animation
    updateCurrentTime(deltaTime);
    
    // Update performance monitoring
    updateFPS(Date.now());
    performanceMonitorRef.current.update(Date.now());
    
    // Clear canvas
    clearCanvas(ctx, canvasConfig);
    
    // Draw signal backgrounds
    signals.forEach((_, index) => {
      drawSignalBackground(ctx, canvasConfig, index);
    });
    
    // Draw grid
    drawGrid(ctx, canvasConfig);
    
    // Draw signal separators
    drawSignalSeparators(ctx, canvasConfig);
    
    // Draw columns
    drawColumns(ctx);
    
    // Draw signals using optimized renderer
    signals.forEach((signal, index) => {
      const buffer = signalBuffers[index];
      SignalRenderer({
        ctx,
        signal,
        index,
        width,
        height,
        currentTime,
        distortion,
        signalBuffer: buffer,
      });
    });
    
    // Draw watermark
    drawWatermark(ctx, canvasConfig);
    
    // Draw performance info in development
    if (process.env.NODE_ENV === 'development') {
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`FPS: ${fps}`, width - 10, height - 10);
    }
  }, [
    width, 
    height, 
    signals, 
    columns, 
    currentTime, 
    distortion, 
    signalBuffers, 
    canvasConfig, 
    drawColumns, 
    fps, 
    updateFPS,
    updateCurrentTime
  ]);

  // Animation frame hook for smooth rendering
  const { start, stop, pause, resume } = useAnimationFrame(draw);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup high-DPI canvas
    setupHighDPICanvas(canvas, canvasConfig);

    // Start animation if playing
    if (isPlaying) {
      start();
    } else {
      // Still draw once when not playing
      draw();
    }

    return () => {
      stop();
    };
  }, [canvasConfig, isPlaying, start, stop, draw]);

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying) {
      start();
    } else {
      pause();
    }
  }, [isPlaying, start, pause]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 bg-white"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onContextMenu={onContextMenu}
      style={{ cursor: 'crosshair' }}
    />
  );
});

SignalCanvas.displayName = 'SignalCanvas';
