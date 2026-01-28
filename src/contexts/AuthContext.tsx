import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { ApiCourse, ProgressEntry, User } from '@/lib/types';
import { getGoogleAuthCode } from '@/lib/googleIdentity';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  myCourses: ApiCourse[];
  progress: ProgressEntry[];
  login: (idToken?: string) => Promise<void>;
  logout: () => void;
  hasAccessToCourse: (course: Pick<ApiCourse, 'id' | 'is_free'>) => boolean;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  markLessonViewed: (courseId: string, lessonId: string) => Promise<void>;
  getCourseProgress: (courseId: string) => number;
  registerCourseLessonCount: (courseId: string, totalLessons: number) => void;
  refreshMyCourses: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [myCourses, setMyCourses] = useState<ApiCourse[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [lessonTotals, setLessonTotals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
      const courses = await api.getMyCourses();
      setMyCourses(courses);
      const prog = await api.getProgress();
      setProgress(prog);
    } catch (e) {
      // If tokens are invalid, clear auth but do not crash.
      api.clearAuth();
      setUser(null);
      setMyCourses([]);
      setProgress([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const stored = api.loadTokens();
    if (stored) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshMyCourses = async () => {
    const courses = await api.getMyCourses();
    setMyCourses(courses);
  };

  const login = async (idToken?: string) => {
    setIsLoading(true);
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'postmessage';
      const code = await getGoogleAuthCode(clientId, redirectUri);
      const payload = { code, redirect_uri: redirectUri };

      const data = await api.loginWithGoogle(payload);
      setUser(data.user);
      await refreshMyCourses();
      const prog = await api.getProgress();
      setProgress(prog);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearAuth();
    setUser(null);
    setMyCourses([]);
    setProgress([]);
  };

  const hasAccessToCourse = (course: Pick<ApiCourse, 'id' | 'is_free'>) => {
    if (course.is_free) return true;
    return myCourses.some((c) => c.id === course.id);
  };

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    const entry = await api.completeLesson(courseId, lessonId);
    setProgress((prev) => {
      const existing = prev.find((p) => p.id === entry.id);
      if (existing) {
        return prev.map((p) => (p.id === entry.id ? entry : p));
      }
      return [...prev, entry];
    });
  };

  const markLessonViewed = async (courseId: string, lessonId: string) => {
    const entry = await api.viewLesson(courseId, lessonId);
    setProgress((prev) => {
      const existing = prev.find((p) => p.id === entry.id);
      if (existing) {
        return prev.map((p) =>
          p.id === entry.id
            ? {
                ...entry,
                is_completed: existing.is_completed || entry.is_completed,
                completed_at: existing.completed_at ?? entry.completed_at,
              }
            : p
        );
      }
      return [...prev, entry];
    });
  };

  const registerCourseLessonCount = (courseId: string, totalLessons: number) => {
    setLessonTotals((prev) => ({ ...prev, [courseId]: totalLessons }));
  };

  const getCourseProgress = (courseId: string) => {
    const total = lessonTotals[courseId];
    if (!total || total === 0) return 0;
    const completed = progress.filter((p) => p.course_id === courseId && p.is_completed).length;
    return Math.min(100, (completed / total) * 100);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      myCourses,
      progress,
      login,
      logout,
      hasAccessToCourse,
      markLessonComplete,
      markLessonViewed,
      getCourseProgress,
      registerCourseLessonCount,
      refreshMyCourses,
    }),
    [user, isLoading, myCourses, progress]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
