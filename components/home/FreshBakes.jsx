'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FreshBakes() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 relative"
        >
          {/* Decor */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-caramel/20 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-12 h-12 bg-caramel rounded-full blur-xl opacity-60" />
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">
              Freshly Baked Bread <br /> <span className="text-caramel">Every Morning</span>
            </h2>
            <div className="w-4 h-4 bg-caramel rounded-full ml-auto mr-20 opacity-80" />
            <p className="text-muted leading-relaxed text-lg max-w-md">
              Our ovens never sleep. Every dawn, our bakers hand-knead the finest organic 
              flour to bring you that irresistible aroma of fresh bread that defines 
              a perfect morning. 
            </p>
            <p className="text-muted leading-relaxed text-sm max-w-md italic">
              From crusty baguettes to hearty whole-grain loaves, we bake with passion 
              so you can eat with joy.
            </p>
          </div>

          <Link href="/shop" className="inline-block">
            <Button className="px-10 py-7 rounded-full bg-caramel hover:bg-brown text-white text-lg font-bold shadow-soft transition-all">
              Visit Us
            </Button>
          </Link>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1000" 
              alt="Freshly Baked Bread" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          {/* Subtle Burlap texture overlay feel can be simulated with a shadow or border */}
          <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-caramel/10 rounded-[3rem] -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
