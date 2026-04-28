'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-cream-highlight animate-pulse flex items-center justify-center">
        <p className="text-muted font-serif">Loading Map...</p>
      </div>
    )
  }
);

export default function DeliveryMap() {
  return (
    <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          <span className="text-caramel font-bold tracking-widest uppercase text-[10px] md:text-sm">Delivery Area</span>
          <h2 className="text-3xl md:text-6xl font-serif text-brown leading-tight">
            We deliver<br className="hidden md:block" /> 
            <span className="mx-2 text-caramel">Freshness</span> to your<br className="hidden md:block" />
            Doorstep
          </h2>
          <p className="text-muted text-sm md:text-lg leading-relaxed max-w-md">
            We currently deliver within a 15km radius of our main kitchen.
            Check the map to see if you are within our cozy delivery zone!
          </p>
          <div className="pt-4 flex gap-6 md:gap-8 justify-center lg:justify-start items-center">
            <div className="text-center lg:text-left">
              <p className="text-xl md:text-2xl font-serif text-brown font-bold">30-45</p>
              <p className="text-[10px] md:text-sm text-muted uppercase tracking-widest font-bold">Minutes</p>
            </div>
            <div className="w-px h-10 md:h-12 bg-border-light" />
            <div className="text-center lg:text-left">
              <p className="text-xl md:text-2xl font-serif text-brown font-bold">15km</p>
              <p className="text-[10px] md:text-sm text-muted uppercase tracking-widest font-bold">Radius</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="h-[300px] md:h-[400px] w-full rounded-[2rem] md:rounded-3xl overflow-hidden shadow-warm border-4 md:border-8 border-cream-highlight relative z-0"
        >
          <MapComponent />

          {/* Map Overlay Guard (Visual Detail) */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[2rem] md:rounded-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
