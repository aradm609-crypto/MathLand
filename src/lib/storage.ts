import type { ProgressState, ExamResult, PracticeRecord, GameRecord } from '@/types';

const KEY = 'mathland-progress-v1';

const empty: ProgressState = {
  exams: [],
  practice: [],
  games: [],
  completedChapters: [],
  totalPoints: 0,
  chapterQuizCompleted: [],
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
      practice: Array.isArray(parsed.practice) ? parsed.practice : [],
      games: Array.isArray(parsed.games) ? parsed.games : [],
      completedChapters: Array.isArray(parsed.completedChapters) ? parsed.completedChapters : [],
      totalPoints: Number.isFinite(parsed.totalPoints) ? Number(parsed.totalPoints) : 0,
      chapterQuizCompleted: Array.isArray(parsed.chapterQuizCompleted) ? parsed.chapterQuizCompleted : [],
    };
  } catch {
    return { ...empty };
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function addExamResult(state: ProgressState, result: ExamResult): ProgressState {
  const exams = [...state.exams, result];
  const completedChapters = new Set(state.completedChapters);
  const chapterMatch = /^chapter-(\d+)$/.exec(result.type);
  if (chapterMatch) completedChapters.add(Number(chapterMatch[1]));
  const newState: ProgressState = {
    ...state,
    exams,
    completedChapters: Array.from(completedChapters),
    totalPoints: state.totalPoints + Math.round(result.scoreOutOf20 * 5),
  };
  saveProgress(newState);
  return newState;
}

export function addPracticeRecord(state: ProgressState, rec: PracticeRecord): ProgressState {
  const newState: ProgressState = {
    ...state,
    practice: [...state.practice, rec],
    totalPoints: state.totalPoints + rec.pointsEarned,
  };
  saveProgress(newState);
  return newState;
}

export function addGameRecord(state: ProgressState, rec: GameRecord): ProgressState {
  const newState: ProgressState = {
    ...state,
    games: [...state.games, rec],
    totalPoints: state.totalPoints + rec.score,
  };
  saveProgress(newState);
  return newState;
}

export function markChapterCompleted(state: ProgressState, chapterId: number): ProgressState {
  if (state.completedChapters.includes(chapterId)) return state;
  const newState: ProgressState = {
    ...state,
    completedChapters: [...state.completedChapters, chapterId],
  };
  saveProgress(newState);
  return newState;
}

export function markQuizCompleted(state: ProgressState, chapterId: number): ProgressState {
  if (state.chapterQuizCompleted.includes(chapterId)) return state;
  const newState: ProgressState = {
    ...state,
    chapterQuizCompleted: [...state.chapterQuizCompleted, chapterId],
    totalPoints: state.totalPoints + 10,
  };
  saveProgress(newState);
  return newState;
}

// Settings
const SETTINGS_KEY = 'mathland-settings-v1';

export interface Settings {
  theme: 'light' | 'dark';
  creatorName: string;
}

const defaultSettings: Settings = {
  theme: 'light',
  creatorName: 'محمد آراد محمدی',
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      creatorName: typeof parsed.creatorName === 'string' ? parsed.creatorName : defaultSettings.creatorName,
    };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}
