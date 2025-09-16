import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { SimulatorStore } from './types';
import { SignalData, Column, SignalId } from '@/types';

const now = () => performance.now();

const initialSignals: SignalData[] = [
  { id: 'bvp', type: 'bvp', color: '#d9534f', amplitude: 1.0, frequency: 2.2, phase: 0, visible: true, seed: 1337, driftSpeed: 0.015 },
  { id: 'gsr', type: 'gsr', color: '#5cb85c', amplitude: 0.8, frequency: 0.12, phase: 0, visible: true, seed: 4242, driftSpeed: 0.01 },
  { id: 'resp', type: 'resp', color: '#337ab7', amplitude: 0.9, frequency: 0.28, phase: 0, visible: true, seed: 7777, driftSpeed: 0.012 },
  { id: 'resp2', type: 'resp2', color: '#3cb3c7', amplitude: 0.75, frequency: 0.3, phase: 0, visible: true, seed: 8888, driftSpeed: 0.013 },
  { id: 'pleth', type: 'pleth', color: '#999', amplitude: 0.6, frequency: 1.8, phase: 0, visible: true, seed: 2222, driftSpeed: 0.02 },
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
    bvp: [], gsr: [], resp: [], resp2: [], pleth: [],
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
    buffers: { bvp: [], gsr: [], resp: [], resp2: [], pleth: [] },
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
    const next: SimulatorStore['buffers'] = { bvp: [], gsr: [], resp: [], resp2: [], pleth: [] };
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
      buffers: { bvp: [], gsr: [], resp: [], resp2: [], pleth: [] },
      startTime: now(), // Reset start time
    }),
}));