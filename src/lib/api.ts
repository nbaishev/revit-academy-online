import {
  ApiCourse,
  ProgressEntry,
  User,
  Purchase,
  AuthTokens,
  AdminCourseCompletionsResponse,
  EntranceQuizStartResponse,
  EntranceQuizStatus,
  EntranceQuizClaimResponse,
  EntranceQuizSubmitResponse,
  FreeCourseBenefitClaimResponse,
  FreeCourseBenefitStatus,
} from './types';
import { clearTokens, loadTokens as loadStoredTokens, saveTokens } from './token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

type RequestOptions = RequestInit & { auth?: boolean };
type AdminCoursePayload = {
  id?: string;
  title: string;
  description: string;
  full_description?: string;
  is_free: boolean;
  published?: boolean;
  level: string;
  price?: number | null;
  discount_price?: number | null;
  preview_image?: File | string | null;
  background_video_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  is_featured?: boolean;
};

let tokens: AuthTokens | null = loadStoredTokens();
let isRefreshing = false;

const getHeaders = (auth?: boolean, includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
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
  const isFormData = options.body instanceof FormData;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(options.auth, !isFormData),
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

const hasCourseFile = (payload: Partial<AdminCoursePayload>) =>
  payload.preview_image instanceof File;

const toCourseFormData = (payload: Partial<AdminCoursePayload>) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value === null) {
      formData.append(key, '');
      return;
    }
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
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
  async viewLesson(courseId: string, lessonId: string) {
    return request<ProgressEntry>('/me/progress/view/', {
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
    if (params.is_featured !== undefined) query.set('is_featured', params.is_featured ? 'True' : 'False');
    query.set('page_size', '100');
    const res = await request<{ results?: ApiCourse[]; count?: number; next?: string; previous?: string }>(
      `/courses/${query.toString() ? `?${query.toString()}` : ''}`,
      { auth: true }
    );
    return res.results ?? (res as unknown as ApiCourse[]);
  },
  async getCourse(id: string) {
    return request<ApiCourse>(`/courses/${id}/`, { auth: true });
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
  async getEntranceQuizStatus() {
    return request<EntranceQuizStatus>('/entrance-test/', { auth: true });
  },
  async startEntranceQuiz() {
    return request<EntranceQuizStartResponse>('/entrance-test/', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ action: 'start' }),
    });
  },
  async submitEntranceQuiz(
    attemptId: string,
    answers: { question_id: number; option_id: number }[]
  ) {
    return request<EntranceQuizSubmitResponse>('/entrance-test/', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ action: 'submit', attempt_id: attemptId, answers }),
    });
  },
  async claimEntranceQuizCourse(targetCourseId: string) {
    return request<EntranceQuizClaimResponse>('/entrance-test/', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ action: 'claim', target_course_id: targetCourseId }),
    });
  },
  async getFreeCourseBenefitStatus(sourceCourseId: string) {
    return request<FreeCourseBenefitStatus>(
      `/free-course-benefits/courses/${sourceCourseId}/status/`,
      { auth: true }
    );
  },
  async claimFreeCourseBenefit(sourceCourseId: string, targetCourseId: string) {
    return request<FreeCourseBenefitClaimResponse>(
      `/free-course-benefits/courses/${sourceCourseId}/claim/`,
      {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ target_course_id: targetCourseId }),
      }
    );
  },
  async adminListCourses() {
    const res = await request<{ results?: ApiCourse[]; count?: number; next?: string; previous?: string }>(
      '/moderator/courses/',
      { auth: true }
    );
    return res.results ?? (res as unknown as ApiCourse[]);
  },
  async adminCreateCourse(payload: AdminCoursePayload) {
    const body = hasCourseFile(payload) ? toCourseFormData(payload) : JSON.stringify(payload);
    return request<ApiCourse>('/moderator/courses/', {
      method: 'POST',
      auth: true,
      body,
    });
  },
  async adminUpdateCourse(id: string, payload: Partial<AdminCoursePayload>) {
    const body = hasCourseFile(payload) ? toCourseFormData(payload) : JSON.stringify(payload);
    return request<ApiCourse>(`/moderator/courses/${id}/`, {
      method: 'PATCH',
      auth: true,
      body,
    });
  },
  async adminDeleteCourse(id: string) {
    return request<void>(`/moderator/courses/${id}/`, { method: 'DELETE', auth: true });
  },
  async adminCreateModule(courseId: string, payload: { title: string; order?: number }) {
    return request<import('./types').ApiModule>(`/moderator/courses/${courseId}/modules/`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },
  async adminCreateLesson(
    courseId: string,
    payload: {
      module_id: number;
      title: string;
      video_url: string;
      order?: number;
      duration?: string;
      additional_materials?: string | null;
    }
  ) {
    return request<import('./types').ApiLesson>(`/moderator/courses/${courseId}/lessons/`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    });
  },
  async adminUpdateLesson(
    courseId: string,
    lessonId: string,
    payload: { additional_materials: string | null }
  ) {
    return request<import('./types').ApiLesson>(`/moderator/courses/${courseId}/lessons/${lessonId}/`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify(payload),
    });
  },
  async adminStats() {
    return request<import('./types').AdminStats>('/moderator/stats/', { auth: true });
  },
  async adminCourseCompletions(courseId: string, completedOnly = true) {
    const query = new URLSearchParams({
      course_id: courseId,
      completed_only: completedOnly ? 'true' : 'false',
    });
    return request<AdminCourseCompletionsResponse>(
      `/moderator/course-completions/?${query.toString()}`,
      { auth: true }
    );
  },
};
