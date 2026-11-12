import { UserProfile, Goal } from '../types';
import { Chapter, CURRICULUM_DATA } from '../data/curriculumData';

const CURRENT_USER_KEY = 'mathquest_current_user_email';
const ACCOUNTS_INDEX_KEY = 'mathquest_saved_accounts_list';

export interface SavedAccountData {
  user: UserProfile;
  chapters: Chapter[];
  goal: Goal;
  savedAt: string;
}

// Default initial guest/student profile
export const DEFAULT_STUDENT: UserProfile = {
  id: 'user-001',
  name: 'Bảo Minh',
  email: 'baovnai@gmail.com',
  grade: 'Lớp 7A1',
  school: 'THCS Kết Nối Tri Thức',
  role: 'student',
  avatar: 'pipo_owl',
  xp: 480,
  coins: 160,
  hearts: 5,
  maxHearts: 5,
  streakDays: 5,
  unlockedBadges: ['RATIONAL_MASTER', 'EUCLID_EXPLORER', 'STREAK_5'],
  authProvider: 'google',
  isAuthenticated: true,
  registeredAt: '2026-09-05',
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
  currentAccuracy: 88,
  progressPercent: 60,
  recommendedMessage:
    'Để đạt mục tiêu Học kỳ 1, tuần này em cần hoàn thành 15 bài tập vận dụng Chương I với độ chính xác trên 85%!',
};

// Save a student's full progress
export function saveStudentProgress(user: UserProfile, chapters: Chapter[], goal: Goal) {
  try {
    const emailKey = user.email ? user.email.toLowerCase().trim() : user.id;
    const accountData: SavedAccountData = {
      user: {
        ...user,
        lastActiveAt: new Date().toISOString(),
      },
      chapters,
      goal,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(`mathquest_data_${emailKey}`, JSON.stringify(accountData));
    localStorage.setItem(CURRENT_USER_KEY, emailKey);

    // Update account index list
    const existingListRaw = localStorage.getItem(ACCOUNTS_INDEX_KEY);
    let accountsList: { email: string; name: string; grade: string; avatar: string; xp: number }[] = [];
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
    });

    localStorage.setItem(ACCOUNTS_INDEX_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

// Load current student progress
export function loadActiveStudentProgress(): SavedAccountData | null {
  try {
    const activeEmail = localStorage.getItem(CURRENT_USER_KEY) || 'baovnai@gmail.com';
    const rawData = localStorage.getItem(`mathquest_data_${activeEmail.toLowerCase().trim()}`);

    if (rawData) {
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.warn('Could not load from localStorage:', err);
  }
  return null;
}

// Load specific student progress by email
export function loadStudentByEmail(email: string): SavedAccountData | null {
  try {
    const rawData = localStorage.getItem(`mathquest_data_${email.toLowerCase().trim()}`);
    if (rawData) {
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.warn('Could not load account by email:', err);
  }
  return null;
}

// Get list of saved student accounts on this device
export function getSavedAccounts(): { email: string; name: string; grade: string; avatar: string; xp: number }[] {
  try {
    const existingListRaw = localStorage.getItem(ACCOUNTS_INDEX_KEY);
    if (existingListRaw) {
      return JSON.parse(existingListRaw);
    }
  } catch {
    // ignore
  }
  return [
    {
      email: 'baovnai@gmail.com',
      name: 'Bảo Minh',
      grade: 'Lớp 7A1',
      avatar: 'pipo_owl',
      xp: 480,
    },
  ];
}

// Clear current session (Log out)
export function clearCurrentSession() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    // ignore
  }
}
