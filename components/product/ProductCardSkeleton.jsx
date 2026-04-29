/**
 * ProductCardSkeleton
 * Mirrors ProductCard structure to prevent layout shift.
 */
export default function ProductCardSkeleton() {
  return (
    <div
      className="bg-cream-highlight rounded-2xl border border-border-light overflow-hidden flex flex-col h-full"
      aria-hidden="true"
    >
      {/* Image area */}
      <div className="aspect-[4/3] bg-caramel/8 relative shrink-0 overflow-hidden">
        {/* Wishlist button */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/60 shimmer" />
      </div>

      {/* Content area */}
      <div className="p-3.5 flex flex-col flex-grow space-y-2">

        {/* Category and rating */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-grow space-y-[5px]">
            {/* category — text-[8px] uppercase, ~60% width */}
            <div className="h-[9px] w-16 rounded-full bg-caramel/10 shimmer" />
            {/* product name — text-sm (≈14px line-height ~20px) */}
            <div className="h-[14px] w-4/5 rounded-full bg-caramel/15 shimmer" />
          </div>
          {/* rating badge — px-1.5 py-0.5 rounded-lg, ~32x18px */}
          <div className="h-[18px] w-8 rounded-lg bg-caramel/10 shrink-0 shimmer" />
        </div>

        {/* Price */}
        <div className="h-[18px] w-12 rounded-full bg-caramel/15 shimmer" />

        {/* Actions */}
        <div className="flex gap-2 pt-0.5 mt-auto">
          {/* "Buy Now" — flex-grow h-9 rounded-lg */}
          <div className="flex-grow h-9 rounded-lg bg-brown/20 shimmer" />
          {/* Cart icon — h-9 w-9 shrink-0 rounded-lg */}
          <div className="h-9 w-9 shrink-0 rounded-lg bg-sage/20 shimmer" />
        </div>
      </div>
    </div>
  );
}
