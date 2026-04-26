'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex items-center bg-cream overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] bg-caramel/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-[40rem] h-[40rem] bg-sage/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-caramel/10 border border-caramel/20 text-caramel text-xs font-bold tracking-[0.2em] uppercase">
              Est. 2026 • Artisanal & Organic
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-brown leading-[1.1]">
              Baking the World
              <span className="italic font-normal text-caramel block">a Better Place</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-lg leading-relaxed">
              Experience the magic of slow-fermented sourdough, flaky hand-laminated
              pastries, and cakes that tell a story in every bite.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
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
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-6 pt-6 border-t border-brown/5"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-cream bg-caramel/20 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">
              <span className="font-bold text-brown">1.2k+</span> happy foodies <br />
              <span className="text-caramel">★★★★★</span>
            </p>
          </motion.div>
        </div>

        {/* Right Unique Image Layout */}
        <div className="relative order-1 lg:order-2 flex items-center justify-end pr-10 min-h-[500px]">
          {/* Main Large Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-20 w-2/3 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white rotate-3"
          >
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000"
              alt="Fresh Bread"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating Secondary Image 1 - Croissant */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [-6, -4, -6]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-10 right-0 z-30 w-[45%] aspect-square rounded-[2rem] overflow-hidden shadow-xl border-8 border-white -mr-4"
          >
            <img
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600"
              alt="Pastries"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating Secondary Image 2 - Cake */}
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [12, 10, 12]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-10 right-1/4 z-30 w-1/2 aspect-video rounded-[2rem] overflow-hidden shadow-xl border-8 border-white -ml-4"
          >
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
              alt="Cake"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 -right-2 w-8 h-8 bg-caramel rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="absolute bottom-1/4 -left-2 w-12 h-12 bg-sage rounded-full blur-2xl opacity-30 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
