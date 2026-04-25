'use client';

import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif text-brown mb-10">Your Shopping Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-6 p-6 bg-cream-highlight rounded-2xl border border-border-light shadow-soft"
              >
                <div className="w-24 h-24 bg-surface-caramel/10 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown/20"><ShoppingBag /></div>
                  )}
                </div>

                <div className="flex-grow space-y-1">
                  <h3 className="text-xl font-serif text-brown">{item.name}</h3>
                  <p className="text-caramel font-bold">৳{item.price}</p>
                </div>

                <div className="flex items-center gap-4 bg-background p-2 rounded-xl border border-border-light">
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 hover:text-caramel transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 hover:text-caramel transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brown p-8 rounded-3xl shadow-warm text-cream space-y-6 sticky top-24">
            <h2 className="text-2xl font-serif">Order Summary</h2>
            
            <div className="space-y-4 text-cream/80 pt-4 border-t border-cream/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-sage font-bold uppercase text-xs mt-1">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-cream pt-4 border-t border-cream/10">
                <span>Total</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button className="w-full py-7 rounded-2xl bg-caramel hover:bg-caramel/90 text-white font-bold text-lg group">
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <p className="text-xs text-center text-cream/40 italic">
              Taxes and shipping calculated at next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
