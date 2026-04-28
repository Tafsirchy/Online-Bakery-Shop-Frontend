'use client';

import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function HomeSweetBakery() {
  return (
    <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group max-w-md mx-auto lg:max-w-none"
        >
          <div className="aspect-square md:aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800" 
              alt="Our Baker" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Accent Dot - Safe for mobile */}
          <div className="absolute top-1/2 right-0 lg:-right-4 w-4 h-4 bg-sage rounded-full hidden sm:block" />
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8 md:space-y-10 relative text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          {/* Yellow Blur Decor */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-caramel/20 rounded-full blur-3xl opacity-50 lg:opacity-100" />
          <div className="absolute top-10 right-10 w-12 h-12 md:w-16 md:h-16 bg-caramel rounded-full shadow-2xl opacity-60 lg:opacity-80 hidden sm:block" />

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif text-brown leading-tight">
              Home Sweet <br /> Bakery
            </h2>
            <p className="text-muted leading-relaxed text-base md:text-lg max-w-md">
              Every loaf we bake is a piece of our heart. We use age-old techniques 
              and organic grains to ensure you bring home more than just bread—you bring home a tradition.
            </p>
          </div>

          <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
            <h3 className="text-sm md:text-lg font-bold text-brown uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-sage rounded-full" />
              Opening Hours :
            </h3>
            <div className="space-y-3 text-brown/70 font-medium w-full max-w-xs">
              <div className="flex justify-between border-b border-brown/5 pb-2">
                <span className="text-sm md:text-base">Monday - Friday</span>
                <span className="text-caramel font-bold text-sm md:text-base">08:00 - 18:00</span>
              </div>
              <div className="flex justify-between border-b border-brown/5 pb-2">
                <span className="text-sm md:text-base">Saturday - Sunday</span>
                <span className="text-caramel font-bold text-sm md:text-base">10:00 - 16:00</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2 md:pt-4">
            {[FaFacebook, FaTwitter, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-brown text-white flex items-center justify-center hover:bg-caramel transition-colors shadow-soft">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
