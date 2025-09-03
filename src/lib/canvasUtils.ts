/**
 * Canvas utility functions for performance optimization and drawing helpers
 */

export interface CanvasConfig {
  width: number;
  height: number;
  pixelRatio: number;
  gridSize: number;
  timeScale: number;
}

export const createCanvasConfig = (
  width: number,
  height: number,
  pixelRatio: number = window.devicePixelRatio || 1
): CanvasConfig => ({
  width,
  height,
  pixelRatio,
  gridSize: 20,
  timeScale: width / 180, // 3 minutes = 180 seconds
});

/**
 * Set up high-DPI canvas for crisp rendering
 */
export const setupHighDPICanvas = (
  canvas: HTMLCanvasElement,
  config: CanvasConfig
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set actual size in memory (scaled to account for extra pixel density)
  canvas.width = config.width * config.pixelRatio;
  canvas.height = config.height * config.pixelRatio;

  // Scale the drawing context so everything will work at the higher ratio
  ctx.scale(config.pixelRatio, config.pixelRatio);

  // Set the display size (CSS pixels)
  canvas.style.width = `${config.width}px`;
  canvas.style.height = `${config.height}px`;
};

/**
 * Draw grid lines with optimized performance
 */
export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig
): void => {
  ctx.save();
  
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  
  // Vertical grid lines (time markers)
  ctx.beginPath();
  for (let i = 0; i <= 180; i += 30) {
    const x = i * config.timeScale;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, config.height);
  }
  ctx.stroke();
  
  // Horizontal grid lines
  ctx.beginPath();
  for (let i = 0; i <= config.height; i += config.gridSize) {
    ctx.moveTo(0, i);
    ctx.lineTo(config.width, i);
  }
  ctx.stroke();
  
  // Time labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  for (let i = 0; i <= 180; i += 60) {
    const x = i * config.timeScale;
    const minutes = Math.floor(i / 60);
    ctx.fillText(`${minutes}:00`, x, 5);
  }
  
  ctx.restore();
};

/**
 * Draw signal background with gradient
 */
export const drawSignalBackground = (
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig,
  signalIndex: number
): void => {
  const signalHeight = config.height / 4;
  const yOffset = signalIndex * signalHeight;
  
  // Create subtle gradient for each signal area
  const gradient = ctx.createLinearGradient(0, yOffset, 0, yOffset + signalHeight);
  gradient.addColorStop(0, 'rgba(248, 250, 252, 0.3)');
  gradient.addColorStop(1, 'rgba(241, 245, 249, 0.1)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, yOffset, config.width, signalHeight);
};

/**
 * Clear canvas with optimized method
 */
export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig
): void => {
  ctx.clearRect(0, 0, config.width, config.height);
};

/**
 * Draw signal separator lines
 */
export const drawSignalSeparators = (
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig
): void => {
  ctx.save();
  
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  for (let i = 1; i < 4; i++) {
    const y = (config.height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(config.width, y);
    ctx.stroke();
  }
  
  ctx.restore();
};

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private frameTimes: number[] = [];
  private maxFrameTimeHistory = 60; // Keep last 60 frames

  update(currentTime: number): void {
    this.frameCount++;
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    // Track frame times for performance analysis
    if (this.frameTimes.length > 0) {
      const frameTime = currentTime - this.lastTime;
      this.frameTimes.push(frameTime);
      
      if (this.frameTimes.length > this.maxFrameTimeHistory) {
        this.frameTimes.shift();
      }
    }
  }

  getFPS(): number {
    return this.fps;
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
  }

  getMaxFrameTime(): number {
    return this.frameTimes.length > 0 ? Math.max(...this.frameTimes) : 0;
  }

  reset(): void {
    this.frameCount = 0;
    this.lastTime = 0;
    this.frameTimes = [];
  }
}

/**
 * Canvas memory management utilities
 */
export const optimizeCanvasMemory = (ctx: CanvasRenderingContext2D): void => {
  // Clear any cached paths
  ctx.beginPath();
  
  // Reset transform matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  // Clear any cached images or patterns
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
};

/**
 * Draw watermark with proper positioning
 */
export const drawWatermark = (
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig,
  text: string = 'CPSpro'
): void => {
  ctx.save();
  
  ctx.fillStyle = 'rgba(156, 163, 175, 0.1)';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const centerX = config.width / 2;
  const centerY = config.height / 2;
  
  ctx.fillText(text, centerX, centerY);
  
  ctx.restore();
};
