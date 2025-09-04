import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { SimulatorStore } from './types';
import { SignalData, Column } from '@/types';

const initialSignals: SignalData[] = [
  {
    id: 'breathing1',
    type: 'breathing1',
    color: '#1e40af', // Dark blue
    amplitude: 1.0,
    frequency: 0.25, // 15 cycles per minute
    phase: 0,
    visible: true,
  },
  {
    id: 'breathing2',
    type: 'breathing2',
    color: '#1e40af', // Dark blue
    amplitude: 0.8,
    frequency: 0.25, // 15 cycles per minute
    phase: 0.2, // Phase shift
    visible: true,
  },
  {
    id: 'eda',
    type: 'eda',
    color: '#16a34a', // Green
    amplitude: 0.6,
    frequency: 0.1, // 6 cycles per minute
    phase: 0,
    visible: true,
  },
  {
    id: 'pulse',
    type: 'pulse',
    color: '#dc2626', // Red
    amplitude: 0.4,
    frequency: 1.2, // 72 bpm
    phase: 0,
    visible: true,
  },
];

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  // Initial state
  signals: initialSignals,
  columns: [],
  isPlaying: true, // Start playing automatically
  currentTime: 0,
  duration: 60, // 60 seconds for hospital monitor style
  playbackSpeed: 1.0,
  distortion: false,
  distortionTime: 0,
  startTime: Date.now(), // Track when simulation started

  // Signal management
  updateSignal: (id: string, updates: Partial<SignalData>) =>
    set((state) => ({
      signals: state.signals.map((signal) =>
        signal.id === id ? { ...signal, ...updates } : signal
      ),
    })),

  toggleSignalVisibility: (id: string) =>
    set((state) => ({
      signals: state.signals.map((signal) =>
        signal.id === id ? { ...signal, visible: !signal.visible } : signal
      ),
    })),

  // Column management
  addColumn: (column: Omit<Column, 'id'>) =>
    set((state) => ({
      columns: [...state.columns, { ...column, id: uuidv4() }],
    })),

  removeColumn: (id: string) =>
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== id),
    })),

  clearColumns: () => set({ columns: [] }),

  // Playback controls
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({ isPlaying: false, currentTime: 0 }),

  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),
  setCurrentTime: (time: number) => set({ currentTime: time }),

  // Continuous signal generation
  updateCurrentTime: () => {
    const state = get();
    if (state.isPlaying) {
      const now = Date.now();
      const elapsed = (now - state.startTime) / 1000; // Convert to seconds
      set({ currentTime: elapsed });
    }
  },

  getCurrentTime: () => {
    const state = get();
    if (state.isPlaying) {
      const now = Date.now();
      return (now - state.startTime) / 1000;
    }
    return state.currentTime;
  },

  // Distortion
  triggerDistortion: () =>
    set({ distortion: true, distortionTime: Date.now() }),
  clearDistortion: () => set({ distortion: false, distortionTime: 0 }),

  // Reset
  reset: () =>
    set({
      signals: initialSignals,
      columns: [],
      isPlaying: true, // Auto-start on reset
      currentTime: 0,
      distortion: false,
      distortionTime: 0,
      startTime: Date.now(), // Reset start time
    }),
}));
