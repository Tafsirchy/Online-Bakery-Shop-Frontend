import { Skeleton } from "@/components/ui/skeleton";
import { Truck, CreditCard } from "lucide-react";

export default function CheckoutLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-32 md:pb-12">
      <Skeleton className="h-10 w-48 rounded-xl mb-8 md:mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Shipping & Payment Skeleton */}
        <div className="space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-caramel opacity-20" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-full" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-caramel opacity-20" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </section>

          <Skeleton className="h-20 w-full rounded-2xl hidden md:block" />
        </div>

        {/* Order Summary Skeleton */}
        <aside className="hidden lg:block space-y-8">
          <div className="rounded-[2.5rem] border border-brown/5 shadow-soft overflow-hidden bg-white">
            <div className="bg-cream-highlight/50 border-b border-brown/5 p-8">
              <Skeleton className="h-8 w-40 rounded-lg" />
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-lg" />
                        <Skeleton className="h-3 w-12 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-brown/5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <div className="flex justify-between pt-6 border-t-2 border-brown/5">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
