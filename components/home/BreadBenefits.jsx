'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Zap, Leaf, DollarSign, Utensils } from 'lucide-react';
import Image from 'next/image';

const allBenefits = [
  {
    title: "Endless Choice",
    desc: "From sourdough to rye, our variety caters to every palate.",
    icon: Sparkles,
    color: "bg-sage/20 text-sage",
    tag: "Variety"
  },
  {
    title: "Stone-Oven Taste",
    desc: "Nothing beats the aroma of bread fresh from our stone oven.",
    icon: Utensils,
    color: "bg-caramel/20 text-caramel",
    tag: "Freshness"
  },
  {
    title: "Gut Health+",
    desc: "Long fermentation helps in maintaining healthy gut flora.",
    icon: Zap,
    color: "bg-brown/20 text-brown",
    tag: "Probiotic"
  },
  {
    title: "Sustained Energy",
    desc: "Complex carbs provide energy throughout your busy day.",
    icon: Heart,
    color: "bg-red-100 text-red-500",
    tag: "Fuel"
  },
  {
    title: "Natural Nutrients",
    desc: "Naturally enriched with essential nutrients for wellness.",
    icon: Leaf,
    color: "bg-green-100 text-green-600",
    tag: "Wellness"
  },
  {
    title: "Daily Savings",
    desc: "Nutritious, filling, and affordable staple for every home.",
    icon: DollarSign,
    color: "bg-amber-100 text-amber-600",
    tag: "Value"
  }
];

export default function BreadBenefits() {
  return (
    <section className="py-12 md:py-24 bg-[#FFFBF2]/30 overflow-hidden relative">
      {/* Decorative Branding Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <span className="text-[20rem] font-serif absolute -top-20 -left-20">Bread</span>
        <span className="text-[20rem] font-serif absolute -bottom-20 -right-20">Health</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center md:text-left mb-12 md:mb-20">
          <span className="text-caramel font-black uppercase tracking-[0.3em] text-[10px]">The Science of Dough</span>
          <h2 className="text-4xl md:text-6xl font-serif text-brown mt-2">Benefits Of <span className=" text-caramel">Breads</span> </h2>
        </div>

        {/* Mobile: Interactive Horizontal Stack (Peeking Cards) */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 scrollbar-hide">
          {allBenefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="min-w-[280px] snap-center bg-white rounded-[2.5rem] p-8 shadow-soft border border-brown/5 flex flex-col items-center text-center space-y-4 group"
            >
              <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform`}>
                <benefit.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-caramel opacity-60">{benefit.tag}</span>
                <h3 className="text-xl font-serif text-brown leading-tight">{benefit.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: Premium Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-12 items-center">
          <div className="space-y-12">
            {allBenefits.slice(0, 3).map((benefit, i) => (
              <div key={benefit.title} className="flex gap-6 items-start group">
                <div className={`w-14 h-14 ${benefit.color} rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-serif text-brown">{benefit.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-caramel/10 rounded-full blur-[100px] animate-pulse" />
            <div className="relative z-10 w-full max-w-[400px] aspect-square rounded-full overflow-hidden border-[12px] border-white shadow-2xl">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src="https://images.unsplash.com/photo-1695150455847-a34429ebfaca"
                  alt="Artisanal Bread"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </motion.div>
            </div>
          </div>

          <div className="space-y-12">
            {allBenefits.slice(3).map((benefit, i) => (
              <div key={benefit.title} className="flex flex-row-reverse gap-6 items-start text-right group">
                <div className={`w-14 h-14 ${benefit.color} rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-serif text-brown">{benefit.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
