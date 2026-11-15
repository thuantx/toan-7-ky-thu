import { UserProfile, Goal, DailyQuestionCount, LessonPracticeSession } from '../types';
import { Chapter, CURRICULUM_DATA } from '../data/curriculumData';

const CURRENT_USER_KEY = 'mathquest_current_user_email';
const ACCOUNTS_INDEX_KEY = 'mathquest_saved_accounts_list';
const PRACTICE_SESSIONS_PREFIX = 'mathquest_practice_sessions_';

export function formatLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildLast7DaysSchedule(totalCompleted: number = 9): DailyQuestionCount[] {
  const weights = [1, 2, 0, 2, 1, 2, 1];
  const baseSum = weights.reduce((a, b) => a + b, 0);
  const result: DailyQuestionCount[] = [];
  const today = new Date();
  let remaining = Math.max(0, Math.round(totalCompleted));

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const idx = 6 - i;
    let count = 0;
    if (remaining > 0) {
      if (idx === 6) {
        count = remaining;
      } else {
        count = Math.min(remaining, Math.round((weights[idx] / baseSum) * totalCompleted));
        remaining -= count;
      }
    }
    result.push({
      date: formatLocalDateKey(d),
      count,
    });
  }
  return result;
}

// Allowed teacher emails: baoaivn@gmail.com (and baovnai@gmail.com)
export const TEACHER_EMAILS = ['baoaivn@gmail.com', 'baovnai@gmail.com'];

export function isTeacherEmail(email?: string): boolean {
  if (!email) return false;
  return TEACHER_EMAILS.includes(email.trim().toLowerCase());
}

export interface SavedAccountData {
  user: UserProfile;
  chapters: Chapter[];
  goal: Goal;
  savedAt: string;
}

// Default initial student profile (unregistered / guest student)
export const DEFAULT_STUDENT: UserProfile = {
  id: 'guest-student',
  name: 'Học sinh',
  email: '',
  grade: 'Lớp 7',
  school: 'THCS Kết Nối Tri Thức',
  role: 'student',
  avatar: 'pipo_owl',
  xp: 0,
  coins: 50,
  hearts: 5,
  maxHearts: 5,
  streakDays: 1,
  unlockedBadges: [],
  authProvider: 'guest',
  isAuthenticated: false,
  registeredAt: new Date().toISOString().split('T')[0],
  lastActiveAt: new Date().toISOString(),
};

export const DEFAULT_GOAL: Goal = {
  id: 'goal-01',
  title: 'Đạt danh hiệu Học sinh Giỏi Toán (Mục tiêu 9.0)',
  scope: 'SEMESTER',
  targetGrade: 9.0,
  targetDate: '2026-12-30',
  weeklyTargetQuestions: 15,
  targetAccuracy: 85,
  completedQuestionsThisWeek: 9,
  dailyCompletedQuestions: buildLast7DaysSchedule(9),
  currentAccuracy: 88,
  progressPercent: 60,
  recommendedMessage:
    'Để đạt mục tiêu Học kỳ 1, tuần này em cần hoàn thành 15 bài tập vận dụng Chương I với độ chính xác trên 85%!',
};

