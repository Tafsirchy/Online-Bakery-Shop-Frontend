'use client';

import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function HomeSweetBakery() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800" 
              alt="Our Baker" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Accent Dot */}
          <div className="absolute top-1/2 -right-4 w-4 h-4 bg-sage rounded-full" />
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-10 relative"
        >
          {/* Yellow Blur Decor */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-caramel/20 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-16 h-16 bg-caramel rounded-full shadow-2xl opacity-80" />

          <div className="space-y-6">
            <h2 className="text-5xl font-serif text-brown leading-tight">
              Home Sweet <br /> Bakery
            </h2>
            <p className="text-muted leading-relaxed text-lg max-w-md">
              Every loaf we bake is a piece of our heart. We use age-old techniques 
              and organic grains to ensure you bring home more than just bread—you bring home a tradition.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-brown uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-sage rounded-full" />
              Opening Hours :
            </h3>
            <div className="space-y-3 text-brown/70 font-medium max-w-xs">
              <div className="flex justify-between border-b border-brown/5 pb-2">
                <span>Monday - Friday</span>
                <span className="text-caramel font-bold">08:00 - 18:00</span>
              </div>
              <div className="flex justify-between border-b border-brown/5 pb-2">
                <span>Saturday - Sunday</span>
                <span className="text-caramel font-bold">10:00 - 16:00</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {[FaFacebook, FaTwitter, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="w-12 h-12 rounded-full bg-brown text-white flex items-center justify-center hover:bg-caramel transition-colors shadow-soft">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
