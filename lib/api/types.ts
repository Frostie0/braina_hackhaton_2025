/**
 * Types TypeScript pour les API
 */

// Types de base
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  xp: number;
  level: number;
  league?: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  updated_at: string;
  user_id: string;
  mastery_percentage?: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizSubmission {
  quiz_id: string;
  answers: Record<string, string | string[]>;
  time_taken: number;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_points: number;
  percentage: number;
  answers: QuizAnswer[];
  time_taken: number;
  completed_at: string;
}

export interface QuizAnswer {
  question_id: string;
  user_answer: string | string[];
  correct_answer: string | string[];
  is_correct: boolean;
  points_earned: number;
}

// Flashcard Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deck_id: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  next_review?: string;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description?: string;
  flashcards: Flashcard[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Generation Types
export interface GenerateFromTextRequest {
  text: string;
  type: 'quiz' | 'flashcards' | 'summary';
  num_questions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GenerateFromFileRequest {
  file: File;
  type: 'quiz' | 'flashcards' | 'summary';
  num_questions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Upload Types
export interface Upload {
  id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  url: string;
  user_id: string;
  created_at: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  xp: number;
  quizzes_completed: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

// Stats Types
export interface DashboardStats {
  total_quizzes: number;
  quizzes_completed: number;
  average_score: number;
  total_study_time: number;
  xp: number;
  level: number;
  streak_days: number;
  flashcards_studied: number;
}

// Folder Types
export interface Folder {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  items: FolderItem[];
  created_at: string;
  updated_at: string;
}

export interface FolderItem {
  id: string;
  type: 'quiz' | 'flashcard_deck';
  item_id: string;
  added_at: string;
}

// Settings Types
export interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications_enabled: boolean;
  email_notifications: boolean;
  study_reminders: boolean;
  privacy_level: 'public' | 'friends' | 'private';
}
