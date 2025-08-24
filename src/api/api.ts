import axios from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection.',
      });
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const apiClient = {
  get: <T = any>(url: string): Promise<ApiResponse<T>> =>
    api.get(url).then((response) => response.data),
    
  post: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.post(url, data).then((response) => response.data),
    
  put: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.put(url, data).then((response) => response.data),
    
  patch: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.patch(url, data).then((response) => response.data),
    
  delete: <T = any>(url: string): Promise<ApiResponse<T>> =>
    api.delete(url).then((response) => response.data),
};

export default api;