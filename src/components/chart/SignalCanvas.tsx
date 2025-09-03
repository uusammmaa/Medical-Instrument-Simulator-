import React, { useRef, useEffect, useCallback } from 'react';
import { useSimulatorStore } from '@/store/simulatorStore';

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
  const { signals, columns, currentTime, distortion } = useSimulatorStore();

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const gridSize = 20;
    const timeScale = width / 180; // 3 minutes = 180 seconds
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (time markers)
    for (let i = 0; i <= 180; i += 30) {
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
    for (let i = 0; i <= 180; i += 60) {
      const x = i * timeScale;
      const minutes = Math.floor(i / 60);
      ctx.fillText(`${minutes}:00`, x, 20);
    }
  }, [width, height]);

  const drawSignal = useCallback((ctx: CanvasRenderingContext2D, signal: any, index: number) => {
    if (!signal.visible) return;
    
    const signalHeight = height / 4;
    const yOffset = index * signalHeight;
    const timeScale = width / 180;
    const amplitude = signal.amplitude * (signalHeight / 4);
    const centerY = yOffset + signalHeight / 2;
    
    ctx.strokeStyle = signal.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      const time = (x / timeScale) + currentTime;
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
    
    ctx.stroke();
    
    // Draw signal label
    ctx.fillStyle = signal.color;
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(signal.type.toUpperCase(), 10, yOffset + 20);
  }, [width, height, currentTime, distortion]);

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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
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
  }, [width, height, signals, columns, currentTime, distortion, drawGrid, drawColumns, drawSignal]);

  useEffect(() => {
    draw();
  }, [draw]);

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
};
