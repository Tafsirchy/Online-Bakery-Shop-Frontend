'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-cream-highlight rounded-2xl shadow-soft border border-border-light overflow-hidden group"
    >
      {/* Image Placeholder/Image */}
      <div className="aspect-square bg-surface-caramel/20 relative overflow-hidden">
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
          <div className="absolute top-4 left-4 bg-sage text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            OFFER
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="text-xl font-serif text-brown">{product.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted">
            <Star className="w-4 h-4 fill-caramel text-caramel" />
            <span>{product.averageRating || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-xl font-bold text-brown">${product.discountPrice}</span>
                <span className="text-sm text-muted line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-brown">${product.price}</span>
            )}
          </div>
          
          <Button 
            onClick={() => addToCart(product)}
            size="icon" 
            className="rounded-xl bg-sage hover:bg-brown-hover transition-all duration-300 shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
