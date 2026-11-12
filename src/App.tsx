import React, { useState, useEffect } from 'react';
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
  loadActiveStudentProgress, 
  clearCurrentSession 
} from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Load initial student data from LocalStorage if available
  const initialData = loadActiveStudentProgress();

  const [chapters, setChapters] = useState<Chapter[]>(initialData?.chapters || CURRICULUM_DATA);
  const [user, setUser] = useState<UserProfile>(initialData?.user || DEFAULT_STUDENT);
  const [goal, setGoal] = useState<Goal>(initialData?.goal || DEFAULT_GOAL);

  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Selection routing
  const [selectedLessonForPractice, setSelectedLessonForPractice] = useState<string>('c1-l1');
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<string | undefined>(undefined);
  const [selectedLessonForTheory, setSelectedLessonForTheory] = useState<string>('c1-l1');

  // Auto-persist student progress whenever user, chapters, or goal changes
  useEffect(() => {
    saveStudentProgress(user, chapters, goal);
  }, [user, chapters, goal]);

  // Handle User profile updates
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Handle Login / Registration success
  const handleLoginSuccess = (loggedUser: UserProfile, savedChapters?: Chapter[], savedGoal?: Goal) => {
    setUser(loggedUser);
    if (savedChapters && savedChapters.length > 0) {
      setChapters(savedChapters);
    }
    if (savedGoal) {
      setGoal(savedGoal);
    }
    saveStudentProgress(loggedUser, savedChapters || chapters, savedGoal || goal);
  };

  // Handle Logout
  const handleLogout = () => {
    clearCurrentSession();
    setUser({
      ...DEFAULT_STUDENT,
      id: `guest-${Date.now()}`,
      name: 'Khách',
      email: '',
      authProvider: 'guest',
      isAuthenticated: false,
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

    // Update goal progress
    setGoal((prev) => ({
      ...prev,
      completedQuestionsThisWeek: prev.completedQuestionsThisWeek + 3,
      progressPercent: Math.min(100, prev.progressPercent + 8),
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

  const handleStartPracticeFromTheory = (lessonId: string) => {
    setSelectedLessonForPractice(lessonId);
    setSelectedPracticeCategory(undefined);
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
        onToggleRole={() =>
          setUser((prev) => ({
            ...prev,
            role: prev.role === 'student' ? 'admin' : 'student',
          }))
        }
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

      {/* 4. Student Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Footer (Specification tab removed) */}
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
              <span>{user.isAuthenticated ? `Tài khoản: ${user.email || user.name}` : 'Đăng nhập Gmail / Đăng ký'}</span>
            </button>
            <span>·</span>
            <span className="text-emerald-700 font-medium">Tự động đồng bộ tiến trình</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
