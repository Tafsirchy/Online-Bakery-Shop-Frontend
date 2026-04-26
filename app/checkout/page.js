'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { items, getTotalPrice, clearCart, removeInvalidItems, removeFromCart } = useCartStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    street: '', city: '', zipCode: '', country: 'Bangladesh'
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  const subtotal = getTotalPrice();
  const shippingFee = 60; // Flat fee for BD delivery
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal + shippingFee - discountAmount;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.replace('/cart');
    }
  }, [isMounted, items.length, router]);

  useEffect(() => {
    if (isMounted) {
      removeInvalidItems();
    }
  }, [isMounted, removeInvalidItems]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponMessage({ type: '', text: '' });
    try {
      const response = await axios.post('/coupons/validate', { 
        code: couponCode, 
        totalAmount: subtotal 
      });
      setDiscount(response.data.discount);
      setCouponMessage({ type: 'success', text: `Coupon applied! ${response.data.discount}% off.` });
    } catch (err) {
      setCouponMessage({ type: 'error', text: err.response?.data?.message || 'Invalid coupon' });
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
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

        const sessionResponse = await axios.post('/orders/checkout-session', orderData);

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

      const response = await axios.post('/orders', orderData);

      clearCart();
      router.push(`/customer/orders/${response.data.data._id}`);
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message || 'Order placement failed';

      // If backend reports missing products, remove them from cart and return user to cart page.
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif text-brown mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping & Payment */}
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif text-brown flex items-center gap-2">
              <Truck className="w-6 h-6 text-caramel" />
              Shipping Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Street Address</Label>
                <Input 
                  required 
                  className="rounded-xl border-border-light"
                  value={shippingInfo.street}
                  onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input 
                  required 
                  className="rounded-xl border-border-light"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input 
                  required 
                  className="rounded-xl border-border-light"
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif text-brown flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-caramel" />
              Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setPaymentMethod('Stripe')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${
                  paymentMethod === 'Stripe' ? 'border-sage bg-sage/5' : 'border-border-light bg-cream-highlight'
                }`}
              >
                <CreditCard className="w-8 h-8 text-sage" />
                <span className="font-bold">Online Payment</span>
                <span className="text-xs text-muted">Stripe Secure</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('COD')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${
                  paymentMethod === 'COD' ? 'border-sage bg-sage/5' : 'border-border-light bg-cream-highlight'
                }`}
              >
                <Truck className="w-8 h-8 text-brown" />
                <span className="font-bold">Cash on Delivery</span>
                <span className="text-xs text-muted">Pay at doorstep</span>
              </div>
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full py-8 rounded-2xl bg-sage hover:bg-brown-hover text-white text-xl font-bold shadow-warm transition-all"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Confirm & Place Order'}
          </Button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="space-y-8">
          <Card className="rounded-3xl border-border-light shadow-soft overflow-hidden">
            <CardHeader className="bg-cream-highlight border-b border-border-light p-8">
              <CardTitle className="text-2xl font-serif text-brown">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Items Mini List */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image || item.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-bold text-brown line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-brown">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Input */}
              <div className="space-y-3 pt-6 border-t border-border-light">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted">Have a coupon?</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter code" 
                    className="rounded-xl border-border-light uppercase" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-xl border-border-light px-6"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </Button>
                </div>
                {couponMessage.text && (
                  <p className={`text-xs font-medium ${couponMessage.type === 'success' ? 'text-sage' : 'text-red-500'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-border-light">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping Fee</span>
                  <span>৳{shippingFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sage font-medium">
                    <span>Discount ({discount}%)</span>
                    <span>-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-serif text-brown pt-4 border-t-2 border-border-light">
                  <span>Total</span>
                  <span>৳{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-sage/5 rounded-2xl border border-sage/20 flex gap-4">
            <Tag className="w-6 h-6 text-sage" />
            <p className="text-sm text-muted italic">
              &quot;Every order is baked fresh just for you. Thank you for supporting our artisanal bakery!&quot;
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
