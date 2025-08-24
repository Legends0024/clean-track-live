// Application Constants

export const APP_NAME = 'Smart Toilet Management System';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
  UPLOADS: '/uploads',
  INSPECT: '/inspect',
  REPORTS: '/reports',
} as const;

// User Roles
export const USER_ROLES = {
  CLEANER: 'cleaner',
  SUPERVISOR: 'supervisor',
  NHAI: 'nhai',
} as const;

// Task Priorities
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Task Statuses
export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

// Alert Types
export const ALERT_TYPES = {
  MAINTENANCE: 'maintenance',
  CLEANLINESS: 'cleanliness',
  USAGE: 'usage',
  EMERGENCY: 'emergency',
} as const;

// Alert Levels
export const ALERT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Block Statuses
export const BLOCK_STATUSES = {
  OPERATIONAL: 'operational',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#22c55e',
  SECONDARY: '#3b82f6',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  SUCCESS: '#10b981',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
} as const;

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  HYGIENE_TICK: 'hygiene_tick',
  ALERT_CREATED: 'alert_created',
  TASK_UPDATED: 'task_updated',
  BLOCK_STATUS_CHANGED: 'block_status_changed',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ACKNOWLEDGE_ALERT: 'acknowledge_alert',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CLEANER: {
    DASHBOARD: '/cleaner',
    TASKS: '/cleaner/tasks',
    PROFILE: '/cleaner/profile',
  },
  SUPERVISOR: {
    DASHBOARD: '/supervisor',
    MONITORING: '/supervisor/monitoring',
    TASKS: '/supervisor/tasks',
    REPORTS: '/supervisor/reports',
  },
  NHAI: {
    DASHBOARD: '/nhai',
    ANALYTICS: '/nhai/analytics',
    REPORTS: '/nhai/reports',
    OVERVIEW: '/nhai/overview',
  },
} as const;

// Dashboard Card Types
export const DASHBOARD_CARDS = {
  CLEANER: {
    PENDING_TASKS: 'pending_tasks',
    COMPLETED_TODAY: 'completed_today',
    AVERAGE_SCORE: 'average_score',
    STREAK: 'streak',
  },
  SUPERVISOR: {
    ACTIVE_BLOCKS: 'active_blocks',
    PENDING_ALERTS: 'pending_alerts',
    COMPLETION_RATE: 'completion_rate',
    AVERAGE_HYGIENE: 'average_hygiene',
  },
  NHAI: {
    TOTAL_FACILITIES: 'total_facilities',
    SYSTEM_HEALTH: 'system_health',
    MONTHLY_CLEANINGS: 'monthly_cleanings',
    EFFICIENCY_SCORE: 'efficiency_score',
  },
} as const;

// Time Intervals
export const TIME_INTERVALS = {
  REAL_TIME_UPDATE: 5000, // 5 seconds
  HEARTBEAT: 30000, // 30 seconds
  RECONNECT_DELAY: 5000, // 5 seconds
  SESSION_CHECK: 300000, // 5 minutes
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// Hygiene Score Thresholds
export const HYGIENE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 40,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Breakpoints (must match Tailwind config)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Environment
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'File upload failed. Please try again.',
  INSPECTION_ERROR: 'Image inspection failed. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  REGISTER_SUCCESS: 'Account created successfully!',
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_COMPLETED: 'Task completed successfully!',
  UPLOAD_SUCCESS: 'Image uploaded successfully!',
  INSPECTION_SUCCESS: 'Image inspection completed!',
} as const;