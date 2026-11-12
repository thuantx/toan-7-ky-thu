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
  RotateCcw,
  Eye,
  EyeOff,
  Compass
} from 'lucide-react';
import { loadStudentByEmail, getSavedAccounts, DEFAULT_GOAL } from '../utils/storage';

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

  // Form states for Email Login
  const [loginEmail, setLoginEmail] = useState<string>('baovnai@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('••••••••');

  // Fast Google Login custom input
  const [googleCustomEmail, setGoogleCustomEmail] = useState<string>('baovnai@gmail.com');

  const savedAccounts = getSavedAccounts();

  if (!isOpen) return null;

  // 1. Handle Quick Google Sign-In
  const handleGoogleSignIn = (emailToUse: string) => {
    setIsLoading(true);
    const targetEmail = emailToUse.trim().toLowerCase();

    setTimeout(() => {
      // Check if user has previously saved progress
      const existingData = loadStudentByEmail(targetEmail);

      let finalUser: UserProfile;
      let finalChapters: Chapter[] | undefined = undefined;
      let finalGoal: Goal | undefined = undefined;

      if (existingData) {
        finalUser = {
          ...existingData.user,
          isAuthenticated: true,
          authProvider: 'google',
          lastActiveAt: new Date().toISOString(),
        };
        finalChapters = existingData.chapters;
        finalGoal = existingData.goal;
        setNotification(`Đăng nhập thành công! Đã khôi phục toàn bộ tiến trình học tập của ${finalUser.name} (${targetEmail}).`);
      } else {
        // Create new account linked to this Gmail
        const nameFromEmail = targetEmail.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        finalUser = {
          id: `user-${Date.now().toString().slice(-4)}`,
          name: formattedName || 'Học sinh Toán 7',
          email: targetEmail,
          grade: 'Lớp 7A1',
          school: 'THCS Kết Nối Tri Thức',
          role: 'student',
          avatar: 'pipo_owl',
          xp: 200, // Welcome gift
          coins: 50,
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
        setNotification(`Chào mừng em gia nhập MathQuest! Tặng em +200 XP và 50 Xu vàng khởi đầu! 🎉`);
      }

      setIsLoading(false);
      setTimeout(() => {
        onLoginSuccess(finalUser, finalChapters, finalGoal);
        onClose();
      }, 1000);
    }, 800);
  };

  // 2. Handle Custom Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      alert('Vui lòng nhập họ tên và Gmail của em nhé!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `user-${Date.now().toString().slice(-4)}`,
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        grade: regGrade,
        school: regSchool.trim() || 'THCS Kết Nối Tri Thức',
        role: 'student',
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

      setNotification(`Đăng ký thành công! Chào mừng ${newUser.name} đến với Toán 7 Kỳ Thú!`);
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

    setIsLoading(true);
    setTimeout(() => {
      const existingData = loadStudentByEmail(loginEmail.trim().toLowerCase());
      if (existingData) {
        const loggedUser: UserProfile = {
          ...existingData.user,
          isAuthenticated: true,
          lastActiveAt: new Date().toISOString(),
        };
        setNotification(`Đăng nhập thành công! Chào ${loggedUser.name}!`);
        setIsLoading(false);
        setTimeout(() => {
          onLoginSuccess(loggedUser, existingData.chapters, existingData.goal);
          onClose();
        }, 900);
      } else {
        // Fallback create
        handleGoogleSignIn(loginEmail);
      }
    }, 600);
  };

  const avatarOptions = [
    { id: 'pipo_owl', label: 'Cú Pipo', desc: 'Thông thái & cần cù' },
    { id: 'lion', label: 'Sư Tử', desc: 'Dũng mãnh vượt khó' },
    { id: 'rabbit', label: 'Thỏ Nhanh', desc: 'Tốc độ tư duy' },
    { id: 'dolphin', label: 'Cá Heo', desc: 'Tư duy logic nhạy bén' },
    { id: 'penguin', label: 'Cánh Cụt', desc: 'Kiên trì bền bỉ' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-tight">
                Tài Khoản Học Sinh Toán 7
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Lưu giữ tiến trình học, điểm XP, chuỗi Streak và huy hiệu
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
          <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Đang đăng nhập: <strong>{currentUser.name}</strong> ({currentUser.email || 'Học sinh'})
              </span>
            </div>
            <button
              onClick={() => {
                onLogout();
                setNotification('Đã đăng xuất tài khoản!');
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
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
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'google_fast'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'hover:text-slate-900'
            }`}
          >
            {/* Google Colorful G SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Đăng nhập Gmail</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>Tạo tài khoản mới</span>
          </button>

          <button
            onClick={() => setActiveTab('login_email')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login_email'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Mật khẩu</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-6 mt-4 p-3 bg-emerald-100 text-emerald-950 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-emerald-300 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: QUICK GMAIL LOGIN */}
          {activeTab === 'google_fast' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Đăng nhập 1-chạm qua tài khoản Gmail
                </h3>
                <p className="text-xs text-slate-500">
                  Tiến trình học tập, bảng xếp hạng và bài tập của em sẽ được lưu tự động trên mây.
                </p>
              </div>

              {/* Big Google SSO Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleGoogleSignIn(googleCustomEmail || 'baovnai@gmail.com')}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isLoading ? 'Đang đồng bộ hồ sơ...' : `Đăng nhập tiếp tục với Google`}</span>
              </button>

              {/* Quick Account Switcher list */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tài khoản học sinh gợi ý trên máy này:
                </span>

                <div className="space-y-2">
                  {savedAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleGoogleSignIn(acc.email)}
                      className="w-full p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500/80 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {acc.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                            {acc.name} <span className="text-slate-400 font-normal">({acc.grade})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {acc.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg font-mono">
                          {acc.xp} XP
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Or custom gmail input */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Hoặc nhập địa chỉ Gmail khác của em:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={googleCustomEmail}
                      onChange={(e) => setGoogleCustomEmail(e.target.value)}
                      placeholder="vidu: hocsinh.toan7@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleGoogleSignIn(googleCustomEmail)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Vào học
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER NEW STUDENT ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Họ và tên học sinh *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nguyễn Bảo Minh"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Lớp học</label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    {['Lớp 7A1', 'Lớp 7A2', 'Lớp 7A3', 'Lớp 7A4', 'Lớp 7A5', 'Lớp 7A6', 'Lớp 7A7', 'Lớp 7A8'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Địa chỉ Gmail / Email học sinh *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="baovnai@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Trường THCS</label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="THCS Kết Nối Tri Thức"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Chọn Linh vật đồng hành cùng em:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setRegAvatar(av.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        regAvatar === av.id
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="text-xl">
                        {av.id === 'pipo_owl' && '🦉'}
                        {av.id === 'lion' && '🦁'}
                        {av.id === 'rabbit' && '🐰'}
                        {av.id === 'dolphin' && '🐬'}
                        {av.id === 'penguin' && '🐧'}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">
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
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Đang tạo tài khoản...' : 'Đăng Ký & Nhận +150 XP Khởi Đầu'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: EMAIL PASSWORD LOGIN */}
          {activeTab === 'login_email' && (
            <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Gmail / Email đã đăng ký</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="baovnai@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700">Mật khẩu</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Em hãy dùng tính năng "Đăng nhập Gmail 1-chạm" để vào thẳng app nhé!'); }} className="text-[10px] text-emerald-600 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Đang kiểm tra...' : 'Đăng Nhập'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Security & Data note */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dữ liệu học tập được bảo mật và mã hóa an toàn trên hệ thống.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
