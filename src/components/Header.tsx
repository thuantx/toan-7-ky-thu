import React from 'react';
import { ViewMode, UserProfile } from '../types';
import { 
  Heart, 
  Flame, 
  Coins, 
  Zap, 
  BookOpen, 
  LayoutDashboard, 
  Target, 
  Compass, 
  ShieldCheck, 
  User, 
  LogIn
} from 'lucide-react';

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
  onOpenGoalsModal,
  onToggleRole,
  onOpenAuthModal,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
          {/* Zone 1: Single text element wordmark with icon */}
          <button
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap block leading-tight">
                Toán 7 Kỳ Thú
              </span>
              <span className="text-[11px] font-medium text-emerald-700 tracking-wide uppercase block">
                Kết Nối Tri Thức
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Specification tab removed per user request) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                currentView === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Dashboard & Mục Tiêu</span>
            </button>

            <button
              onClick={() => onViewChange('practice')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                currentView === 'practice'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Luyện Tập Trắc Nghiệm & Điền Số</span>
            </button>

            <button
              onClick={() => onViewChange('theory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                currentView === 'theory'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Lý Thuyết & Ví Dụ Step-by-Step</span>
            </button>
          </nav>

          {/* Zone 3: Gamification Status Bar & Student Account Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Hearts Count */}
            <div
              title="Số tim còn lại (Mỗi lần trả lời sai bị trừ 1 tim)"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs sm:text-sm font-mono tabular-nums"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>{user.hearts}/{user.maxHearts}</span>
            </div>

            {/* Coins */}
            <div
              title="Xu vàng thưởng (Dùng mua vật phẩm và hồi phục tim)"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 font-bold text-xs sm:text-sm font-mono tabular-nums"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{user.coins}</span>
            </div>

            {/* XP Points */}
            <div
              title="Điểm kinh nghiệm tích lũy"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm font-mono tabular-nums"
            >
              <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />
              <span>{user.xp} <span className="text-[10px] uppercase font-sans">XP</span></span>
            </div>

            {/* Streak flame */}
            <div
              title="Chuỗi ngày chăm chỉ học liên tiếp"
              className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-100 text-orange-700 font-bold text-xs font-mono tabular-nums"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{user.streakDays} ngày</span>
            </div>

            {/* Set Goal Quick Trigger Button */}
            <button
              onClick={onOpenGoalsModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Thiết lập mục tiêu học kỳ / năm"
            >
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mục tiêu</span>
            </button>

            {/* Role Switcher: Student vs Admin */}
            <button
              onClick={onToggleRole}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-400/40'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title="Nhấn để chuyển đổi vai trò Học sinh <-> Admin/Giáo viên"
            >
              {user.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span className="whitespace-nowrap">Admin/GV</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="whitespace-nowrap">Học sinh</span>
                </>
              )}
            </button>

            {/* User Profile / Gmail Sign-in Button */}
            {user.isAuthenticated ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 transition-all text-left shrink-0 group"
                title={`Đang đăng nhập: ${user.name} (${user.email || 'Học sinh'}). Nhấn để quản lý tài khoản.`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block leading-tight text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span className="truncate max-w-[90px]">{user.name}</span>
                    {user.authProvider === 'google' && (
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-mono font-bold">G</span>
                    )}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium truncate max-w-[100px]">
                    {user.grade}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                title="Đăng nhập hoặc đăng ký nhanh qua Gmail để lưu tiến trình học"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span className="whitespace-nowrap">Đăng nhập Gmail</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (Specification tab removed) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3 py-1 rounded font-medium whitespace-nowrap ${currentView === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Dashboard & Mục tiêu
          </button>
          <button
            onClick={() => onViewChange('practice')}
            className={`px-3 py-1 rounded font-medium whitespace-nowrap ${currentView === 'practice' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Luyện tập
          </button>
          <button
            onClick={() => onViewChange('theory')}
            className={`px-3 py-1 rounded font-medium whitespace-nowrap ${currentView === 'theory' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Lý thuyết
          </button>
        </div>
      </div>
    </header>
  );
};