// Save a student's or teacher's full progress
export function saveStudentProgress(user: UserProfile, chapters: Chapter[], goal: Goal) {
  try {
    const emailKey = user.email ? user.email.toLowerCase().trim() : user.id;
    // Strict role enforcement
    const enforcedRole: 'admin' | 'student' = isTeacherEmail(emailKey) ? 'admin' : 'student';

    const accountData: SavedAccountData = {
      user: {
        ...user,
        role: enforcedRole,
        lastActiveAt: new Date().toISOString(),
      },
      chapters,
      goal,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(`mathquest_data_${emailKey}`, JSON.stringify(accountData));
    localStorage.setItem(CURRENT_USER_KEY, emailKey);

    // Update account index list only for authenticated users with valid email
    if (user.isAuthenticated && user.email && user.email.includes('@')) {
      const existingListRaw = localStorage.getItem(ACCOUNTS_INDEX_KEY);
      let accountsList: { email: string; name: string; grade: string; avatar: string; xp: number; role?: 'student' | 'admin' }[] = [];
      if (existingListRaw) {
        try {
          accountsList = JSON.parse(existingListRaw);
        } catch {
          accountsList = [];
        }
      }

      const filtered = accountsList.filter((a) => a.email !== emailKey);
      filtered.unshift({
        email: emailKey,
        name: user.name,
        grade: user.grade,
        avatar: user.avatar,
        xp: user.xp,
        role: enforcedRole,
      });

      localStorage.setItem(ACCOUNTS_INDEX_KEY, JSON.stringify(filtered.slice(0, 10)));
    }
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

// Merge saved progress (status, accuracy, stats) into latest CURRICULUM_DATA
export function mergeWithCurriculum(savedChapters?: Chapter[]): Chapter[] {
  if (!savedChapters || savedChapters.length === 0) {
    return CURRICULUM_DATA;
  }

  const progressMap = new Map<string, { status: string; accuracy: number; totalAttempts: number; correctCount: number; timeSpentMinutes: number }>();
  savedChapters.forEach((ch) => {
    ch.lessons?.forEach((l) => {
      progressMap.set(l.id, {
        status: l.status,
        accuracy: l.accuracy,
        totalAttempts: l.totalAttempts,
        correctCount: l.correctCount,
        timeSpentMinutes: l.timeSpentMinutes,
      });
    });
  });

  return CURRICULUM_DATA.map((ch) => ({
    ...ch,
    lessons: ch.lessons.map((l) => {
      const saved = progressMap.get(l.id);
      if (saved) {
        return {
          ...l,
          status: saved.status as any,
          accuracy: saved.accuracy,
          totalAttempts: saved.totalAttempts,
          correctCount: saved.correctCount,
          timeSpentMinutes: saved.timeSpentMinutes,
        };
      }
      return l;
    }),
  }));
}

// Load current active account progress
export function loadActiveStudentProgress(): SavedAccountData | null {
  try {
    const activeEmail = localStorage.getItem(CURRENT_USER_KEY);
    if (!activeEmail) return null;
    const rawData = localStorage.getItem(`mathquest_data_${activeEmail.toLowerCase().trim()}`);

    if (rawData) {
      const parsed: SavedAccountData = JSON.parse(rawData);
      if (!parsed || !parsed.user || typeof parsed.user !== 'object') {
        return null;
      }
      // Guarantee role consistency based on email
      parsed.user.role = isTeacherEmail(parsed.user.email) ? 'admin' : 'student';
      // Always merge with latest curriculum data so new sections, examples & questions are never lost
      parsed.chapters = mergeWithCurriculum(parsed.chapters);
      return parsed;
    }
  } catch (err) {
    console.warn('Could not load from localStorage:', err);
  }
  return null;
}

// Load specific student progress by email
export function loadStudentByEmail(email: string): SavedAccountData | null {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const rawData = localStorage.getItem(`mathquest_data_${cleanEmail}`);
    if (rawData) {
      const parsed: SavedAccountData = JSON.parse(rawData);
      if (!parsed || !parsed.user || typeof parsed.user !== 'object') {
        return null;
      }
      parsed.user.role = isTeacherEmail(cleanEmail) ? 'admin' : 'student';
      parsed.chapters = mergeWithCurriculum(parsed.chapters);
      return parsed;
    }
  } catch (err) {
    console.warn('Could not load account by email:', err);
  }
  return null;
}

// Get list of saved student accounts on this device
export function getSavedAccounts(): { email: string; name: string; grade: string; avatar: string; xp: number; role?: 'student' | 'admin' }[] {
  try {
    const existingListRaw = localStorage.getItem(ACCOUNTS_INDEX_KEY);
    if (existingListRaw) {
      return JSON.parse(existingListRaw);
    }
  } catch {
    // ignore
  }
  return [];
}

// Clear current session (Log out)
export function clearCurrentSession() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    // ignore
  }
}

export function getPracticeStorageKey(user?: Pick<UserProfile, 'id' | 'email' | 'isAuthenticated'> | null): string {
  if (user?.isAuthenticated && user.email) {
    return user.email.trim().toLowerCase();
  }
  return 'guest';
}

export function loadPracticeSessions(accountKey: string): Record<string, LessonPracticeSession> {
  try {
    const raw = localStorage.getItem(`${PRACTICE_SESSIONS_PREFIX}${accountKey}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, LessonPracticeSession>;
  } catch {
    return {};
  }
}

export function savePracticeSessions(
  accountKey: string,
  sessions: Record<string, LessonPracticeSession>
): void {
  try {
    localStorage.setItem(`${PRACTICE_SESSIONS_PREFIX}${accountKey}`, JSON.stringify(sessions));
  } catch (err) {
    console.warn('Could not save practice sessions:', err);
  }
}

/**
 * Shuffles multiple-choice options using Fisher-Yates while ensuring
 * the correct answer moves to a different position (A/B/C/D) on reset
 * so students cannot memorize option letters.
 */
export function shuffleQuestionOptionsAvoidingSamePosition(
  options: string[],
  correctAnswer: string,
  previousOptions?: string[]
): string[] {
  if (!Array.isArray(options) || options.length <= 1) return options;

  const normalize = (s: string) => s.normalize('NFC').trim().toLowerCase();
  const prev = previousOptions && previousOptions.length === options.length ? previousOptions : options;
  const prevCorrectIdx = prev.findIndex((o) => normalize(o) === normalize(correctAnswer));

  const fisherYates = (arr: string[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  for (let attempt = 0; attempt < 12; attempt++) {
    const candidate = fisherYates(options);
    const nextCorrectIdx = candidate.findIndex((o) => normalize(o) === normalize(correctAnswer));
    const sameOrder = candidate.every((val, i) => val === prev[i]);
    if (!sameOrder && (prevCorrectIdx === -1 || nextCorrectIdx !== prevCorrectIdx)) {
      return candidate;
    }
  }

  // Deterministic fallback rotation if random attempts hit same slot
  const rotated = [...prev.slice(1), prev[0]];
  return rotated;
}

