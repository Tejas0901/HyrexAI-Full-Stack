import { cn } from "@/lib/utils";

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse",
      className
    )}
  />
);

export const PricingCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-7 space-y-5">
    <Shimmer className="h-4 w-16" />
    <Shimmer className="h-3 w-48" />
    <Shimmer className="h-9 w-24" />
    <Shimmer className="h-10 w-full rounded-xl" />
    <div className="space-y-3 pt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Shimmer key={i} className="h-3.5 w-full" />
      ))}
    </div>
  </div>
);

export const BillingDashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Current plan */}
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
      <Shimmer className="h-4 w-32" />
      <div className="flex gap-4">
        <Shimmer className="h-8 w-24" />
        <Shimmer className="h-8 w-24" />
      </div>
      <Shimmer className="h-3 w-48" />
    </div>
    {/* Usage */}
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
      <Shimmer className="h-4 w-24" />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Shimmer className="h-3.5 w-28" />
            <Shimmer className="h-3.5 w-20" />
          </div>
          <Shimmer className="h-2 w-full rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Shimmer className="h-3.5 w-28" />
            <Shimmer className="h-3.5 w-20" />
          </div>
          <Shimmer className="h-2 w-full rounded-full" />
        </div>
      </div>
    </div>
    {/* History */}
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
      <Shimmer className="h-4 w-32" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
          <Shimmer className="h-3.5 w-24" />
          <Shimmer className="h-3.5 w-40" />
          <Shimmer className="h-3.5 w-12" />
          <Shimmer className="h-3.5 w-14" />
          <Shimmer className="h-3.5 w-10" />
        </div>
      ))}
    </div>
  </div>
);
