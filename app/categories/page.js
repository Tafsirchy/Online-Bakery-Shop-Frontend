'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageWrapper from '@/components/shared/PageWrapper';
import { ArrowRight, Cake, Croissant, Cookie, Wheat, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { 
    name: 'Cakes', 
    desc: 'From celebration masterpieces to daily tea-time delights, our cakes are baked with the finest organic cocoa and Madagascan vanilla.',
    icon: Cake,
    count: '12 Items',
    color: 'bg-[#F9EBD7]',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'
  },
  { 
    name: 'Pastries', 
    desc: 'Hundreds of flaky layers, pure French butter, and the crunch of a perfect bake. Our pastries are a morning tradition.',
    icon: Croissant,
    count: '18 Items',
    color: 'bg-[#E3E8D5]',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'
  },
  { 
    name: 'Cookies', 
    desc: 'Crispy edges, gooey centers, and a hint of sea salt. Made in small batches to ensure the perfect texture every time.',
    icon: Cookie,
    count: '10 Items',
    color: 'bg-[#F2E5D7]',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800'
  },
  { 
    name: 'Bread', 
    desc: 'The soul of our bakery. Naturally leavened sourdoughs and rustic loaves with a thick, caramelized crust.',
    icon: Wheat,
    count: '8 Items',
    color: 'bg-[#EBDBCF]',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'
  }
];

export default function CategoriesPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif text-brown">Our Collections</h1>
          <p className="text-sm md:text-lg text-muted leading-relaxed">
            Every category represents a labor of love. Explore our artisanal range 
            of treats, each crafted with a commitment to quality and tradition.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${cat.color} rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center border border-brown/5 shadow-soft group cursor-default`}
            >
              <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-warm relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-brown/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 md:p-3 bg-white/50 rounded-xl md:rounded-2xl">
                    <cat.icon className="w-6 h-6 md:w-8 md:h-8 text-brown" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted">{cat.count}</span>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-2xl md:text-3xl font-serif text-brown">{cat.name}</h2>
                  <p className="text-muted text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">{cat.desc}</p>
                </div>

                <Link href={`/shop?category=${cat.name}`} className="block pt-2 md:pt-4">
                  <Button className="w-full py-6 rounded-xl md:rounded-2xl bg-brown hover:bg-caramel text-white font-bold group border-none">
                    Browse {cat.name}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </PageWrapper>
  );
}
