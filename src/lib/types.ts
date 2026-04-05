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

export type CourseDeliveryMode = 'online' | 'offline';

export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  is_free: boolean;
  published: boolean;
  level: string;
  price?: number | null;
  discount_price?: number | null;
  current_price?: number | null;
  preview_image?: string | null;
  background_video_url?: string | null;
  delivery_mode: CourseDeliveryMode;
  mentor_telegram_username?: string | null;
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

export interface PublicStats {
  total_users: number;
}

export interface ModeratorUserSummary {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  date_joined: string;
}

export interface AdminStats {
  total_users: number;
  total_courses: number;
  total_purchases: number;
  most_popular_courses: { id: string; title: string; enrollments: number }[];
}

export interface AdminCourseCompletionEntry {
  user_id: string;
  name: string;
  email: string;
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
  is_completed: boolean;
  last_completed_at?: string | null;
}

export interface AdminCourseCompletionsResponse {
  course: {
    id: string;
    title: string;
    total_lessons: number;
  };
  completed_only: boolean;
  total_users: number;
  completed_users: number;
  results: AdminCourseCompletionEntry[];
}

export interface ModeratorCourseAccessGrantResponse {
  created: boolean;
  purchase: Purchase;
  user: ModeratorUserSummary;
  course: ApiCourse;
}

export interface EntranceQuizQuestionOption {
  id: number;
  text: string;
  order: number;
}

export interface EntranceQuizQuestion {
  id: number;
  text: string;
  options: EntranceQuizQuestionOption[];
}

export interface EntranceQuizStatus {
  can_start: boolean;
  attempts_used: number;
  attempts_left: number;
  max_attempts: number;
  pass_score: number;
  has_passed: boolean;
  can_claim: boolean;
  already_claimed: boolean;
  claimed_target_course?: {
    id: string;
    title: string;
  } | null;
}

export interface EntranceQuizStartResponse {
  attempt_id: string;
  attempt_no: number;
  questions: EntranceQuizQuestion[];
}

export interface EntranceQuizReward {
  percent_off: number;
  expires_at: string;
  is_active: boolean;
}

export interface EntranceQuizSubmitResponse {
  action?: 'submit';
  passed: boolean;
  score_percent: number;
  correct_count: number;
  total_questions: number;
  attempts_left: number;
}

export interface EntranceQuizClaimResponse {
  action?: 'claim';
  claim_id: string;
  target_course: {
    id: string;
    title: string;
  };
  reward: {
    id: string;
    percent_off: number;
    expires_at: string;
    is_active: boolean;
  };
}

export interface FreeCourseBenefitStatus {
  is_configured: boolean;
  is_active: boolean;
  percent_off?: number | null;
  completion_percent: number;
  completed_lessons: number;
  total_lessons: number;
  is_completed: boolean;
  already_claimed: boolean;
  can_claim: boolean;
  claimed_target_course?: {
    id: string;
    title: string;
  } | null;
  reward_expires_at?: string | null;
}

export interface FreeCourseBenefitClaimResponse {
  claim_id: string;
  source_course_id: string;
  target_course: {
    id: string;
    title: string;
  };
  percent_off: number;
  reward: {
    id: string;
    percent_off: number;
    expires_at: string;
    is_active: boolean;
  };
}
