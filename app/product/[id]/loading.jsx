import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Breadcrumbs Skeleton */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-cream-highlight border border-border-light flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-muted opacity-20" />
            </div>
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-3 w-4 rounded-full" />
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-3 w-4 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Left: Image Gallery Skeleton */}
          <div className="space-y-6">
            <Skeleton className="aspect-square rounded-[3rem] border border-border-light shadow-warm" />
            <div className="flex gap-3 overflow-hidden -mx-4 px-4 lg:mx-0 lg:px-0">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: Product Info Skeleton */}
          <div className="flex flex-col h-full space-y-6">
            <div>
              <Skeleton className="h-6 w-24 rounded-lg mb-4" />
              <Skeleton className="h-12 w-full max-w-md rounded-xl mb-4" />
              <Skeleton className="h-12 w-2/3 rounded-xl mb-4" />
              
              <div className="flex items-center gap-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-100 fill-gray-100" />
                  ))}
                  <Skeleton className="ml-2 h-4 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-6 w-20 rounded-xl" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-2/3 rounded-full" />
            </div>

            <div className="hidden lg:block pt-6 space-y-4">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-2xl" />
            </div>

            <div className="hidden lg:flex gap-4 pt-8">
              <Skeleton className="flex-1 h-14 rounded-2xl" />
              <Skeleton className="w-14 h-14 rounded-2xl" />
            </div>

            {/* Features Skeleton */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-border-light">
              {[Truck, ShieldCheck, RotateCcw].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-cream-highlight flex items-center justify-center">
                    <Icon className="w-6 h-6 text-muted opacity-20" />
                  </div>
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
