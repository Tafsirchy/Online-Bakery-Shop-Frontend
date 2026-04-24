'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FALLBACK_FEATURED_PRODUCTS = [
  {
    _id: 'fallback-1',
    name: 'Classic Sourdough',
    price: 8.5,
    category: 'Bread',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'],
    averageRating: 4.8,
  },
  {
    _id: 'fallback-2',
    name: 'Velvet Chocolate Cake',
    price: 35,
    discountPrice: 28,
    category: 'Cakes',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'],
    averageRating: 4.9,
  },
  {
    _id: 'fallback-3',
    name: 'Almond Croissant',
    price: 4.75,
    category: 'Pastries',
    images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'],
    averageRating: 4.7,
  },
  {
    _id: 'fallback-4',
    name: 'Blueberry Muffin',
    price: 3.5,
    category: 'Pastries',
    images: ['https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800'],
    averageRating: 4.6,
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get('/products?limit=4&sort=-averageRating');
        const fetchedProducts = Array.isArray(response.data?.data) ? response.data.data : [];
        setProducts(fetchedProducts.length ? fetchedProducts : FALLBACK_FEATURED_PRODUCTS);
      } catch (err) {
        console.error(err);
        setProducts(FALLBACK_FEATURED_PRODUCTS);
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
