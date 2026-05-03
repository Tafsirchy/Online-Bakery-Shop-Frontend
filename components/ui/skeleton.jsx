import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-caramel/10 shimmer", className)}
      {...props}
    />
  );
}

export { Skeleton };
