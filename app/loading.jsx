'use client';

import { motion } from 'framer-motion';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream">
      {/* Artisanal Loader Logo */}
      <div className="relative mb-8">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-24 h-24 rounded-full border-4 border-dashed border-caramel/30 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-caramel/10 flex items-center justify-center">
            <span className="text-caramel font-serif text-2xl font-black">B</span>
          </div>
        </motion.div>
        
        {/* Floating crumbs/sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className="absolute w-1.5 h-1.5 bg-caramel/40 rounded-full"
            style={{ 
              top: `${50 + Math.sin(i * 60 * Math.PI/180) * 60}%`,
              left: `${50 + Math.cos(i * 60 * Math.PI/180) * 60}%`
            }}
          />
        ))}
      </div>

      <div className="space-y-3 text-center">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-serif text-brown font-bold tracking-tight"
        >
          Kneading the Dough...
        </motion.h2>
        <div className="w-48 h-1 bg-brown/5 rounded-full overflow-hidden relative mx-auto">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-caramel w-1/2 rounded-full"
          />
        </div>
        <p className="text-[10px] uppercase font-bold text-muted tracking-[0.2em]">
          Bringing you fresh artisanal bakes
        </p>
      </div>
    </div>
  );
}
