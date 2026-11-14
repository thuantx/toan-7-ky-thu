import React, { useMemo } from 'react';
import { Goal, DailyQuestionCount } from '../types';
import { formatLocalDateKey } from '../utils/storage';
import { Flame, CalendarCheck, Sparkles, ArrowRight, Check } from 'lucide-react';

interface StreakBadgeProps {
  goal: Goal;
  onStartPractice?: () => void;
}

export interface StreakCalculationResult {
  streakDays: number;
  isActiveToday: boolean;
  todayCount: number;
  last7Days: {
    dateKey: string;
    label: string;
    count: number;
    isToday: boolean;
  }[];
}

const SHORT_WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function calculateLearningStreak(
  dailyCompletedQuestions?: DailyQuestionCount[]
): StreakCalculationResult {
  const countsByDate = new Map<string, number>();

  if (Array.isArray(dailyCompletedQuestions)) {
    dailyCompletedQuestions.forEach((entry) => {
      if (entry && typeof entry.date === 'string' && entry.date.trim()) {
        const key = entry.date.trim();
        const prev = countsByDate.get(key) ?? 0;
        const val = Math.max(0, Math.round(Number(entry.count) || 0));
        countsByDate.set(key, Math.max(prev, val));
      }
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatLocalDateKey(today);
  const todayCount = countsByDate.get(todayKey) ?? 0;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = formatLocalDateKey(yesterday);
  const yesterdayCount = countsByDate.get(yesterdayKey) ?? 0;

  // Count consecutive days with >= 1 completed question.
  // If today already has >= 1 question, count backwards starting today.
  // If today has 0 so far but yesterday had >= 1, count backwards starting yesterday (active streak pending today).
  let streakDays = 0;
  if (todayCount > 0 || yesterdayCount > 0) {
    const cursor = new Date(todayCount > 0 ? today : yesterday);
    // Safety bound of 3650 days
    for (let step = 0; step < 3650; step++) {
      const key = formatLocalDateKey(cursor);
      const dayCount = countsByDate.get(key) ?? 0;
      if (dayCount > 0) {
        streakDays += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const last7Days: StreakCalculationResult['last7Days'] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatLocalDateKey(d);
    last7Days.push({
      dateKey: key,
      label: key === todayKey ? 'Nay' : SHORT_WEEKDAYS[d.getDay()],
      count: countsByDate.get(key) ?? 0,
      isToday: key === todayKey,
    });
  }

  return {
    streakDays,
    isActiveToday: todayCount > 0,
    todayCount,
    last7Days,
  };
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  goal,
  onStartPractice,
}) => {
  const { streakDays, isActiveToday, todayCount, last7Days } = useMemo(
    () => calculateLearningStreak(goal.dailyCompletedQuestions),
    [goal.dailyCompletedQuestions]
  );

  const hasFireStreak = streakDays >= 3;

  return (
    <section
      aria-label="StreakBadge"
      className={`h-full rounded-3xl p-6 sm:p-7 border shadow-sm flex flex-col justify-between gap-5 ${
        hasFireStreak
          ? 'bg-gradient-to-b from-amber-50/90 via-orange-50/60 to-white border-amber-200/90'
          : 'bg-white border-slate-200/80'
      }`}
    >
      {/* Top Header & Streak Counter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CalendarCheck
              className={`w-4 h-4 shrink-0 ${
                hasFireStreak ? 'text-orange-600' : 'text-emerald-600'
              }`}
            />
            <span>Chuỗi ngày học liên tiếp</span>
          </div>

          <span
            className={`text-xs font-semibold ${
              hasFireStreak ? 'text-orange-700' : 'text-slate-500'
            }`}
          >
            {isActiveToday ? 'Đã điểm danh hôm nay' : 'Chờ luyện hôm nay'}
          </span>
        </div>

        {/* Main Hero Metric with Fire Icon when streak >= 3 */}
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
              hasFireStreak
                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-400 shadow-sm'
                : streakDays > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            {hasFireStreak ? (
              <Flame className="w-8 h-8 fill-amber-200 text-white" aria-label="Biểu tượng ngọn lửa chuỗi học tập" />
            ) : (
              <CalendarCheck className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl sm:text-4xl font-black font-mono tabular-nums tracking-tight ${
                  hasFireStreak ? 'text-orange-700' : 'text-slate-900'
                }`}
              >
                {streakDays}
              </span>
              <span className="text-sm font-bold text-slate-700">
                ngày liên tiếp
              </span>
            </div>

            <p className="text-xs text-slate-500 font-mono tabular-nums">
              Hôm nay: {todayCount} câu đã hoàn thành
            </p>
          </div>
        </div>

        {/* Congratulatory Message (3+ days) or Milestone Guidance (<3 days) */}
        {hasFireStreak ? (
          <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500 shrink-0" />
              <span>Chúc mừng! Phong độ học tập tuyệt vời!</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Em đã duy trì học Toán liên tục <strong>{streakDays} ngày</strong>.
              {isActiveToday
                ? ' Ngọn lửa kiên trì đang rực cháy — hãy tiếp tục phát huy nhé!'
                : ' Hãy giải thêm 1 câu hôm nay để giữ vững ngọn lửa chuỗi ngày nhé!'}
            </p>
          </div>
        ) : streakDays > 0 ? (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Khởi đầu đầy hứa hẹn!</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Em chỉ cần học thêm <strong>{3 - streakDays} ngày liên tiếp</strong> nữa để mở khóa huy hiệu ngọn lửa 3+ ngày.
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-xs font-bold text-slate-800">
              Bắt đầu chuỗi ngày học tập mới
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hoàn thành ít nhất 1 bài tập mỗi ngày để tích lũy chuỗi ngày liên tiếp và thắp sáng ngọn lửa thành tích.
            </p>
          </div>
        )}
      </div>

      {/* Bottom 7-day Streak Checkboxes & Action */}
      <div className="space-y-4 pt-3 border-t border-slate-200/70">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-600 block">
            Nhịp học 7 ngày gần nhất
          </span>
          <div className="grid grid-cols-7 gap-1.5">
            {last7Days.map((day) => {
              const completed = day.count > 0;
              return (
                <div
                  key={day.dateKey}
                  title={`${day.dateKey}: ${day.count} câu`}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono tabular-nums font-bold border transition-colors ${
                      completed
                        ? hasFireStreak
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : day.isToday
                        ? 'bg-white text-slate-500 border-dashed border-slate-400'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {completed ? <Check className="w-4 h-4" /> : <span>0</span>}
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      day.isToday ? 'text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {onStartPractice && (
          <button
            type="button"
            onClick={onStartPractice}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              hasFireStreak
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            <span>{isActiveToday ? 'Giải thêm để tăng thành tích' : 'Làm 1 câu giữ chuỗi ngay'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
