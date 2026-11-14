import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Goal } from '../types';
import { Chapter } from '../data/curriculumData';
import {
  X,
  User,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Compass,
  GraduationCap,
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
  Upload,
  Trash2,
} from 'lucide-react';
import { getSavedAccounts, isTeacherEmail } from '../utils/storage';
import {
  BUILTIN_AVATAR_OPTIONS,
  AVATAR_EMOJI_MAP,
  compressAvatarImageFile,
  isCustomImageAvatar,
} from '../utils/avatar';
import {
  signInWithGoogleAccount,
  loadOrCreateGoogleUserProfile,
} from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  firebaseUser: FirebaseUser | null;
  currentChapters: Chapter[];
  currentGoal: Goal;
  onLoginSuccess: (
    user: UserProfile,
    chapters: Chapter[],
    goal: Goal,
    fbUser: FirebaseUser
  ) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void> | void;
  onLogout: () => Promise<void> | void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  firebaseUser,
  currentChapters,
  currentGoal,
  onLoginSuccess,
  onUpdateProfile,
  onLogout,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile editor states when authenticated
  const [editName, setEditName] = useState<string>(currentUser.name);
  const [editGrade, setEditGrade] = useState<string>(currentUser.grade || 'Lớp 7A1');
  const [editSchool, setEditSchool] = useState<string>(currentUser.school || 'THCS Kết Nối Tri Thức');
  const [editAvatar, setEditAvatar] = useState<string>(currentUser.avatar || 'pipo_owl');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const wasOpenRef = useRef<boolean>(false);
  const lastUidRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUid = firebaseUser?.uid || null;
    const isOpening = isOpen && !wasOpenRef.current;
    const isSwitchingAccount = isOpen && lastUidRef.current !== currentUid;

    if (isOpening || isSwitchingAccount) {
      setEditName(currentUser.name || '');
      setEditGrade(currentUser.grade || 'Lớp 7A1');
      setEditSchool(currentUser.school || 'THCS Kết Nối Tri Thức');
      setEditAvatar(currentUser.avatar || 'pipo_owl');
      setErrorMessage(null);
      if (isOpening) {
        setNotification(null);
      }
    }
    wasOpenRef.current = isOpen;
    lastUidRef.current = currentUid;
  }, [isOpen, firebaseUser?.uid, currentUser.name, currentUser.grade, currentUser.school, currentUser.avatar]);

  const savedAccounts = getSavedAccounts();

  if (!isOpen) return null;

  // Real Google OAuth Sign-In (Forces Google sign-in with email/password + account selection)
  const handleGoogleOAuthSignIn = async (loginHint?: string) => {
    setErrorMessage(null);
    setNotification(null);
    setIsLoading(true);

    try {
      const fbUser = await signInWithGoogleAccount(loginHint);

      if (!fbUser.email || !fbUser.emailVerified) {
        setErrorMessage('Tài khoản Google chưa xác minh địa chỉ email. Vui lòng dùng Gmail đã xác minh.');
        setIsLoading(false);
        return;
      }

      const fallbackUser = currentUser.isAuthenticated ? null : currentUser;
      const { user: loadedUser, chapters, goal, isNewUser } =
        await loadOrCreateGoogleUserProfile(
          fbUser,
          fallbackUser,
          currentChapters,
          currentGoal
        );

      const isTeacher = isTeacherEmail(loadedUser.email);
      setNotification(
        isTeacher
          ? `Chào Thầy/Cô! Đã xác thực Google (${loadedUser.email}) với quyền Giáo viên.`
          : isNewUser
          ? `Đăng nhập Google thành công! Chào mừng ${loadedUser.name} (+200 XP & 50 Xu vàng).`
          : `Xác thực Google thành công! Đã tải tiến trình học của ${loadedUser.name}.`
      );

      onLoginSuccess(loadedUser, chapters, goal, fbUser);
      setIsLoading(false);

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: unknown) {
      setIsLoading(false);
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: string }).code)
          : '';
      const msg = err instanceof Error ? err.message : String(err);

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMessage('Bạn đã đóng cửa sổ đăng nhập Google trước khi chọn tài khoản.');
      } else if (code === 'auth/popup-blocked') {
        setErrorMessage(
          'Trình duyệt đang chặn cửa sổ đăng nhập (Popup). Vui lòng cho phép mở Popup rồi thử lại.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setErrorMessage(
          'Tên miền hiện tại chưa được cấp phép trong Firebase Authorized Domains. Vui lòng thêm domain này vào Firebase Console -> Authentication -> Settings -> Authorized domains.'
        );
      } else if (code === 'auth/network-request-failed') {
        setErrorMessage('Lỗi kết nối mạng khi xác thực Google. Vui lòng kiểm tra Internet.');
      } else {
        setErrorMessage(`Không thể đăng nhập Google: ${msg}`);
      }
    }
  };

  const handleSaveProfileChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!editName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của em.');
      return;
    }

    setErrorMessage(null);
    setNotification(null);
    setIsSaving(true);

    try {
      await onUpdateProfile({
        name: editName.trim(),
        grade: currentUser.role === 'admin' ? 'Tổ Toán 7' : editGrade,
        school: editSchool.trim() || 'THCS Kết Nối Tri Thức',
        avatar: editAvatar,
      });
      setNotification('Đã lưu cập nhật hồ sơ học tập lên hệ thống!');
    } catch (err: unknown) {
      let detail = err instanceof Error ? err.message : String(err);
      try {
        const parsed = JSON.parse(detail) as { error?: string };
        if (parsed?.error) detail = parsed.error;
      } catch {
        // plain error message
      }

      if (detail.toLowerCase().includes('permission') || detail.toLowerCase().includes('insufficient')) {
        setErrorMessage('Không đủ quyền lưu hồ sơ lên máy chủ. Vui lòng đăng xuất và đăng nhập lại Google.');
      } else if (detail.toLowerCase().includes('quota')) {
        setErrorMessage('Hệ thống đang vượt quá giới hạn lượt lưu miễn phí trong ngày.');
      } else if (detail.toLowerCase().includes('offline') || detail.toLowerCase().includes('network')) {
        setErrorMessage('Không thể kết nối máy chủ để lưu hồ sơ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setErrorMessage(`Không thể lưu hồ sơ: ${detail}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setErrorMessage(null);
    setNotification(null);
    setIsUploadingAvatar(true);

    try {
      const compressedDataUrl = await compressAvatarImageFile(file);
      setEditAvatar(compressedDataUrl);
      setNotification('Đã tải ảnh đại diện lên! Hãy nhấn "Lưu cập nhật hồ sơ" để lưu lại.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || 'Không thể xử lý ảnh đại diện đã chọn.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const hasCustomAvatar = isCustomImageAvatar(editAvatar);
  const currentHasCustomAvatar = isCustomImageAvatar(currentUser.avatar);
  const currentMascotEmoji = AVATAR_EMOJI_MAP[currentUser.avatar];

  const isAuthenticatedWithGoogle = Boolean(currentUser.isAuthenticated && firebaseUser);

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
                {isAuthenticatedWithGoogle ? 'Tài Khoản Google Đã Xác Thực' : 'Đăng Nhập Bằng Google'}
              </h2>
              <p className="text-[11px] text-emerald-100">
                Toán 7 Kết Nối Tri Thức · Bảo mật OAuth
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

        {/* Notifications */}
        {notification && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="leading-snug">{notification}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 text-rose-950 rounded-xl text-xs font-semibold flex items-start gap-2 border border-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {isAuthenticatedWithGoogle ? (
            /* AUTHENTICATED VIEW: Show Verified Google Account + Profile Editor */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {currentHasCustomAvatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-emerald-200 shrink-0"
                    />
                  ) : currentMascotEmoji ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                      {currentMascotEmoji}
                    </div>
                  ) : firebaseUser?.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </span>
                      {currentUser.role === 'admin' ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
                          Giáo viên
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                          Học sinh
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Student Profile Form */}
              <form onSubmit={handleSaveProfileChanges} className="space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thông tin hồ sơ học tập</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Lớp học</label>
                    <select
                      value={editGrade}
                      disabled={currentUser.role === 'admin'}
                      onChange={(e) => setEditGrade(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white font-medium disabled:bg-slate-100"
                    >
                      {['Lớp 7A1', 'Lớp 7A2', 'Lớp 7A3', 'Lớp 7A4', 'Lớp 7A5', 'Lớp 7A6', 'Lớp 7A7'].map(
                        (g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Trường THCS</label>
                  <input
                    type="text"
                    value={editSchool}
                    onChange={(e) => setEditSchool(e.target.value)}
                    placeholder="THCS Kết Nối Tri Thức"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Linh vật / Ảnh đại diện:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isUploadingAvatar || isSaving}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{hasCustomAvatar ? 'Đổi ảnh tải lên' : 'Tải ảnh ngoài'}</span>
                      </button>
                      {hasCustomAvatar && (
                        <button
                          type="button"
                          disabled={isUploadingAvatar || isSaving}
                          onClick={() => setEditAvatar('pipo_owl')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer"
                          title="Xóa ảnh tải lên và dùng lại linh vật mặc định"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa ảnh</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {BUILTIN_AVATAR_OPTIONS.map((av) => (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setEditAvatar(av.id)}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                          editAvatar === av.id
                            ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="text-base h-6 flex items-center justify-center">{av.emoji}</div>
                        <span className="text-[9px] font-bold text-slate-700 block truncate">
                          {av.label}
                        </span>
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={isUploadingAvatar || isSaving}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        hasCustomAvatar
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 bg-slate-50/50'
                      }`}
                      title="Tải ảnh từ thiết bị làm biểu tượng đại diện"
                    >
                      <div className="h-6 flex items-center justify-center">
                        {isUploadingAvatar ? (
                          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                        ) : hasCustomAvatar ? (
                          <img
                            src={editAvatar}
                            alt="Ảnh đại diện tùy chỉnh"
                            className="w-6 h-6 rounded-md object-cover border border-emerald-300"
                          />
                        ) : (
                          <Upload className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 block truncate">
                        {hasCustomAvatar ? 'Ảnh riêng' : 'Tải ảnh'}
                      </span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-snug">
                    Có thể chọn linh vật có sẵn hoặc tải ảnh PNG/JPG/WEBP từ máy (tự động thu gọn làm icon).
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving || isUploadingAvatar}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu hồ sơ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu cập nhật hồ sơ</span>
                    </>
                  )}
                </button>
              </form>

              {/* Switch Google Account / Sign Out */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleGoogleOAuthSignIn()}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Đổi tài khoản Google khác</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await onLogout();
                    setNotification('Đã đăng xuất tài khoản Google!');
                  }}
                  className="py-2 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* UNAUTHENTICATED VIEW: Real Google OAuth Sign-In Only */
            <div className="space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Xác thực tài khoản Google Mail
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Học sinh và giáo viên đăng nhập trực tiếp qua cửa sổ chính thức của Google (nhập email, mật khẩu Google và chọn tài khoản để xác thực).
                </p>
              </div>

              {/* Main Google OAuth Sign-In Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleGoogleOAuthSignIn()}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-emerald-500 font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
                ) : (
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
                )}
                <span>
                  {isLoading
                    ? 'Đang mở cửa sổ xác thực Google...'
                    : 'Đăng nhập nhanh bằng Google'}
                </span>
              </button>

              {/* Step-by-step assurance box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-[11px] text-slate-600">
                <div className="font-bold text-slate-800">Quy trình đăng nhập an toàn:</div>
                <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
                  <li>Nhấn nút <strong>Đăng nhập nhanh bằng Google</strong> ở trên.</li>
                  <li>
                    Đăng nhập bằng <strong>Email & Mật khẩu Google</strong> của bạn (hoặc chọn
                    <em> "Sử dụng một tài khoản khác"</em>).
                  </li>
                  <li>Chọn tài khoản Google đã xác thực để tự động đồng bộ điểm XP, huy hiệu và bài học.</li>
                </ol>
              </div>

              {/* Recent verified Google accounts on this device (still requires Google OAuth popup) */}
              {savedAccounts.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tài khoản đã đăng nhập gần đây (Xác thực lại qua Google):
                  </span>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {savedAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleGoogleOAuthSignIn(acc.email)}
                        className="w-full p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
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

              {/* Teacher verification info */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>
                    Giáo viên (<strong>baoaivn@gmail.com</strong>) vui lòng xác thực đúng Google Mail qua nút đăng nhập ở trên.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
