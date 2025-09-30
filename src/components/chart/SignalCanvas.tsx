"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useSimulatorStore } from "@/store/simulatorStore";
import { SignalData } from "@/types";

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
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

function generateSample(
  sig: SignalData,
  tMs: number,
  distortionActive: boolean,
  distortionStartedAt: number | null
) {
  const t = tMs / 1000;

  // Generate different base signals based on type
  let base;

  if (sig.type === "breathing1" || sig.type === "breathing2") {
    // Perfectly smooth signals for breathing - no jitter, no drift
    base =
      Math.sin(2 * Math.PI * sig.frequency * t + sig.phase) * sig.amplitude;
  } else 
  if (sig.type === "eda") {
    const amplitude = distortionActive ? sig.amplitude * 2 : sig.amplitude;
    const frequency = distortionActive ? sig.frequency * 4 : sig.frequency;
    base = Math.sin(2 * Math.PI * frequency * t + sig.phase) * amplitude;
  } else if (sig.type === "pulse") {
    // Natural BPR signal - clean sine wave with light amplitude variations
    const rng = mulberry32(Math.floor(t * 60) + sig.seed);
    // Very light amplitude variation (5% max) for natural BPR feel
    const amplitudeVariation = 1 + (rng() - 0.5) * 0.05;
    // Very subtle frequency variation (1% max) to avoid perfect regularity
    const freqVariation = 1 + (rng() - 0.5) * 0.01;

    base =
      Math.sin(2 * Math.PI * (sig.frequency * freqVariation) * t + sig.phase) *
      sig.amplitude *
      amplitudeVariation;
  } else {
    // Other signals with original noise and jitter
    const rng = mulberry32(Math.floor(t * 60) + sig.seed);
    const freqJitter = 1 + (rng() - 0.5) * 0.05;
    const slowDrift =
      0.5 *
      Math.sin(2 * Math.PI * sig.driftSpeed * t + sig.seed) *
      sig.amplitude *
      0.08;
    const smallJitter = (rng() - 0.5) * 0.06 * sig.amplitude;

    base =
      Math.sin(2 * Math.PI * (sig.frequency * freqJitter) * t + sig.phase) *
        sig.amplitude +
      slowDrift +
      smallJitter;
  }

  if (!distortionActive) return base;

  const elapsed = distortionStartedAt ? (tMs - distortionStartedAt) / 1000 : 0;
  const E = easeOutCubic(Math.min(1, elapsed / 0.25)); // 250ms ramp

  switch (sig.type) {
    case "pulse": {
      // Natural BPR distortion - maintain clean pattern with amplitude increase
      const ampLift = 1.6; // Slightly reduced for more natural look
      return base * (1 + E * (ampLift - 1));
    }
    case "eda": {
      // EDA signal - amplitude already increased in base signal when distortion is active
      return base;
    }
    case "breathing1":
    case "breathing2": {
      // Breathing signals - smooth sine wave with frequency increase during distortion
      const freqBump = 2;
      return (
        Math.sin(2 * Math.PI * (sig.frequency * freqBump) * t + sig.phase) *
        sig.amplitude * 1.5
      );
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
    buffers,
    pushSample,
    trimBuffers,
    distortionActive,
    distortionStartedAt,
    updateCurrentTime,
  } = useSimulatorStore();

  // Drawing helpers
  const valueToY = (y: number, h: number, row: number, rows: number) => {
    const rowHeight = h / rows;
    const mid = row * rowHeight + rowHeight / 2;
    // scale each signal to ~70% of row height
    return mid - y * (rowHeight * 0.35);
  };

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const gridSize = 20;
      const timeScale = width / 60; // 60 seconds window

      ctx.strokeStyle = "#e5e7eb";
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

      // Time labels - show relative time (60s, 50s, 40s, etc.)
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      for (let i = 0; i <= 60; i += 20) {
        const x = i * timeScale;
        const seconds = 60 - i; // Countdown from 60 to 0
        ctx.fillText(`${seconds}s`, x, 20);
      }
    },
    [width, height]
  );


  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update current time for continuous animation (only when playing)
    if (isPlaying) {
      updateCurrentTime();
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx);

    // Generate and append new samples if playing
    if (isPlaying) {
      const t = performance.now();
      signals.forEach((sig) => {
        const y = generateSample(sig, t, distortionActive, distortionStartedAt);
        pushSample(sig.id, { t, y });
      });
      // keep last 60 seconds
      trimBuffers(60_000);
    }

    // Draw signals from buffers - only last 60 seconds
    const rows = signals.length;

    signals.forEach((sig, row) => {
      if (!sig.visible) return;
      const arr = buffers[sig.id] ?? [];
      if (arr.length < 2) return;

      // Filter samples to only show last 60 seconds
      const windowedSamples = arr.filter(
        (sample) =>
          sample.t >= performance.now() - 60000 && sample.t <= performance.now()
      );

      if (windowedSamples.length < 2) return;

      ctx.beginPath();
      for (let i = 0; i < windowedSamples.length; i++) {
        // Calculate x position: right-to-left scrolling
        // Most recent data (right edge) to oldest data (left edge)
        const timeFromNow = (performance.now() - windowedSamples[i].t) / 1000; // seconds ago
        const x = width - timeFromNow * (width / 60); // 60 seconds = full width
        const y = valueToY(windowedSamples[i].y, height, row, rows);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = sig.color;
      ctx.stroke();

      // Draw signal label
      ctx.fillStyle = sig.color;
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      const rowHeight = height / rows;
      const yOffset = row * rowHeight;
      let labelText = sig.type.toUpperCase();

      if (distortionActive) {
        labelText += " (DISTORTED)";
        ctx.fillStyle = "#ff6b6b";
      }
      ctx.fillText(labelText, 10, yOffset + 20);
    });
  }, [
    width,
    height,
    signals,
    buffers,
    distortionActive,
    distortionStartedAt,
    pushSample,
    trimBuffers,
    isPlaying,
    updateCurrentTime,
    drawGrid,
  ]);

  // Animation loop for continuous signal generation
  useEffect(() => {
    const animate = () => {
      draw();
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, isPlaying]);

  // Restart animation when resuming from pause
  useEffect(() => {
    if (isPlaying && !animationRef.current) {
      const animate = () => {
        draw();
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, draw]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (onContextMenu) {
        onContextMenu(event);
      }
      return false;
    },
    [onContextMenu]
  );

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
      style={{ cursor: "crosshair" }}
    />
  );
};
