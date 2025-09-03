/**
 * Constants for signal characteristics and performance requirements
 */

// Signal Types
export const SIGNAL_TYPES = {
  BREATHING1: 'breathing1',
  BREATHING2: 'breathing2',
  EDA: 'eda',
  PULSE: 'pulse',
} as const;

// Signal Colors (matching medical instrument standards)
export const SIGNAL_COLORS = {
  BREATHING1: '#1e40af', // Dark blue
  BREATHING2: '#1e40af', // Dark blue
  EDA: '#16a34a',        // Green
  PULSE: '#dc2626',      // Red
} as const;

// Signal Characteristics
export const SIGNAL_CHARACTERISTICS = {
  [SIGNAL_TYPES.BREATHING1]: {
    frequency: 0.25, // 15 cycles per minute (12-20 range)
    amplitude: 1.0,
    phase: 0,
    variation: 0.1, // Random variation factor
  },
  [SIGNAL_TYPES.BREATHING2]: {
    frequency: 0.25, // 15 cycles per minute (12-20 range)
    amplitude: 0.8,
    phase: 0.2, // Phase shift from breathing1
    variation: 0.1,
  },
  [SIGNAL_TYPES.EDA]: {
    frequency: 0.1, // 6 cycles per minute (0.1-0.5 Hz)
    amplitude: 0.6,
    phase: 0,
    variation: 0.05,
    peakFrequency: 0.1, // Frequency for occasional peaks
    peakThreshold: 0.8, // Threshold for peak generation
  },
  [SIGNAL_TYPES.PULSE]: {
    frequency: 1.2, // 72 bpm (60-100 range)
    amplitude: 0.4,
    phase: 0,
    variation: 0.05,
    harmonic1: 2, // First harmonic multiplier
    harmonic2: 4, // Second harmonic multiplier
  },
} as const;

// Performance Requirements
export const PERFORMANCE_CONFIG = {
  TARGET_FPS: 60,
  MAX_FRAME_TIME: 16.67, // 60fps = 16.67ms per frame
  SAMPLE_RATE: 60, // Samples per second
  BUFFER_SIZE: 1000, // Number of data points in buffer
  MEMORY_LIMIT: 100 * 1024 * 1024, // 100MB
  LOAD_TIME_LIMIT: 3000, // 3 seconds
} as const;

// Interactive Features
export const INTERACTIVE_CONFIG = {
  COLUMN_WIDTH: 3, // 3 seconds width
  DISTORTION_DURATION: 1000, // 1 second
  CLICK_TOLERANCE: 5, // 5px radius
  KEYBOARD_RESPONSE_TIME: 100, // 100ms latency
  SNAP_TO_GRID: true,
  GRID_SNAP_DISTANCE: 10, // 10px
} as const;

// Canvas Configuration
export const CANVAS_CONFIG = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 400,
  GRID_SIZE: 20,
  TIME_WINDOW: 180, // 3 minutes in seconds
  PIXEL_RATIO: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  SMOOTHING_FACTOR: 0.1, // For smooth transitions
  EASING_FUNCTION: 'ease-out',
  TRANSITION_DURATION: 300, // 300ms
  BOUNCE_FACTOR: 0.6, // For bounce effects
} as const;

// UI Configuration
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 300,
  HEADER_HEIGHT: 60,
  STATUS_BAR_HEIGHT: 30,
  TAB_HEIGHT: 40,
  PANEL_PADDING: 16,
  BORDER_RADIUS: 8,
  SHADOW_DEPTH: 2,
} as const;

// Signal Labels
export const SIGNAL_LABELS = {
  [SIGNAL_TYPES.BREATHING1]: 'TR', // Thoracic Respiration
  [SIGNAL_TYPES.BREATHING2]: 'AR', // Abdominal Respiration
  [SIGNAL_TYPES.EDA]: 'EDA', // Electrodermal Activity
  [SIGNAL_TYPES.PULSE]: 'BP', // Blood Pressure
} as const;

// Event Types
export const EVENT_TYPES = {
  COLUMN_ADD: 'column_add',
  COLUMN_REMOVE: 'column_remove',
  DISTORTION_START: 'distortion_start',
  DISTORTION_END: 'distortion_end',
  SIGNAL_UPDATE: 'signal_update',
  PLAYBACK_START: 'playback_start',
  PLAYBACK_PAUSE: 'playback_pause',
  PLAYBACK_STOP: 'playback_stop',
} as const;

// Default Subject Information
export const DEFAULT_SUBJECT = {
  name: 'Trent Lund',
  scoresheet: '<New>',
  chart: 'Arm, 8/17/2010 11:05:02 AM',
  examiner: 'Shawn',
} as const;

// Default Scoring Data
export const DEFAULT_SCORING = {
  r1: { tr: 0, ar: 0, eda: 0, bp: 0, ple: 0 },
  r2: { tr: 0, ar: 0, eda: 0, bp: 0, ple: 0 },
} as const;

// Default Question
export const DEFAULT_QUESTION = {
  question: 'Did you take the 20 dollars from petty cash?',
  r1: '',
  r2: '',
} as const;

// Default Ratios
export const DEFAULT_RATIOS = {
  c1: { r1: 0.26, r2: 0.06 },
  c2: { r1: 1.13, r2: 0.26 },
} as const;

// Default Totals
export const DEFAULT_TOTALS = {
  r1: 0,
  r2: 0,
  total: 0,
} as const;

// Tab Names
export const TAB_NAMES = [
  'Arm',
  'Chart 2',
  'Finger Cuff Detrend Example',
  'Finger Part II',
  'Finger Part III',
  'Chart 6',
] as const;

// Conclusion Options
export const CONCLUSION_OPTIONS = [
  'Not Scored',
  'Deceptive',
  'Non-Deceptive',
  'Inconclusive',
] as const;
