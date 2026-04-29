'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Truck, Tag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const isValidObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ''));

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sage" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, removeInvalidItems, removeFromCart, appliedCoupon, clearAppliedCoupon } = useCartStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const orderPlacedRef = useRef(false);
  const couponAppliedRef = useRef(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    street: '', city: '', zipCode: '', country: 'Bangladesh', phone: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
  const [showMobileItems, setShowMobileItems] = useState(false);

  const searchParams = useSearchParams();
  const subtotal = getTotalPrice();
  const shippingFee = 60; // Flat fee for BD delivery
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal + shippingFee - discountAmount;

  const handleApplyCoupon = useCallback(async (codeToApply) => {
    const isExplicitString = typeof codeToApply === 'string';
    const code = (isExplicitString ? codeToApply : couponCode)?.trim();
    
    if (!code) return;
    
    setCouponLoading(true);
    setCouponMessage({ type: '', text: '' });
    try {
      const response = await axios.post('coupons/validate', { 
        code: code, 
        totalAmount: subtotal 
      });
      setDiscount(response.data.discount);
      setCouponMessage({ type: 'success', text: `Coupon applied! ${response.data.discount}% off.` });
      
      if (isExplicitString) {
        setCouponCode(codeToApply);
      }
    } catch (err) {
      setCouponMessage({ type: 'error', text: err.response?.data?.message || 'Invalid coupon' });
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode, subtotal]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !couponAppliedRef.current) {
      const couponFromUrl = searchParams.get('coupon');
      const activeCoupon = couponFromUrl || appliedCoupon;
      
      if (activeCoupon && subtotal > 0 && discount === 0) {
        couponAppliedRef.current = true;
        handleApplyCoupon(activeCoupon);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && items.length === 0 && !orderPlacedRef.current) {
      router.replace('/cart');
    }
  }, [isMounted, items.length, router]);

  useEffect(() => {
    if (isMounted) {
      removeInvalidItems();
    }
  }, [isMounted, removeInvalidItems]);

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      router.push('/login?redirect=checkout');
      return;
    }

    setLoading(true);
    try {
      const sanitizedProducts = items
        .filter((item) => isValidObjectId(item.productId))
        .map((item) => ({
          productId: String(item.productId),
          quantity: Math.max(1, Math.floor(Number(item.quantity || 1))),
        }));

      if (sanitizedProducts.length === 0) {
        throw new Error('Your cart has invalid products. Please re-add items from the shop.');
      }

      const orderData = {
        products: sanitizedProducts,
        shippingAddress: shippingInfo,
        paymentMethod,
        couponCode: couponCode || undefined
      };

      if (paymentMethod === 'Stripe') {
        if (!stripePromise) {
          throw new Error('Stripe publishable key is missing');
        }

        const sessionResponse = await axios.post('orders/checkout-session', orderData);

        const unavailableIds = Array.isArray(sessionResponse.data?.warnings)
          ? sessionResponse.data.warnings
          : [];

        if (unavailableIds.length > 0) {
          unavailableIds.forEach((productId) => removeFromCart(productId));
        }

        if (sessionResponse.data?.sessionUrl) {
          window.location.href = sessionResponse.data.sessionUrl;
        } else {
          throw new Error('Failed to create Stripe session URL');
        }
        return;
      }

      const response = await axios.post('orders', orderData);

      orderPlacedRef.current = true;
      router.push(`/shop?cod_success=true&orderId=${response.data.data._id}`);
      clearCart();
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message || 'Order placement failed';

      if (typeof serverMessage === 'string' && serverMessage.startsWith('Some products are unavailable:')) {
        const unavailableIds = serverMessage.match(/[a-fA-F0-9]{24}/g) || [];

        if (unavailableIds.length > 0) {
          unavailableIds.forEach((productId) => removeFromCart(productId));
        }

        alert('All items in your cart are unavailable right now. Please return to the shop.');
        router.replace('/cart');
        return;
      }

      alert(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 pb-32 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-serif text-brown mb-8 md:mb-10">Checkout</h1>

      {/* Mobile Sticky Order Bar (Top) */}
      <div className="lg:hidden bg-cream-highlight -mx-6 px-6 py-4 border-b border-brown/5 sticky top-0 z-40 mb-8 shadow-sm flex justify-between items-center backdrop-blur-md bg-white/80">
        <div>
          <p className="text-[10px] uppercase font-bold text-muted tracking-widest">Total Due</p>
          <p className="text-xl font-serif text-brown font-bold leading-tight">৳{finalTotal.toFixed(2)}</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => setShowMobileItems(!showMobileItems)}
          className="text-caramel font-bold text-sm h-auto p-0"
        >
          {showMobileItems ? 'Hide Items' : `View ${items.length} Items`}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Shipping & Payment */}
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif text-brown flex items-center gap-2">
              <Truck className="w-6 h-6 text-caramel" />
              Shipping
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-muted uppercase">Street Address</Label>
                <Input 
                  required 
                  className="h-12 rounded-xl border-brown/5 focus-visible:ring-caramel"
                  value={shippingInfo.street}
                  onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-muted uppercase">Phone Number</Label>
                <Input 
                  required 
                  type="tel"
                  placeholder="e.g. +880 1..."
                  className="h-12 rounded-xl border-brown/5 focus-visible:ring-caramel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted uppercase">City</Label>
                <Input 
                  required 
                  className="h-12 rounded-xl border-brown/5 focus-visible:ring-caramel"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted uppercase">Zip Code</Label>
                <Input 
                  required 
                  className="h-12 rounded-xl border-brown/5 focus-visible:ring-caramel"
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif text-brown flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-caramel" />
              Payment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div 
                onClick={() => setPaymentMethod('Stripe')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                  paymentMethod === 'Stripe' ? 'border-sage bg-sage/5' : 'border-brown/5 bg-white'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'Stripe' ? 'text-sage' : 'text-muted'}`} />
                <div className="text-left">
                  <p className="font-bold text-sm text-brown">Online Payment</p>
                  <p className="text-[10px] text-muted font-medium">Stripe Secure</p>
                </div>
              </div>
              <div 
                onClick={() => setPaymentMethod('COD')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                  paymentMethod === 'COD' ? 'border-sage bg-sage/5' : 'border-brown/5 bg-white'
                }`}
              >
                <Truck className={`w-6 h-6 ${paymentMethod === 'COD' ? 'text-brown' : 'text-muted'}`} />
                <div className="text-left">
                  <p className="font-bold text-sm text-brown">Cash on Delivery</p>
                  <p className="text-[10px] text-muted font-medium">Pay at doorstep</p>
                </div>
              </div>
            </div>
          </section>

          {/* Coupon Input - Now visible in main flow for mobile */}
          <section className="p-6 bg-cream-highlight/30 rounded-2xl border border-brown/5 space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Voucher Code</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter code" 
                className="h-12 rounded-xl border-brown/5 uppercase text-sm bg-white" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={discount > 0}
              />
              {discount > 0 ? (
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="h-12 rounded-xl px-6 border-none"
                  onClick={() => {
                    setDiscount(0);
                    setCouponCode('');
                    setCouponMessage({ type: '', text: '' });
                    clearAppliedCoupon();
                    couponAppliedRef.current = false;
                  }}
                >
                  Remove
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 rounded-xl border-brown/5 px-6 font-bold text-xs uppercase tracking-widest text-brown border-none bg-white"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode}
                >
                  {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </Button>
              )}
            </div>
            {couponMessage.text && (
              <p className={`text-xs font-bold px-2 ${couponMessage.type === 'success' ? 'text-sage' : 'text-red-500'}`}>
                {couponMessage.text}
              </p>
            )}
          </section>

          <Button 
            type="submit" 
            className="w-full h-16 md:h-20 rounded-2xl bg-sage hover:bg-brown-hover text-white text-xl font-bold shadow-lg transition-all hidden md:flex border-none"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
          </Button>
        </form>

        {/* Order Summary (Accordion on Mobile) */}
        <aside className={`space-y-8 ${showMobileItems ? 'block' : 'hidden lg:block'}`}>
          <Card className="rounded-[2.5rem] border-brown/5 shadow-soft overflow-hidden bg-white">
            <CardHeader className="bg-cream-highlight/50 border-b border-brown/5 p-6 md:p-8">
              <CardTitle className="text-2xl font-serif text-brown">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image || item.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-brown/5"
                      />
                      <div>
                        <p className="text-sm font-bold text-brown line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted font-medium tracking-tight">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-brown">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-brown/5">
                <div className="flex justify-between text-muted text-sm font-medium">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted text-sm font-medium">
                  <span>Delivery</span>
                  <span>৳{shippingFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sage font-bold text-sm">
                    <span>Discount ({discount}%)</span>
                    <span>-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-serif text-brown pt-6 border-t-2 border-brown/5">
                  <span>Total Due</span>
                  <span>৳{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Sticky Confirmation Bar (Bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-brown/5 z-50 shadow-2xl">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-sage text-white font-bold text-base shadow-lg border-none active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Confirm Order • ৳{finalTotal.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
