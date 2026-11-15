import React, { useState, useEffect } from 'react';
import { Chapter, Question, Lesson } from '../data/curriculumData';
import { UserProfile, LessonPracticeSession, QuestionAttemptState } from '../types';
import { 
  Heart, 
  Coins, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  WifiOff, 
  Save, 
  Sparkles,
  Trophy,
  Filter,
  Check,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Info,
  Layers,
  ChevronDown,
  AlertTriangle,
  Volume2,
  VolumeX,
  Shuffle
} from 'lucide-react';
import { QuickCatalogModal } from './QuickCatalogModal';
import { PipoOwlMascot } from './PipoOwlMascot';
import { MathBadgeIcon } from './MathBadgeIcon';
import { soundManager, triggerMiniFireworks } from '../utils/soundEffects';
import { isTeacherEmail, shuffleQuestionOptionsAvoidingSamePosition } from '../utils/storage';

interface PracticeViewProps {
  chapters: Chapter[];
  initialLessonId: string;
  initialCategoryFilter?: string;
  onLessonChange?: (lessonId: string) => void;
  onCategoryFilterApplied?: () => void;
  practiceSessions: Record<string, LessonPracticeSession>;
  onUpdatePracticeSession: (
    lessonId: string,
    updater: (prev: LessonPracticeSession | undefined) => LessonPracticeSession
  ) => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLessonStatusChange: (lessonId: string, newStatus: Lesson['status'], accuracy: number) => void;
  onQuestionCompleted?: (isCorrect: boolean) => void;
}

function createDefaultLessonSession(lessonId: string): LessonPracticeSession {
  return {
    lessonId,
    currentIndex: 0,
    selectedCategoryFilter: 'all',
    selectedTypeFilter: 'all',
    answers: {},
    mistakeQuestionIds: [],
    rewardedQuestionIds: [],
    isSessionCompleted: false,
    optionOrders: {},
    resetCount: 0,
  };
}

const EMPTY_ATTEMPT: QuestionAttemptState = {
  selectedOption: null,
  textAnswer: '',
  isSubmitted: false,
  isCorrect: null,
  wrongAttempts: 0,
};

