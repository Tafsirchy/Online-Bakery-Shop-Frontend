'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('session_id');
    if (orderId && sessionId) {
      router.replace(`/shop?payment_success=true&orderId=${orderId}&session_id=${sessionId}`);
    } else {
      router.replace('/shop');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-brown">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="font-medium animate-pulse">Finalizing your order...</p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-brown">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="font-medium animate-pulse">Finalizing your order...</p>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
