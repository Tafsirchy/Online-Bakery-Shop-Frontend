'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FALLBACK_FEATURED_PRODUCTS = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Classic Sourdough',
    price: 180,
    category: 'Bread',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'],
    averageRating: 4.8,
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Velvet Chocolate Cake',
    price: 2800,
    discountPrice: 2200,
    category: 'Cakes',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'],
    averageRating: 4.9,
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Almond Croissant',
    price: 150,
    category: 'Pastries',
    images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'],
    averageRating: 4.7,
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d4',
    name: 'Blueberry Muffin',
    price: 120,
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
          <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">Best Sellers</h2>
          <p className="text-muted">Most loved treats by our community</p>
        </div>
        <Link href="/shop" className="text-caramel font-bold hover:underline">See Menu</Link>
      </div>

      {/* 
        Same grid layout used for BOTH states.
        ProductCardSkeleton mirrors ProductCard's exact DOM, aspect ratios,
        and spacing → zero layout shift (CLS ≈ 0) when content swaps in.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading
          ? [1, 2, 3, 4].map((n) => <ProductCardSkeleton key={n} />)
          : products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </section>
  );
}

const FALLBACK_FEATURED_PRODUCTS = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d1', // Valid-looking ObjectId
    name: 'Classic Sourdough',
    price: 180,
    category: 'Bread',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'],
    averageRating: 4.8,
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Velvet Chocolate Cake',
    price: 2800,
    discountPrice: 2200,
    category: 'Cakes',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'],
    averageRating: 4.9,
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Almond Croissant',
    price: 150,
    category: 'Pastries',
    images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'],
    averageRating: 4.7,
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d4',
    name: 'Blueberry Muffin',
    price: 120,
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
          <h2 className="text-5xl md:text-6xl font-serif text-brown leading-tight">Best Sellers</h2>
          <p className="text-muted">Most loved treats by our community</p>
        </div>
        <Link href="/shop" className="text-caramel font-bold hover:underline">See Menu</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-cream-highlight/50 rounded-2xl border border-border-light/50 overflow-hidden flex flex-col h-full animate-pulse shadow-sm">
              <div className="aspect-[4/3] bg-caramel/5 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-caramel/20 animate-spin" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-2 flex-grow">
                    <div className="h-2 bg-caramel/10 rounded-full w-1/3" />
                    <div className="h-4 bg-caramel/10 rounded-full w-3/4" />
                  </div>
                  <div className="w-8 h-4 bg-caramel/5 rounded-lg" />
                </div>
                <div className="h-5 bg-caramel/10 rounded-full w-1/4" />
                <div className="flex gap-2 pt-2">
                  <div className="h-10 bg-caramel/10 rounded-xl flex-grow" />
                  <div className="h-10 w-10 bg-caramel/10 rounded-xl" />
                </div>
              </div>
            </div>
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
