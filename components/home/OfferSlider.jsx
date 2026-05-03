'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Sparkles, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';

const CATEGORY_FALLBACK_IMAGES = {
  'Cakes': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b',
  'Pastries': 'https://plus.unsplash.com/premium_photo-1661351637185-162e386528a8',
  'Cookies': 'https://plus.unsplash.com/premium_photo-1670895801135-858a7d167ea4',
  'Bread': 'https://plus.unsplash.com/premium_photo-1673111979369-0222c7314b82'
};

export default function OfferSlider() {
  const router = useRouter();
  const setAppliedCoupon = useCartStore((state) => state.setAppliedCoupon);
  const [combinedOffers, setCombinedOffers] = useState([]);
  const [showSlider, setShowSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponsRes, productsRes, catRes] = await Promise.all([
          axios.get('coupons/public'),
          axios.get('products'),
          axios.get('/categories')
        ]);

        const categoriesData = catRes.data.data || [];
        let list = [];

        // Product offers
        if (productsRes.data.success) {
          // Group global offers by category to show one card per category
          const globalOffersByCategory = productsRes.data.data
            .filter(p => p.discountPrice > 0 && p.isGlobalOffer)
            .reduce((acc, product) => {
              if (!acc[product.category]) {
                const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
                // Find matching category image
                const categoryInfo = categoriesData.find(c => c.name === product.category);

                acc[product.category] = {
                  title: `${discountPercent}% Off All ${product.category}!`,
                  description: `Indulge in our premium ${product.category} collection with a limited-time discount. Freshly baked just for you!`,
                  image: categoryInfo?.image || product.images?.[0] || CATEGORY_FALLBACK_IMAGES[product.category] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
                  category: product.category,
                  discount: discountPercent,
                  isGlobalOffer: true,
                  originalPrice: product.price,
                  discountedPrice: product.discountPrice,
                };
              }
              return acc;
            }, {});

          const productOffers = Object.values(globalOffersByCategory);
          list = [...list, ...productOffers];
        }

        if (couponsRes.data.success) {
          const activeCoupons = couponsRes.data.data.filter(c => c.isActive && new Date(c.expiryDate) > new Date());
          const couponOffers = activeCoupons.map(coupon => ({
            title: `Exclusive ${coupon.discount}% Discount!`,
            description: `Enjoy a sweet deal on your next order. Minimum purchase of ৳${coupon.minPurchase} required.`,
            couponCode: coupon.code,
            image: coupon.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=1000',
            isCoupon: true
          }));
          list = [...list, ...couponOffers];
        }

        setCombinedOffers(list);
        setShowSlider(list.length > 0);
      } catch (err) {
        console.error('Failed to fetch offer data', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showSlider && combinedOffers.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % combinedOffers.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [showSlider, combinedOffers]);

  if (!showSlider || !combinedOffers.length) return null;

  const handleCopy = (code) => {
    const upperCode = String(code || '').toUpperCase();
    navigator.clipboard.writeText(upperCode);
    setCopiedCode(upperCode);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const currentOffer = combinedOffers[currentIndex];

  return (
    <section className="relative bg-[#FFFBF2] overflow-hidden py-8 md:py-12">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-caramel/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-sage/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Slider container */}
        <div className="relative w-full h-[520px] md:h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col md:flex-row bg-white rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(74,55,40,0.08)] overflow-hidden border border-border-light/10 group"
            >
              {/* Image side */}
              <div className="relative w-full md:w-[35%] h-48 md:h-full overflow-hidden shrink-0 bg-cream-highlight/20 relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={currentOffer.image}
                    alt={currentOffer.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 35vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-brown/30 via-transparent to-transparent opacity-40" />

                {/* Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-caramel text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    Featured Deal
                  </div>
                </div>
              </div>

              {/* Perforated edge */}
              <div className="hidden md:flex absolute left-[35%] top-0 bottom-0 w-5 flex-col justify-around items-center z-20 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 bg-[#FFFBF2] rounded-full shadow-inner border border-border-light/5" />
                ))}
              </div>

              {/* Content side */}
              <div className="relative w-full md:w-[65%] h-full flex flex-col justify-center p-6 md:p-10 bg-gradient-to-br from-white to-cream-highlight/5">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative z-10"
                >
                  <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6 md:mb-8">
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-caramel" />
                        <span className="text-[10px] font-bold text-caramel uppercase tracking-[0.2em]">Limited Offer</span>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-serif text-brown font-black leading-tight tracking-tight">
                        {currentOffer.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted font-medium  line-clamp-2">
                        {currentOffer.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                      {currentOffer.couponCode && (
                        <div className="flex items-center bg-[#FDF8F0] p-1 rounded-xl border-2 border-dashed border-caramel/20">
                          <div className="px-4 py-2 text-brown font-mono font-black text-lg tracking-[0.1em] border-r-2 border-dashed border-caramel/10 uppercase">
                            {currentOffer.couponCode}
                          </div>
                          <button
                            onClick={() => handleCopy(currentOffer.couponCode)}
                            className="px-4 py-2 text-caramel hover:text-brown transition-all"
                            aria-label="Copy coupon code"
                          >
                            {copiedCode === currentOffer.couponCode ? (
                              <CheckCircle2 className="w-5 h-5 text-sage" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      )}

                      {currentOffer.isGlobalOffer && (
                        <div className="flex items-center bg-gradient-to-r from-caramel/10 to-sage/10 px-4 py-2 rounded-xl border border-caramel/30">
                          <span className="text-brown font-bold text-sm">
                            Save ৳{(currentOffer.originalPrice - currentOffer.discountedPrice).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={async () => {
                          try {
                            if (currentOffer.couponCode) {
                              try {
                                localStorage.setItem('appliedCoupon', currentOffer.couponCode);
                              } catch (e) { }
                              setAppliedCoupon(currentOffer.couponCode);
                              handleCopy(currentOffer.couponCode);
                            }
                          } catch (err) {
                            console.error('Failed to apply coupon locally', err);
                          } finally {
                            setTimeout(() => router.push(`/shop?category=${currentOffer.category || 'all'}`), 60);
                          }
                        }}
                        className="px-8 py-4 bg-brown text-cream rounded-xl font-black text-[11px] md:text-xs uppercase tracking-widest hover:bg-caramel hover:text-white transition-all shadow-md flex items-center justify-center gap-2 group"
                      >
                        Grab Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Status footer */}
                <div className="md:absolute md:bottom-6 md:left-10 flex items-center gap-4 md:gap-6 border-t border-border-light/30 pt-4 w-full md:w-[calc(100%-80px)]">
                  <div className="flex items-center gap-2 text-sage">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Live Offer</span>
                  </div>
                  <div className="h-3 w-px bg-border-light" />
                  <div className="flex items-center gap-2 text-muted/50">
                    <Tag className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Bakery Special</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          {combinedOffers.length > 1 && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1">
              {combinedOffers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className="group relative flex items-center justify-center w-10 h-10"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div className={`absolute w-6 h-6 rounded-full border transition-all duration-500 ${i === currentIndex ? 'border-caramel opacity-100' : 'border-transparent opacity-0'}`} />
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-brown scale-125' : 'bg-brown/20 group-hover:bg-brown/40'}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