// Robust answer verification function: handles casing, unicode NFC/NFD, extra spaces, decimals, fractions, degrees, and option letters
export function checkIsAnswerCorrect(userAns: string, correctAns: string, options?: string[]): boolean {
  if (!userAns || !correctAns) return false;

  const normalize = (s: string) =>
    s
      .normalize('NFC')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[–—−]/g, '-');

  const u = normalize(userAns);
  const c = normalize(correctAns);

  // 1. Direct normalized match
  if (u === c) return true;

  // 2. Option letter match (A, B, C, D) ONLY if either input is explicitly a single choice letter (e.g., "A", "B.", "C)")
  if (options && options.length > 0) {
    const isSingleLetterChoice = (s: string) => /^[a-d][.)]?$/i.test(s.trim());

    if (isSingleLetterChoice(c)) {
      const targetLetter = c.trim()[0].toLowerCase();
      const targetIndex = targetLetter.charCodeAt(0) - 97;
      if (options[targetIndex] && normalize(options[targetIndex]) === u) {
        return true;
      }
    }

    if (isSingleLetterChoice(u)) {
      const userLetter = u.trim()[0].toLowerCase();
      const userIndex = userLetter.charCodeAt(0) - 97;
      if (options[userIndex] && normalize(options[userIndex]) === c) {
        return true;
      }
    }

    // For multiple choice, never strip parentheses (preserves 0,(36) vs 0,3(6) and 2a - b^2 vs (2a - b)^2)
    return u.replace(/\s+/g, '') === c.replace(/\s+/g, '');
  }

  // 3. Fill-in-blank normalization: spaces, decimal dot/comma, trailing degree symbol, and (-a)/b fraction formatting
  const normalizeFill = (s: string) => {
    let val = s.replace(/\s+/g, '');
    // Unwrap standalone negative parens like (-13)/6 -> -13/6 without touching repeating decimals like 1,(6)
    val = val.replace(/(^|\/)\((-?\d+(?:[.,]\d+)?)\)(?=$|\/)/g, '$1$2');
    // Normalize decimal comma <-> dot for pure numbers or repeating decimals
    if (/^-?\d+[.,]\d+$/.test(val) || /^-?\d+[.,]\d*\(\d+\)$/.test(val)) {
      val = val.replace(',', '.');
    }
    // Strip trailing degree symbol on numeric answers (e.g., 80° -> 80)
    if (/^-?\d+(?:[.,]\d+)?°$/.test(val)) {
      val = val.slice(0, -1);
    }
    return val;
  };

  return normalizeFill(u) === normalizeFill(c);
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  chapters,
  initialLessonId,
  initialCategoryFilter,
  onLessonChange,
  onCategoryFilterApplied,
  practiceSessions,
  onUpdatePracticeSession,
  user,
  onUpdateUser,
  onLessonStatusChange,
  onQuestionCompleted,
}) => {
  // Find current lesson
  const allLessons = chapters.flatMap((c) => c.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(initialLessonId || allLessons[0]?.id || 'c1-l1');
  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentChapter = chapters.find((c) => c.lessons.some((l) => l.id === currentLesson.id)) || chapters[0];

  // Quick Catalog Modal & Reset Confirm State
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [activeChapterTabId, setActiveChapterTabId] = useState<string>(currentChapter.id);

  // Persisted session for the active lesson
  const lessonSession = practiceSessions[currentLesson.id] || createDefaultLessonSession(currentLesson.id);

  const updateCurrentLessonSession = (
    updater: (prev: LessonPracticeSession) => LessonPracticeSession
  ) => {
    onUpdatePracticeSession(currentLesson.id, (prev) =>
      updater(prev || createDefaultLessonSession(currentLesson.id))
    );
  };

  // Synchronize active chapter tab when lesson changes
  useEffect(() => {
    setActiveChapterTabId(currentChapter.id);
    setShowResetConfirm(false);
  }, [currentChapter.id, currentLesson.id]);

  // Synchronize when initialLessonId or initialCategoryFilter prop changes
  useEffect(() => {
    if (initialLessonId && initialLessonId !== currentLessonId) {
      setCurrentLessonId(initialLessonId);
    }
  }, [initialLessonId]);

  useEffect(() => {
    if (initialCategoryFilter !== undefined) {
      onUpdatePracticeSession(currentLesson.id, (prev) => ({
        ...(prev || createDefaultLessonSession(currentLesson.id)),
        selectedCategoryFilter: initialCategoryFilter,
        currentIndex: 0,
        isSessionCompleted: false,
      }));
      onCategoryFilterApplied?.();
    }
  }, [initialCategoryFilter, currentLesson.id]);

  // Derived filters & mistake bank from persisted session
  const selectedTypeFilter = lessonSession.selectedTypeFilter;
  const selectedCategoryFilter = lessonSession.selectedCategoryFilter;
  const mistakeQuestions = currentLesson.questions.filter((q) =>
    lessonSession.mistakeQuestionIds.includes(q.id)
  );
  const isSessionCompleted = lessonSession.isSessionCompleted;

  const setSelectedTypeFilter = (typeFilter: 'all' | 'multiple_choice' | 'fill_in_blank') => {
    updateCurrentLessonSession((prev) => ({
      ...prev,
      selectedTypeFilter: typeFilter,
      currentIndex: 0,
      isSessionCompleted: false,
    }));
  };

  const setSelectedCategoryFilter = (catFilter: string) => {
    updateCurrentLessonSession((prev) => ({
      ...prev,
      selectedCategoryFilter: catFilter,
      currentIndex: 0,
      isSessionCompleted: false,
    }));
  };

  const setCurrentIndex = (next: number | ((prevIdx: number) => number)) => {
    updateCurrentLessonSession((prev) => ({
      ...prev,
      currentIndex: typeof next === 'function' ? next(prev.currentIndex) : next,
    }));
  };

  // Filtered Questions
  const filteredQuestions = currentLesson.questions.filter((q) => {
    if (selectedCategoryFilter === 'review_mistakes') {
      return lessonSession.mistakeQuestionIds.includes(q.id);
    }
    if (selectedTypeFilter !== 'all' && q.type !== selectedTypeFilter) return false;
    if (selectedCategoryFilter !== 'all' && q.category !== selectedCategoryFilter) return false;
    return true;
  });

  const activeQuestions = filteredQuestions.length > 0 ? filteredQuestions : currentLesson.questions;

  // Active Question State (persisted per questionId inside lessonSession.answers)
  const currentIndex = Math.max(0, Math.min(lessonSession.currentIndex, Math.max(0, activeQuestions.length - 1)));
  const currentQuestion: Question | undefined = activeQuestions[currentIndex];

  const currentAttempt: QuestionAttemptState = currentQuestion
    ? lessonSession.answers[currentQuestion.id] || EMPTY_ATTEMPT
    : EMPTY_ATTEMPT;

  const selectedOption = currentAttempt.selectedOption;
  const textAnswer = currentAttempt.textAnswer;
  const wrongAttempts = currentAttempt.wrongAttempts;
  const isAnswerSubmitted = currentAttempt.isSubmitted;
  const isCorrect = currentAttempt.isCorrect;

  // Displayed options (respecting shuffled order if lesson was reset/shuffled)
  const displayedOptions: string[] | undefined =
    currentQuestion?.type === 'multiple_choice' && currentQuestion.options
      ? lessonSession.optionOrders[currentQuestion.id]?.length === currentQuestion.options.length
        ? lessonSession.optionOrders[currentQuestion.id]
        : currentQuestion.options
      : currentQuestion?.options;

  const setSelectedOption = (optionValue: string | null) => {
    if (!currentQuestion) return;
    updateCurrentLessonSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: {
          ...(prev.answers[currentQuestion.id] || EMPTY_ATTEMPT),
          selectedOption: optionValue,
        },
      },
    }));
  };

  const setTextAnswer = (valueOrUpdater: string | ((prevText: string) => string)) => {
    if (!currentQuestion) return;
    updateCurrentLessonSession((prev) => {
      const existingAttempt = prev.answers[currentQuestion.id] || EMPTY_ATTEMPT;
      const nextText =
        typeof valueOrUpdater === 'function' ? valueOrUpdater(existingAttempt.textAnswer) : valueOrUpdater;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: {
            ...existingAttempt,
            textAnswer: nextText,
          },
        },
      };
    });
  };

  // Derived session progress counts
  const answeredInLessonCount = currentLesson.questions.filter(
    (q) => lessonSession.answers[q.id]?.isSubmitted
  ).length;
  const sessionCorrectCount = activeQuestions.filter(
    (q) => lessonSession.answers[q.id]?.isSubmitted && lessonSession.answers[q.id]?.isCorrect
  ).length;

  // Admin-only peek state
  const [showAdminInspection, setShowAdminInspection] = useState<boolean>(false);

  // Edge-case simulation flags
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [checkpointNotice, setCheckpointNotice] = useState<string | null>(null);
  const [showRefillModal, setShowRefillModal] = useState<boolean>(false);

  // Sound effect state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());

  // Refill modal inline error
  const [refillError, setRefillError] = useState<string | null>(null);

  // Verified teacher check (must be Google-authenticated with verified teacher email AND active admin mode)
  const isVerifiedTeacher = Boolean(
    user.isAuthenticated && isTeacherEmail(user.email) && user.role === 'admin'
  );

  // Mascot dynamic reaction
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Chào bạn nhỏ! Cùng Pipo tính toán thật cẩn thận để rinh trọn điểm nhé!'
  );

  // Sync mascot message & close admin peek when switching questions or lessons (WITHOUT wiping saved answers!)
  useEffect(() => {
    setShowAdminInspection(false);

    if (isVerifiedTeacher) {
      setMascotMessage(
        `[Chế độ Giáo viên]: Câu ${currentIndex + 1}/${activeQuestions.length}. Thầy/Cô có quyền mở xem trước Gợi ý sư phạm và Đáp án.`
      );
    } else if (isAnswerSubmitted) {
      setMascotMessage(
        isCorrect
          ? `Câu ${currentIndex + 1} đã hoàn thành chính xác! Em có thể xem lại lời giải hoặc chuyển câu tiếp theo.`
          : `Câu ${currentIndex + 1} đã lưu kết quả chưa đúng. Hãy đọc kỹ lời giải chi tiết bên dưới nhé!`
      );
    } else if (selectedOption || textAnswer.trim()) {
      setMascotMessage(
        `Câu ${currentIndex + 1}: Đã giữ nguyên lựa chọn của em! Bấm "Kiểm tra đáp án" khi em sẵn sàng nhé.`
      );
    } else {
      setMascotMessage(
        `Câu hỏi số ${currentIndex + 1}: Em hãy đọc kỹ đề, tự tính toán ra nháp nhé! Cách giải chi tiết sẽ mở sau khi kiểm tra.`
      );
    }
  }, [currentIndex, currentLesson.id, isVerifiedTeacher, activeQuestions.length]);

  // Handle checking answers (Normalized comparison + anti-double-submit guard + persisted session)
  const handleSubmitAnswer = () => {
    if (!currentQuestion || isAnswerSubmitted) return;

    let userAnswer = '';
    if (currentQuestion.type === 'multiple_choice') {
      if (!selectedOption) return;
      userAnswer = selectedOption.trim();
    } else {
      if (!textAnswer.trim()) return;
      userAnswer = textAnswer.trim();
    }

    const isAnswerRight = checkIsAnswerCorrect(
      userAnswer,
      currentQuestion.correctAnswer,
      displayedOptions
    );

    const alreadyRewarded = lessonSession.rewardedQuestionIds.includes(currentQuestion.id);
    const nextAttempts = isAnswerRight ? wrongAttempts : wrongAttempts + 1;

    updateCurrentLessonSession((prev) => {
      const existingAttempt = prev.answers[currentQuestion.id] || EMPTY_ATTEMPT;
      const nextRewarded =
        isAnswerRight && !prev.rewardedQuestionIds.includes(currentQuestion.id)
          ? [...prev.rewardedQuestionIds, currentQuestion.id]
          : prev.rewardedQuestionIds;

      const nextMistakes = isAnswerRight
        ? prev.mistakeQuestionIds.filter((id) => id !== currentQuestion.id)
        : prev.mistakeQuestionIds.includes(currentQuestion.id)
        ? prev.mistakeQuestionIds
        : [...prev.mistakeQuestionIds, currentQuestion.id];

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: {
            ...existingAttempt,
            selectedOption: currentQuestion.type === 'multiple_choice' ? userAnswer : existingAttempt.selectedOption,
            textAnswer: currentQuestion.type === 'fill_in_blank' ? userAnswer : existingAttempt.textAnswer,
            isSubmitted: true,
            isCorrect: isAnswerRight,
            wrongAttempts: nextAttempts,
          },
        },
        rewardedQuestionIds: nextRewarded,
        mistakeQuestionIds: nextMistakes,
      };
    });

    if (isAnswerRight) {
      soundManager.playCorrect();
      triggerMiniFireworks(0.5, 0.45);

      if (!alreadyRewarded) {
        const xpGained = wrongAttempts === 0 ? currentQuestion.pointsXP : Math.max(5, currentQuestion.pointsXP - 10);
        const coinsGained = 5;

        onUpdateUser({
          xp: user.xp + xpGained,
          coins: user.coins + coinsGained,
        });

        onQuestionCompleted?.(true);
        setMascotMessage(
          `Xuất sắc quá! Em đã giải chính xác! +${xpGained} XP và +${coinsGained} Xu vàng! Hãy đọc lời giải chi tiết rồi bấm "Câu tiếp theo" nhé! 🎉`
        );
      } else {
        setMascotMessage(
          'Chính xác! Em đã ôn tập lại câu này thành công (Điểm XP & Xu đã được ghi nhận trước đó). Hãy bấm "Câu tiếp theo" nhé!'
        );
      }
    } else {
      soundManager.playIncorrect();

      const newHearts = Math.max(0, user.hearts - 1);
      onUpdateUser({ hearts: newHearts });

      if (newHearts === 0) {
        setRefillError(null);
        setShowRefillModal(true);
        setMascotMessage(
          'Ối, em đã tạm hết tim rồi! Đừng lo, hãy làm câu đố tư duy nhanh hoặc đổi xu để hồi máu nhé!'
        );
      } else {
        setMascotMessage(
          `Chưa chính xác (-1 tim)! Câu hỏi này đã được chuyển vào mục "Kiểm tra lại sau". Hãy xem lời giải chi tiết bên dưới rồi bấm "Câu tiếp theo" nhé! 👇`
        );
      }
    }
  };

  // Reset entire lesson answers AND shuffle multiple-choice options to prevent answer-position memorization
  const handleResetLessonAndShuffle = () => {
    updateCurrentLessonSession((prev) => {
      const nextOptionOrders: Record<string, string[]> = { ...prev.optionOrders };
      currentLesson.questions.forEach((q) => {
        if (q.type === 'multiple_choice' && q.options && q.options.length > 1) {
          const currentOrder = prev.optionOrders[q.id] || q.options;
          nextOptionOrders[q.id] = shuffleQuestionOptionsAvoidingSamePosition(
            q.options,
            q.correctAnswer,
            currentOrder
          );
        }
      });

      return {
        ...prev,
        currentIndex: 0,
        selectedCategoryFilter: 'all',
        selectedTypeFilter: 'all',
        answers: {},
        mistakeQuestionIds: [],
        isSessionCompleted: false,
        optionOrders: nextOptionOrders,
        resetCount: (prev.resetCount || 0) + 1,
      };
    });

    setShowResetConfirm(false);
    setMascotMessage(
      `Đã đặt lại bài làm của Bài ${currentLesson.number} và đảo thứ tự đáp án A, B, C, D! Em hãy tự giải lại thật chắc nhé!`
    );
    setCheckpointNotice(
      `Đã reset toàn bộ bài tập Bài ${currentLesson.number}: "${currentLesson.title}" và đảo lại thứ tự các đáp án để luyện tập lại từ đầu.`
    );
    setTimeout(() => setCheckpointNotice(null), 5000);
  };

  // Retry only mistake questions (clears their previous wrong submission & shuffles their options)
  const handleStartReviewMistakes = () => {
    updateCurrentLessonSession((prev) => {
      const nextAnswers = { ...prev.answers };
      const nextOptionOrders = { ...prev.optionOrders };

      prev.mistakeQuestionIds.forEach((qId) => {
        delete nextAnswers[qId];
        const q = currentLesson.questions.find((item) => item.id === qId);
        if (q && q.type === 'multiple_choice' && q.options && q.options.length > 1) {
          nextOptionOrders[qId] = shuffleQuestionOptionsAvoidingSamePosition(
            q.options,
            q.correctAnswer,
            prev.optionOrders[qId] || q.options
          );
        }
      });

      return {
        ...prev,
        answers: nextAnswers,
        optionOrders: nextOptionOrders,
        selectedCategoryFilter: 'review_mistakes',
        currentIndex: 0,
        isSessionCompleted: false,
      };
    });
  };

  // Next question or complete lesson
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      updateCurrentLessonSession((prev) => ({
        ...prev,
        isSessionCompleted: true,
      }));
      const finalAccuracy = Math.min(100, Math.round((sessionCorrectCount / activeQuestions.length) * 100));
      const newStatus = finalAccuracy >= 80 ? 'MASTER' : 'COMPLETED';
      onLessonStatusChange(currentLesson.id, newStatus, finalAccuracy);
      setMascotMessage(
        `Chúc mừng em đã hoàn thành bài học với độ chính xác ${finalAccuracy}%! Pipo rất tự hào về em! 🏆`
      );
      if (finalAccuracy >= 60) {
        soundManager.playCorrect();
        triggerMiniFireworks(0.5, 0.35);
      }
    }
  };

  // Edge-case simulation
  const handleSimulateAppCrashAndRestore = () => {
    const checkpoint = {
      lessonId: currentLesson.id,
      questionIndex: currentIndex,
      score: sessionCorrectCount,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    };
    try {
      localStorage.setItem('mathquest_checkpoint', JSON.stringify(checkpoint));
    } catch {
      // ignore
    }

    setCheckpointNotice(
      `[State Machine Checkpoint Đã Lưu]: Đã lưu tự động phiên học của bài "${currentLesson.title}" tại câu ${currentIndex + 1} lúc ${checkpoint.timestamp}. Nếu học sinh chuyển tab Lý thuyết hoặc tải lại trang, hệ thống vẫn giữ nguyên các câu đã làm!`
    );
    setTimeout(() => setCheckpointNotice(null), 6000);
  };

  // Switch to a new lesson (preserving progress of the previous lesson!)
  const handleSwitchLesson = (newLessonId: string) => {
    setCurrentLessonId(newLessonId);
    onLessonChange?.(newLessonId);
    setShowResetConfirm(false);
  };

  // Categories for current lesson
  const availableCategories = Array.from(new Set(currentLesson.questions.map((q) => q.category)));
  const displayedChapterLessons = chapters.find((c) => c.id === activeChapterTabId)?.lessons || currentChapter.lessons;

  return (
    <div className="space-y-6 pb-16">
      {/* Edge-case / Checkpoint toast notice */}
      {checkpointNotice && (
        <div className="p-4 rounded-2xl bg-indigo-900 text-white shadow-xl flex items-center justify-between border border-indigo-400/40 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{checkpointNotice}</span>
          </div>
          <button
            onClick={() => setCheckpointNotice(null)}
            className="text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg shrink-0 ml-3"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {/* Offline simulation banner */}
      {isOfflineSimulated && (
        <div className="p-3.5 rounded-2xl bg-amber-500 text-amber-950 font-bold text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>Chế độ Ngoại Tuyến (Offline-First): Dữ liệu câu hỏi được lưu trong bộ nhớ máy. Bài làm sẽ tự động đồng bộ khi có mạng lại!</span>
          </div>
          <button
            onClick={() => setIsOfflineSimulated(false)}
            className="px-2.5 py-1 bg-amber-950 text-white rounded-lg text-[11px]"
          >
            Tắt mô phỏng
          </button>
        </div>
      )}

      {/* 1. Header Toolbar with QUICK CATALOG SELECTION (Click nhanh danh mục bài học) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        {/* Top row: Current Lesson Title + Quick Catalog Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">
              <span>{currentChapter.code}</span>
              <span>·</span>
              <span>Bài {currentLesson.number}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">Toán 7 Kết Nối Tri Thức</span>
            </div>

            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Bài {currentLesson.number}: {currentLesson.title}
              </h2>
            </div>
          </div>

          {/* Top-right Action Buttons: Reset Lesson & Quick Catalog */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => {
                  if (answeredInLessonCount > 0 || isSessionCompleted) {
                    setShowResetConfirm(true);
                  } else {
                    handleResetLessonAndShuffle();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                title="Đặt lại toàn bộ câu trả lời của bài này và đảo thứ tự đáp án A, B, C, D"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-600" />
                <span>{answeredInLessonCount > 0 || isSessionCompleted ? 'Làm lại cả bài' : 'Đảo đáp án'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-2xl px-2.5 py-1.5">
                <span className="text-[11px] font-bold text-amber-950">Reset & đảo đáp án?</span>
                <button
                  type="button"
                  onClick={handleResetLessonAndShuffle}
                  className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold cursor-pointer"
                >
                  Xác nhận
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            )}

            <button
              onClick={() => setShowCatalogModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              title="Mở danh mục chọn nhanh 25 bài học của toàn bộ chương trình"
            >
              <Layers className="w-4 h-4" />
              <span>Danh mục 25 Bài Học</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          </div>
        </div>

        {/* Quick Chapter Selector Chips (Click 1 chạm đổi chương & bài ngay trên thanh) */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chọn nhanh Chương:</span>
            </span>
            <button
              onClick={() => setShowCatalogModal(true)}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Xem tất cả 25 bài →
            </button>
          </div>

          {/* Chapter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {chapters.map((ch) => {
              const isSelected = ch.id === activeChapterTabId;
              const hasCurrentLesson = ch.lessons.some((l) => l.id === currentLesson.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterTabId(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : hasCurrentLesson
                      ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-300/80'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{ch.code}: {ch.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Lesson Pills belonging to the selected chapter */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            {displayedChapterLessons.map((l) => {
              const isCurrent = l.id === currentLesson.id;
              return (
                <button
                  key={l.id}
                  onClick={() => handleSwitchLesson(l.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white font-bold shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 hover:border-emerald-300'
                  }`}
                  title={l.title}
                >
                  <span className="font-bold">Bài {l.number}:</span>
                  <span className="truncate max-w-[150px]">{l.title}</span>
                  {l.status === 'MASTER' && <span className="text-[10px]">⭐</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phần bài tập:</span>
            </span>

            {currentLesson.sections && currentLesson.sections.length > 0 ? (
              <>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('all');
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({currentLesson.questions.length} bài)
                </button>
                {currentLesson.sections.map((sec) => {
                  const matchingCat = availableCategories.find(c => c.includes(sec.code)) || (sec.code === 'Phần I' ? 'Phần I: Khái niệm & Trục số' : 'Phần II: Thứ tự & So sánh');
                  const count = currentLesson.questions.filter((q) => q.sectionId === sec.id || q.category.includes(sec.code)).length;
                  const isSelected = selectedCategoryFilter === matchingCat;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setSelectedCategoryFilter(matchingCat);
                        setCurrentIndex(0);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <span className="font-extrabold">{sec.code}:</span>
                      <span>{sec.shortTitle || sec.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-emerald-200/80 text-emerald-900'
                      }`}>
                        {count} bài
                      </span>
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('all');
                    setCurrentIndex(0);
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({currentLesson.questions.length})
                </button>
                {availableCategories.map((cat) => {
                  const count = currentLesson.questions.filter((q) => q.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategoryFilter(cat);
                        setCurrentIndex(0);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        selectedCategoryFilter === cat
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        selectedCategoryFilter === cat ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </>
            )}

            {/* Mục kiểm tra lại sau (Sổ tay câu sai) */}
            {mistakeQuestions.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCategoryFilter('review_mistakes');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedCategoryFilter === 'review_mistakes'
                    ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500/20'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
                title="Luyện tập lại các câu đã trả lời sai"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Kiểm tra lại sau</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  selectedCategoryFilter === 'review_mistakes' ? 'bg-white/25 text-white' : 'bg-rose-200 text-rose-900 font-bold'
                }`}>
                  {mistakeQuestions.length} câu
                </span>
              </button>
            )}
          </div>

          {/* Question Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg ${selectedTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedTypeFilter('multiple_choice')}
              className={`px-2.5 py-1 rounded-lg ${selectedTypeFilter === 'multiple_choice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Trắc nghiệm
            </button>
            <button
              onClick={() => setSelectedTypeFilter('fill_in_blank')}
              className={`px-2.5 py-1 rounded-lg ${selectedTypeFilter === 'fill_in_blank' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Điền đáp án
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Practice Stage & Mascot Companion Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Mascot Pipo Companion & Edge-Case Simulation tools */}
        <div className="lg:col-span-1 space-y-4">
          {/* Mascot Speech Bubble Card */}
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md shrink-0 bg-white">
                <PipoOwlMascot className="w-full h-full" size="sm" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">Cú Thông Thái Pipo</span>
                <span className="text-[11px] text-emerald-700 font-semibold block flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Trợ giảng Toán 7</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isVerifiedTeacher ? '🛡️ Vai trò: Giáo viên' : '🎒 Vai trò: Học sinh'}
                </span>
              </div>
            </div>

            {/* Dynamic Speech Box */}
            <div className="relative bg-white p-3.5 rounded-2xl border border-amber-200 text-xs text-slate-800 leading-relaxed shadow-sm">
              <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-amber-200 transform rotate-45" />
              {mascotMessage}
            </div>

            {/* Quick Lives indicator */}
            <div className="flex items-center justify-between text-xs pt-1 text-slate-600">
              <span>Mạng hiện có:</span>
              <div className="flex items-center gap-1">
                {[...Array(user.maxHearts)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < user.hearts
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-slate-300 fill-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RBAC Policy Notice Card */}
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Quy chế xem Gợi ý & Lời giải:</span>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-slate-800">Học sinh:</strong> Tự làm bài, lời giải và giải thích sẽ mở sau khi nhấn "Kiểm tra đáp án".
              </li>
              <li>
                <strong className="text-purple-700">Giáo viên:</strong> Chỉ tài khoản baoaivn@gmail.com có quyền xem trước đáp án và gợi ý.
              </li>
            </ul>
          </div>

          {/* Edge-Cases Simulation Control Deck */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Mô phỏng Kỹ thuật LMS (Edge-Cases)
            </span>
            <button
              onClick={handleSimulateAppCrashAndRestore}
              className="w-full py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Lưu Checkpoint (Auto-save)</span>
            </button>
            <button
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              className="w-full py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span>{isOfflineSimulated ? 'Hủy giả lập rớt mạng' : 'Giả lập rớt mạng'}</span>
            </button>
          </div>
        </div>

        {/* Center / Right Column: Active Question Canvas */}
        <div className="lg:col-span-3 space-y-6">
          {!isSessionCompleted && currentQuestion ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              {/* Question Header, Saved Status & Navigator Pills */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-mono">
                      Câu {currentIndex + 1} / {activeQuestions.length}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold">
                      Đã làm {answeredInLessonCount}/{currentLesson.questions.length}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      {currentQuestion.category}
                    </span>
                    <span className="text-slate-400 hidden sm:inline">·</span>
                    <span className="hidden sm:inline">Độ khó: {currentQuestion.difficulty}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(soundManager.toggle())}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        soundEnabled 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-2xs' 
                          : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={soundEnabled ? 'Âm thanh: Đang BẬT (Bấm để tắt)' : 'Âm thanh: Đang TẮT (Bấm để bật)'}
                    >
                      {soundEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[11px]">Âm thanh</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Tắt âm</span>
                        </>
                      )}
                    </button>

                    <span className="text-indigo-600 font-bold font-mono">
                      +{currentQuestion.pointsXP} XP
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(((currentIndex + 1) / activeQuestions.length) * 100)}%`,
                    }}
                  />
                </div>

                {/* Clickable Question Navigator Pills (shows saved answers across tab switches) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {activeQuestions.map((qItem, qIdx) => {
                    const attempt = lessonSession.answers[qItem.id];
                    const isCurrent = qIdx === currentIndex;
                    const hasDraft = Boolean(
                      !attempt?.isSubmitted && (attempt?.selectedOption || attempt?.textAnswer?.trim())
                    );
                    let pillClass = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';
                    if (attempt?.isSubmitted) {
                      pillClass = attempt.isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300';
                    } else if (hasDraft) {
                      pillClass = 'bg-amber-50 text-amber-800 border-amber-300';
                    }

                    return (
                      <button
                        key={qItem.id}
                        type="button"
                        onClick={() => setCurrentIndex(qIdx)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold font-mono transition-all flex items-center gap-1 shrink-0 cursor-pointer ${pillClass} ${
                          isCurrent ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                        }`}
                        title={
                          attempt?.isSubmitted
                            ? attempt.isCorrect
                              ? `Câu ${qIdx + 1}: Đã làm đúng`
                              : `Câu ${qIdx + 1}: Đã làm sai`
                            : hasDraft
                            ? `Câu ${qIdx + 1}: Đã chọn đáp án (chưa kiểm tra)`
                            : `Câu ${qIdx + 1}: Chưa làm`
                        }
                      >
                        <span>{qIdx + 1}</span>
                        {attempt?.isSubmitted && attempt.isCorrect && <Check className="w-3 h-3 text-emerald-600" />}
                        {attempt?.isSubmitted && !attempt.isCorrect && <XCircle className="w-3 h-3 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Prompt */}
              <div className="py-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed font-sans">
                  {currentQuestion.prompt}
                </h3>
              </div>

              {/* Interactive Input Zone */}
              {currentQuestion.type === 'multiple_choice' && displayedOptions ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {displayedOptions.map((opt, idx) => {
                    let btnStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

                    if (isAnswerSubmitted) {
                      const isOptionCorrect = checkIsAnswerCorrect(
                        opt,
                        currentQuestion.correctAnswer,
                        displayedOptions
                      );

                      if (isOptionCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                      } else if (selectedOption === opt && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-medium';
                      }
                    } else if (selectedOption === opt) {
                      btnStyle = 'border-emerald-600 bg-emerald-50/50 text-slate-950 font-semibold ring-2 ring-emerald-500/30';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => !isAnswerSubmitted && setSelectedOption(opt)}
                        className={`p-4 rounded-2xl border-2 text-left text-sm transition-all flex items-start gap-3 ${
                          isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer'
                        } ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="pt-0.5 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Fill in the blank input zone */
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="text"
                      disabled={isAnswerSubmitted}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Nhập kết quả (Ví dụ: 13/6 hoặc -3/2 hoặc 45°)..."
                      className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-base font-mono font-semibold disabled:bg-slate-50 disabled:text-slate-600"
                    />

                    {/* Virtual keypad quick inserts for math symbols */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                      {['/', '-', '°', '²', '√', '1/2', '1/3', '3/4'].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          disabled={isAnswerSubmitted}
                          onClick={() => !isAnswerSubmitted && setTextAnswer((prev) => prev + sym)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-xs font-bold font-mono rounded-lg transition-colors disabled:opacity-50"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: Submit / Admin Hint / Next */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                {/* Left side of action row: RBAC-controlled hint area */}
                <div className="flex items-center gap-2">
                  {isVerifiedTeacher ? (
                    /* Admin/Teacher: CAN view hint before submission */
                    <button
                      onClick={() => setShowAdminInspection(!showAdminInspection)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>{showAdminInspection ? 'Đóng gợi ý Giáo viên' : 'Admin: Xem trước Gợi ý & Đáp án'}</span>
                      {showAdminInspection ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    /* Student: CANNOT view hint before submission */
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Học sinh tự giải (Cách giải sẽ mở sau khi kiểm tra)</span>
                    </div>
                  )}
                </div>

                {/* Right side: Submit Answer or Next Question */}
                <div className="flex items-center gap-3">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={currentQuestion.type === 'multiple_choice' ? !selectedOption : !textAnswer.trim()}
                      className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                        (currentQuestion.type === 'multiple_choice' ? !selectedOption : !textAnswer.trim())
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer active:scale-95'
                      }`}
                    >
                      <span>Kiểm tra đáp án</span>
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{currentIndex + 1 < activeQuestions.length ? 'Câu tiếp theo' : 'Xem kết quả bài học'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Pre-Inspection Panel */}
              {isVerifiedTeacher && showAdminInspection && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-purple-950 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-800 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      Bảng Điều Khiển Dành Cho Giáo Viên (baoaivn@gmail.com)
                    </span>
                    <span className="text-[10px] bg-purple-200/60 px-2 py-0.5 rounded font-mono">
                      Đáp án đúng: {currentQuestion.correctAnswer}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <strong>Gợi ý sư phạm định hướng:</strong> {currentQuestion.adminHint}
                    </p>
                    <p className="text-[11px] text-purple-700 italic">
                      * Lưu ý: Giao diện học sinh không hiển thị phần gợi ý này. Học sinh chỉ thấy lời giải sau khi ấn "Kiểm tra đáp án".
                    </p>
                  </div>
                </div>
              )}

              {/* CHỈ SAU KHI KIỂM TRA ĐÁP ÁN: HIỂN THỊ GIẢI THÍCH VÀ CÁCH GIẢI CHI TIẾT */}
              {isAnswerSubmitted && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                      isCorrect
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/90 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold text-sm">
                      {isCorrect ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Chính xác tuyệt đối! Em làm bài rất tốt!</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            <span>Chưa chính xác — Đã trừ 1 tim!</span>
                          </div>
                          <p className="text-xs font-normal text-rose-900 pl-7">
                            Câu hỏi này đã được chuyển vào mục <strong>"Kiểm tra lại sau"</strong> để em ôn tập. Em hãy xem lời giải chi tiết bên dưới rồi bấm <strong>"Câu tiếp theo"</strong> để tiếp tục nhé!
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {!isCorrect && (
                      <span className="text-xs font-mono font-semibold bg-white/80 px-2.5 py-1 rounded-lg shrink-0 border border-rose-200">
                        Đáp án chuẩn: <strong className="text-emerald-700">{currentQuestion.correctAnswer}</strong>
                      </span>
                    )}
                  </div>

                  {/* GIẢI THÍCH VÀ CÁCH GIẢI CHI TIẾT TỪNG BƯỚC */}
                  <div className="bg-gradient-to-br from-indigo-50/60 via-blue-50/40 to-slate-50 rounded-2xl p-5 border border-indigo-200/80 space-y-3.5 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm border-b border-indigo-100 pb-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Giải Thích & Cách Giải Chi Tiết Từng Bước (Toán 7 Kết Nối Tri Thức)</span>
                    </div>

                    {/* Step-by-step Solution */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">
                        Các bước giải chi tiết:
                      </span>
                      <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-line shadow-xs">
                        {currentQuestion.stepByStepSolution}
                      </div>
                    </div>

                    {/* Pedagogical Explanation / Takeaway */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Ghi nhớ cốt lõi & Kết luận:
                      </span>
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 leading-relaxed font-sans">
                        {currentQuestion.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Session Completed Celebration Screen */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300">
                <MathBadgeIcon className="w-full h-full" title="Hoàn thành bài học" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span>Hoàn Thành Xuất Sắc!</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Đã hoàn thành Bài {currentLesson.number}: {currentLesson.title}
                </h3>
                <p className="text-xs text-slate-600">
                  Em đã trả lời đúng {sessionCorrectCount}/{activeQuestions.length} câu hỏi. Trạng thái bài học đã được thăng cấp trong hệ thống LMS!
                </p>
              </div>

              {/* Performance pills */}
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-xs font-mono font-bold">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans">Độ chính xác</span>
                  <span className="text-emerald-600 text-lg">
                    {Math.round((sessionCorrectCount / activeQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans">Điểm XP</span>
                  <span className="text-indigo-600 text-lg">+{sessionCorrectCount * 20}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans">Xu vàng</span>
                  <span className="text-amber-600 text-lg">+{sessionCorrectCount * 5}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {mistakeQuestions.length > 0 && (
                  <button
                    onClick={handleStartReviewMistakes}
                    className="py-2.5 px-5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Luyện lại {mistakeQuestions.length} câu đã làm sai</span>
                  </button>
                )}

                <button
                  onClick={handleResetLessonAndShuffle}
                  className="py-2.5 px-5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4 text-amber-600" />
                  <span>Làm lại cả bài (Đảo đáp án)</span>
                </button>

                <button
                  onClick={() => {
                    const currentIndexInAll = allLessons.findIndex((l) => l.id === currentLesson.id);
                    const nextLesson = allLessons[currentIndexInAll + 1];
                    if (nextLesson) {
                      handleSwitchLesson(nextLesson.id);
                    }
                  }}
                  className="py-2.5 px-6 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Chuyển sang bài tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Catalog Modal (Mở danh mục chọn bài học nhanh chóng) */}
      <QuickCatalogModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        chapters={chapters}
        currentLessonId={currentLesson.id}
        onSelectLesson={handleSwitchLesson}
        mode="practice"
      />

      {/* Refill Hearts Modal */}
      {showRefillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Em tạm thời hết tim rồi!</h3>
              <p className="text-xs text-slate-600">
                Làm sai nhiều giúp em rút kinh nghiệm! Hãy chọn cách hồi phục mạng dưới đây:
              </p>
            </div>

            {refillError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {refillError}
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setRefillError(null);
                  onUpdateUser({ hearts: 5 });
                  setShowRefillModal(false);
                  setMascotMessage('Pipo đã hồi đầy 5 tim cho em rồi! Cố gắng giải thật bình tĩnh nhé!');
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Giải câu đố vui để hồi đầy 5 tim (Miễn phí)</span>
              </button>

              <button
                onClick={() => {
                  if (user.coins >= 50) {
                    setRefillError(null);
                    onUpdateUser({ coins: user.coins - 50, hearts: 5 });
                    setShowRefillModal(false);
                  } else {
                    setRefillError('Em cần ít nhất 50 xu vàng để mua gói hồi tim (hiện có ' + user.coins + ' xu).');
                  }
                }}
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Đổi 50 Xu vàng để hồi đầy tim</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
