'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Minus, 
  Plus, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Textarea } from '@/components/ui/textarea';
import { 
  Trash2, 
  MessageSquare, 
  Leaf, 
  Flame, 
  Sparkles,
  User,
  Quote,
  Edit
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const fetchData = async () => {
    try {
      const [prodRes, revRes] = await Promise.all([
        axios.get(`/products/${id}`),
        axios.get(`/products/${id}/reviews`)
      ]);
      setProduct(prodRes.data.data);
      setReviews(revRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Product not found');
      router.push('/shop');
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, router]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to leave a review');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await axios.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      // Refresh reviews and product (for new avg rating)
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editFormData, setEditFormData] = useState({ rating: 5, comment: '' });

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditFormData({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/reviews/${editingReviewId}`, editFormData);
      toast.success('Review updated');
      setEditingReviewId(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete review');
    }
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
    <div className="min-h-screen bg-background pb-20">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
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
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 snap-start w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-brown leading-tight mb-4">{product.name}</h1>
                
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

              <details className="group">
                <summary className="text-muted leading-relaxed text-base md:text-lg max-w-xl cursor-pointer list-none flex items-start justify-between lg:block lg:cursor-auto lg:pointer-events-none">
                  <span className="line-clamp-2 lg:line-clamp-none group-open:line-clamp-none transition-all">{product.description}</span>
                  <span className="lg:hidden text-caramel text-xs font-bold tracking-widest uppercase ml-4 mt-1 shrink-0 whitespace-nowrap group-open:hidden">Read More</span>
                </summary>
              </details>

              {/* Quantity Selector - Desktop only, Mobile handled in sticky bar */}
              <div className="hidden lg:block space-y-4 pt-6">
                <label className="text-sm font-bold text-brown uppercase tracking-widest">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-cream-highlight rounded-2xl p-1 shadow-sm border border-border-light">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="rounded-xl h-11 w-11 hover:bg-white"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-brown">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="rounded-xl h-11 w-11 hover:bg-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions - Desktop only */}
              <div className="hidden lg:flex gap-4 pt-8">
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

              {/* Features - Horizontal on Mobile */}
              <div className="grid grid-cols-3 gap-2 md:gap-6 pt-8 md:pt-12 border-t border-border-light mt-auto">
                <div className="flex flex-col items-center text-center space-y-1 md:space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
                    <Truck className="w-5 h-5 md:w-6 h-6" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-brown leading-tight">Fast Delivery</span>
                  <span className="hidden md:block text-[10px] text-muted">Within 2-3 hours</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1 md:space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-caramel/10 text-caramel flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 md:w-6 h-6" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-brown leading-tight">Freshly Baked</span>
                  <span className="hidden md:block text-[10px] text-muted">100% Organic</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1 md:space-y-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brown/10 text-brown flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 md:w-6 h-6" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-brown leading-tight">Easy Returns</span>
                  <span className="hidden md:block text-[10px] text-muted">No questions asked</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Sections (Accordions on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16 md:mb-24">
          {/* Ingredients */}
          <details className="bg-cream-highlight/50 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-border-light shadow-soft group">
            <summary className="flex items-center justify-between cursor-pointer list-none md:pointer-events-none md:mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-caramel/10 text-caramel flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 md:w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-serif text-brown">Cooking Ingredients</h2>
              </div>
              <Plus className="w-5 h-5 text-brown/50 group-open:rotate-45 transition-transform md:hidden" />
            </summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-0">
              {product.ingredients?.length > 0 ? (
                product.ingredients.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 p-3 md:p-4 rounded-xl md:rounded-2xl border border-border-light shadow-xs group/item hover:bg-white transition-all">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-caramel/40 group-hover/item:scale-125 transition-transform" />
                    <span className="text-xs md:text-sm font-medium text-brown/80">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted italic text-xs md:text-sm">Ingredients list coming soon...</p>
              )}
            </div>
          </details>

          {/* Health Benefits */}
          <details className="bg-sage/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-sage/10 shadow-soft group">
            <summary className="flex items-center justify-between cursor-pointer list-none md:pointer-events-none md:mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-sage/10 text-sage flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 md:w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-serif text-brown">Health Benefits</h2>
              </div>
              <Plus className="w-5 h-5 text-brown/50 group-open:rotate-45 transition-transform md:hidden" />
            </summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-0">
              {product.healthBenefits?.length > 0 ? (
                product.healthBenefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 p-3 md:p-4 rounded-xl md:rounded-2xl border border-sage/10 shadow-xs group/item hover:bg-white transition-all">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-sage/60" />
                    <span className="text-xs md:text-sm font-medium text-brown/80">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted italic text-xs md:text-sm">Health benefits coming soon...</p>
              )}
            </div>
          </details>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brown/10 text-brown flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-serif text-brown">Customer Reviews</h2>
            </div>
            <Badge variant="secondary" className="bg-brown/5 text-brown border-brown/10 px-3 py-1 rounded-full font-bold text-xs">
              {reviews.length} Feedbacks
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-3">
              {reviewsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(n => <div key={n} className="h-24 bg-cream-highlight rounded-2xl animate-pulse" />)}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={review._id}
                      className="bg-white rounded-2xl p-4 border border-border-light shadow-soft relative"
                    >
                      {editingReviewId === review._id ? (
                        <form onSubmit={handleUpdateReview} className="space-y-3">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setEditFormData({ ...editFormData, rating: s })}
                                className="transition-transform active:scale-90"
                              >
                                <Star className={`w-5 h-5 ${s <= editFormData.rating ? 'fill-caramel text-caramel' : 'text-gray-200'}`} />
                              </button>
                            ))}
                          </div>
                          <Textarea
                            className="bg-cream-highlight border-border-light rounded-xl h-20 text-sm"
                            value={editFormData.comment}
                            onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                            required
                          />
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" className="bg-sage text-white rounded-lg text-xs h-8">Save</Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingReviewId(null)} className="rounded-lg text-xs h-8">Cancel</Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-cream-highlight flex items-center justify-center border border-border-light shrink-0">
                                <User className="w-4 h-4 text-brown/40" />
                              </div>
                              <div>
                                <h4 className="font-bold text-brown text-sm leading-tight">{review.userId?.name}</h4>
                                <div className="flex gap-0.5 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-caramel text-caramel' : 'text-gray-200'}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted font-medium bg-background px-2 py-0.5 rounded-full border border-border-light">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                              {user?._id === review.userId?._id && (
                                <button
                                  onClick={() => handleEditClick(review)}
                                  className="p-1.5 rounded-lg text-sage hover:bg-sage/10 transition-all"
                                  title="Edit review"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {(user?._id === review.userId?._id || user?.role === 'admin') && (
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                  title="Delete review"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-muted text-sm leading-relaxed italic pl-[46px]">&#8220;{review.comment}&#8221;</p>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-cream-highlight/30 rounded-2xl border border-dashed border-border-light">
                  <p className="text-muted font-serif italic">Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-brown text-white rounded-2xl p-6 shadow-xl sticky top-24">
                <h3 className="text-lg font-serif mb-4">Write a Review</h3>

                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Your Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="transition-transform active:scale-90"
                          >
                            <Star className={`w-7 h-7 ${s <= rating ? 'fill-caramel text-caramel' : 'text-white/20'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Share your thoughts</label>
                      <Textarea
                        placeholder="What did you love about this treat?"
                        className="bg-white/10 border-white/20 rounded-xl h-24 text-sm focus:bg-white focus:text-brown transition-all placeholder:text-white/30"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full h-11 rounded-xl bg-caramel hover:bg-white hover:text-brown text-white font-bold transition-all shadow-lg gap-2 text-sm"
                    >
                      {submittingReview ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Post Review
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4 py-4 border border-white/10 rounded-xl bg-white/5">
                    <p className="text-xs opacity-80 px-3 leading-relaxed">
                      Please sign in to share your thoughts and rate our treats.
                    </p>
                    <Link href="/login" className="block px-4">
                      <Button className="w-full rounded-xl bg-white text-brown hover:bg-caramel hover:text-white transition-all font-bold text-sm">
                        Login Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-border-light shadow-[0_-10px_40px_rgba(74,55,40,0.1)] z-[100] lg:hidden flex flex-col gap-3 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Total Price</span>
             <span className="text-xl font-bold text-sage">৳{currentPrice * quantity}</span>
          </div>
          
          <div className="flex items-center bg-cream-highlight rounded-xl p-1 shadow-inner border border-border-light">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="rounded-lg h-8 w-8 hover:bg-white"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-bold text-brown text-sm">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setQuantity(prev => prev + 1)}
              className="rounded-lg h-8 w-8 hover:bg-white"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleToggleWishlist}
            className={`w-12 h-12 rounded-xl border-border-light shadow-sm shrink-0 ${
              isInWishlist(product._id) ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-red-500' : ''}`} />
          </Button>
          <Button 
            onClick={handleAddToCart}
            className="flex-1 h-12 rounded-xl bg-sage hover:bg-brown text-white font-bold text-base shadow-lg active:scale-95 transition-all gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
