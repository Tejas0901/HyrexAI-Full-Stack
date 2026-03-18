import { useState } from "react";
import { AlertCircle, CalendarDays, CreditCard, TrendingUp, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useCurrentPlan,
  useUsageStats,
  usePaymentHistory,
  usePlans,
  useSubscribe,
} from "@/hooks/useBilling";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { UsageBar } from "@/components/billing/UsageBar";
import { BillingTable } from "@/components/billing/BillingTable";
import { BillingDashboardSkeleton } from "@/components/billing/SkeletonLoader";
import type { PlanId } from "@/types/billing";

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DemoNotice = () => (
  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 rounded-xl px-4 py-3 mb-6">
    <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
      <span className="font-semibold">Demo mode:</span> Billing data is simulated. Real payment
      processing requires backend integration.
    </p>
  </div>
);

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
        <Icon size={14} className="text-primary" />
      </div>
      <h3 className="text-sm font-heading font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Billing = () => {
  const { data: current, isLoading: loadingCurrent } = useCurrentPlan();
  const { data: usage, isLoading: loadingUsage } = useUsageStats();
  const { data: history, isLoading: loadingHistory } = usePaymentHistory();
  const { data: plans, isLoading: loadingPlans } = usePlans();
  const { mutate: subscribe, isPending: subscribing } = useSubscribe();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  const isLoading = loadingCurrent || loadingUsage || loadingHistory || loadingPlans;

  if (isLoading) return <BillingDashboardSkeleton />;

  return (
    <div className="max-w-4xl space-y-6">
      <DemoNotice />

      {/* Current Plan */}
      <SectionCard title="Current Plan" icon={CreditCard}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <PlanBadge type="plan" value={current!.planId} />
              <PlanBadge type="status" value={current!.status} />
              {current!.cancelAtPeriodEnd && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 px-2.5 py-1 rounded-full">
                  Cancels at period end
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <CalendarDays size={13} />
              {current!.nextBillingDate
                ? `Next billing on ${formatDate(current!.nextBillingDate)}`
                : "No upcoming billing"}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Member since {formatDate(current!.startDate)}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              to="/pricing"
              className="btn-gradient px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            >
              Manage Plan
            </Link>
          </div>
        </div>
      </SectionCard>

      {/* Usage Stats */}
      <SectionCard title="Usage This Month" icon={TrendingUp}>
        <div className="space-y-5">
          <UsageBar
            label="API Requests"
            used={usage!.apiRequests.used}
            limit={usage!.apiRequests.limit}
          />
          <UsageBar
            label="Tokens"
            used={usage!.tokens.used}
            limit={usage!.tokens.limit}
          />
          <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
            <RefreshCcw size={11} />
            Resets on {formatDate(usage!.resetDate)}
          </p>
        </div>
      </SectionCard>

      {/* Upgrade / Downgrade */}
      <SectionCard title="Change Plan" icon={TrendingUp}>
        <div className="grid sm:grid-cols-3 gap-3">
          {plans?.map((plan) => {
            const isCurrent = plan.id === current!.planId;
            const isLoading = subscribing && selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                disabled={isCurrent || subscribing}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  subscribe(plan.id);
                }}
                className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                  isCurrent
                    ? "border-primary/30 bg-blue-50 dark:bg-blue-950/30 cursor-default"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-sm font-heading font-bold text-gray-900 dark:text-gray-100">
                    {plan.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold text-primary bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-600 mb-3">
                  {plan.id === "enterprise"
                    ? "Custom pricing"
                    : plan.price === 0
                    ? "Free forever"
                    : `$${plan.price}/month`}
                </p>
                {!isCurrent && (
                  <span className="text-xs font-semibold text-primary group-hover:underline">
                    {isLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Switching...
                      </span>
                    ) : plan.id === "enterprise" ? (
                      "Contact Sales →"
                    ) : plan.price < (plans?.find((p) => p.id === current!.planId)?.price ?? 0) ? (
                      "Downgrade →"
                    ) : (
                      "Upgrade →"
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Payment History */}
      <SectionCard title="Payment History" icon={CreditCard}>
        <BillingTable records={history ?? []} />
      </SectionCard>
    </div>
  );
};

export default Billing;
