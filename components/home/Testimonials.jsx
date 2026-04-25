'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';

const reviews = [
  {
    name: "Eric Stanley",
    role: "Food Critic",
    text: "The sourdough here is life-changing. Crispy crust, airy middle, and just the right amount of tang. I visit every single weekend!",
    img: "https://i.pravatar.cc/150?u=eric"
  },
  {
    name: "Joe Walsh",
    role: "Local Business Owner",
    text: "Perfect for our morning meetings. The pastries are flaky and consistently delicious. Best bakery in the city, hands down.",
    img: "https://i.pravatar.cc/150?u=joe"
  },
  {
    name: "Andrew Mong",
    role: "Nutritionist",
    text: "I love that they use organic grains and slow fermentation. It's rare to find a bakery that cares this much about health and flavor.",
    img: "https://i.pravatar.cc/150?u=andrew"
  }
];

export default function Testimonials() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-12 h-80 w-80 -translate-x-1/2 rounded-full bg-caramel/12 blur-3xl" />
        <div className="absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-sage/14 blur-3xl" />
        <div className="absolute -right-10 top-1/3 h-64 w-64 rounded-full bg-brown/8 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14 space-y-5"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-cream-highlight/80 px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase text-brown/80">
            <Sparkles className="h-3.5 w-3.5 text-caramel" />
            Freshly Shared Stories
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-tight text-brown">
            Customer
            <span className="mx-2 text-caramel">Love Notes</span>
            From Our Oven
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted leading-relaxed">
            Every loaf and pastry carries a little joy. Here is what our regulars say
            about the taste, warmth, and moments we bake into every order.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-9">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.45 }}
              viewport={{ once: true }}
              className="relative rounded-[2rem] border border-brown/10 bg-gradient-to-br from-[#fffaf2] via-[#fff3de] to-[#fdf2df] p-8 sm:p-9 shadow-soft group"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(212,163,115,0.18),transparent_45%)] opacity-70" />
              <div className="absolute right-5 top-5 text-caramel/25">
                <Quote className="h-10 w-10 fill-current" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex gap-1.5 text-caramel">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-[15px] text-brown/85 leading-relaxed italic flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden shrink-0">
                    <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-brown leading-none">{review.name}</h4>
                    <p className="mt-1 text-[11px] text-muted uppercase tracking-[0.16em]">{review.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
