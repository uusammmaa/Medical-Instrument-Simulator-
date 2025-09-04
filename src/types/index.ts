export interface SignalData {
  id: string;
  type: 'breathing1' | 'breathing2' | 'eda' | 'pulse';
  color: string;
  amplitude: number;
  frequency: number;
  phase: number;
  visible: boolean;
}

export interface Column {
  id: string;
  type: 'green' | 'red';
  x: number;
  width: number;
  timestamp: number;
}

export interface SimulatorState {
  signals: SignalData[];
  columns: Column[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  distortion: boolean;
  distortionTime: number;
  startTime: number;
}

export interface ScoringData {
  r1: {
    tr: number;
    ar: number;
    eda: number;
    bp: number;
    ple: number;
  };
  r2: {
    tr: number;
    ar: number;
    eda: number;
    bp: number;
    ple: number;
  };
}

export interface QuestionData {
  question: string;
  r1: string;
  r2: string;
}

export interface CommentsData {
  edaComments: string;
}

export interface RatiosData {
  c1: { r1: number; r2: number };
  c2: { r1: number; r2: number };
}

export interface TotalsData {
  r1: number;
  r2: number;
  total: number;
}

export interface SubjectInfo {
  name: string;
  scoresheet: string;
  chart: string;
  examiner: string;
}
