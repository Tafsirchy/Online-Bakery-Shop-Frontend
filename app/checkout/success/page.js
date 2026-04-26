'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Finalizing your payment...');

  const orderId = useMemo(() => searchParams.get('orderId'), [searchParams]);
  const sessionId = useMemo(() => searchParams.get('session_id'), [searchParams]);

  useEffect(() => {
    const finalizePayment = async () => {
      if (!orderId || !sessionId) {
        setMessage('Payment completed. We could not verify the order ID from the URL.');
        setIsLoading(false);
        return;
      }

      try {
        await axios.put(`/orders/${orderId}/mark-paid`, { sessionId });
        clearCart();
        setMessage('Payment successful! Your order is confirmed and now processing.');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Payment was received, but confirmation is still pending.');
      } finally {
        setIsLoading(false);
      }
    };

    finalizePayment();
  }, [orderId, sessionId, clearCart]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Card className="rounded-3xl border-border-light shadow-soft">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-sage/10 text-sage flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-serif text-brown">Payment Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Finalizing your order...
              </span>
            ) : (
              message
            )}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/shop">
              <Button variant="outline" className="rounded-xl border-border-light">Continue Shopping</Button>
            </Link>
            <Link href="/customer">
              <Button className="rounded-xl bg-sage hover:bg-brown-hover">Go to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-6 py-16 text-center text-muted">
          Finalizing your order...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
