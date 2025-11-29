/**
 * Centralisation de tous les endpoints API
 * Facilite la maintenance et la modification des URLs
 */

export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Utilisateurs
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/profile/avatar',
  },

  // Quiz
  QUIZ: {
    LIST: '/quiz',
    GET: (id: string) => `/quiz/${id}`,
    CREATE: '/quiz',
    UPDATE: (id: string) => `/quiz/${id}`,
    DELETE: (id: string) => `/quiz/${id}`,
    START: (id: string) => `/quiz/${id}/start`,
    SUBMIT: (id: string) => `/quiz/${id}/submit`,
    RESULTS: (id: string) => `/quiz/${id}/results`,
    MY_QUIZ: '/quiz/my-quiz',
    RECENT: '/quiz/recent',
  },

  // Flashcards
  FLASHCARDS: {
    LIST: '/flashcards',
    GET: (id: string) => `/flashcards/${id}`,
    CREATE: '/flashcards',
    UPDATE: (id: string) => `/flashcards/${id}`,
    DELETE: (id: string) => `/flashcards/${id}`,
    MY_FLASHCARDS: '/flashcards/my-flashcards',
    STUDY: (id: string) => `/flashcards/${id}/study`,
  },

  // Génération de contenu (AI)
  GENERATE: {
    FROM_TEXT: '/generate/from-text',
    FROM_PDF: '/generate/from-pdf',
    FROM_AUDIO: '/generate/from-audio',
    FROM_URL: '/generate/from-url',
    CHAT_TO_PDF: '/generate/chat-to-pdf',
  },

  // Uploads
  UPLOADS: {
    DOCUMENT: '/uploads/document',
    AUDIO: '/uploads/audio',
    IMAGE: '/uploads/image',
    MY_UPLOADS: '/uploads/my-uploads',
    DELETE: (id: string) => `/uploads/${id}`,
  },

  // Leaderboards
  LEADERBOARDS: {
    GLOBAL: '/leaderboards/global',
    FRIENDS: '/leaderboards/friends',
    LEAGUE: (leagueId: string) => `/leaderboards/league/${leagueId}`,
  },

  // Achievements
  ACHIEVEMENTS: {
    LIST: '/achievements',
    MY_ACHIEVEMENTS: '/achievements/my-achievements',
    UNLOCK: (id: string) => `/achievements/${id}/unlock`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // Statistiques
  STATS: {
    DASHBOARD: '/stats/dashboard',
    QUIZ_STATS: '/stats/quiz',
    STUDY_TIME: '/stats/study-time',
    PROGRESS: '/stats/progress',
  },

  // Folders
  FOLDERS: {
    LIST: '/folders',
    GET: (id: string) => `/folders/${id}`,
    CREATE: '/folders',
    UPDATE: (id: string) => `/folders/${id}`,
    DELETE: (id: string) => `/folders/${id}`,
    ADD_ITEM: (id: string) => `/folders/${id}/items`,
    REMOVE_ITEM: (folderId: string, itemId: string) => `/folders/${folderId}/items/${itemId}`,
  },

  // Paramètres
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    LANGUAGE: '/settings/language',
    NOTIFICATIONS: '/settings/notifications',
    PRIVACY: '/settings/privacy',
  },
} as const;

export default API_ENDPOINTS;
