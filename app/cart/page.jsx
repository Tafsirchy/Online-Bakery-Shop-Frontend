'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const totalPrice = getTotalPrice();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-cream-highlight rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-12 h-12 text-caramel/40" />
        </div>
        <h2 className="text-3xl font-serif text-brown">Your cart is empty</h2>
        <p className="text-muted max-w-xs">Looks like you haven't added any treats yet. Let's find something delicious!</p>
        <Link href="/shop">
          <Button className="bg-sage hover:bg-brown-hover px-8 py-6 rounded-xl transition-all">
            Browse Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-32 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-serif text-brown mb-8 md:mb-10">Your Shopping Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 p-4 md:p-6 bg-cream-highlight rounded-[1.5rem] md:rounded-2xl border border-brown/5 shadow-soft"
              >
                <div className="flex gap-4 md:gap-6 items-center flex-1">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-caramel/10 rounded-xl overflow-hidden flex-shrink-0 border border-brown/5 relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="100px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brown/20"><ShoppingBag /></div>
                    )}
                  </div>

                  <div className="flex-grow space-y-0.5 md:space-y-1">
                    <h3 className="text-lg md:text-xl font-serif text-brown leading-tight">{item.name}</h3>
                    <p className="text-caramel font-bold text-sm md:text-base">৳{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 pt-4 sm:pt-0 border-t sm:border-none border-brown/5">
                  <div className="flex items-center gap-2 md:gap-4 bg-white p-1.5 md:p-2 rounded-xl border border-brown/5 shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg hover:bg-cream-highlight text-muted hover:text-caramel transition-all"
                    >
                      <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <span className="w-6 md:w-8 text-center font-bold text-sm md:text-base text-brown">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg hover:bg-cream-highlight text-muted hover:text-caramel transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-white border border-red-50 text-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brown p-8 rounded-[2rem] md:rounded-3xl shadow-warm text-cream space-y-6 sticky top-24 hidden md:block border-none">
            <h2 className="text-2xl font-serif">Order Summary</h2>
            
            <div className="space-y-4 text-cream/80 pt-4 border-t border-cream/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-sage font-bold uppercase text-[10px] mt-1 tracking-widest">At Checkout</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-cream pt-4 border-t border-cream/10">
                <span>Total</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button className="w-full h-14 md:h-16 rounded-2xl bg-caramel hover:bg-caramel/90 text-white font-bold text-lg group border-none">
                Checkout
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile Sticky Summary Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl md:hidden border-t border-brown/5 z-50 shadow-2xl">
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Total Payable</span>
                <span className="text-xl font-serif text-brown font-bold leading-tight">৳{totalPrice.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="flex-1">
                <Button className="w-full h-14 rounded-2xl bg-sage text-white font-bold text-base shadow-lg border-none active:scale-95 transition-transform">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
