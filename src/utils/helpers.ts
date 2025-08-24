import { HYGIENE_THRESHOLDS, UPLOAD_CONFIG } from './constants';

// Date and Time Utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// String Utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Number Utilities
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Hygiene Score Utilities
export const getHygieneStatus = (score: number): {
  status: string;
  color: string;
  bgColor: string;
} => {
  if (score >= HYGIENE_THRESHOLDS.EXCELLENT) {
    return {
      status: 'Excellent',
      color: 'text-accent-success',
      bgColor: 'bg-accent-success/10',
    };
  } else if (score >= HYGIENE_THRESHOLDS.GOOD) {
    return {
      status: 'Good',
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/10',
    };
  } else if (score >= HYGIENE_THRESHOLDS.FAIR) {
    return {
      status: 'Fair',
      color: 'text-accent-warning',
      bgColor: 'bg-accent-warning/10',
    };
  } else {
    return {
      status: 'Poor',
      color: 'text-accent-danger',
      bgColor: 'bg-accent-danger/10',
    };
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= HYGIENE_THRESHOLDS.EXCELLENT) return '#22c55e';
  if (score >= HYGIENE_THRESHOLDS.GOOD) return '#3b82f6';
  if (score >= HYGIENE_THRESHOLDS.FAIR) return '#f59e0b';
  return '#ef4444';
};

// Task Priority Utilities
export const getPriorityColor = (priority: string): {
  color: string;
  bgColor: string;
} => {
  switch (priority.toLowerCase()) {
    case 'high':
      return {
        color: 'text-accent-danger',
        bgColor: 'bg-accent-danger/10',
      };
    case 'medium':
      return {
        color: 'text-accent-warning',
        bgColor: 'bg-accent-warning/10',
      };
    case 'low':
    default:
      return {
        color: 'text-accent-success',
        bgColor: 'bg-accent-success/10',
      };
  }
};

export const getStatusColor = (status: string): {
  color: string;
  bgColor: string;
} => {
  switch (status.toLowerCase()) {
    case 'completed':
      return {
        color: 'text-accent-success',
        bgColor: 'bg-accent-success/10',
      };
    case 'in-progress':
      return {
        color: 'text-accent-secondary',
        bgColor: 'bg-accent-secondary/10',
      };
    case 'pending':
    default:
      return {
        color: 'text-accent-warning',
        bgColor: 'bg-accent-warning/10',
      };
  }
};

// File Validation
export const validateFile = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)}`,
    };
  }

  // Check file type
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type as "image/jpeg" | "image/png" | "image/webp")) {
    return {
      isValid: false,
      error: 'File type not supported. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  return { isValid: true };
};

// Array Utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// URL Utilities
export const buildUrl = (base: string, params: Record<string, any>): string => {
  const url = new URL(base, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
};

// Local Storage Utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

// Debounce Utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle Utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Generate Random ID
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Color Utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};