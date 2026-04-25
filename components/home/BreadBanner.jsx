'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function BreadBanner() {
  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden my-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=1600"
          alt="Multiple Tastes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cream-highlight/0 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-5xl md:text-6xl font-serif leading-tight text-white">One Bread, <br /> Multiple Taste</h2>
          <p className="text-lg text-white leading-relaxed max-w-2xl mx-auto">
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
          className="flex flex-wrap justify-center gap-6 items-center"
        >
          <Button className="px-10 py-7 rounded-full bg-cream text-brown hover:bg-white text-lg font-bold shadow-xl transition-all">
            Get Our Jams
          </Button>
          <button className="w-16 h-16 rounded-full bg-caramel text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
            <Play className="w-6 h-6 fill-current" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
