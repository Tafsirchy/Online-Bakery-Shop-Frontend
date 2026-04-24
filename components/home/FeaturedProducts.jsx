'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get('/products?limit=4&sort=-averageRating');
        setProducts(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif text-brown">Best Sellers</h2>
          <p className="text-muted">Most loved treats by our community</p>
        </div>
        <Link href="/shop" className="text-caramel font-bold hover:underline">See Menu</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 bg-cream-highlight rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
