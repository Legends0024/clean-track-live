// Core Types for Smart Toilet Management System

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'cleaner' | 'supervisor' | 'nhai';
  avatar?: string;
  blockId?: string;
  lastActive?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  blockId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completedAt?: string;
  imageUrl?: string;
  inspectionScore?: number;
  inspectionLabel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface HygieneScore {
  blockId: string;
  score: number;
  timestamp: string;
  sensors: {
    cleanliness: number;
    odor: number;
    usage: number;
    maintenance: number;
  };
}

export interface Alert {
  id: string;
  type: 'maintenance' | 'cleanliness' | 'usage' | 'emergency';
  blockId: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  assignedTo?: string;
}

export interface Block {
  id: string;
  name: string;
  location: string;
  currentScore: number;
  status: 'operational' | 'maintenance' | 'offline';
  lastCleaned: string;
  nextScheduled: string;
  totalUsage: number;
  alerts: Alert[];
}

export interface ChartData {
  name: string;
  value: number;
  timestamp?: string;
  [key: string]: any;
}

export interface SocketEvents {
  hygiene_tick: HygieneScore;
  alert_created: Alert;
  task_updated: {
    taskId: string;
    status: Task['status'];
    completedBy?: string;
    completedAt?: string;
  };
  block_status_changed: {
    blockId: string;
    status: Block['status'];
    timestamp: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}

export interface ImageUploadResponse {
  url: string;
  filename: string;
  size: number;
}

export interface InspectionResult {
  score: number;
  label: string;
  recommendations: string[];
  confidence: number;
}

export interface ReportData {
  period: 'day' | 'week' | 'month';
  totalCleanings: number;
  averageScore: number;
  alertsGenerated: number;
  completionRate: number;
  blocks: Block[];
  trends: ChartData[];
}