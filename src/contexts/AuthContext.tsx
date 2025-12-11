import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'moderator';
  purchasedCourses: string[];
  progress: Record<string, { completedLessons: string[]; lastAccessed: Date }>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  hasAccessToCourse: (courseId: string) => boolean;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getCourseProgress: (courseId: string) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes (set to moderator to test admin panel)
const mockUser: User = {
  id: '1',
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  avatar: undefined,
  role: 'moderator',
  purchasedCourses: ['revit-basics', 'revit-architecture'],
  progress: {
    'revit-basics': {
      completedLessons: ['lesson-1-1', 'lesson-1-2'],
      lastAccessed: new Date(),
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('revit-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    // Mock Google OAuth login
    setUser(mockUser);
    localStorage.setItem('revit-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('revit-user');
  };

  const hasAccessToCourse = (courseId: string): boolean => {
    if (!user) return false;
    // Free courses (revit-basics) are accessible to all logged-in users
    if (courseId === 'revit-basics') return true;
    return user.purchasedCourses.includes(courseId);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    if (!user) return;

    const updatedProgress = { ...user.progress };
    if (!updatedProgress[courseId]) {
      updatedProgress[courseId] = { completedLessons: [], lastAccessed: new Date() };
    }
    
    if (!updatedProgress[courseId].completedLessons.includes(lessonId)) {
      updatedProgress[courseId].completedLessons.push(lessonId);
    }
    updatedProgress[courseId].lastAccessed = new Date();

    const updatedUser = { ...user, progress: updatedProgress };
    setUser(updatedUser);
    localStorage.setItem('revit-user', JSON.stringify(updatedUser));
  };

  const getCourseProgress = (courseId: string): number => {
    if (!user || !user.progress[courseId]) return 0;
    
    // This would need course data to calculate properly
    const completedCount = user.progress[courseId].completedLessons.length;
    // Mock total for demo
    return Math.min(100, (completedCount / 10) * 100);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        hasAccessToCourse,
        markLessonComplete,
        getCourseProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
