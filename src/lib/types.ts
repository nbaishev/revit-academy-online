export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
  date_joined: string;
}

export interface ApiLesson {
  id: string;
  title: string;
  order: number;
  duration?: string;
  video_url?: string;
  additional_materials?: string | null;
}

export interface ApiModule {
  id: string;
  title: string;
  order: number;
  lessons: ApiLesson[];
}

export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  is_free: boolean;
  level: string;
  price?: number | null;
  discount_price?: number | null;
  preview_image?: string | null;
  background_video_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  is_featured?: boolean;
  lessons_count?: number;
  modules_count?: number;
  modules?: ApiModule[];
  created_at?: string;
  updated_at?: string;
}

export interface Purchase {
  id: string;
  payment_id?: string;
  payment_url?: string;
  course: ApiCourse;
  amount?: number;
  status: 'pending' | 'paid' | 'cancelled';
  transaction_id?: string;
  created_at: string;
}

export interface ProgressEntry {
  id: string;
  course_id: string;
  lesson: ApiLesson;
  is_completed: boolean;
  completed_at?: string;
  last_viewed_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AdminStats {
  total_users: number;
  total_courses: number;
  total_purchases: number;
  most_popular_courses: { id: string; title: string; enrollments: number }[];
}
