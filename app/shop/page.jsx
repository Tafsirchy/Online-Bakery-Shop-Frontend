'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

function ShopContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('-averageRating');
  const [categories, setCategories] = useState(['all']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) {
      setCategory(catFromUrl);
    }
  }, [searchParams]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9;

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(['all', ...response.data.data.map(c => c.name)]);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?sort=${sortBy}&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}&page=${currentPage}&limit=${productsPerPage}`;
      if (category !== 'all') url += `&category=${category}`;
      if (search) url += `&search=${search}`;
      
      const response = await axios.get(url);
      setProducts(response.data.data);
      setTotalPages(Math.ceil((response.data.total || 0) / productsPerPage));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); 
    return () => clearTimeout(timer);
  }, [search, category, priceRange, sortBy, currentPage]);

  // Restore applied coupon from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('appliedCoupon');
      if (stored) {
        const current = useCartStore.getState().appliedCoupon;
        if (!current) {
          useCartStore.getState().setAppliedCoupon(stored);
        }
      }
    } catch (e) {}
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      <PaymentSuccessModal />

      {/* Mobile Horizontal Categories */}
      <div className="flex md:hidden overflow-x-auto gap-3 pb-6 no-scrollbar -mx-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
              category === cat 
                ? 'bg-sage text-white border-sage shadow-sm' 
                : 'bg-white text-muted border-brown/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Filters Sidebar (Collapsible on Mobile) */}
        <aside className={`w-full md:w-64 space-y-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-cream-highlight p-6 md:p-8 rounded-[2rem] border border-brown/5 shadow-soft space-y-8">
            <div className="flex justify-between items-center md:block">
              <h3 className="text-xl font-serif text-brown flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-caramel" />
                Refine
              </h3>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden text-muted text-xs font-bold uppercase tracking-widest"
              >
                Done
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Desktop Category List */}
              <div className="hidden md:block space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Category</Label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all font-medium ${
                        category === cat 
                          ? 'bg-sage text-white shadow-md translate-x-1' 
                          : 'hover:bg-white text-muted'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Price Limit</Label>
                  <span className="text-sm text-brown font-bold font-serif">৳{priceRange[1]}</span>
                </div>
                <Slider 
                  value={priceRange} 
                  max={5000} 
                  step={10} 
                  onValueChange={setPriceRange}
                  className="[&>span:first-child]:bg-caramel"
                />
              </div>

              <Button 
                variant="outline" 
                onClick={() => {
                  setPriceRange([0, 2000]);
                  setCategory('all');
                  setSearch('');
                  setIsFilterOpen(false);
                }}
                className="w-full rounded-xl border-brown/10 text-muted text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all border-none"
              >
                Reset All
              </Button>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1 space-y-6 md:space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-cream-highlight p-3 md:p-4 rounded-2xl md:rounded-3xl border border-brown/5 shadow-soft">
            <div className="flex items-center gap-3 w-full sm:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input 
                  placeholder="Search treats..." 
                  className="pl-11 h-12 md:h-14 rounded-xl md:rounded-2xl border-brown/5 bg-white focus-visible:ring-caramel text-sm md:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden h-12 w-12 rounded-xl bg-white border border-brown/5 text-brown flex items-center justify-center p-0 shrink-0"
              >
                <SlidersHorizontal className="w-5 h-5 text-caramel" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
              <div className="relative w-full sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-brown/5 bg-white px-4 text-xs md:text-sm outline-none focus:ring-2 focus:ring-caramel/20 appearance-none font-medium text-brown"
                >
                  <option value="-averageRating">Top Rated</option>
                  <option value="-createdAt">Newest Arrival</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 md:h-80 bg-cream-highlight rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination UI */}
              <div className="flex justify-center items-center gap-4 pt-8 border-t border-border-light">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="rounded-xl border-border-light hover:bg-sage hover:text-white transition-all disabled:opacity-30"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-sage text-white flex items-center justify-center font-bold shadow-sm">
                    {currentPage}
                  </span>
                  {products.length === productsPerPage && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="w-10 h-10 rounded-full text-muted hover:text-brown font-medium"
                    >
                      {currentPage + 1}
                    </Button>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  disabled={products.length < productsPerPage}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="rounded-xl border-border-light hover:bg-sage hover:text-white transition-all disabled:opacity-30"
                >
                  Next
                </Button>
              </div>
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
                  setCurrentPage(1);
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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-sage animate-spin" />
          <p className="text-muted font-serif italic text-lg">Opening the bakery...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

function PaymentSuccessModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Finalizing your payment...');
  const [isDismissed, setIsDismissed] = useState(false);

  const isSuccess = searchParams.get('payment_success');
  const isCodSuccess = searchParams.get('cod_success');
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');
  const shouldShowModal = !isDismissed && (isCodSuccess === 'true' || isSuccess === 'true') && !!orderId;

  const isError = message.toLowerCase().includes('not authorized') || 
                  message.toLowerCase().includes('pending') || 
                  message.toLowerCase().includes('failed');

  useEffect(() => {
    if (isCodSuccess === 'true' && orderId) {
      setIsLoading(false);
      setMessage('Order placed successfully! You will pay via Cash on Delivery when it arrives.');
      clearCart();
    } else if (isSuccess === 'true' && orderId && sessionId) {
      const finalizePayment = async () => {
        try {
          await axios.put(`/orders/${orderId}/mark-paid`, { sessionId });
          clearCart();
          setMessage('Payment successful! Your order is confirmed and now processing.');
        } catch (err) {
          setMessage(err.response?.data?.message || 'Payment was received, but confirmation is pending.');
        } finally {
          setIsLoading(false);
        }
      };
      finalizePayment();
    }
  }, [isSuccess, isCodSuccess, orderId, sessionId, clearCart]);

  const handleClose = () => {
    setIsDismissed(true);
    router.replace('/shop', { scroll: false });
  };

  if (!shouldShowModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 border border-brown/5 shadow-2xl bg-cream-highlight outline-none animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-6">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-sm ${
            isError ? 'bg-amber-100 text-amber-600' : 'bg-sage/10 text-sage'
          }`}>
            {isError ? <Loader2 className="w-10 h-10 animate-spin" /> : <CheckCircle2 className="w-12 h-12" />}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif text-brown">
              {isError ? 'Status Update' : (isCodSuccess === 'true' ? 'Order Confirmed' : 'Payment Success')}
            </h2>
            <p className="text-muted/90 text-lg leading-relaxed">
              {isLoading ? 'Finalizing your order details...' : message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-10">
          <Link href="/customer" className="w-full">
            <Button className="w-full rounded-2xl bg-sage hover:bg-brown text-white h-14 text-base font-bold shadow-lg border-none">
              View My Orders
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            className="w-full rounded-2xl border-brown/10 hover:bg-brown/5 h-14 text-base font-semibold text-brown/60 transition-all border-none"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
