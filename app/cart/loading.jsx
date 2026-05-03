import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-32 md:pb-12">
      <Skeleton className="h-10 w-64 rounded-xl mb-8 md:mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 p-4 md:p-6 bg-cream-highlight rounded-[1.5rem] md:rounded-2xl border border-brown/5 shadow-soft">
              <div className="flex gap-4 md:gap-6 items-center flex-1">
                <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded-lg" />
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 pt-4 sm:pt-0 border-t sm:border-none border-brown/5">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-brown p-8 rounded-[2rem] md:rounded-3xl shadow-warm space-y-6 sticky top-24 hidden md:block">
            <Skeleton className="h-8 w-40 bg-white/10 rounded-lg" />
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 bg-white/10 rounded-full" />
                <Skeleton className="h-4 w-16 bg-white/10 rounded-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 bg-white/10 rounded-full" />
                <Skeleton className="h-4 w-16 bg-white/10 rounded-full" />
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10">
                <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
                <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-16 w-full bg-caramel/40 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
