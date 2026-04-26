'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ChevronLeft, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Minus,
  Plus,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import axios from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Product not found');
        router.push('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-sage animate-spin" />
          <p className="text-muted font-serif italic text-lg">Preparing your treats...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs & Back */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/shop" 
            className="group flex items-center gap-2 text-muted hover:text-brown transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-cream-highlight flex items-center justify-center group-hover:bg-sage group-hover:text-white transition-all shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Shop</span>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-muted/60 font-medium">
            <Link href="/" className="hover:text-brown">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-brown">Shop</Link>
            <span>/</span>
            <span className="text-brown">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-square bg-cream-highlight rounded-[3rem] overflow-hidden border border-border-light shadow-warm relative"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  src={product.images[activeImage] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {hasDiscount && (
                <div className="absolute top-8 left-8 bg-sage text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-[0.2em] uppercase">
                  Special Offer
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
                      activeImage === idx ? 'border-sage ring-4 ring-sage/10' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="text-sage border-sage/30 bg-sage/5 rounded-lg px-3 py-1 text-xs font-bold tracking-widest uppercase mb-4">
                  {product.category}
                </Badge>
                <h1 className="text-5xl md:text-6xl font-serif text-brown leading-tight mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-brown">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= Math.round(product.averageRating) ? 'fill-caramel text-caramel' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-bold">{product.averageRating}</span>
                    <span className="text-muted text-sm">({product.numOfReviews} reviews)</span>
                  </div>
                  
                  <div className={`text-sm font-medium ${product.stock > 0 ? 'text-sage' : 'text-red-400'}`}>
                    {product.stock > 0 ? '● In Stock' : '● Out of Stock'}
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-sage">৳{currentPrice}</span>
                {hasDiscount && (
                  <span className="text-xl text-muted line-through">৳{product.price}</span>
                )}
              </div>

              <p className="text-muted leading-relaxed text-lg max-w-xl">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="space-y-4 pt-6">
                <label className="text-sm font-bold text-brown uppercase tracking-widest">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-cream-highlight rounded-2xl p-1 shadow-sm border border-border-light">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="rounded-xl h-10 w-10 hover:bg-white"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-brown">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="rounded-xl h-10 w-10 hover:bg-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-8">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-14 rounded-2xl bg-sage hover:bg-brown text-white font-bold text-lg shadow-lg transition-all active:scale-[0.98] gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 rounded-2xl border-border-light shadow-sm transition-all ${
                    isInWishlist(product._id) ? 'bg-red-50 text-red-500 border-red-100' : 'hover:bg-cream-highlight'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500' : ''}`} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border-light mt-auto">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-brown">Fast Delivery</span>
                  <span className="text-[10px] text-muted">Within 2-3 hours</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-caramel/10 text-caramel flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-brown">Freshly Baked</span>
                  <span className="text-[10px] text-muted">100% Organic</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-brown/10 text-brown flex items-center justify-center">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-brown">Easy Returns</span>
                  <span className="text-[10px] text-muted">No questions asked</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
