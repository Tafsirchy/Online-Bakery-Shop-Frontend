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
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-caramel font-bold tracking-widest uppercase text-sm">Delivery Area</span>
          <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">
            We deliver<br /><span className="mx-2 text-caramel">Freshness</span> to your<br />
            Doorstep
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            We currently deliver within a 15km radius of our main kitchen.
            Check the map to see if you are within our cozy delivery zone!
          </p>
          <div className="pt-4 flex gap-8">
            <div>
              <p className="text-2xl font-serif text-brown">30-45</p>
              <p className="text-sm text-muted">Minutes Delivery</p>
            </div>
            <div className="w-px h-12 bg-border-light" />
            <div>
              <p className="text-2xl font-serif text-brown">15km</p>
              <p className="text-sm text-muted">Delivery Radius</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="h-[400px] w-full rounded-3xl overflow-hidden shadow-warm border-8 border-cream-highlight relative z-0"
        >
          <MapComponent />

          {/* Map Overlay Blur (Visual Detail) */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
