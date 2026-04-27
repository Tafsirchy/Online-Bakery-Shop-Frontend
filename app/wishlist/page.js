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
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm"
          >
            <Heart className="w-8 h-8 fill-red-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif text-brown mb-4 tracking-tight">Your Wishlist</h1>
          <p className="text-muted max-w-lg text-lg">
            Save your favorite artisanal baked goods here and easily add them to your cart when you're ready.
          </p>
          {!user && (
            <p className="mt-4 text-sm text-caramel font-medium bg-caramel/5 px-4 py-2 rounded-full">
              Sign in to sync your wishlist across all your devices!
            </p>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white max-w-xl mx-auto rounded-3xl p-10 text-center shadow-soft border border-border-light">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-brown mb-4">Your wishlist is empty</h2>
            <p className="text-muted mb-8">Looks like you haven't added any sweet treats to your wishlist yet.</p>
            <Button onClick={() => router.push('/shop')} className="bg-sage hover:bg-brown text-white rounded-xl h-12 px-8">
              Explore Shop
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
