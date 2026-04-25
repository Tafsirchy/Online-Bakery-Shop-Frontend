import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/lib/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      hasHydrated: false,
      error: null,

      setHasHydrated: (value) => set({ hasHydrated: value }),

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

      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ user: null, isLoading: false });
          return null;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await axios.get('/auth/me');
          const currentUser = response.data.user || response.data.data || null;
          set({ user: currentUser, isLoading: false });
          return currentUser;
        } catch (err) {
          set({ user: null, token: null, isLoading: false, error: null });
          return null;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
