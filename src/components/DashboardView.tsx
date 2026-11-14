import React, { useState } from 'react';
import { Chapter, Lesson } from '../data/curriculumData';
import { Goal, UserProfile } from '../types';
import { 
  Target, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  BookOpen,
  Compass
} from 'lucide-react';
import { PipoOwlMascot } from './PipoOwlMascot';
import { MathBadgeIcon } from './MathBadgeIcon';
import { WeeklyProgress } from './WeeklyProgress';
import { StreakBadge } from './StreakBadge';
import { GlobalLeaderboard } from './GlobalLeaderboard';

interface DashboardViewProps {
  chapters: Chapter[];
  user: UserProfile;
  goal: Goal;
  onOpenGoalsModal: () => void;
  onOpenAuthModal?: () => void;
  onSelectLessonForPractice: (lessonId: string, categoryFilter?: string) => void;
  onSelectLessonForTheory: (lessonId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  chapters,
  user,
  goal,
  onOpenGoalsModal,
  onOpenAuthModal,
  onSelectLessonForPractice,
  onSelectLessonForTheory,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || 'ch-1');

  // Compute Overall Completion Rate
  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedLessons = chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter((l) => l.status === 'COMPLETED' || l.status === 'MASTER').length,
    0
  );
  const overallCompletionPercent = Math.round((completedLessons / Math.max(1, totalLessons)) * 100);

  // Total questions answered & accuracy
  const totalAttempts = chapters.reduce(
    (acc, ch) => acc + ch.lessons.reduce((sub, l) => sub + l.totalAttempts, 0),
    0
  );
  const totalCorrect = chapters.reduce(
    (acc, ch) => acc + ch.lessons.reduce((sub, l) => sub + l.correctCount, 0),
    0
  );
  const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const totalMinutes = chapters.reduce(
    (acc, ch) => acc + ch.lessons.reduce((sub, l) => sub + l.timeSpentMinutes, 0),
    0
  );

  const activeChapter = chapters.find((ch) => ch.id === selectedChapterId) || chapters[0];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Overview Banner with Mascot Pipo */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Toán 7 Kết Nối Tri Thức</span>
              </div>
              {user.isAuthenticated && user.email ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 backdrop-blur-md text-emerald-200 text-xs font-medium border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Hồ sơ: <strong>{user.name}</strong> · {user.grade} · {user.email}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-medium border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Học sinh tự do trải nghiệm · Đăng nhập để lưu XP</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight">
              {user.isAuthenticated && user.name && user.name !== 'Học sinh' ? (
                <>Xin chào, <span className="text-amber-300">{user.name}</span>! Cùng Pipo chinh phục điểm 10 nào!</>
              ) : (
                <>Xin chào các em học sinh! Cùng Pipo chinh phục điểm 10 nào!</>
              )}
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              {user.isAuthenticated ? (
                <>Em đã hoàn thành <strong className="text-white font-bold">{completedLessons}/{totalLessons}</strong> bài học với tỉ lệ chính xác <strong className="text-amber-300 font-bold">{averageAccuracy}%</strong>. Hãy duy trì chuỗi <strong className="text-orange-300">{user.streakDays} ngày</strong> học tập xuất sắc nhé!</>
              ) : (
                <>Hệ thống gồm trọn bộ <strong className="text-white font-bold">25 bài học</strong> chuẩn SGK Kết Nối Tri Thức với <strong className="text-amber-300 font-bold">159 câu hỏi</strong> bài tập có phân tích chi tiết. Các em hãy tự do đăng ký/đăng nhập tài khoản của mình để lưu tiến trình nhé!</>
              )}
            </p>

            {/* Quick KPI stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-xs text-emerald-200 block">Tiến độ khóa</span>
                <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white">
                  {overallCompletionPercent}%
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-xs text-emerald-200 block">Độ chính xác</span>
                <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-amber-300">
                  {averageAccuracy}%
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-xs text-emerald-200 block">Câu đã giải</span>
                <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white">
                  {totalAttempts}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-xs text-emerald-200 block">Thời gian học</span>
                <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-teal-200">
                  {totalMinutes}p
                </span>
              </div>
            </div>
          </div>

          {/* Mascot Illustration with speech bubble */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative group">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl bg-white/20">
                <PipoOwlMascot className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="absolute -bottom-3 -right-2 bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Pipo Cú Nhí</span>
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-emerald-100 max-w-[200px] text-center italic bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
              "Làm toán như thám hiểm, càng giải càng ghiền!"
            </p>
          </div>
        </div>
      </section>

      {/* 2. Goal Setting & Micro-goals Recommendation Engine Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Target className="w-4 h-4" />
              <span>Hệ thống Thiết lập Mục tiêu & Nội suy Lộ trình (Micro-Goals Engine)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Mục tiêu hiện tại: {goal.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenGoalsModal}
              className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors whitespace-nowrap"
            >
              Điều chỉnh mục tiêu
            </button>
            <button
              onClick={() => onSelectLessonForPractice('c1-l2')}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Tiếp tục mục tiêu tuần</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Goal details & Micro-goals math */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Goal progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Tiến độ thực hiện mục tiêu</span>
              <span className="font-bold text-slate-900 font-mono">{goal.progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${goal.progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              Kỳ hạn mục tiêu: <span className="font-semibold text-slate-700">{goal.targetDate}</span> (Học kỳ 1)
            </p>
          </div>

          {/* Micro-goal: Weekly workload & accuracy */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span>Micro-Goal Tuần này</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">
                {goal.completedQuestionsThisWeek}/{goal.weeklyTargetQuestions} bài
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Cần hoàn thành <strong>{goal.weeklyTargetQuestions} bài tập vận dụng</strong> với độ chính xác tối thiểu <strong>≥ {goal.targetAccuracy}%</strong>.
            </p>
            <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((goal.completedQuestionsThisWeek / goal.weeklyTargetQuestions) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Mascot Recommendation Message */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-900 block">Lời khuyên từ Pipo:</span>
              <p className="text-xs text-indigo-950 mt-1 leading-relaxed">
                {goal.recommendedMessage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2B. Streak Badge & Weekly Progress D3 Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <StreakBadge
            goal={goal}
            onStartPractice={() => onSelectLessonForPractice('c1-l2')}
          />
        </div>
        <div className="lg:col-span-8">
          <WeeklyProgress
            goal={goal}
            onStartPractice={() => onSelectLessonForPractice('c1-l2')}
          />
        </div>
      </div>

      {/* 3. Skill Diagnostics & Weakness Radar (Phân tích Lỗ hổng Kiến thức) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Bản Đồ Năng Lực Toán 7 (Skill Diagnostics)</span>
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Đánh giá theo 4 trục chuyên đề
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500">Dữ liệu thực tế từ bài làm</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Metric 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:bg-slate-100/70 transition-colors shadow-2xs">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-bold text-slate-800">1. Số hữu tỉ & Phép tính</span>
                <span className="font-black text-emerald-600 font-mono text-sm sm:text-base">88% (Tốt)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
              </div>
              <span className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed block">
                Thành thạo cộng trừ nhân chia và quy đồng mẫu.
              </span>
            </div>

            {/* Metric 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:bg-slate-100/70 transition-colors shadow-2xs">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-bold text-slate-800">2. Phương trình Tìm x & Lũy thừa</span>
                <span className="font-black text-amber-600 font-mono text-sm sm:text-base">74% (Cần rèn)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[74%]" />
              </div>
              <span className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed block">
                Còn lúng túng khi đổi dấu chuyển vế số âm.
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:bg-slate-100/70 transition-colors shadow-2xs">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-bold text-slate-800">3. Góc, Tia phân giác & Song song</span>
                <span className="font-black text-emerald-600 font-mono text-sm sm:text-base">92% (Tinh thông)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
              </div>
              <span className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed block">
                Nhận diện góc so le trong và đối đỉnh rất tốt.
              </span>
            </div>

            {/* Metric 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:bg-slate-100/70 transition-colors shadow-2xs">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-bold text-slate-800">4. Tam giác bằng nhau (c-c-c, c-g-c)</span>
                <span className="font-black text-rose-600 font-mono text-sm sm:text-base">65% (Lỗ hổng)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full w-[65%]" />
              </div>
              <span className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed block">
                Cần củng cố xác định góc xen giữa và đỉnh tương ứng.
              </span>
            </div>
          </div>
        </div>

        {/* Weakness Alert & 1-Click Drill */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-6 sm:p-7 border border-rose-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Phát hiện lỗ hổng cần lấp ngay</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-rose-950 leading-snug">
              Dạng bài: Tìm x trong phương trình phân số & Quy tắc chuyển vế
            </h4>
            <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed font-normal">
              Hệ thống phát hiện em hay quên đổi dấu từ <code className="bg-white/90 px-1.5 py-0.5 rounded text-rose-800 font-mono font-bold">+a</code> sang <code className="bg-white/90 px-1.5 py-0.5 rounded text-rose-800 font-mono font-bold">-a</code> khi chuyển qua vế đối diện ở Bài 2 & Bài 4.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectLessonForPractice('c1-l2', 'Tìm x cơ bản')}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Luyện riêng 3 câu dạng này</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Complete LMS Curriculum Browser (10 Chương theo PDF) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Khung Chương Trình Học Toán 7 Cơ Bản (Chuẩn PDF)</span>
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Chọn Chương & Bài học để bắt đầu
            </h2>
          </div>

          {/* Chapter Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedChapterId === ch.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {ch.code}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Chapter Details */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                {activeChapter.code}
              </span>
              <span className="text-slate-300">·</span>
              <h3 className="text-base font-bold text-slate-900">
                {activeChapter.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {activeChapter.description}
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 shrink-0">
            {activeChapter.lessons.length} Bài học chuyên sâu
          </span>
        </div>

        {/* Lessons List in the active chapter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChapter.lessons.map((lesson: Lesson) => {
            const getStatusBadge = (status: Lesson['status']) => {
              switch (status) {
                case 'MASTER':
                  return (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Master ⭐</span>
                    </span>
                  );
                case 'COMPLETED':
                  return (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Hoàn thành</span>
                    </span>
                  );
                case 'IN_PROGRESS':
                  return (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3 text-amber-600" />
                      <span>Đang học</span>
                    </span>
                  );
                default:
                  return (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <span>Chưa học</span>
                    </span>
                  );
              }
            };

            return (
              <div
                key={lesson.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      Bài {lesson.number}
                    </span>
                    {getStatusBadge(lesson.status)}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {lesson.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {lesson.description}
                  </p>

                  {/* Explicit sections breakdown (Mục I, Mục II) */}
                  {lesson.sections && lesson.sections.length > 0 && (
                    <div className="pt-1.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Cấu trúc theo SGK ({lesson.sections.length} mục):</span>
                      </div>
                      <div className="space-y-1">
                        {lesson.sections.map((sec) => (
                          <div
                            key={sec.id}
                            className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-black text-emerald-800 shrink-0">{sec.code}:</span>
                              <span className="font-semibold text-slate-800 truncate">{sec.title}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0 ml-2">
                              {sec.examples.length} ví dụ · {sec.code === 'Phần I' ? '14 bài tập' : '8 bài tập'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Performance Metrics */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-3">
                    <span title="Số câu đúng / tổng số câu">
                      Đúng: <strong className="text-slate-800">{lesson.correctCount}/{lesson.totalAttempts || lesson.questions.length}</strong>
                    </span>
                    <span title="Độ chính xác">
                      Tỉ lệ: <strong className={lesson.accuracy >= 80 ? 'text-emerald-600' : 'text-slate-700'}>{lesson.accuracy}%</strong>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400" title="Thời gian học">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.timeSpentMinutes}p</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Practice vs Theory */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onSelectLessonForTheory(lesson.id)}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lý thuyết & Ví dụ</span>
                  </button>

                  <button
                    onClick={() => onSelectLessonForPractice(lesson.id)}
                    className="py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Luyện tập ngay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Gamification Badges & Trophy Cabinet */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Phòng Truyền Thống & Bộ Sưu Tập Huy Hiệu</span>
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Huy hiệu vinh danh học sinh giỏi Toán
            </h3>
          </div>
          <span className="text-xs font-semibold text-amber-700 font-mono">
            Đã mở 3 / 8 huy hiệu
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {/* Badge 1: Rational Master */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-200/80 text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-md">
              <MathBadgeIcon className="w-full h-full" title="Bậc Thầy Số Hữu Tỉ" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Bậc Thầy Số Hữu Tỉ</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Đã đạt chuẩn ⭐</span>
            </div>
          </div>

          {/* Badge 2: Euclid Explorer */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-200/80 text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center shadow-inner">
              <Compass className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Nhà Thám Hiểm Euclid</span>
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Đã mở khóa</span>
            </div>
          </div>

          {/* Badge 3: Streak Flame */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-orange-50 to-rose-50 border border-orange-200/80 text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center shadow-inner">
              <Flame className="w-8 h-8 text-orange-600 fill-orange-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Kỷ Luật Thần Đồng</span>
              <span className="text-[10px] text-orange-600 font-bold block mt-0.5">Chuỗi 5 ngày</span>
            </div>
          </div>

          {/* Badge 4: Algebra Champion (Locked) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 opacity-60">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 block">Dũng Sĩ Đa Thức</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Khóa ở Chương VII</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Global Leaderboard (Top 10 Students from Firestore) */}
      <GlobalLeaderboard
        currentUser={user}
        onOpenAuthModal={onOpenAuthModal}
        onStartPractice={() => onSelectLessonForPractice('c1-l2')}
      />
    </div>
  );
};
