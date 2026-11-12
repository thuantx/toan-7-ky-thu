import React, { useState, useEffect } from 'react';
import { Chapter, Question, Lesson } from '../data/curriculumData';
import { UserProfile } from '../types';
import { 
  Heart, 
  Coins, 
  Zap, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
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
  Info
} from 'lucide-react';

interface PracticeViewProps {
  chapters: Chapter[];
  initialLessonId: string;
  initialCategoryFilter?: string;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLessonStatusChange: (lessonId: string, newStatus: Lesson['status'], accuracy: number) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  chapters,
  initialLessonId,
  initialCategoryFilter,
  user,
  onUpdateUser,
  onLessonStatusChange,
}) => {
  // Find current lesson
  const allLessons = chapters.flatMap((c) => c.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(initialLessonId || allLessons[0]?.id || 'c1-l1');
  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentChapter = chapters.find((c) => c.lessons.some((l) => l.id === currentLesson.id)) || chapters[0];

  // Filters
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'multiple_choice' | 'fill_in_blank'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(initialCategoryFilter || 'all');

  // Filtered Questions
  const filteredQuestions = currentLesson.questions.filter((q) => {
    if (selectedTypeFilter !== 'all' && q.type !== selectedTypeFilter) return false;
    if (selectedCategoryFilter !== 'all' && q.category !== selectedCategoryFilter) return false;
    return true;
  });

  const activeQuestions = filteredQuestions.length > 0 ? filteredQuestions : currentLesson.questions;

  // Active Question State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentQuestion: Question | undefined = activeQuestions[currentIndex];

  // User input states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Admin-only peek state (Students CANNOT view hints before submission)
  const [showAdminInspection, setShowAdminInspection] = useState<boolean>(false);

  // Session Statistics
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState<boolean>(false);

  // Edge-case simulation flags
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [checkpointNotice, setCheckpointNotice] = useState<string | null>(null);
  const [showRefillModal, setShowRefillModal] = useState<boolean>(false);

  // Mascot dynamic reaction
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Chào bạn nhỏ! Cùng Pipo tính toán thật cẩn thận để rinh trọn điểm nhé!'
  );

  // Reset question state when index or lesson changes
  useEffect(() => {
    setSelectedOption(null);
    setTextAnswer('');
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setWrongAttempts(0);
    setShowAdminInspection(false);

    if (user.role === 'admin') {
      setMascotMessage(`[Chế độ Admin/GV]: Câu ${currentIndex + 1}/${activeQuestions.length}. Thầy/Cô có quyền mở xem trước Gợi ý sư phạm và Đáp án mẫu.`);
    } else {
      setMascotMessage(`Câu hỏi số ${currentIndex + 1}: Em hãy đọc kỹ đề, tự tính toán ra nháp nhé! Cách giải chi tiết sẽ mở sau khi kiểm tra.`);
    }
  }, [currentIndex, currentLessonId, user.role, activeQuestions.length]);

  // Handle checking answers
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    let userAnswer = '';
    if (currentQuestion.type === 'multiple_choice') {
      if (!selectedOption) return;
      userAnswer = selectedOption.trim();
    } else {
      if (!textAnswer.trim()) return;
      userAnswer = textAnswer.trim().toLowerCase();
    }

    const expected = currentQuestion.correctAnswer.trim().toLowerCase();
    const isAnswerRight = userAnswer === expected;

    setIsAnswerSubmitted(true);
    setIsCorrect(isAnswerRight);

    if (isAnswerRight) {
      // Award XP & Coins
      const xpGained = wrongAttempts === 0 ? currentQuestion.pointsXP : Math.max(5, currentQuestion.pointsXP - 10);
      const coinsGained = 5;

      onUpdateUser({
        xp: user.xp + xpGained,
        coins: user.coins + coinsGained,
      });

      setSessionCorrectCount((prev) => prev + 1);
      setMascotMessage(`Xuất sắc quá! Em đã giải chính xác! +${xpGained} XP và +${coinsGained} Xu vàng! Hãy đọc cách giải bên dưới để củng cố nhé! 🎉`);
    } else {
      // Penalty: Lose 1 Heart
      const newHearts = Math.max(0, user.hearts - 1);
      onUpdateUser({ hearts: newHearts });

      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);

      if (newHearts === 0) {
        setShowRefillModal(true);
        setMascotMessage('Ối, em đã tạm hết tim rồi! Đừng lo, hãy làm câu đố tư duy nhanh hoặc đổi xu để hồi máu nhé!');
      } else {
        setMascotMessage(`Chưa chính xác rồi em ơi (-1 tim)! Đừng buồn, Pipo đã mở Lời giải & Cách giải chi tiết từng bước ngay bên dưới để em xem nè! 👇`);
      }
    }
  };

  // Next question or complete lesson
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed current session
      setIsSessionCompleted(true);
      const finalAccuracy = Math.round(((sessionCorrectCount + (isCorrect ? 1 : 0)) / activeQuestions.length) * 100);
      const newStatus = finalAccuracy >= 90 ? 'MASTER' : 'COMPLETED';
      onLessonStatusChange(currentLesson.id, newStatus, finalAccuracy);
      setMascotMessage(`Chúc mừng em đã hoàn thành bài học với độ chính xác ${finalAccuracy}%! Pipo rất tự hào về em! 🏆`);
    }
  };

  // Edge-case simulation: Simulate Sudden App Exit & Auto-Checkpoint Restore
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
      `[State Machine Checkpoint Đã Lưu]: Đã lưu tự động phiên học của bài "${currentLesson.title}" tại câu ${currentIndex + 1} lúc ${checkpoint.timestamp}. Nếu học sinh vô tình thoát app, hệ thống sẽ khôi phục 100% tiến trình!`
    );
    setTimeout(() => setCheckpointNotice(null), 6000);
  };

  // Categories for current lesson
  const availableCategories = Array.from(new Set(currentLesson.questions.map((q) => q.category)));

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

      {/* 1. Header Toolbar: Lesson Selection & Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">
              <span>{currentChapter.code}</span>
              <span>·</span>
              <span>Bài {currentLesson.number}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">Toán 7 Kết Nối Tri Thức</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Bài {currentLesson.number}: {currentLesson.title}
            </h2>
          </div>

          {/* Lesson Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="lesson-select" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Đổi bài:
            </label>
            <select
              id="lesson-select"
              value={currentLessonId}
              onChange={(e) => {
                setCurrentLessonId(e.target.value);
                setCurrentIndex(0);
                setSelectedCategoryFilter('all');
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-xs truncate"
            >
              {allLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  Bài {l.number}: {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Dạng bài:</span>
            </span>
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCategoryFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({currentLesson.questions.length})
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  selectedCategoryFilter === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Question Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg ${selectedTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Tất cả loại
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
                <img
                  src="/src/assets/images/math_mascot_owl_1794450740550.jpg"
                  alt="Mascot Cú Pipo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">Cú Thông Thái Pipo</span>
                <span className="text-[11px] text-emerald-700 font-semibold block flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Trợ giảng Toán 7</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {user.role === 'admin' ? '🛡️ Vai trò: Admin/GV' : '🎒 Vai trò: Học sinh'}
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
                <strong className="text-slate-800">Học sinh:</strong> Không được xem gợi ý trước khi nộp bài để rèn luyện tính độc lập.
              </li>
              <li>
                <strong className="text-emerald-700">Sau khi nộp:</strong> Toàn bộ giải thích & cách giải từng bước sẽ được mở tự động!
              </li>
              <li>
                <strong className="text-purple-700">Admin/Giáo viên:</strong> Có nút xem trước gợi ý sư phạm và đáp án mẫu bất kỳ lúc nào.
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
              {/* Question Header & Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-mono">
                      Câu {currentIndex + 1} / {activeQuestions.length}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      {currentQuestion.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span>Độ khó: {currentQuestion.difficulty}</span>
                  </div>

                  <span className="text-indigo-600 font-bold font-mono">
                    +{currentQuestion.pointsXP} XP
                  </span>
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
              </div>

              {/* Question Prompt */}
              <div className="py-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed font-sans">
                  {currentQuestion.prompt}
                </h3>
              </div>

              {/* Interactive Input Zone */}
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {currentQuestion.options.map((opt, idx) => {
                    let btnStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

                    if (isAnswerSubmitted) {
                      if (opt === currentQuestion.correctAnswer) {
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
                        disabled={isAnswerSubmitted && isCorrect === true}
                        onClick={() => setSelectedOption(opt)}
                        className={`p-4 rounded-2xl border-2 text-left text-sm transition-all flex items-start gap-3 ${btnStyle}`}
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
                      disabled={isAnswerSubmitted && isCorrect === true}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Nhập kết quả (Ví dụ: 13/6 hoặc -3/2 hoặc 45°)..."
                      className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-base font-mono font-semibold"
                    />

                    {/* Virtual keypad quick inserts for math symbols */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                      {['/', '-', '°', '²', '√', '1/2', '1/3', '3/4'].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => setTextAnswer((prev) => prev + sym)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-xs font-bold font-mono rounded-lg transition-colors"
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
                  {user.role === 'admin' ? (
                    /* Admin/Teacher: CAN view hint before submission */
                    <button
                      onClick={() => setShowAdminInspection(!showAdminInspection)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>{showAdminInspection ? 'Đóng gợi ý Admin' : 'Admin: Xem trước Gợi ý & Đáp án'}</span>
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
                  {!isAnswerSubmitted || isCorrect === false ? (
                    <button
                      onClick={handleSubmitAnswer}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                    >
                      <span>Kiểm tra đáp án</span>
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                    >
                      <span>Câu tiếp theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Pre-Inspection Panel (Visible ONLY to Admin before submit) */}
              {user.role === 'admin' && showAdminInspection && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-purple-950 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-800 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      Bảng Điều Khiển Dành Cho Admin / Giáo Viên
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
                      * Lưu ý: Giao diện học sinh sẽ hoàn toàn bị ẩn phần gợi ý này. Học sinh chỉ thấy lời giải sau khi ấn "Kiểm tra đáp án".
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
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Chính xác tuyệt đối! Em làm bài rất tốt!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>Chưa chính xác (Lần sai thứ {wrongAttempts}) — Đã trừ 1 tim!</span>
                        </>
                      )}
                    </div>
                    
                    {!isCorrect && (
                      <span className="text-xs font-mono font-semibold bg-white/70 px-2.5 py-1 rounded-lg">
                        Đáp án chuẩn: <strong className="text-emerald-700">{currentQuestion.correctAnswer}</strong>
                      </span>
                    )}
                  </div>

                  {/* GIẢI THÍCH VÀ CÁCH GIẢI CHI TIẾT TỪNG BƯỚC (Step-by-Step Solution & Explanation) */}
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
                <img
                  src="/src/assets/images/math_achievement_badge_1794450742214.jpg"
                  alt="Hoàn thành bài học"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
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
                <button
                  onClick={() => {
                    setIsSessionCompleted(false);
                    setCurrentIndex(0);
                    setSessionCorrectCount(0);
                  }}
                  className="py-2.5 px-5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Luyện tập lại</span>
                </button>

                <button
                  onClick={() => {
                    const currentIndexInAll = allLessons.findIndex((l) => l.id === currentLesson.id);
                    const nextLesson = allLessons[currentIndexInAll + 1];
                    if (nextLesson) {
                      setCurrentLessonId(nextLesson.id);
                      setCurrentIndex(0);
                      setSessionCorrectCount(0);
                      setIsSessionCompleted(false);
                    }
                  }}
                  className="py-2.5 px-6 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Chuyển sang bài tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refill Hearts Modal if lives run out */}
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

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
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
                    onUpdateUser({ coins: user.coins - 50, hearts: 5 });
                    setShowRefillModal(false);
                  } else {
                    alert('Em cần 50 xu vàng để mua gói hồi tim.');
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
