export type PageKey =
  | 'home'
  | 'chapters'
  | 'chapter'
  | 'exam'
  | 'practice'
  | 'calculator'
  | 'game'
  | 'dashboard'
  | 'about';

export interface WorkedExample {
  problem: string;
  steps: string[];
  answer: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string;
  introduction: string;
  concepts: { title: string; body: string }[];
  formulas: { name: string; expression: string }[];
  examples: WorkedExample[];
  practice: PracticeQuestion[];
  tips: string[];
  quiz: QuizQuestion[];
}

export interface ExamQuestion {
  id: string;
  chapterId: number;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamResult {
  id: string;
  date: number;
  type: 'comprehensive' | `chapter-${number}`;
  title: string;
  total: number;
  correct: number;
  scoreOutOf20: number;
  percentage: number;
  weakChapters: number[];
  answers: { questionId: string; selected: number | null; correct: boolean }[];
}

export interface PracticeRecord {
  date: number;
  chapterId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  correct: number;
  total: number;
  pointsEarned: number;
}

export interface GameRecord {
  date: number;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  correct: number;
  total: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ProgressState {
  exams: ExamResult[];
  practice: PracticeRecord[];
  games: GameRecord[];
  completedChapters: number[];
  totalPoints: number;
  chapterQuizCompleted: number[];
}
