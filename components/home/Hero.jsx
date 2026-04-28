'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-0 flex items-center bg-cream overflow-hidden py-8 md:py-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-caramel/10 rounded-full blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-sage/10 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Creative Geometric Image Cluster (Less Height/Width, More Impact) */}
        <div className="relative order-1 lg:order-2 flex items-center justify-center lg:justify-end lg:pr-20">
          <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">

            {/* Rotating Decorative Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-caramel/20"
            />

            {/* Main Image - Bread (Middle Circle) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[70%] aspect-square rounded-full overflow-hidden shadow-2xl border-8 border-white group"
            >
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"
                alt="Bread"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brown/10 group-hover:bg-transparent transition-colors" />
            </motion.div>

            {/* Top Right Circle - Croissant */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-0 right-0 z-30 w-[45%] aspect-square rounded-full overflow-hidden shadow-xl border-4 md:border-6 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80"
                alt="Croissant"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Bottom Right Circle - Cake */}
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-4 right-0 z-30 w-[40%] aspect-square rounded-full overflow-hidden shadow-xl border-4 md:border-6 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"
                alt="Cake"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Artisanal Badge - Rotating */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-2 left-0 z-40 w-24 h-24 bg-brown rounded-full flex items-center justify-center text-white p-2 border-4 border-cream shadow-lg"
            >
              <p className="text-[10px] font-bold uppercase tracking-tighter text-center leading-none">
                Artisanal <br /> Quality <br /> <span className="text-caramel">★★★★★</span>
              </p>
            </motion.div>

            {/* Decorative Sparkles */}
            <div className="absolute top-1/4 -left-4 w-3 h-3 bg-caramel rounded-full animate-ping" />
            <div className="absolute bottom-1/3 -right-6 w-2 h-2 bg-sage rounded-full animate-pulse" />
          </div>
        </div>

        {/* Left Content - Floating Card Approach for SM */}
        <div className="order-2 lg:order-1 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/40 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-8 lg:p-0 rounded-[2.5rem] lg:rounded-none border border-white/50 lg:border-none shadow-xl shadow-brown/5 lg:shadow-none space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="space-y-4 md:space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-caramel/10 border border-caramel/20 text-caramel text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase">
                Est. 2026 • Artisanal & Organic
              </span>
              <h1 className="text-[32px] md:text-5xl lg:text-7xl font-serif font-medium text-brown leading-[1.1] tracking-tight">
                Baking the World
                <span className="italic font-normal text-caramel block mt-1 lg:mt-0">a Better Place</span>
              </h1>
              <p className="text-sm md:text-xl text-muted/80 max-w-md leading-relaxed px-2 lg:px-0">
                Experience the magic of slow-fermented sourdough, flaky pastries, and cakes that tell a story in every bite.
              </p>
            </div>

            {/* Compact Desktop Buttons */}
            <div className="hidden lg:flex gap-4">
              <Link href="/shop">
                <Button size="lg" className="px-10 py-8 rounded-2xl bg-brown hover:bg-caramel text-white text-lg font-bold shadow-warm transition-all group">
                  Shop Fresh Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/story">
                <Button variant="outline" size="lg" className="px-10 py-8 rounded-2xl border-2 border-brown/10 text-brown text-lg font-bold hover:bg-cream-highlight transition-all">
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Mobile-Only CTA Grid */}
            <div className="grid grid-cols-2 gap-3 w-full lg:hidden">
              <Link href="/shop" className="col-span-2">
                <Button className="w-full py-7 rounded-2xl bg-brown text-white text-base font-bold shadow-soft">
                  Shop Now
                </Button>
              </Link>
              <Link href="/story">
                <Button variant="outline" className="w-full py-6 rounded-2xl border-brown/10 text-brown text-sm font-bold bg-white/50">
                  Our Story
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" className="w-full py-6 rounded-2xl border-brown/10 text-brown text-sm font-bold bg-white/50">
                  Full Menu
                </Button>
              </Link>
            </div>

            {/* Trust Indicator - Optimized for SM */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-brown/5 w-full">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-caramel/20 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] md:text-xs text-muted/70">
                <span className="font-bold text-brown">1.2k+</span> happy foodies
                <span className="mx-2 text-caramel">★</span>
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 left-6 right-6 z-[100] lg:hidden"
      >
        <Link href="/shop">
          <Button className="w-full py-7 rounded-2xl bg-brown hover:bg-caramel text-white text-lg font-bold shadow-2xl flex items-center justify-between px-8 border border-white/20">
            <span>Shop Fresh Now</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="bg-white/20 p-2 rounded-xl"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
