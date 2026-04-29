'use client';

import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { wishlist, fetchWishlist, hasHydrated } = useWishlistStore();
  const { user, hasHydrated: authHydrated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authHydrated && hasHydrated) {
      if (user) {
        fetchWishlist().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [authHydrated, hasHydrated, user, fetchWishlist]);

  if (!authHydrated || !hasHydrated || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-caramel animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-10 md:mb-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 md:w-16 md:h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm"
          >
            <Heart className="w-7 h-7 md:w-8 md:h-8 fill-red-500" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-serif text-brown mb-3 md:mb-4 tracking-tight">Your Wishlist</h1>
          <p className="text-muted max-w-lg text-base md:text-lg">
            Save your favorite artisanal baked goods here and easily add them to your cart when you're ready.
          </p>
          {!user && (
            <p className="mt-4 text-[10px] md:text-sm text-caramel font-bold uppercase tracking-widest bg-caramel/5 px-4 py-2 rounded-full border border-caramel/10">
              Sign in to sync your favorites
            </p>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white max-w-xl mx-auto rounded-[2rem] p-8 md:p-10 text-center shadow-soft border border-brown/5">
            <Heart className="w-12 h-12 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl md:text-2xl font-serif text-brown mb-3">Your wishlist is empty</h2>
            <p className="text-muted text-sm md:text-base mb-8">Looks like you haven't added any sweet treats to your wishlist yet.</p>
            <Button onClick={() => router.push('/shop')} className="bg-sage hover:bg-brown text-white rounded-xl h-12 px-8 border-none">
              Explore Shop
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Button variant="ghost" onClick={() => router.push('/shop')} className="text-muted hover:text-brown rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
