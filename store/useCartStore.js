import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const isValidObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ''));

const sanitizeCartItems = (items = []) => {
  return items
    .map((item) => ({
      productId: String(item?.productId || '').trim(),
      name: item?.name || 'Bakery Item',
      price: Number(item?.price || 0),
      image: item?.image || '',
      quantity: Math.max(1, Math.floor(Number(item?.quantity || 1))),
    }))
    .filter((item) => isValidObjectId(item.productId) && Number.isFinite(item.price) && item.price > 0);
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      
      setAppliedCoupon: (code) => set({ appliedCoupon: code }),
      clearAppliedCoupon: () => set({ appliedCoupon: null }),

      addToCart: (product, quantity = 1) => {
        const productId = String(product?._id || product?.id || '').trim();
        if (!isValidObjectId(productId)) {
          return false;
        }

        const safeQuantity = Math.max(1, Math.floor(Number(quantity || 1)));
        const unitPrice = Number(product?.discountPrice > 0 ? product.discountPrice : product?.price || 0);
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
          return false;
        }

        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.productId === productId);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + safeQuantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                productId,
                name: product.name,
                price: unitPrice,
                image: product?.images?.[0] || '',
                quantity: safeQuantity,
              },
            ],
          });
        }

        return true;
      },

      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      removeInvalidItems: () => {
        set({
          items: sanitizeCartItems(get().items),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { items: [] };
        }

        return {
          ...persistedState,
          items: sanitizeCartItems(persistedState.items || []),
        };
      },
    }
  )
);
