import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { SimulatorStore } from './types';
import { SignalData, Column, SignalId } from '@/types';

const now = () => performance.now();

const initialSignals: SignalData[] = [
  { id: 'breathing1', type: 'breathing1', color: '#1e3a8a', amplitude: 0.9, frequency: 0.28, phase: 0, visible: true, seed: 7777, driftSpeed: 0.012 },
  { id: 'breathing2', type: 'breathing2', color: '#1e40af', amplitude: 0.75, frequency: 0.3, phase: 0, visible: true, seed: 8888, driftSpeed: 0.013 },
  { id: 'eda', type: 'eda', color: '#16a34a', amplitude: 0.8, frequency: 0.12, phase: 0, visible: true, seed: 4242, driftSpeed: 0.01 },
  { id: 'pulse', type: 'pulse', color: '#dc2626', amplitude: 1.0, frequency: 2.2, phase: 0, visible: true, seed: 1337, driftSpeed: 0.015 },
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
  startTime: now(), // Track when simulation started
  distortionActive: false,
  distortionStartedAt: null,

  // append-only buffers (rolling window)
  buffers: {
    breathing1: [], breathing2: [], eda: [], pulse: [],
  },

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
  play: () => set({ isPlaying: true, startTime: now() }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({
    isPlaying: false,
    currentTime: 0,
    distortionActive: false,
    distortionStartedAt: null,
    buffers: { breathing1: [], breathing2: [], eda: [], pulse: [] },
    startTime: now(),
  }),

  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),
  setCurrentTime: (time: number) => set({ currentTime: time }),

  // Continuous signal generation
  updateCurrentTime: () => {
    const state = get();
    if (state.isPlaying) {
      const now = performance.now();
      const elapsed = (now - state.startTime) / 1000; // Convert to seconds
      set({ currentTime: elapsed });
    }
  },

  getCurrentTime: () => {
    const state = get();
    if (state.isPlaying) {
      const now = performance.now();
      return (now - state.startTime) / 1000;
    }
    return state.currentTime;
  },

  // Distortion
  triggerDistortion: () => {
    const now = performance.now();
    set({ distortion: true, distortionTime: now });
  },
  clearDistortion: () => {
    set({ distortion: false, distortionTime: 0 });
  },

  // New distortion methods for Spacebar
  pressSpace: () => set({ distortionActive: true, distortionStartedAt: now() }),
  releaseSpace: () => set({ distortionActive: false }),

  // Buffer management
  pushSample: (id, s) => set(state => {
    const next = { ...state.buffers };
    (next[id] ??= []).push(s);
    return { buffers: next };
  }),

  trimBuffers: (windowMs) => set(state => {
    const cutoff = now() - windowMs;
    const next: SimulatorStore['buffers'] = { breathing1: [], breathing2: [], eda: [], pulse: [] };
    (Object.keys(state.buffers) as SignalId[]).forEach(id => {
      const arr = state.buffers[id];
      let i = 0;
      while (i < arr.length && arr[i].t < cutoff) i++;
      next[id] = i > 0 ? arr.slice(i) : arr;
    });
    return { buffers: next };
  }),

  // Reset
  reset: () =>
    set({
      signals: initialSignals,
      columns: [],
      isPlaying: true, // Auto-start on reset
      currentTime: 0,
      distortion: false,
      distortionTime: 0,
      distortionActive: false,
      distortionStartedAt: null,
      buffers: { breathing1: [], breathing2: [], eda: [], pulse: [] },
      startTime: now(), // Reset start time
    }),
}));