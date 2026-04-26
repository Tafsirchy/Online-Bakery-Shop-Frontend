import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      fetchWishlist: async () => {
        try {
          const res = await axios.get('/auth/wishlist');
          set({ wishlist: res.data.data });
        } catch (err) {
          console.error('Failed to fetch wishlist', err);
          if (err.response?.status === 401) {
            set({ wishlist: [] });
          }
        }
      },

      toggleWishlist: async (productId) => {
        try {
          const res = await axios.post(`/auth/wishlist/${productId}`);
          set({ wishlist: res.data.data });
          
          // Check if added or removed
          const isAdded = res.data.data.some(p => (p._id === productId || p === productId));
          if (isAdded) {
            toast.success('Added to wishlist', { icon: '❤️' });
          } else {
            toast.info('Removed from wishlist');
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Please login to use wishlist');
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
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      },
    }
  )
);
