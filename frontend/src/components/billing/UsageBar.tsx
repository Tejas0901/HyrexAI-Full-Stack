import { cn } from "@/lib/utils";

interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  className?: string;
}

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
};

export const UsageBar = ({ label, used, limit, unit = "", className }: UsageBarProps) => {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);

  const barColor =
    pct >= 90
      ? "bg-red-500 dark:bg-red-500"
      : pct >= 70
      ? "bg-amber-500 dark:bg-amber-400"
      : "bg-primary";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isUnlimited ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Unlimited</span>
          ) : (
            <>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatNumber(used)}{unit}
              </span>
              {" / "}
              {formatNumber(limit)}{unit}
            </>
          )}
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {isUnlimited ? (
          <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full opacity-40" />
        ) : (
          <div
            className={cn("h-full rounded-full transition-all duration-700", barColor)}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>

      {!isUnlimited && (
        <p className="text-xs text-gray-400 dark:text-gray-600">
          {pct.toFixed(1)}% used
          {pct >= 80 && (
            <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
              · Consider upgrading
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default UsageBar;
