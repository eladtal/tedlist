import { useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const response = await axios.get('/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAuthState({
          user: response.data.user,
          token,
          loading: false,
          error: null
        });
      } catch (error) {
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          token: null,
          loading: false,
          error: 'Session expired'
        });
      }
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthState({ user, token, loading: false, error: null });
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Invalid credentials',
        loading: false
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      loading: false,
      error: null
    });
  };

  return {
    user: authState.user,
    token: authState.token,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    isAuthenticated: !!authState.token
  };
}; 