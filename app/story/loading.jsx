import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

export default function StoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-16 md:space-y-32">
      {/* Hero Section Skeleton */}
      <section className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
        <Skeleton className="h-4 w-24 mx-auto rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-12 md:h-20 w-3/4 mx-auto rounded-xl" />
          <Skeleton className="h-12 md:h-20 w-1/2 mx-auto rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-xl mx-auto rounded-full" />
          <Skeleton className="h-4 w-2/3 mx-auto rounded-full" />
        </div>
      </section>

      {/* The Founder's Tale Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative">
          <Skeleton className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] border-4 md:border-8 border-cream-highlight" />
          <div className="mt-8 md:mt-0 md:absolute md:-bottom-10 md:-right-10 bg-brown p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] w-full max-w-xs relative z-10">
            <Quote className="w-8 h-8 text-caramel opacity-20 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-white/10 rounded-full" />
              <Skeleton className="h-4 w-full bg-white/10 rounded-full" />
              <Skeleton className="h-4 w-2/3 bg-white/10 rounded-full" />
            </div>
            <Skeleton className="mt-6 h-3 w-24 bg-caramel/40 rounded-full" />
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-8 pt-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-16 rounded-xl" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-16 rounded-xl" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
