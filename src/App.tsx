import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, UserProfile, Goal } from './types';
import { CURRICULUM_DATA, Chapter, Lesson } from './data/curriculumData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PracticeView } from './components/PracticeView';
import { TheoryView } from './components/TheoryView';
import { GoalModal } from './components/GoalModal';
import { AuthModal } from './components/AuthModal';
import { 
  DEFAULT_STUDENT, 
  DEFAULT_GOAL, 
  saveStudentProgress, 
  clearCurrentSession,
  isTeacherEmail,
  mergeWithCurriculum,
  formatLocalDateKey,
  buildLast7DaysSchedule
} from './utils/storage';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  auth,
  loadOrCreateGoogleUserProfile,
  syncUserProgressToFirestore,
  signOutGoogleAccount,
} from './firebase';
import { calculateLearningStreak } from './components/StreakBadge';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  const [chapters, setChapters] = useState<Chapter[]>(mergeWithCurriculum(CURRICULUM_DATA));
  const [user, setUser] = useState<UserProfile>(DEFAULT_STUDENT);
  const [goal, setGoal] = useState<Goal>(DEFAULT_GOAL);

  // Firebase Auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseHydrated, setIsFirebaseHydrated] = useState<boolean>(false);
  const hydratedUidRef = useRef<string | null>(null);

  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Selection routing
  const [selectedLessonForPractice, setSelectedLessonForPractice] = useState<string>('c1-l1');
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<string | undefined>(undefined);
  const [selectedLessonForTheory, setSelectedLessonForTheory] = useState<string>('c1-l1');

  // Subscribe to Firebase Auth state (Real Google OAuth verification)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email && fbUser.emailVerified) {
        setFirebaseUser(fbUser);

        // If already hydrated from explicit login modal flow for this UID, skip duplicate fetch
        if (hydratedUidRef.current === fbUser.uid) {
          setIsFirebaseHydrated(true);
          return;
        }

        try {
          const { user: loadedUser, chapters: loadedChapters, goal: loadedGoal } =
            await loadOrCreateGoogleUserProfile(fbUser, null, CURRICULUM_DATA, DEFAULT_GOAL);

          hydratedUidRef.current = fbUser.uid;
          setUser(loadedUser);
          setChapters(loadedChapters);
          setGoal(loadedGoal);
          saveStudentProgress(loadedUser, loadedChapters, loadedGoal);
        } catch (err) {
          console.error('Failed to load Google user profile from Firestore:', err);
        } finally {
          setIsFirebaseHydrated(true);
        }
      } else {
        // Not authenticated via Google -> strictly guest mode (no unauthenticated admin/email bypass)
        hydratedUidRef.current = null;
        setFirebaseUser(null);
        clearCurrentSession();
        setUser((prev) =>
          prev.isAuthenticated
            ? {
                ...DEFAULT_STUDENT,
                id: `guest-${Date.now()}`,
                name: 'Học sinh',
                email: '',
                role: 'student',
                authProvider: 'guest',
                isAuthenticated: false,
              }
            : { ...prev, role: 'student', isAuthenticated: false, authProvider: 'guest' }
        );
        setIsFirebaseHydrated(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-persist student progress to LocalStorage + Firestore when authenticated
  useEffect(() => {
    if (!isFirebaseHydrated) return;

    saveStudentProgress(user, chapters, goal);

    if (!firebaseUser || !user.isAuthenticated) return;

    const timer = setTimeout(() => {
      syncUserProgressToFirestore(firebaseUser, user, chapters, goal).catch((err) => {
        console.warn('Firestore background sync error:', err);
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [user, chapters, goal, firebaseUser, isFirebaseHydrated]);

  // Handle User profile updates (e.g. XP/coins/hearts from PracticeView)
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Handle explicit profile save from AuthModal (immediate local + Firestore persistence)
  const handleSaveProfile = async (updated: Partial<UserProfile>) => {
    const mergedUser: UserProfile = {
      ...user,
      ...updated,
      lastActiveAt: new Date().toISOString(),
    };

    const activeFbUser = auth.currentUser || firebaseUser;
    if (activeFbUser && mergedUser.isAuthenticated) {
      await syncUserProgressToFirestore(activeFbUser, mergedUser, chapters, goal);
    }

    setUser(mergedUser);
    saveStudentProgress(mergedUser, chapters, goal);
  };

  // Handle Google OAuth Login success
  const handleLoginSuccess = (
    loggedUser: UserProfile,
    savedChapters: Chapter[],
    savedGoal: Goal,
    fbUser: FirebaseUser
  ) => {
    hydratedUidRef.current = fbUser.uid;
    setFirebaseUser(fbUser);
    setUser(loggedUser);
    setChapters(savedChapters && savedChapters.length > 0 ? savedChapters : mergeWithCurriculum(CURRICULUM_DATA));
    setGoal(savedGoal || DEFAULT_GOAL);
    setIsFirebaseHydrated(true);
    saveStudentProgress(loggedUser, savedChapters || chapters, savedGoal || goal);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOutGoogleAccount();
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    hydratedUidRef.current = null;
    setFirebaseUser(null);
    clearCurrentSession();
    setChapters(mergeWithCurriculum(CURRICULUM_DATA));
    setGoal(DEFAULT_GOAL);
    setUser({
      ...DEFAULT_STUDENT,
      id: `guest-${Date.now()}`,
      name: 'Khách',
      email: '',
      role: 'student',
      authProvider: 'guest',
      isAuthenticated: false,
    });
  };

  // Record a completed question onto today's date in goal.dailyCompletedQuestions
  const handleQuestionCompleted = (isCorrect: boolean) => {
    if (!isCorrect) return;
    const todayKey = formatLocalDateKey(new Date());

    setGoal((prev) => {
      const baseHistory =
        Array.isArray(prev.dailyCompletedQuestions) && prev.dailyCompletedQuestions.length > 0
          ? prev.dailyCompletedQuestions
          : buildLast7DaysSchedule(prev.completedQuestionsThisWeek);

      const map = new Map<string, number>();
      baseHistory.forEach((entry) => {
        if (entry?.date) map.set(entry.date, Math.max(0, Number(entry.count) || 0));
      });
      map.set(todayKey, (map.get(todayKey) ?? 0) + 1);

      const today = new Date();
      const updated7Days = [];
      let rollingSum = 0;
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = formatLocalDateKey(d);
        const count = map.get(key) ?? 0;
        rollingSum += count;
        updated7Days.push({ date: key, count });
      }

      const target = Math.max(1, prev.weeklyTargetQuestions || 15);
      const nextStreak = calculateLearningStreak(updated7Days).streakDays;
      setUser((uPrev) =>
        uPrev.streakDays !== nextStreak ? { ...uPrev, streakDays: nextStreak } : uPrev
      );

      return {
        ...prev,
        dailyCompletedQuestions: updated7Days,
        completedQuestionsThisWeek: rollingSum,
        progressPercent: Math.min(100, Math.round((rollingSum / target) * 100)),
      };
    });
  };

  // Handle lesson status transitions (State Machine execution)
  const handleLessonStatusChange = (lessonId: string, newStatus: Lesson['status'], accuracy: number) => {
    setChapters((prevChapters) =>
      prevChapters.map((ch) => ({
        ...ch,
        lessons: ch.lessons.map((l) => {
          if (l.id === lessonId) {
            return {
              ...l,
              status: newStatus,
              accuracy: Math.max(l.accuracy, accuracy),
              totalAttempts: l.totalAttempts + 3,
              correctCount: l.correctCount + (accuracy >= 80 ? 3 : 2),
            };
          }
          return l;
        }),
      }))
    );

    // Update overall goal progress percent on lesson completion
    setGoal((prev) => ({
      ...prev,
      progressPercent: Math.min(100, Math.max(prev.progressPercent, prev.progressPercent + 5)),
    }));
  };

  // Routing actions
  const handleStartPracticeFromDashboard = (lessonId: string, categoryFilter?: string) => {
    setSelectedLessonForPractice(lessonId);
    setSelectedPracticeCategory(categoryFilter);
    setCurrentView('practice');
  };

  const handleStartTheoryFromDashboard = (lessonId: string) => {
    setSelectedLessonForTheory(lessonId);
    setCurrentView('theory');
  };

  const handleStartPracticeFromTheory = (lessonId: string, categoryFilter?: string) => {
    setSelectedLessonForPractice(lessonId);
    setSelectedPracticeCategory(categoryFilter);
    setCurrentView('practice');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. Universal Top Bar */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onOpenGoalsModal={() => setIsGoalModalOpen(true)}
        onToggleRole={() => {
          if (firebaseUser?.emailVerified && isTeacherEmail(firebaseUser.email || undefined)) {
            setUser((prev) => ({
              ...prev,
              role: prev.role === 'student' ? 'admin' : 'student',
            }));
          }
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 2. Main View Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'dashboard' && (
          <DashboardView
            chapters={chapters}
            user={user}
            goal={goal}
            onOpenGoalsModal={() => setIsGoalModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSelectLessonForPractice={handleStartPracticeFromDashboard}
            onSelectLessonForTheory={handleStartTheoryFromDashboard}
          />
        )}

        {currentView === 'practice' && (
          <PracticeView
            chapters={chapters}
            initialLessonId={selectedLessonForPractice}
            initialCategoryFilter={selectedPracticeCategory}
            user={user}
            onUpdateUser={handleUpdateUser}
            onLessonStatusChange={handleLessonStatusChange}
            onQuestionCompleted={handleQuestionCompleted}
          />
        )}

        {currentView === 'theory' && (
          <TheoryView
            chapters={chapters}
            selectedLessonId={selectedLessonForTheory}
            onSelectLesson={setSelectedLessonForTheory}
            onStartPractice={handleStartPracticeFromTheory}
          />
        )}
      </main>

      {/* 3. Goal Setting Modal */}
      <GoalModal
        currentGoal={goal}
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSaveGoal={(newGoal) => setGoal(newGoal)}
      />

      {/* 4. Real Google OAuth Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        firebaseUser={firebaseUser}
        currentChapters={chapters}
        currentGoal={goal}
        onLoginSuccess={handleLoginSuccess}
        onUpdateProfile={handleSaveProfile}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 Toán 7 Kỳ Thú · Giáo trình cơ bản Kết Nối Tri Thức với Cuộc Sống · Hệ thống Gamification LMS
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-slate-900 underline underline-offset-2 flex items-center gap-1"
            >
              <span>{user.isAuthenticated ? `Tài khoản Google: ${user.email || user.name}` : 'Đăng nhập qua Google'}</span>
            </button>
            <span>·</span>
            <span className="text-emerald-700 font-medium">
              {user.isAuthenticated ? 'Đã đồng bộ đám mây' : 'Tự động lưu tiến trình'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
