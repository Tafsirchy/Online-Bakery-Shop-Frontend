'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

const reviews = [
  {
    name: "Eric Stanley",
    role: "Food Critic",
    text: "The sourdough here is life-changing. Crispy crust, airy middle, and just the right amount of tang. I visit every single weekend for my morning fix!",
    img: "https://i.pravatar.cc/150?u=eric",
    accent: "bg-sage/10"
  },
  {
    name: "Joe Walsh",
    role: "Business Owner",
    text: "Perfect for our morning meetings. The pastries are flaky and consistently delicious. Best bakery in the city, hands down. Our team loves it!",
    img: "https://i.pravatar.cc/150?u=joe",
    accent: "bg-caramel/10"
  },
  {
    name: "Andrew Mong",
    role: "Nutritionist",
    text: "I love that they use organic grains and slow fermentation. It's rare to find a bakery that cares this much about both health and deep flavor.",
    img: "https://i.pravatar.cc/150?u=andrew",
    accent: "bg-brown/10"
  }
];

export default function Testimonials() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[#fffdfa]">
      {/* Organic Background Textures */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-caramel" />
              <p className="text-caramel font-bold tracking-[0.2em] uppercase text-[10px]">Voices of the Table</p>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-brown leading-[1.1]">
              Shared <span className='text-caramel'>Moments</span> <br />
              Around Our Oven
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="hidden lg:block text-right"
          >
            <div className="flex items-center justify-end gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-caramel text-caramel" />
              ))}
            </div>
            <p className="text-muted text-sm italic">4.9/5 Average Rating from 500+ regular patrons</p>
          </motion.div>
        </div>

        {/* Creative Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              viewport={{ once: true }}
              className={`relative rounded-[3rem] p-10 group ${i === 1 ? 'md:translate-y-12 bg-white shadow-warm border-2 border-caramel/5' : 'bg-cream-highlight/50 hover:bg-white hover:shadow-soft transition-all duration-500 border border-brown/5'}`}
            >
              {/* Floating Quote Icon */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-caramel scale-0 group-hover:scale-100 transition-transform duration-300">
                <Quote className="h-5 w-5 fill-current" />
              </div>

              <div className="space-y-6 relative z-10">
                {/* Rating & Verified */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-caramel">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-sage font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Regular
                  </div>
                </div>

                {/* Review Text */}
                <div className="relative">
                  <p className="text-lg font-serif italic text-brown/90 leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 flex items-center gap-4 border-t border-brown/5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-white shadow-md overflow-hidden ring-1 ring-brown/5">
                      <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${review.accent} rounded-full flex items-center justify-center text-brown border-2 border-white shadow-sm`}>
                      <Sparkles className="h-2.5 w-2.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brown leading-tight">{review.name}</h4>
                    <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-medium mt-1">{review.role}</p>
                  </div>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-caramel/5 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 px-8 py-4 bg-white rounded-full shadow-soft border border-brown/5">
            <p className="text-muted text-xs tracking-widest uppercase">Trusted by thousands of local bread lovers</p>
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src={`https://i.pravatar.cc/100?img=${i + 20}`}
                  alt=""
                />
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-caramel text-[10px] font-bold text-white ring-2 ring-white">
                +1k
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-caramel/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-sage/5 rounded-full blur-[100px] -z-10" />
    </section>
  );
}
