'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

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
    <section className="relative py-12 md:py-32 overflow-hidden bg-[#fffdfa]">
      {/* Organic Background Textures */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl text-center lg:text-left items-center lg:items-start flex flex-col"
          >
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-caramel" />
              <p className="text-caramel font-bold tracking-[0.2em] uppercase text-[10px]">Voices of the Table</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-brown leading-[1.1]">
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
            <p className="text-muted text-sm ">4.9/5 Average Rating from 500+ regular patrons</p>
          </motion.div>
        </div>

        {/* Creative Staggered Grid / Mobile Carousel */}
        <div className="flex md:grid md:grid-cols-3 gap-6 lg:gap-12 items-start overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 scrollbar-hide md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              viewport={{ once: true }}
              className={`relative min-w-[300px] md:min-w-0 snap-center rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 group transition-all duration-500 border border-brown/5 ${i === 1 ? 'md:translate-y-12 bg-white shadow-warm border-caramel/5' : 'bg-cream-highlight/50 md:hover:bg-white md:hover:shadow-soft'}`}
            >
              {/* Floating Quote Icon - Visible on mobile for tactile feedback */}
              <div className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-caramel opacity-40 md:opacity-0 md:scale-0 md:group-hover:scale-100 md:group-hover:opacity-100 transition-all duration-300">
                <Quote className="h-4 w-4 md:h-5 md:w-5 fill-current" />
              </div>

              <div className="space-y-6 relative z-10">
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

                <div className="relative">
                  <p className="text-base md:text-lg font-serif  text-brown/90 leading-relaxed line-clamp-4 md:line-clamp-none">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className="pt-6 flex items-center gap-4 border-t border-brown/5">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white shadow-md overflow-hidden ring-1 ring-brown/5 relative">
                      <Image src={review.img} alt={review.name} fill className="object-cover" sizes="60px" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${review.accent} rounded-full flex items-center justify-center text-brown border-2 border-white shadow-sm`}>
                      <Sparkles className="h-2.5 w-2.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-brown leading-tight">{review.name}</h4>
                    <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-medium mt-1">{review.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 text-center"
        >
          <div className="inline-flex flex-col items-center gap-3 md:gap-4 px-6 md:px-8 py-4 bg-white rounded-full shadow-soft border border-brown/5">
            <p className="text-muted text-[10px] md:text-xs tracking-widest uppercase font-bold">Trusted by 1k+ local bread lovers</p>
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="inline-block h-7 w-7 md:h-8 md:w-8 rounded-full ring-2 ring-white relative overflow-hidden"
                >
                  <Image
                    src={`https://i.pravatar.cc/100?img=${i + 20}`}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ))}
              <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-caramel text-[9px] md:text-[10px] font-bold text-white ring-2 ring-white">
                +1k
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-caramel/5 rounded-full blur-[100px] -z-10 opacity-50 md:opacity-100" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-sage/5 rounded-full blur-[100px] -z-10 opacity-50 md:opacity-100" />
    </section>
  );
}
