import { create } from 'zustand';
import { UIStore } from './types';
import { ScoringData, QuestionData, CommentsData, RatiosData, TotalsData, SubjectInfo } from '@/types';

const initialScoring: ScoringData = {
  r1: { tr: 0, ar: 0, eda: 0, bp: 0, ple: 0 },
  r2: { tr: 0, ar: 0, eda: 0, bp: 0, ple: 0 },
};

const initialQuestion: QuestionData = {
  question: 'Did you take the 20 dollars from petty cash?',
  r1: '',
  r2: '',
};

const initialComments: CommentsData = {
  edaComments: '',
};

const initialRatios: RatiosData = {
  c1: { r1: 0.26, r2: 0.06 },
  c2: { r1: 1.13, r2: 0.26 },
};

const initialTotals: TotalsData = {
  r1: 0,
  r2: 0,
  total: 0,
};

const initialSubject: SubjectInfo = {
  name: 'Trent',
  scoresheet: '<New>',
  chart: `Arm, ${new Date().toLocaleString()}`,
  examiner: 'Dr. Khan',
};

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  scoring: initialScoring,
  question: initialQuestion,
  comments: initialComments,
  ratios: initialRatios,
  totals: initialTotals,
  subject: initialSubject,
  conclusion: 'Not Scored',
  selectedTab: 'Arm',
  sidebarCollapsed: false,

  // Actions
  updateScoring: (updates: Partial<ScoringData>) =>
    set((state) => ({
      scoring: { ...state.scoring, ...updates },
    })),

  updateQuestion: (updates: Partial<QuestionData>) =>
    set((state) => ({
      question: { ...state.question, ...updates },
    })),

  updateComments: (updates: Partial<CommentsData>) =>
    set((state) => ({
      comments: { ...state.comments, ...updates },
    })),

  updateRatios: (updates: Partial<RatiosData>) =>
    set((state) => ({
      ratios: { ...state.ratios, ...updates },
    })),

  updateTotals: (updates: Partial<TotalsData>) =>
    set((state) => ({
      totals: { ...state.totals, ...updates },
    })),

  updateSubject: (updates: Partial<SubjectInfo>) =>
    set((state) => ({
      subject: { ...state.subject, ...updates },
    })),

  setConclusion: (conclusion: string) => set({ conclusion }),
  setSelectedTab: (tab: string) => set({ selectedTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
