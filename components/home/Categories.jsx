'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from '@/lib/axios';

const FALLBACK_COLORS = ['bg-[#F9EBD7]', 'bg-[#E3E8D5]', 'bg-[#F2E5D7]', 'bg-[#EBDBCF]'];
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/products')
        ]);

        const allProducts = prodRes.data.data;
        const featured = catRes.data.data
          .filter(cat => cat.isFeatured && cat.isActive)
          .slice(0, 4)
          .map(cat => ({
            ...cat,
            itemCount: allProducts.filter(p => p.category === cat.name).length
          }));

        setCategories(featured);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="py-24 bg-[#FFFBF2]/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">Our Collections</h2>
            <p className="text-muted italic opacity-75">Curated selections of our finest bakes</p>
          </div>
          <Link href="/shop" className="text-caramel font-bold hover:underline flex items-center gap-2 group transition-all">
            View All Collections
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop?category=${cat.name}`}>
                <div className={`${FALLBACK_COLORS[i % FALLBACK_COLORS.length]} rounded-3xl p-8 h-[320px] flex flex-col justify-end group cursor-pointer overflow-hidden relative shadow-soft border border-border-light/20 transition-all duration-500`}>
                  {/* Background Image - Cleaner Hover */}
                  <img
                    src={cat.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent group-hover:from-background/20 group-hover:via-transparent transition-all duration-700 pointer-events-none" />

                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-4xl font-serif text-brown group-hover:text-brown drop-shadow-sm leading-tight transition-transform duration-500 group-hover:-translate-y-1">{cat.name}</h3>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-caramel opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                        {cat.subtitle || 'Premium Selection'}
                      </p>
                    </div>
                    <div className="w-10 h-1 bg-brown group-hover:w-full transition-all duration-700 rounded-full opacity-30 group-hover:opacity-100" />
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
