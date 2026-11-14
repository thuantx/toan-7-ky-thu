import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProfile, Goal } from './types';
import { Chapter, CURRICULUM_DATA } from './data/curriculumData';
import { DEFAULT_GOAL, isTeacherEmail, mergeWithCurriculum } from './utils/storage';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration (the client is offline).');
    }
  }
}
testConnection();

// Always prompt Google Account Chooser (forces Google sign-in / account selection)
export async function signInWithGoogleAccount(loginHint?: string): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  const customParams: Record<string, string> = {
    prompt: 'select_account',
  };
  if (loginHint && loginHint.trim()) {
    customParams.login_hint = loginHint.trim();
  }
  provider.setCustomParameters(customParams);
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutGoogleAccount(): Promise<void> {
  await signOut(auth);
}

function buildLessonProgressMap(chapters: Chapter[]) {
  const progressMap: Record<
    string,
    {
      status: string;
      accuracy: number;
      totalAttempts: number;
      correctCount: number;
      timeSpentMinutes: number;
    }
  > = {};

  chapters.forEach((ch) => {
    ch.lessons.forEach((l) => {
      if (
        l.status !== 'NOT_STARTED' ||
        l.accuracy > 0 ||
        l.totalAttempts > 0 ||
        l.correctCount > 0 ||
        l.timeSpentMinutes > 0
      ) {
        progressMap[l.id] = {
          status: l.status,
          accuracy: l.accuracy,
          totalAttempts: l.totalAttempts,
          correctCount: l.correctCount,
          timeSpentMinutes: l.timeSpentMinutes,
        };
      }
    });
  });

  return progressMap;
}

function buildCleanGoalMap(goal: Goal) {
  const cleanGoal: Record<string, unknown> = {
    id: String(goal.id || 'goal-01').slice(0, 64),
    title: String(goal.title || DEFAULT_GOAL.title).slice(0, 200),
    scope: goal.scope || 'SEMESTER',
    targetGrade: Number(goal.targetGrade || 9.0),
    targetDate: String(goal.targetDate || '2026-12-30').slice(0, 20),
    weeklyTargetQuestions: Number(goal.weeklyTargetQuestions || 15),
    targetAccuracy: Number(goal.targetAccuracy || 85),
    completedQuestionsThisWeek: Number(goal.completedQuestionsThisWeek || 0),
    currentAccuracy: Number(goal.currentAccuracy || 0),
    progressPercent: Number(goal.progressPercent || 0),
    recommendedMessage: String(goal.recommendedMessage || '').slice(0, 400),
  };
  if (goal.targetChapterId) {
    cleanGoal.targetChapterId = String(goal.targetChapterId).slice(0, 64);
  }
  if (Array.isArray(goal.dailyCompletedQuestions)) {
    cleanGoal.dailyCompletedQuestions = goal.dailyCompletedQuestions.slice(-14).map((entry) => ({
      date: String(entry.date || '').slice(0, 12),
      count: Math.max(0, Math.round(Number(entry.count || 0))),
    }));
  }
  return cleanGoal;
}

export function applyLessonProgressToCurriculum(
  lessonProgress?: Record<
    string,
    {
      status?: string;
      accuracy?: number;
      totalAttempts?: number;
      correctCount?: number;
      timeSpentMinutes?: number;
    }
  >
): Chapter[] {
  if (!lessonProgress) return CURRICULUM_DATA;
  return CURRICULUM_DATA.map((ch) => ({
    ...ch,
    lessons: ch.lessons.map((l) => {
      const saved = lessonProgress[l.id];
      if (!saved) return l;
      return {
        ...l,
        status: (saved.status as Chapter['lessons'][number]['status']) || l.status,
        accuracy: typeof saved.accuracy === 'number' ? saved.accuracy : l.accuracy,
        totalAttempts: typeof saved.totalAttempts === 'number' ? saved.totalAttempts : l.totalAttempts,
        correctCount: typeof saved.correctCount === 'number' ? saved.correctCount : l.correctCount,
        timeSpentMinutes:
          typeof saved.timeSpentMinutes === 'number' ? saved.timeSpentMinutes : l.timeSpentMinutes,
      };
    }),
  }));
}

