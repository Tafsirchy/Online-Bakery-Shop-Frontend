import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/lib/axios';
import { useAuthStore } from './useAuthStore';
import { toast } from 'react-toastify';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      fetchWishlist: async () => {
        const { user, token } = useAuthStore.getState();
        if (!user || !token) return; // Must be logged in

        try {
          const res = await axios.get('/auth/wishlist');
          set({ wishlist: res.data.data });
        } catch (err) {
          // Token invalid or expired
          console.error('Failed to fetch wishlist', err);
        }
      },

      toggleWishlist: async (product) => {
        const productId = typeof product === 'string' ? product : product._id;
        const { user, token } = useAuthStore.getState();

        if (user && token) {
          try {
            const res = await axios.post(`/auth/wishlist/${productId}`);
            set({ wishlist: res.data.data });

            const isAdded = res.data.data.some(p => (p._id === productId || p === productId));
            if (isAdded) {
              toast.success('Added to wishlist', { icon: '❤️' });
            } else {
              toast.info('Removed from wishlist');
            }
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update wishlist');
          }
        } else {
          // Guest logic
          const { wishlist } = get();
          const isAdded = wishlist.some(p => (p._id === productId || p === productId));

          if (isAdded) {
            const updatedWishlist = wishlist.filter(p => (p._id !== productId && p !== productId));
            set({ wishlist: updatedWishlist });
            toast.info('Removed from wishlist');
          } else {
            // Store the full product if available, otherwise just ID
            const itemToAdd = typeof product === 'object' ? product : productId;
            set({ wishlist: [...wishlist, itemToAdd] });
            toast.success('Added to wishlist', { icon: '❤️' });
          }
        }
      },

      isInWishlist: (productId) => {
        const { wishlist } = get();
        return wishlist.some(p => p._id === productId || p === productId);
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'bakery-wishlist',
      version: 1,
      migrate: (persistedState) => persistedState,
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      },
    }
  )
);
