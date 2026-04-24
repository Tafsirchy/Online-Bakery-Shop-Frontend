'use client';

import { motion } from 'framer-motion';

const items = [
  "Artisanal Breads", "Organic Flour", "Daily Fresh", "Hand-Kneaded", 
  "Natural Leaven", "Slow Fermented", "Golden Crust", "Local Sourced",
  "Artisanal Breads", "Organic Flour", "Daily Fresh", "Hand-Kneaded"
];

export default function ScrollingMarquee() {
  return (
    <div className="bg-brown py-6 overflow-hidden whitespace-nowrap flex border-y border-caramel/20">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 20, 
          ease: "linear" 
        }}
        className="flex gap-20 items-center pr-20"
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="text-cream text-2xl font-serif tracking-widest uppercase opacity-80">{item}</span>
            <div className="w-2 h-2 bg-caramel rounded-full" />
          </div>
        ))}
      </motion.div>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 20, 
          ease: "linear" 
        }}
        className="flex gap-20 items-center pr-20"
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="text-cream text-2xl font-serif tracking-widest uppercase opacity-80">{item}</span>
            <div className="w-2 h-2 bg-caramel rounded-full" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