const inFlightProfileLoads = new Map<
  string,
  Promise<{
    user: UserProfile;
    chapters: Chapter[];
    goal: Goal;
    isNewUser: boolean;
  }>
>();

export async function loadOrCreateGoogleUserProfile(
  firebaseUser: FirebaseUser,
  localFallbackUser?: UserProfile | null,
  localFallbackChapters?: Chapter[],
  localFallbackGoal?: Goal
): Promise<{
  user: UserProfile;
  chapters: Chapter[];
  goal: Goal;
  isNewUser: boolean;
}> {
  const uid = firebaseUser.uid;
  const existingPromise = inFlightProfileLoads.get(uid);
  if (existingPromise) {
    return existingPromise;
  }

  const loadPromise = loadOrCreateGoogleUserProfileInternal(
    firebaseUser,
    localFallbackUser,
    localFallbackChapters,
    localFallbackGoal
  ).finally(() => {
    inFlightProfileLoads.delete(uid);
  });

  inFlightProfileLoads.set(uid, loadPromise);
  return loadPromise;
}

async function loadOrCreateGoogleUserProfileInternal(
  firebaseUser: FirebaseUser,
  localFallbackUser?: UserProfile | null,
  localFallbackChapters?: Chapter[],
  localFallbackGoal?: Goal
): Promise<{
  user: UserProfile;
  chapters: Chapter[];
  goal: Goal;
  isNewUser: boolean;
}> {
  const uid = firebaseUser.uid;
  const email = firebaseUser.email || '';
  const isTeacher = Boolean(firebaseUser.emailVerified && isTeacherEmail(email));
  const path = `users/${uid}`;
  const docRef = doc(db, 'users', uid);

  let snap;
  try {
    snap = await getDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (snap.exists()) {
    const data = snap.data();
    const loadedUser: UserProfile = {
      id: uid,
      name: String(data.name || firebaseUser.displayName || 'Học sinh Toán 7'),
      email,
      grade: String(data.grade || (isTeacher ? 'Tổ Toán 7' : 'Lớp 7A1')),
      school: String(data.school || 'THCS Kết Nối Tri Thức'),
      role: isTeacher ? 'admin' : 'student',
      avatar: String(data.avatar || 'pipo_owl'),
      xp: typeof data.xp === 'number' ? data.xp : 0,
      coins: typeof data.coins === 'number' ? data.coins : 50,
      hearts: typeof data.hearts === 'number' ? data.hearts : 5,
      maxHearts: typeof data.maxHearts === 'number' ? data.maxHearts : 5,
      streakDays: typeof data.streakDays === 'number' ? data.streakDays : 1,
      unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : ['RATIONAL_MASTER'],
      authProvider: 'google',
      isAuthenticated: true,
      registeredAt: localFallbackUser?.registeredAt || new Date().toISOString().split('T')[0],
      lastActiveAt: new Date().toISOString(),
    };

    const loadedChapters = data.lessonProgress
      ? applyLessonProgressToCurriculum(data.lessonProgress)
      : mergeWithCurriculum(localFallbackChapters);

    const loadedGoal: Goal = data.goal
      ? { ...DEFAULT_GOAL, ...(data.goal as Partial<Goal>) }
      : localFallbackGoal || DEFAULT_GOAL;

    if (loadedUser.role === 'student') {
      syncLeaderboardEntry(firebaseUser, loadedUser).catch((err) =>
        console.warn('Initial leaderboard sync skipped:', err)
      );
    }

    return {
      user: loadedUser,
      chapters: loadedChapters,
      goal: loadedGoal,
      isNewUser: false,
    };
  }

  // First time signing in with this Google account -> create Firestore profile
  const displayName = (
    localFallbackUser?.name && localFallbackUser.name !== 'Học sinh' && localFallbackUser.name !== 'Khách'
      ? localFallbackUser.name
      : firebaseUser.displayName || email.split('@')[0] || 'Học sinh Toán 7'
  )
    .trim()
    .slice(0, 100);

  const initialUser: UserProfile = {
    id: uid,
    name: isTeacher && !firebaseUser.displayName ? 'Thầy/Cô Giáo Viên' : displayName,
    email,
    grade: isTeacher ? 'Tổ Toán 7' : localFallbackUser?.grade || 'Lớp 7A1',
    school: localFallbackUser?.school || 'THCS Kết Nối Tri Thức',
    role: isTeacher ? 'admin' : 'student',
    avatar: localFallbackUser?.avatar || 'pipo_owl',
    xp: isTeacher ? 1000 : Math.max(200, localFallbackUser?.xp || 0),
    coins: isTeacher ? 200 : Math.max(50, localFallbackUser?.coins || 0),
    hearts: 5,
    maxHearts: 5,
    streakDays: Math.max(1, localFallbackUser?.streakDays || 1),
    unlockedBadges:
      localFallbackUser?.unlockedBadges && localFallbackUser.unlockedBadges.length > 0
        ? localFallbackUser.unlockedBadges
        : ['RATIONAL_MASTER'],
    authProvider: 'google',
    isAuthenticated: true,
    registeredAt: new Date().toISOString().split('T')[0],
    lastActiveAt: new Date().toISOString(),
  };

  const initialChapters = mergeWithCurriculum(localFallbackChapters);
  const initialGoal = localFallbackGoal || DEFAULT_GOAL;

  const createPayload = {
    uid,
    name: initialUser.name,
    email,
    grade: initialUser.grade.slice(0, 40),
    school: (initialUser.school || 'THCS Kết Nối Tri Thức').slice(0, 120),
    avatar: initialUser.avatar.slice(0, 40),
    xp: initialUser.xp,
    coins: initialUser.coins,
    hearts: initialUser.hearts,
    maxHearts: initialUser.maxHearts,
    streakDays: initialUser.streakDays,
    unlockedBadges: initialUser.unlockedBadges.slice(0, 30),
    lessonProgress: buildLessonProgressMap(initialChapters),
    goal: buildCleanGoalMap(initialGoal),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, createPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  if (initialUser.role === 'student') {
    syncLeaderboardEntry(firebaseUser, initialUser).catch((err) =>
      console.warn('New user leaderboard sync skipped:', err)
    );
  }

  return {
    user: initialUser,
    chapters: initialChapters,
    goal: initialGoal,
    isNewUser: true,
  };
}

export async function syncUserProgressToFirestore(
  firebaseUser: FirebaseUser,
  userProfile: UserProfile,
  chapters: Chapter[],
  goal: Goal
): Promise<void> {
  if (!firebaseUser || !firebaseUser.emailVerified || !firebaseUser.email) {
    throw new Error('Phiên đăng nhập Google chưa hợp lệ hoặc email chưa được xác minh.');
  }

  const uid = firebaseUser.uid;
  const path = `users/${uid}`;
  const docRef = doc(db, 'users', uid);

  const updatablePayload = {
    name: (userProfile.name || firebaseUser.displayName || 'Học sinh Toán 7').trim().slice(0, 100) || 'Học sinh',
    grade: (userProfile.grade || 'Lớp 7A1').trim().slice(0, 40) || 'Lớp 7A1',
    school: (userProfile.school || 'THCS Kết Nối Tri Thức').trim().slice(0, 120),
    avatar: (userProfile.avatar || 'pipo_owl').trim().slice(0, 40) || 'pipo_owl',
    xp: Math.max(0, Math.min(10000000, Math.round(userProfile.xp || 0))),
    coins: Math.max(0, Math.min(10000000, Math.round(userProfile.coins || 0))),
    hearts: Math.max(0, Math.min(10, Math.round(userProfile.hearts ?? 5))),
    maxHearts: Math.max(1, Math.min(10, Math.round(userProfile.maxHearts || 5))),
    streakDays: Math.max(0, Math.min(10000, Math.round(userProfile.streakDays || 1))),
    unlockedBadges: (userProfile.unlockedBadges || []).slice(0, 30).map((b) => String(b).slice(0, 60)),
    lessonProgress: buildLessonProgressMap(chapters),
    goal: buildCleanGoalMap(goal),
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(docRef, updatablePayload);
  } catch (error) {
    const errCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : '';
    const errMsg = error instanceof Error ? error.message : String(error);
    if (
      errCode === 'not-found' ||
      errMsg.includes('No document to update') ||
      errMsg.includes('not-found')
    ) {
      try {
        await setDoc(docRef, {
          uid,
          email: firebaseUser.email,
          ...updatablePayload,
          createdAt: serverTimestamp(),
        });
      } catch (createErr) {
        handleFirestoreError(createErr, OperationType.CREATE, path);
      }
      if (userProfile.role === 'student') {
        await syncLeaderboardEntry(firebaseUser, userProfile);
      }
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  if (userProfile.role === 'student') {
    await syncLeaderboardEntry(firebaseUser, userProfile);
  }
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  grade: string;
  avatar: string;
  xp: number;
  streakDays: number;
}

export async function syncLeaderboardEntry(
  firebaseUser: FirebaseUser,
  userProfile: UserProfile
): Promise<void> {
  if (!firebaseUser || !firebaseUser.emailVerified || !firebaseUser.email) return;

  const uid = firebaseUser.uid;
  const path = `leaderboard/${uid}`;
  const docRef = doc(db, 'leaderboard', uid);

  const payload = {
    uid,
    name: (userProfile.name || firebaseUser.displayName || 'Học sinh Toán 7').trim().slice(0, 100) || 'Học sinh',
    grade: (userProfile.grade || 'Lớp 7A1').trim().slice(0, 40) || 'Lớp 7A1',
    avatar: (userProfile.avatar || 'pipo_owl').trim().slice(0, 40) || 'pipo_owl',
    xp: Math.max(0, Math.min(10000000, Math.round(userProfile.xp || 0))),
    streakDays: Math.max(0, Math.min(10000, Math.round(userProfile.streakDays || 0))),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

function mapLeaderboardSnapshotDocs(
  docs: { id: string; data: () => Record<string, unknown> }[]
): LeaderboardEntry[] {
  return docs.map((d) => {
    const data = d.data();
    return {
      uid: String(data.uid || d.id),
      name: String(data.name || 'Học sinh Toán 7'),
      grade: String(data.grade || 'Lớp 7'),
      avatar: String(data.avatar || 'pipo_owl'),
      xp: typeof data.xp === 'number' ? data.xp : 0,
      streakDays: typeof data.streakDays === 'number' ? data.streakDays : 0,
    };
  });
}

export async function fetchTopLeaderboardStudents(
  topCount: number = 10
): Promise<LeaderboardEntry[]> {
  const path = 'leaderboard';
  try {
    const q = query(
      collection(db, path),
      where('xp', '>=', 0),
      orderBy('xp', 'desc'),
      limit(Math.max(1, Math.min(10, topCount)))
    );
    const snap = await getDocs(q);
    return mapLeaderboardSnapshotDocs(snap.docs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeTopLeaderboardStudents(
  topCount: number,
  onData: (entries: LeaderboardEntry[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const path = 'leaderboard';
  const q = query(
    collection(db, path),
    where('xp', '>=', 0),
    orderBy('xp', 'desc'),
    limit(Math.max(1, Math.min(10, topCount)))
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(mapLeaderboardSnapshotDocs(snapshot.docs));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (formattedError) {
        onError(
          formattedError instanceof Error ? formattedError : new Error(String(formattedError))
        );
      }
    }
  );
}
