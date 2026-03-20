import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import { PricingCard } from "@/components/billing/PricingCard";
import { PricingCardSkeleton } from "@/components/billing/SkeletonLoader";
import { usePlans, useCurrentPlan, useSubscribe } from "@/hooks/useBilling";
import { useAuth } from "@/contexts/AuthContext";
import type { PlanId } from "@/types/billing";

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const { data: plans, isLoading: loadingPlans } = usePlans();
  const { data: current } = useCurrentPlan();
  const { isAuthenticated } = useAuth();
  const { mutate: subscribe, isPending: subscribing } = useSubscribe();
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);

  const handleSelect = (planId: PlanId) => {
    if (!isAuthenticated) {
      window.location.href = "/signin";
      return;
    }
    if (planId === "enterprise") {
      window.location.href = "mailto:sales@hyrex.ai";
      return;
    }
    setPendingPlan(planId);
    subscribe(planId, { onSettled: () => setPendingPlan(null) });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-heading font-bold text-xs text-white">H</span>
            </div>
            <span className="font-heading font-bold text-base text-gray-900 dark:text-gray-100">
              Hyrex <span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="w-24" /> {/* spacer */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Page header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 px-4 py-1.5 rounded-full mb-6">
            <Zap size={13} className="text-primary" />
            <span className="text-sm text-primary font-medium">Simple, transparent pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pay for what you <span className="text-primary">actually need</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Start free. Scale as you grow. No hidden fees, no long-term contracts.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !annual
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                annual
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Annual
              <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                −20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {loadingPlans
            ? Array.from({ length: 3 }).map((_, i) => <PricingCardSkeleton key={i} />)
            : plans?.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  annual={annual}
                  currentPlanId={current?.planId}
                  onSelect={handleSelect}
                  loading={subscribing && pendingPlan === plan.id}
                />
              ))}
        </div>

        {/* FAQ / Trust row */}
        <div className="mt-20 grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
          {[
            {
              title: "Cancel anytime",
              desc: "No lock-in. Downgrade or cancel your plan from the billing dashboard at any time.",
            },
            {
              title: "Secure payments",
              desc: "Payments are processed with bank-level encryption. We never store your card details.",
            },
            {
              title: "Usage resets monthly",
              desc: "API request and token limits reset on your billing date each month.",
            },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
                {item.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
