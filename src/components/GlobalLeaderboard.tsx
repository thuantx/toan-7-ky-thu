import React, { useEffect, useState, useCallback } from 'react';
import { UserProfile } from '../types';
import {
  LeaderboardEntry,
  fetchTopLeaderboardStudents,
  subscribeTopLeaderboardStudents,
} from '../firebase';
import {
  Trophy,
  Medal,
  Flame,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  LogIn,
} from 'lucide-react';

interface GlobalLeaderboardProps {
  currentUser: UserProfile;
  onOpenAuthModal?: () => void;
  onStartPractice?: () => void;
}

const AVATAR_EMOJI_MAP: Record<string, string> = {
  pipo_owl: '🦉',
  lion: '🦁',
  rabbit: '🐰',
  dolphin: '🐬',
  penguin: '🐧',
};

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentUser,
  onOpenAuthModal,
  onStartPractice,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadLeaderboardOnce = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const data = await fetchTopLeaderboardStudents(10);
      setEntries(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Quota exceeded')) {
        setErrorMessage('Đã chạm giới hạn lượt đọc miễn phí trong ngày của Firestore. Hạn mức sẽ tự đặt lại vào ngày mai.');
      } else {
        setErrorMessage('Không thể tải bảng xếp hạng từ Firestore lúc này.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Only attach realtime onSnapshot listener when authenticated; use one-shot fetch for guests
    if (currentUser.isAuthenticated) {
      setIsLoading(true);
      setErrorMessage(null);

      const unsubscribe = subscribeTopLeaderboardStudents(
        10,
        (data) => {
          setEntries(data);
          setIsLoading(false);
          setIsRefreshing(false);
        },
        (err) => {
          const msg = err.message || '';
          if (msg.includes('Quota exceeded')) {
            setErrorMessage('Đã chạm giới hạn lượt đọc miễn phí trong ngày của Firestore. Hạn mức sẽ tự đặt lại vào ngày mai.');
          } else {
            setErrorMessage('Không thể đồng bộ bảng xếp hạng trực tiếp từ Firestore.');
          }
          setIsLoading(false);
          setIsRefreshing(false);
        }
      );

      return () => unsubscribe();
    } else {
      loadLeaderboardOnce(false);
    }
  }, [currentUser.isAuthenticated, loadLeaderboardOnce]);

  const currentUserInTop10 = entries.some((e) => e.uid === currentUser.id);
  const tenthPlaceXp = entries.length >= 10 ? entries[9].xp : null;

  const renderRankCell = (index: number) => {
    const rank = index + 1;
    if (rank === 1) {
      return (
        <div className="inline-flex items-center gap-1.5 font-mono tabular-nums font-bold text-amber-700">
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
          <span>#1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="inline-flex items-center gap-1.5 font-mono tabular-nums font-bold text-slate-600">
          <Medal className="w-4 h-4 text-slate-400 shrink-0" />
          <span>#2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="inline-flex items-center gap-1.5 font-mono tabular-nums font-bold text-orange-700">
          <Medal className="w-4 h-4 text-orange-500 shrink-0" />
          <span>#3</span>
        </div>
      );
    }
    return (
      <span className="font-mono tabular-nums text-xs font-semibold text-slate-500 pl-1">
        #{rank}
      </span>
    );
  };

  return (
    <section
      aria-label="GlobalLeaderboard"
      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Global Leaderboard</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="text-slate-500 font-normal">
              Top 10 học sinh có điểm XP cao nhất trên Firestore
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Bảng Xếp Hạng Thi Đua Toán 7
          </h3>
        </div>

        <button
          type="button"
          onClick={() => loadLeaderboardOnce(true)}
          disabled={isLoading || isRefreshing}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới bảng xếp hạng'}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-2.5 py-2" aria-busy="true">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-11 rounded-xl bg-slate-100 animate-pulse border border-slate-200/50"
            />
          ))}
        </div>
      ) : errorMessage ? (
        /* Error State */
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 text-xs text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => loadLeaderboardOnce(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : entries.length === 0 ? (
        /* Empty State */
        <div className="py-8 px-4 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200/70">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-sm font-bold text-slate-900">
              Chưa có học sinh nào ghi danh trên Bảng xếp hạng
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentUser.isAuthenticated
                ? 'Hãy hoàn thành bài luyện tập để đồng bộ điểm XP lên hệ thống và giữ vị trí Top 1 đầu tiên!'
                : 'Đăng nhập bằng Google để lưu điểm XP lên đám mây Firestore và tranh tài cùng Top 10 học sinh xuất sắc nhất!'}
            </p>
          </div>
          <div className="pt-1 flex justify-center">
            {currentUser.isAuthenticated ? (
              onStartPractice && (
                <button
                  type="button"
                  onClick={onStartPractice}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Luyện tập ghi điểm ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            ) : (
              onOpenAuthModal && (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đăng nhập Google để tham gia</span>
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        /* Populated Top 10 Table */
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                  <th className="py-2.5 px-3 w-20">Hạng</th>
                  <th className="py-2.5 px-3">Học sinh</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Lớp</th>
                  <th className="py-2.5 px-3 text-right">Chuỗi ngày</th>
                  <th className="py-2.5 px-3 text-right">Tổng XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {entries.map((entry, idx) => {
                  const isCurrentUser = entry.uid === currentUser.id;
                  const emoji = AVATAR_EMOJI_MAP[entry.avatar] || '🦉';
                  return (
                    <tr
                      key={entry.uid}
                      className={`h-12 transition-colors ${
                        isCurrentUser
                          ? 'bg-emerald-50/70'
                          : idx === 0
                          ? 'bg-amber-50/40 hover:bg-amber-50/70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3 align-middle whitespace-nowrap">
                        {renderRankCell(idx)}
                      </td>

                      <td className="py-2 px-3 align-middle">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm shrink-0"
                            aria-hidden="true"
                          >
                            {emoji}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`truncate text-sm ${
                                  isCurrentUser || idx < 3
                                    ? 'font-bold text-slate-900'
                                    : 'font-medium text-slate-800'
                                }`}
                              >
                                {entry.name}
                              </span>
                              {isCurrentUser && (
                                <span className="text-xs font-bold text-emerald-700 shrink-0">
                                  (Bạn)
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 sm:hidden block">
                              {entry.grade}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2 px-3 align-middle text-xs text-slate-600 hidden sm:table-cell whitespace-nowrap">
                        {entry.grade}
                      </td>

                      <td className="py-2 px-3 align-middle text-right whitespace-nowrap">
                        <span className="inline-flex items-center justify-end gap-1 text-xs font-mono tabular-nums text-slate-700">
                          {entry.streakDays >= 3 && (
                            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
                          )}
                          <span>{entry.streakDays} ngày</span>
                        </span>
                      </td>

                      <td className="py-2 px-3 align-middle text-right whitespace-nowrap">
                        <span
                          className={`font-mono tabular-nums text-sm font-bold ${
                            idx === 0
                              ? 'text-amber-700'
                              : isCurrentUser
                              ? 'text-emerald-700'
                              : 'text-slate-900'
                          }`}
                        >
                          {entry.xp.toLocaleString('vi-VN')} XP
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Personal Standing Prompt when signed in outside Top 10 */}
          {currentUser.isAuthenticated &&
            currentUser.role === 'student' &&
            !currentUserInTop10 && (
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                <span>
                  Điểm hiện tại của bạn:{' '}
                  <strong className="font-mono tabular-nums text-slate-900">
                    {currentUser.xp.toLocaleString('vi-VN')} XP
                  </strong>
                  {tenthPlaceXp !== null && tenthPlaceXp >= currentUser.xp && (
                    <>
                      {' '}
                      · Cần thêm{' '}
                      <strong className="font-mono tabular-nums text-emerald-700">
                        {(tenthPlaceXp - currentUser.xp + 1).toLocaleString('vi-VN')} XP
                      </strong>{' '}
                      để lọt vào Top 10!
                    </>
                  )}
                </span>
                {onStartPractice && (
                  <button
                    type="button"
                    onClick={onStartPractice}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Luyện tập tích lũy XP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
        </div>
      )}
    </section>
  );
};
