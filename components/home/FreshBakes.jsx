'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, Sunrise, Flame } from 'lucide-react';

const morningRoutine = [
  { time: "03:00 AM", stage: "Hand Kneading", icon: Sunrise, desc: "Sourcing organic grains and kneading by hand." },
  { time: "05:00 AM", stage: "Natural Proofing", icon: Clock, desc: "Resting in stone bowls for maximum flavor." },
  { time: "07:00 AM", stage: "Golden Crust", icon: Flame, desc: "Fresh from the oven, ready for your table." }
];

export default function FreshBakes() {
  return (
    <section className="py-16 md:py-32 bg-[#FFFBF2] overflow-hidden relative">
      {/* Morning Mist Decor */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-caramel/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sage/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Visual Timeline Storytelling */}
          <div className="space-y-12 order-last lg:order-first">
            <div className="space-y-4 text-center lg:text-left">
              <span className="text-caramel font-black uppercase tracking-[0.4em] text-[10px]">The Baker's Routine</span>
              <h2 className="text-4xl md:text-7xl font-serif text-brown leading-[1.1]">
                Baked while <br /> <span className="italic text-caramel">you sleep.</span>
              </h2>
            </div>

            <div className="space-y-8">
              {morningRoutine.map((step, i) => (
                <motion.div
                  key={step.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-center group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-px h-8 bg-brown/10" />
                    <div className="w-12 h-12 rounded-full border border-brown/10 flex items-center justify-center text-brown bg-white shadow-soft group-hover:bg-caramel group-hover:text-white transition-all duration-500">
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-grow pt-8">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[10px] font-black text-caramel/60">{step.time}</span>
                      <h3 className="text-xl font-serif text-brown font-bold">{step.stage}</h3>
                    </div>
                    <p className="text-sm text-muted max-w-xs mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 text-center lg:text-left">
              <Link href="/shop" className="inline-block w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-12 py-8 rounded-full bg-brown hover:bg-caramel text-white text-lg font-bold shadow-2xl transition-all group active:scale-95 border-none">
                  Visit the Bakery
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Immersive Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Sunrise Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
            
            <div className="aspect-[3/4] lg:aspect-[4/5] rounded-[3rem] lg:rounded-[4rem] overflow-hidden border-[12px] border-white shadow-warm relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80" 
                alt="Artisanal Bread" 
                className="w-full h-full object-cover"
              />
              {/* Glass Info Card */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl">
                <p className="text-brown font-serif italic text-lg leading-tight">
                  "The irresistible aroma of dawn, captured in every loaf."
                </p>
              </div>
            </div>
            
            {/* Background Shape */}
            <div className="absolute -bottom-10 -left-10 w-full h-full bg-sage/5 rounded-[4rem] -z-10 rotate-3" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
