'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const added = addToCart(product);
    if (!added) {
      toast.error('This product cannot be added right now. Please refresh and try again.');
      return;
    }
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      position: "bottom-right"
    });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const added = addToCart(product);
    if (!added) {
      toast.error('This product cannot be purchased right now.');
      return;
    }
    router.push('/checkout');
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-cream-highlight rounded-2xl shadow-soft border border-border-light overflow-hidden group flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="aspect-square bg-surface-caramel/20 relative overflow-hidden shrink-0">
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brown/40 font-serif text-xl italic">
            Freshly Baked
          </div>
        )}
        
        {/* Offer Badge */}
        {product.discountPrice > 0 && (
          <div className="absolute top-4 left-4 bg-sage text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm tracking-widest">
            OFFER
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brown hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow space-y-3">
        {/* Title & Rating */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-[9px] text-muted font-bold uppercase tracking-[0.2em] mb-1 truncate">{product.category}</p>
            <h3 className="text-base font-serif text-brown leading-tight line-clamp-1">{product.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted bg-white/50 px-1.5 py-0.5 rounded-lg shrink-0">
            <Star className="w-3 h-3 fill-caramel text-caramel" />
            <span className="font-medium">{product.averageRating || 0}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          {product.discountPrice > 0 ? (
            <>
              <span className="text-lg font-bold text-brown">৳{product.discountPrice}</span>
              <span className="text-xs text-muted line-through opacity-50">৳{product.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-brown">৳{product.price}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1 mt-auto">
          <Button 
            onClick={handleBuyNow}
            className="flex-grow bg-brown hover:bg-caramel text-white rounded-lg h-9 font-bold text-xs transition-all border-none"
          >
            Buy Now
          </Button>
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="rounded-lg bg-sage hover:bg-brown text-white h-9 w-9 shrink-0 transition-all shadow-sm border-none"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
