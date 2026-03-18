import { Check, X, Sparkles } from "lucide-react";
import type { Plan, PlanId } from "@/types/billing";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: Plan;
  annual: boolean;
  currentPlanId?: PlanId;
  onSelect: (planId: PlanId) => void;
  loading?: boolean;
}

export const PricingCard = ({
  plan,
  annual,
  currentPlanId,
  onSelect,
  loading,
}: PricingCardProps) => {
  const isCurrent = currentPlanId === plan.id;
  const price = annual ? plan.priceAnnual : plan.price;
  const isEnterprise = plan.id === "enterprise";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border transition-all duration-200",
        plan.highlight
          ? "border-primary/30 shadow-lg shadow-blue-500/10 bg-white dark:bg-gray-900"
          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
      )}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            <Sparkles size={11} />
            {plan.badge}
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-base font-heading font-bold text-gray-900 dark:text-gray-100 mb-1">
            {plan.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="mb-7">
          {isEnterprise ? (
            <div>
              <span className="text-4xl font-heading font-bold text-gray-900 dark:text-gray-100">
                Custom
              </span>
            </div>
          ) : price === 0 ? (
            <div>
              <span className="text-4xl font-heading font-bold text-gray-900 dark:text-gray-100">
                $0
              </span>
              <span className="text-gray-400 dark:text-gray-600 ml-1 text-sm">/month</span>
            </div>
          ) : (
            <div>
              <span className="text-4xl font-heading font-bold text-gray-900 dark:text-gray-100">
                ${price}
              </span>
              <span className="text-gray-400 dark:text-gray-600 ml-1 text-sm">/month</span>
              {annual && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  Save ${(plan.price - price) * 12}/year with annual billing
                </p>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onSelect(plan.id)}
          disabled={isCurrent || loading}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-7",
            isCurrent
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-default"
              : plan.highlight
              ? "btn-gradient text-white hover:opacity-90"
              : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : isCurrent ? (
            "Current Plan"
          ) : (
            plan.ctaLabel
          )}
        </button>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

        {/* Features */}
        <ul className="space-y-3 flex-1">
          {plan.features.map((f) => (
            <li key={f.text} className="flex items-start gap-3">
              {f.included ? (
                <Check
                  size={15}
                  className="flex-shrink-0 mt-0.5 text-emerald-500 dark:text-emerald-400"
                  strokeWidth={2.5}
                />
              ) : (
                <X
                  size={15}
                  className="flex-shrink-0 mt-0.5 text-gray-300 dark:text-gray-700"
                  strokeWidth={2}
                />
              )}
              <span
                className={cn(
                  "text-sm",
                  f.included
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-600"
                )}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
