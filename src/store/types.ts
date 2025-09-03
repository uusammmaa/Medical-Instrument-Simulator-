import { SignalData, Column, SimulatorState, ScoringData, QuestionData, CommentsData, RatiosData, TotalsData, SubjectInfo } from '@/types';

export interface SimulatorStore extends SimulatorState {
  // Signal management
  updateSignal: (id: string, updates: Partial<SignalData>) => void;
  toggleSignalVisibility: (id: string) => void;
  
  // Column management
  addColumn: (column: Omit<Column, 'id'>) => void;
  removeColumn: (id: string) => void;
  clearColumns: () => void;
  
  // Playback controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setCurrentTime: (time: number) => void;
  
  // Distortion
  triggerDistortion: () => void;
  clearDistortion: () => void;
  
  // Reset
  reset: () => void;
}

export interface UIStore {
  // Panel data
  scoring: ScoringData;
  question: QuestionData;
  comments: CommentsData;
  ratios: RatiosData;
  totals: TotalsData;
  subject: SubjectInfo;
  conclusion: string;
  
  // UI state
  selectedTab: string;
  sidebarCollapsed: boolean;
  
  // Actions
  updateScoring: (updates: Partial<ScoringData>) => void;
  updateQuestion: (updates: Partial<QuestionData>) => void;
  updateComments: (updates: Partial<CommentsData>) => void;
  updateRatios: (updates: Partial<RatiosData>) => void;
  updateTotals: (updates: Partial<TotalsData>) => void;
  updateSubject: (updates: Partial<SubjectInfo>) => void;
  setConclusion: (conclusion: string) => void;
  setSelectedTab: (tab: string) => void;
  toggleSidebar: () => void;
}
