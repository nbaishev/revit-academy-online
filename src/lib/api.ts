import { ApiCourse, ProgressEntry, User, Purchase, AuthTokens } from './types';
import { clearTokens, loadTokens as loadStoredTokens, saveTokens } from './token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

type RequestOptions = RequestInit & { auth?: boolean };

let tokens: AuthTokens | null = loadStoredTokens();
let isRefreshing = false;

const getHeaders = (auth?: boolean): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (auth && tokens?.access) {
    headers['Authorization'] = `Bearer ${tokens.access}`;
  }
  return headers;
};

const refreshAccessToken = async () => {
  if (!tokens?.refresh || isRefreshing) return tokens;
  isRefreshing = true;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    if (!res.ok) {
      clearTokens();
      tokens = null;
      return null;
    }
    const data = (await res.json()) as { access: string };
    tokens = { access: data.access, refresh: tokens.refresh };
    saveTokens(tokens);
    return tokens;
  } finally {
    isRefreshing = false;
  }
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(options.auth),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && options.auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, { ...options, headers: options.headers, auth: true });
    }
  }

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API ${res.status}: ${errorBody}`);
  }
  return res.json() as Promise<T>;
};

type GoogleLoginPayload = { id_token?: string; code?: string; redirect_uri?: string };

export const api = {
  setTokens(newTokens: AuthTokens) {
    tokens = newTokens;
    saveTokens(tokens);
  },
  clearAuth() {
    tokens = null;
    clearTokens();
  },
  loadTokens() {
    tokens = loadStoredTokens();
    return tokens;
  },
  async loginWithGoogle(payload: GoogleLoginPayload) {
    if (!payload.id_token && !payload.code) {
      throw new Error('Google token or code is required');
    }
    const data = await request<{ access: string; refresh: string; user: User }>(
      '/auth/login/google/',
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: getHeaders(false),
      }
    );
    tokens = { access: data.access, refresh: data.refresh };
    saveTokens(tokens);
    return data;
  },
  async getMe() {
    return request<User>('/me/', { auth: true });
  },
  async getMyCourses() {
    return request<ApiCourse[]>('/me/courses/', { auth: true });
  },
  async getProgress() {
    return request<ProgressEntry[]>('/me/progress/', { auth: true });
  },
  async completeLesson(courseId: string, lessonId: string) {
    return request<ProgressEntry>('/me/progress/complete/', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ course_id: courseId, lesson_id: lessonId }),
    });
  },
  async listCourses(params: { search?: string; level?: string; price?: string; is_featured?: boolean } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.level && params.level !== 'all') query.set('level', params.level);
    if (params.price) query.set('price', params.price);
    if (params.is_featured) query.set('is_featured', 'True');
    query.set('page_size', '100');
    const res = await request<{ results?: ApiCourse[]; count?: number; next?: string; previous?: string }>(
      `/courses/${query.toString() ? `?${query.toString()}` : ''}`
    );
    return res.results ?? (res as unknown as ApiCourse[]);
  },
  async getCourse(id: string) {
    return request<ApiCourse>(`/courses/${id}/`);
  },
  async getCourseContent(id: string) {
    return request<ApiCourse>(`/courses/${id}/content/`, { auth: true });
  },
  async purchaseCourse(courseId: string) {
    return request<Purchase>('/purchase/', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ course_id: courseId }),
    });
  },
  async adminStats() {
    return request<import('./types').AdminStats>('/admin/stats/', { auth: true });
  },
};
