'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
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
    toggleWishlist(product);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-cream-highlight rounded-2xl shadow-soft border border-border-light overflow-hidden group flex flex-col h-full"
    >
      {/* Image Container */}
      {/* Image Container */}
      <div className="aspect-[4/3] bg-surface-caramel/20 relative overflow-hidden shrink-0">
        <Link href={`/product/${product._id}`} className="w-full h-full block">
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
        </Link>
        
        {/* Offer Badge */}
        {product.discountPrice > 0 && (
          <div className="absolute top-3 left-3 bg-sage text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm tracking-widest uppercase pointer-events-none">
            Offer
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brown hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-colors ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </button>
      </div>

      <div className="p-3.5 flex flex-col flex-grow space-y-2">
        {/* Title & Rating */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-[8px] text-muted font-bold uppercase tracking-[0.2em] mb-0.5 truncate">{product.category}</p>
            <Link href={`/product/${product._id}`}>
              <h3 className="text-sm font-serif text-brown leading-tight line-clamp-1 hover:text-caramel transition-colors cursor-pointer">{product.name}</h3>
            </Link>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted bg-white/50 px-1.5 py-0.5 rounded-lg shrink-0">
            <Star className="w-2.5 h-2.5 fill-caramel text-caramel" />
            <span className="font-medium">{product.averageRating || 0}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5">
          {product.discountPrice > 0 ? (
            <>
              <span className="text-base font-bold text-brown">৳{product.discountPrice}</span>
              <span className="text-[10px] text-muted line-through opacity-50">৳{product.price}</span>
            </>
          ) : (
            <span className="text-base font-bold text-brown">৳{product.price}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-0.5 mt-auto">
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
