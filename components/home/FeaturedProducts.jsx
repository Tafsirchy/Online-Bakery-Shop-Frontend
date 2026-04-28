'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
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
        const response = await axios.get('/products?isFeatured=true&limit=4');
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
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 gap-4 text-center sm:text-left">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-serif text-brown leading-tight">Featured Selection</h2>
          <p className="text-muted text-sm md:text-base">Handpicked favorites from our master bakers</p>
        </div>
        <Link href="/shop" className="text-caramel font-bold hover:underline py-2">See Menu</Link>
      </div>

      {/* Same grid for both loading & loaded states — eliminates CLS */}
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
