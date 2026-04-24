'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { name: 'Cakes', desc: 'Divine layers of sweetness', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', color: 'bg-[#F9EBD7]' },
  { name: 'Pastries', desc: 'Flaky, buttery goodness', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', color: 'bg-[#E3E8D5]' },
  { name: 'Cookies', desc: 'Crispy edges, soft hearts', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800', color: 'bg-[#F2E5D7]' },
  { name: 'Bread', desc: 'The soul of our bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', color: 'bg-[#EBDBCF]' },
];

export default function Categories() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-serif text-brown">Browse by Category</h2>
            <p className="text-muted">Find your favorite treat from our curated collections</p>
          </div>
          <Link href="/shop" className="text-caramel font-bold hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop?category=${cat.name}`}>
                <div className={`${cat.color} rounded-3xl p-8 h-80 flex flex-col justify-end group cursor-pointer overflow-hidden relative shadow-soft border border-border-light/20`}>
                  {/* Background Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent group-hover:from-background/60 transition-colors duration-500 pointer-events-none" />

                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-serif text-brown mb-1 group-hover:text-brown drop-shadow-sm">{cat.name}</h3>
                    <p className="text-sm text-muted mb-4 group-hover:text-brown/80 drop-shadow-sm">{cat.desc}</p>
                    <div className="w-10 h-1 bg-brown group-hover:w-20 transition-all duration-500" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
