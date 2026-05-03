import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <header className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4">
        <Skeleton className="h-12 md:h-16 w-64 mx-auto rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-md mx-auto rounded-full" />
          <Skeleton className="h-4 w-4/5 mx-auto rounded-full" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-cream-highlight rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center border border-brown/5 shadow-soft">
            <Skeleton className="w-full md:w-1/2 aspect-square rounded-2xl md:rounded-3xl" />
            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex justify-between">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
