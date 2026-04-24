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
      <div className="max-w-7xl mx-auto px-6 py-20">
        <header className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif text-brown">Our Collections</h1>
          <p className="text-lg text-muted leading-relaxed">
            Every category represents a labor of love. Explore our artisanal range 
            of treats, each crafted with a commitment to quality and tradition.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${cat.color} rounded-[2.5rem] p-10 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-border-light shadow-soft group cursor-default`}
            >
              <div className="w-full md:w-1/2 aspect-square rounded-3xl overflow-hidden shadow-warm relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-brown/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="w-full md:w-1/2 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/50 rounded-2xl">
                    <cat.icon className="w-8 h-8 text-brown" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted">{cat.count}</span>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-serif text-brown">{cat.name}</h2>
                  <p className="text-muted text-sm leading-relaxed">{cat.desc}</p>
                </div>

                <Link href={`/shop?category=${cat.name}`} className="block pt-4">
                  <Button className="w-full py-6 rounded-2xl bg-brown hover:bg-caramel text-white font-bold group">
                    Browse {cat.name}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner Section */}
        <div className="mt-24 p-12 md:p-20 bg-sage rounded-[3rem] text-center text-cream relative overflow-hidden shadow-warm">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-6 h-6 fill-caramel text-caramel" />)}
            </div>
            <h3 className="text-4xl font-serif">Seasonal Specialities</h3>
            <p className="text-lg opacity-80">
              Check out our monthly limited-edition treats inspired by the seasons. 
              Available for a short time only!
            </p>
            <Link href="/shop?category=Offers" className="inline-block">
              <Button size="lg" className="px-10 py-7 rounded-2xl bg-cream text-sage hover:bg-white transition-all font-bold">
                Explore Seasonal Offers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
