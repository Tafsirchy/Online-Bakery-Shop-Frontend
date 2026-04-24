import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/lib/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/auth/register', userData);
          set({ user: response.data.user, token: response.data.token, isLoading: false });
          return response.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
          throw err;
        }
      },

      login: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/auth/login', userData);
          set({ user: response.data.user, token: response.data.token, isLoading: false });
          return response.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
