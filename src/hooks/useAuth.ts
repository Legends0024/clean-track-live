import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { loginUser, registerUser, logoutUser, fetchCurrentUser, clearError } from '../features/auth/authSlice';
import { LoginCredentials, RegisterCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Initialize auth on mount
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(registerUser(credentials)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local auth state even if logout fails
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const refreshUser = async () => {
    try {
      await dispatch(fetchCurrentUser()).unwrap();
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearAuthError,
    refreshUser,
  };
};