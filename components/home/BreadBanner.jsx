'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Image from 'next/image';

export default function BreadBanner() {
  return (
    <section className="relative h-[50vh] md:h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden my-12 md:py-24 rounded-[2rem] md:rounded-none mx-4 md:mx-0 shadow-2xl md:shadow-none">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2"
          alt="Multiple Tastes"
          fill
          className="object-cover scale-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl space-y-6 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-serif leading-tight text-white drop-shadow-lg">
            One Bread, <br /> <span className="text-caramel">Multiple Taste</span>
          </h2>
          <p className="text-sm md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto font-medium">
            From sweet honey to rich chocolate and tangy jams—our artisanal loaves
            are the perfect canvas for your every craving. Discover the endless
            possibilities of a single slice.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 items-center"
        >
          <Button className="w-full sm:w-auto px-10 py-7 rounded-full bg-white text-brown hover:bg-caramel hover:text-white text-base md:text-lg font-bold shadow-2xl transition-all border-none">
            Get Our Jams
          </Button>
          <button 
            aria-label="Play our story video"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-caramel text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl group"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current group-hover:animate-pulse" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
