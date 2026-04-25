'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('-createdAt');

  const categories = ['all', 'Cakes', 'Pastries', 'Cookies', 'Bread', 'Offers'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?sort=${sortBy}&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}`;
      if (category !== 'all') url += `&category=${category}`;
      if (search) url += `&search=${search}`;
      
      const response = await axios.get(url);
      setProducts(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce search/filters
    return () => clearTimeout(timer);
  }, [search, category, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-xl font-serif text-brown mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </h3>
            
            <div className="space-y-6 bg-cream-highlight p-6 rounded-2xl border border-border-light shadow-soft">
              {/* Category */}
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted">Category</Label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div 
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat 
                          ? 'bg-sage text-white shadow-sm' 
                          : 'hover:bg-background text-muted'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted">Price Range</Label>
                  <span className="text-sm text-brown font-medium">৳{priceRange[1]}</span>
                </div>
                <Slider 
                  value={priceRange} 
                  max={5000} 
                  step={10} 
                  onValueChange={setPriceRange}
                  className="[&>span:first-child]:bg-sage"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1 space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-cream-highlight p-4 rounded-2xl border border-border-light shadow-soft">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input 
                placeholder="Search treats..." 
                className="pl-10 rounded-xl border-border-light focus-visible:ring-sage"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Label className="hidden sm:block text-sm text-muted whitespace-nowrap">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl border-border-light">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-cream-highlight border-border-light rounded-xl">
                  <SelectItem value="-createdAt">Newest Arrival</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="-price">Price: High to Low</SelectItem>
                  <SelectItem value="-averageRating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-cream-highlight rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-cream-highlight rounded-2xl border border-dashed border-border-light">
              <h3 className="text-2xl font-serif text-brown mb-2">No treats found</h3>
              <p className="text-muted">Try adjusting your filters or search term.</p>
              <Button 
                variant="link" 
                className="text-caramel mt-4"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                  setPriceRange([0, 2000]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
