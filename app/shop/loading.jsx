import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { SlidersHorizontal, Search } from "lucide-react";

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Mobile Horizontal Categories Skeleton */}
      <div className="flex md:hidden overflow-x-auto gap-3 pb-6 no-scrollbar -mx-4 px-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Filters Sidebar Skeleton */}
        <aside className="hidden md:block w-64 space-y-8">
          <div className="bg-cream-highlight p-6 md:p-8 rounded-[2rem] border border-brown/5 shadow-soft space-y-8">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-caramel opacity-20" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
            
            <div className="space-y-8">
              {/* Category List Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-3 w-16 rounded-full" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                  ))}
                </div>
              </div>

              {/* Price Range Skeleton */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>

              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </aside>

        {/* Product Grid Area Skeleton */}
        <main className="flex-1 space-y-6 md:space-y-8">
          {/* Top Bar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-cream-highlight p-3 md:p-4 rounded-2xl md:rounded-3xl border border-brown/5 shadow-soft">
            <div className="flex items-center gap-3 w-full sm:max-w-md">
              <div className="relative flex-1 h-12 md:h-14 bg-white rounded-xl md:rounded-2xl border border-brown/5 flex items-center px-4">
                <Search className="w-4 h-4 text-muted opacity-20" />
                <Skeleton className="ml-3 h-4 w-32 rounded-full" />
              </div>
              <Skeleton className="md:hidden h-12 w-12 rounded-xl" />
            </div>
            
            <div className="w-full sm:w-48 h-12 md:h-14 bg-white rounded-xl md:rounded-2xl border border-brown/5" />
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
