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
      {/* Image container */}
      <div className="aspect-[4/3] bg-surface-caramel/20 relative overflow-hidden shrink-0">
        <Link href={`/product/${product._id}`} className="w-full h-full block">
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brown/40 font-serif text-sm md:text-xl italic">
              Freshly Baked
            </div>
          )}
        </Link>
        
        {/* Offer badge */}
        {product.discountPrice > 0 && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-sage text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black shadow-lg tracking-widest uppercase pointer-events-none z-10">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% Off
          </div>
        )}

        {/* Wishlist button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 md:top-3 md:right-3 w-10 h-10 md:w-8 md:h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brown hover:text-red-500 transition-all shadow-md z-10"
        >
          <Heart 
            className={`w-4 h-4 md:w-3.5 md:h-3.5 transition-colors ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </button>
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-grow space-y-1.5 md:space-y-2">
        {/* Title and rating */}
        <div className="flex justify-between items-start gap-1">
          <div className="min-w-0">
            <p className="text-[9px] md:text-[10px] text-muted font-bold uppercase tracking-[0.15em] mb-0.5 truncate">{product.category}</p>
            <Link href={`/product/${product._id}`}>
              <h3 className="text-xs md:text-sm font-serif text-brown font-bold leading-tight line-clamp-1 hover:text-caramel transition-colors cursor-pointer">{product.name}</h3>
            </Link>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1 text-[9px] md:text-[10px] text-muted bg-white px-1.5 py-0.5 rounded-lg shrink-0 border border-border-light/50">
            <Star className="w-2.5 h-2.5 fill-caramel text-caramel" />
            <span className="font-bold">{product.averageRating || 0}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-sm md:text-base font-bold text-brown">৳{product.discountPrice}</span>
                <span className="text-[10px] text-muted line-through opacity-50">৳{product.price}</span>
              </>
            ) : (
              <span className="text-sm md:text-base font-bold text-brown">৳{product.price}</span>
            )}
          </div>
          {/* Stock info */}
          <div className="hidden md:block text-[9px] font-bold text-brown/50 mt-1">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 md:gap-2 pt-1 md:pt-2 mt-auto">
          <Button 
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex-grow bg-brown hover:bg-caramel text-white rounded-xl h-10 md:h-9 font-bold text-[10px] md:text-xs transition-all border-none disabled:opacity-50"
          >
            {product.stock > 0 ? 'Buy Now' : 'Sold Out'}
          </Button>
          <Button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            size="icon" 
            className="rounded-xl bg-sage hover:bg-brown text-white h-10 w-10 md:h-9 md:w-9 shrink-0 transition-all shadow-sm border-none disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
