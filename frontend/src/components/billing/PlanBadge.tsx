import type { PlanId, PlanStatus } from "@/types/billing";
import { cn } from "@/lib/utils";

const PLAN_COLORS: Record<PlanId, string> = {
  free: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  pro: "bg-blue-50 dark:bg-blue-950 text-primary border-blue-100 dark:border-blue-900",
  enterprise:
    "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900",
};

const STATUS_COLORS: Record<PlanStatus, string> = {
  active: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900",
  trialing: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900",
  expired: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900",
  cancelled: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border-gray-200 dark:border-gray-700",
};

interface PlanBadgeProps {
  type: "plan" | "status";
  value: PlanId | PlanStatus;
  className?: string;
}

const PLAN_LABELS: Record<PlanId, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const STATUS_LABELS: Record<PlanStatus, string> = {
  active: "Active",
  trialing: "Trial",
  expired: "Expired",
  cancelled: "Cancelled",
};

export const PlanBadge = ({ type, value, className }: PlanBadgeProps) => {
  const colorClass =
    type === "plan"
      ? PLAN_COLORS[value as PlanId]
      : STATUS_COLORS[value as PlanStatus];

  const label =
    type === "plan"
      ? PLAN_LABELS[value as PlanId]
      : STATUS_LABELS[value as PlanStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        colorClass,
        className
      )}
    >
      {type === "status" && value === "active" && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
      )}
      {label}
    </span>
  );
};

export default PlanBadge;
