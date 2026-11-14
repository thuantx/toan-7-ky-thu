import React from 'react';
import { ViewMode, UserProfile } from '../types';
import { 
  Heart, 
  Coins, 
  Zap, 
  BookOpen, 
  LayoutDashboard, 
  Compass, 
  ShieldCheck, 
  LogIn,
  GraduationCap
} from 'lucide-react';
import { isTeacherEmail } from '../utils/storage';
import { AVATAR_EMOJI_MAP, isCustomImageAvatar } from '../utils/avatar';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  user: UserProfile;
  onOpenGoalsModal: () => void;
  onToggleRole: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  user,
  onToggleRole,
  onOpenAuthModal,
}) => {
  const isTeacher = user.role === 'admin' || isTeacherEmail(user.email);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-14 sm:h-15">
          {/* 1. Brand Logo: Compact, single-line text brand */}
          <button
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-2 text-left group focus:outline-none rounded-lg shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="hidden xs:block leading-none">
              <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap block">
                Toán 7 Kỳ Thú
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase block mt-0.5">
                Kết Nối Tri Thức
              </span>
            </div>
          </button>

          {/* 2. Compact Navigation: Clean 3 core tabs (Saves >250px on laptops) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => onViewChange('dashboard')}
              title="Dashboard tiến độ & Mục tiêu tuần"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                currentView === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onViewChange('theory')}
              title="Lý thuyết cốt lõi & Ví dụ mẫu từng bước"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                currentView === 'theory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Lý Thuyết</span>
            </button>

            <button
              onClick={() => onViewChange('practice')}
              title="Luyện tập trắc nghiệm và điền số"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                currentView === 'practice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Luyện Tập</span>
            </button>
          </nav>

          {/* 3. Gamification Badges & User Status: Compact pills */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Hearts Count */}
            <div
              title={`Số tim còn lại: ${user.hearts}/${user.maxHearts} (Sai 1 câu trừ 1 tim)`}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 border border-rose-100/80 text-rose-600 font-bold text-xs font-mono tabular-nums shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{user.hearts}/{user.maxHearts}</span>
            </div>

            {/* Coins */}
            <div
              title={`Xu vàng tích lũy: ${user.coins}`}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100/80 text-amber-700 font-bold text-xs font-mono tabular-nums shrink-0"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.coins}</span>
            </div>

            {/* XP Points */}
            <div
              title={`Điểm kinh nghiệm: ${user.xp} XP`}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100/80 text-indigo-700 font-bold text-xs font-mono tabular-nums shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
              <span>{user.xp} <span className="text-[10px] uppercase font-sans">XP</span></span>
            </div>

            {/* Teacher Role Badge (ONLY shown when logged in with teacher email: baoaivn@gmail.com) */}
            {isTeacher && (
              <button
                onClick={onToggleRole}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 ring-1 ring-purple-400/40 shrink-0 hover:bg-purple-200 transition-colors"
                title="Tài khoản Giáo viên (baoaivn@gmail.com). Nhấn để xem trước đáp án hoặc chuyển chế độ xem của học sinh."
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span className="hidden sm:inline">Giáo viên</span>
              </button>
            )}

            {/* User Profile / Gmail Button */}
            {user.isAuthenticated ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all text-left shrink-0"
                title={`Đang đăng nhập: ${user.name} (${user.email || 'Học sinh'}). Nhấn để quản lý tài khoản.`}
              >
                {isCustomImageAvatar(user.avatar) ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-lg object-cover border border-emerald-200 shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {isTeacher ? (
                      <GraduationCap className="w-3.5 h-3.5" />
                    ) : AVATAR_EMOJI_MAP[user.avatar] ? (
                      <span className="text-sm leading-none">{AVATAR_EMOJI_MAP[user.avatar]}</span>
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                )}
                <div className="hidden sm:block leading-tight text-left max-w-[100px] truncate">
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    {isTeacher ? 'baoaivn' : user.grade}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                title="Đăng nhập bằng tài khoản Google (xác thực Gmail)"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đăng nhập Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (Below header on small phones) */}
        <div className="flex md:hidden items-center justify-around py-1.5 border-t border-slate-100 text-xs gap-1">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap ${currentView === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onViewChange('theory')}
            className={`px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap ${currentView === 'theory' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Lý thuyết
          </button>
          <button
            onClick={() => onViewChange('practice')}
            className={`px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap ${currentView === 'practice' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Luyện tập
          </button>
        </div>
      </div>
    </header>
  );
};
