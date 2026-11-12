import React, { useState } from 'react';
import { UserProfile, Goal } from '../types';
import { Chapter, CURRICULUM_DATA } from '../data/curriculumData';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  School, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  LogOut, 
  Eye,
  EyeOff,
  Compass,
  GraduationCap
} from 'lucide-react';
import { loadStudentByEmail, getSavedAccounts, DEFAULT_GOAL, isTeacherEmail } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile, chapters?: Chapter[], goal?: Goal) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'google_fast' | 'register' | 'login_email'>('google_fast');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for Registration
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regGrade, setRegGrade] = useState<string>('Lớp 7A1');
  const [regSchool, setRegSchool] = useState<string>('THCS Kết Nối Tri Thức');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regAvatar, setRegAvatar] = useState<string>('pipo_owl');

  // Form states for Email Login (no prefilled teacher account by default)
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Fast Google Login custom input
  const [googleCustomEmail, setGoogleCustomEmail] = useState<string>('');

  const savedAccounts = getSavedAccounts();

  if (!isOpen) return null;

  // 1. Handle Quick Google Sign-In
  const handleGoogleSignIn = (emailToUse: string) => {
    const targetEmail = emailToUse.trim().toLowerCase();
    if (!targetEmail) {
      setNotification('Vui lòng nhập địa chỉ Gmail của em nhé!');
      return;
    }

    setIsLoading(true);
    const isTeacher = isTeacherEmail(targetEmail);

    setTimeout(() => {
      // Check if user has previously saved progress
      const existingData = loadStudentByEmail(targetEmail);

      let finalUser: UserProfile;
      let finalChapters: Chapter[] | undefined = undefined;
      let finalGoal: Goal | undefined = undefined;

      if (existingData) {
        finalUser = {
          ...existingData.user,
          role: isTeacher ? 'admin' : 'student',
          isAuthenticated: true,
          authProvider: 'google',
          lastActiveAt: new Date().toISOString(),
        };
        finalChapters = existingData.chapters;
        finalGoal = existingData.goal;
        setNotification(
          isTeacher
            ? `Chào Thầy/Cô! Đã đăng nhập vai trò Giáo viên (${targetEmail}) với toàn quyền xem đáp án & gợi ý.`
            : `Đăng nhập thành công! Đã khôi phục tiến trình học của ${finalUser.name} (${targetEmail}).`
        );
      } else {
        // Create new account
        const nameFromEmail = targetEmail.split('@')[0];
        const formattedName = isTeacher
          ? 'Thầy/Cô Giáo Viên'
          : nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        finalUser = {
          id: `user-${Date.now().toString().slice(-4)}`,
          name: formattedName || 'Học sinh Toán 7',
          email: targetEmail,
          grade: isTeacher ? 'Tổ Toán 7' : 'Lớp 7A1',
          school: 'THCS Kết Nối Tri Thức',
          role: isTeacher ? 'admin' : 'student',
          avatar: 'pipo_owl',
          xp: isTeacher ? 1000 : 200,
          coins: isTeacher ? 200 : 50,
          hearts: 5,
          maxHearts: 5,
          streakDays: 1,
          unlockedBadges: ['RATIONAL_MASTER'],
          authProvider: 'google',
          isAuthenticated: true,
          registeredAt: new Date().toISOString().split('T')[0],
          lastActiveAt: new Date().toISOString(),
        };
        finalChapters = CURRICULUM_DATA;
        finalGoal = DEFAULT_GOAL;
        setNotification(
          isTeacher
            ? `Kích hoạt tài khoản Giáo viên (${targetEmail}) thành công! 🎓`
            : `Chào mừng em gia nhập MathQuest! Tặng em +200 XP và 50 Xu vàng! 🎉`
        );
      }

      setIsLoading(false);
      setTimeout(() => {
        onLoginSuccess(finalUser, finalChapters, finalGoal);
        onClose();
      }, 1000);
    }, 700);
  };

  // 2. Handle Custom Registration (Always Student role unless teacher email)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setNotification('Vui lòng nhập họ tên và Gmail của em nhé!');
      return;
    }

    const cleanEmail = regEmail.trim().toLowerCase();
    const isTeacher = isTeacherEmail(cleanEmail);

    setIsLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `user-${Date.now().toString().slice(-4)}`,
        name: regName.trim(),
        email: cleanEmail,
        grade: isTeacher ? 'Tổ Toán 7' : regGrade,
        school: regSchool.trim() || 'THCS Kết Nối Tri Thức',
        role: isTeacher ? 'admin' : 'student', // Strictly student unless baoaivn@gmail.com
        avatar: regAvatar,
        xp: 150,
        coins: 40,
        hearts: 5,
        maxHearts: 5,
        streakDays: 1,
        unlockedBadges: ['RATIONAL_MASTER'],
        authProvider: 'email',
        isAuthenticated: true,
        registeredAt: new Date().toISOString().split('T')[0],
        lastActiveAt: new Date().toISOString(),
      };

      setNotification(
        isTeacher
          ? `Đăng ký thành công tài khoản Giáo viên (${cleanEmail})!`
          : `Đăng ký thành công! Chào mừng học sinh ${newUser.name} lớp ${newUser.grade}!`
      );
      setIsLoading(false);

      setTimeout(() => {
        onLoginSuccess(newUser, CURRICULUM_DATA, DEFAULT_GOAL);
        onClose();
      }, 1000);
    }, 700);
  };

  // 3. Handle Email Password Login
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    handleGoogleSignIn(loginEmail);
  };

  const avatarOptions = [
    { id: 'pipo_owl', label: 'Cú Pipo' },
    { id: 'lion', label: 'Sư Tử' },
    { id: 'rabbit', label: 'Thỏ Nhanh' },
    { id: 'dolphin', label: 'Cá Heo' },
    { id: 'penguin', label: 'Cánh Cụt' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 px-5 py-4 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">
                Đăng Nhập & Đăng Ký
              </h2>
              <p className="text-[11px] text-emerald-100">
                Toán 7 Kết Nối Tri Thức
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Status Banner (if already logged in) */}
        {currentUser.isAuthenticated && (
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-800">
            <div className="flex items-center gap-2 truncate">
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span className="truncate">
                {currentUser.name} (<strong>{currentUser.role === 'admin' ? 'Giáo viên' : 'Học sinh'}</strong>)
              </span>
            </div>
            <button
              onClick={() => {
                onLogout();
                setNotification('Đã đăng xuất tài khoản!');
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline ml-2 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('google_fast')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'google_fast'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'hover:text-slate-900'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Gmail 1-Chạm</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tạo tài khoản</span>
          </button>

          <button
            onClick={() => setActiveTab('login_email')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login_email'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mật khẩu</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-5 mt-3 p-2.5 bg-emerald-50 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="leading-tight">{notification}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5">
          {/* TAB 1: QUICK GMAIL LOGIN */}
          {activeTab === 'google_fast' && (
            <div className="space-y-4">
              <div className="text-center space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Đăng nhập học sinh bằng Gmail
                </h3>
                <p className="text-[11px] text-slate-500">
                  Nhập địa chỉ Gmail của em để tự động lưu điểm số, huy hiệu và chuỗi ngày học.
                </p>
              </div>

              {/* Student Gmail Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Địa chỉ Gmail của học sinh:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleGoogleSignIn(googleCustomEmail);
                      }
                    }}
                    placeholder="nguyenan.toan7@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-mono"
                  />
                </div>

                {/* Main Action Button */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleGoogleSignIn(googleCustomEmail)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{isLoading ? 'Đang vào học...' : 'Đăng Nhập / Vào Học Bằng Gmail Này'}</span>
                </button>
              </div>

              {/* Show Saved Accounts on this device if any */}
              {savedAccounts.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tài khoản đã lưu trên thiết bị này:
                  </span>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {savedAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleGoogleSignIn(acc.email)}
                        className="w-full p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="truncate">{acc.name}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold shrink-0">
                                {acc.grade}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono truncate">
                              {acc.email}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Switch to Register */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-center space-y-1">
                <span className="text-xs font-bold text-amber-900 block">
                  Em là học sinh mới chưa có tài khoản?
                </span>
                <p className="text-[11px] text-amber-700 leading-tight">
                  Đăng ký hồ sơ để chọn linh vật đại diện và nhận ngay <strong>+150 XP</strong> khởi đầu!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="mt-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                >
                  Tạo tài khoản học sinh ngay →
                </button>
              </div>

              {/* Discrete Teacher Login Link */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setGoogleCustomEmail('baoaivn@gmail.com');
                    handleGoogleSignIn('baoaivn@gmail.com');
                  }}
                  className="text-[11px] text-slate-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  <span>Dành cho Giáo viên quản lý (baoaivn@gmail.com)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER NEW STUDENT ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nguyễn Bảo Minh"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Lớp học</label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    {['Lớp 7A1', 'Lớp 7A2', 'Lớp 7A3', 'Lớp 7A4', 'Lớp 7A5', 'Lớp 7A6', 'Lớp 7A7'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Địa chỉ Gmail học sinh *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="hocsinh.toan7@gmail.com"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Trường THCS</label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="THCS Kết Nối Tri Thức"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Mật khẩu</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Chọn Linh vật:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {avatarOptions.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setRegAvatar(av.id)}
                      className={`p-1.5 rounded-xl border text-center transition-all ${
                        regAvatar === av.id
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="text-base">
                        {av.id === 'pipo_owl' && '🦉'}
                        {av.id === 'lion' && '🦁'}
                        {av.id === 'rabbit' && '🐰'}
                        {av.id === 'dolphin' && '🐬'}
                        {av.id === 'penguin' && '🐧'}
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 block truncate">
                        {av.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Đang tạo...' : 'Đăng Ký Tài Khoản Học Sinh (+150 XP)'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: EMAIL PASSWORD LOGIN */}
          {activeTab === 'login_email' && (
            <form onSubmit={handleEmailLoginSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Gmail / Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="vidu@gmail.com"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Đang kiểm tra...' : 'Đăng Nhập'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
