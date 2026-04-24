'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-serif text-brown">Customers Testimonial</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-[#FFF8F0] p-10 rounded-[2.5rem] shadow-soft border border-brown/5 flex flex-col items-center text-center space-y-6 relative group hover:shadow-warm transition-shadow"
          >
            <div className="absolute top-6 left-6 text-caramel/20">
              <Quote className="w-12 h-12 fill-current" />
            </div>
            
            <p className="text-muted leading-relaxed italic relative z-10">
              "{review.text}"
            </p>

            <div className="flex gap-1 text-caramel">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>

            <div className="pt-4 space-y-3">
              <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden mx-auto">
                <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-brown">{review.name}</h4>
                <p className="text-xs text-muted uppercase tracking-widest">{review.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
