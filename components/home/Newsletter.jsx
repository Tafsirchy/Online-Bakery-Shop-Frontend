'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Utensils } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-12 md:py-32 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="relative">
        {/* Background elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-8 -left-8 w-20 h-20 bg-sage/10 rounded-full blur-2xl pointer-events-none" 
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -bottom-8 -right-8 w-24 h-24 bg-caramel/10 rounded-full blur-2xl pointer-events-none" 
        />

        <div className="bg-cream-highlight rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-warm flex flex-col lg:flex-row border border-brown/5">
          {/* Left: Background image */}
          <div className="lg:w-1/2 relative min-h-[300px] md:min-h-[400px] group overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000" 
              alt="Artisanal Bakery" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brown/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-brown/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 text-white space-y-2">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-caramel" />
                <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Join the Table</span>
              </div>
              <p className="text-xl md:text-2xl font-serif italic">Every crumb tells a story.</p>
            </div>

            {/* Stamped badge */}
            <motion.div 
              initial={{ rotate: -15 }}
              whileHover={{ rotate: 0, scale: 1.1 }}
              className="absolute top-6 md:top-10 right-6 md:right-10 w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-center p-2 shadow-xl cursor-default"
            >
              <div className="border border-white/40 rounded-full w-full h-full flex flex-col items-center justify-center">
                <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-tighter">100% <br /> Artisanal</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Newsletter form */}
          <div className="lg:w-1/2 p-8 md:p-24 flex flex-col justify-center items-center lg:items-start space-y-8 md:space-y-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-10 h-[2px] bg-caramel" />
                <span className="text-caramel font-bold text-[10px] md:text-xs uppercase tracking-widest">Our Newsletter</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-brown leading-tight">
                Bread for the <br /> 
                <span className="text-caramel">curious soul.</span>
              </h2>
              <p className="text-muted text-sm md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                Get the baker's secret techniques, early access to workshops, 
                and exclusive seasonal menus delivered to your inbox.
              </p>
            </div>

            <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <Input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-3xl bg-white border-brown/5 text-brown placeholder:text-muted/40 focus-visible:ring-caramel shadow-soft text-base md:text-lg transition-all"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity hidden md:block">
                    <Sparkles className="w-6 h-6 text-caramel/40" />
                  </div>
                </div>
                <Button className="h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl bg-brown hover:bg-caramel text-white font-bold text-lg md:text-xl shadow-warm transition-all active:scale-[0.98] border-none">
                  Start Your Journey
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                <div className="w-1.5 h-1.5 bg-sage rounded-full" />
                <p className="text-[10px] md:text-xs text-muted/60 italic font-medium">
                  We respect your inbox like we respect our dough—no fluff.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
