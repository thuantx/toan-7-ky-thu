export type ViewMode = 'dashboard' | 'practice' | 'theory';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  grade: string;
  school?: string;
  role: 'student' | 'admin';
  avatar: string; // 'pipo_owl' | 'lion' | 'rabbit' | 'dolphin' | 'penguin'
  xp: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  streakDays: number;
  unlockedBadges: string[];
  authProvider: 'google' | 'email' | 'guest';
  isAuthenticated: boolean;
  registeredAt?: string;
  lastActiveAt?: string;
}

export interface DailyQuestionCount {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface Goal {
  id: string;
  title: string;
  scope: 'SEMESTER' | 'FULL_YEAR' | 'CHAPTER';
  targetGrade: number; // e.g. 9.0
  targetDate: string; // YYYY-MM-DD
  targetChapterId?: string;
  weeklyTargetQuestions: number;
  targetAccuracy: number; // e.g. 85%
  completedQuestionsThisWeek: number;
  dailyCompletedQuestions?: DailyQuestionCount[];
  currentAccuracy: number;
  progressPercent: number;
  recommendedMessage: string;
}

export interface MascotMood {
  state: 'idle' | 'happy' | 'thinking' | 'encouraging' | 'celebrating' | 'sad';
  message: string;
}

export interface EdgeCaseState {
  simulatedOffline: boolean;
  simulatedExit: boolean;
  savedCheckpoint: {
    lessonId: string;
    questionIndex: number;
    score: number;
    timestamp: string;
  } | null;
}
