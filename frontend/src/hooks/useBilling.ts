import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CurrentSubscription,
  PaymentRecord,
  Plan,
  UsageStats,
} from "@/types/billing";

// ─── Static demo data ─────────────────────────────────────────────────────────

const STATIC_PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceAnnual: 0,
    description: "Perfect for exploring Hyrex AI and small projects.",
    highlight: false,
    ctaLabel: "Get Started Free",
    limits: { apiRequests: 1000, tokens: 100_000, teamMembers: 1 },
    features: [
      { text: "1,000 API requests / month", included: true },
      { text: "100K tokens / month", included: true },
      { text: "Speech to Text (5 min/day)", included: true },
      { text: "Text to Speech (basic voices)", included: true },
      { text: "Resume Screening (5 / month)", included: true },
      { text: "Candidate Matching", included: false },
      { text: "Interview Insights", included: false },
      { text: "Priority support", included: false },
      { text: "Team members", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    priceAnnual: 39,
    description: "For growing teams that need serious hiring automation.",
    highlight: true,
    badge: "Most Popular",
    ctaLabel: "Upgrade to Pro",
    limits: { apiRequests: 100_000, tokens: 10_000_000, teamMembers: 5 },
    features: [
      { text: "100,000 API requests / month", included: true },
      { text: "10M tokens / month", included: true },
      { text: "Speech to Text (unlimited)", included: true },
      { text: "Text to Speech (all voices)", included: true },
      { text: "Resume Screening (unlimited)", included: true },
      { text: "Candidate Matching", included: true },
      { text: "Interview Insights", included: true },
      { text: "Priority email support", included: true },
      { text: "Up to 5 team members", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0,
    priceAnnual: 0,
    description: "Custom solutions for large recruitment firms and enterprises.",
    highlight: false,
    ctaLabel: "Contact Sales",
    limits: { apiRequests: -1, tokens: -1, teamMembers: -1 },
    features: [
      { text: "Unlimited API requests", included: true },
      { text: "Unlimited tokens", included: true },
      { text: "All Speech & AI features", included: true },
      { text: "Dedicated infrastructure", included: true },
      { text: "SSO & SAML", included: true },
      { text: "Custom model fine-tuning", included: true },
      { text: "SLA & 24/7 support", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Custom integrations", included: true },
    ],
  },
];

const STATIC_CURRENT: CurrentSubscription = {
  planId: "pro",
  planName: "Pro",
  status: "active",
  nextBillingDate: "2026-04-18",
  cancelAtPeriodEnd: false,
  startDate: "2026-03-18",
};

const STATIC_USAGE: UsageStats = {
  apiRequests: { used: 63_412, limit: 100_000 },
  tokens: { used: 4_187_320, limit: 10_000_000 },
  resetDate: "2026-04-18",
};

const STATIC_HISTORY: PaymentRecord[] = [
  {
    id: "pay_1",
    date: "2026-03-18",
    amount: 49,
    currency: "USD",
    status: "paid",
    description: "Pro Plan — March 2026",
    invoiceUrl: "#",
  },
  {
    id: "pay_2",
    date: "2026-02-18",
    amount: 49,
    currency: "USD",
    status: "paid",
    description: "Pro Plan — February 2026",
    invoiceUrl: "#",
  },
  {
    id: "pay_3",
    date: "2026-01-18",
    amount: 49,
    currency: "USD",
    status: "paid",
    description: "Pro Plan — January 2026",
    invoiceUrl: "#",
  },
  {
    id: "pay_4",
    date: "2025-12-18",
    amount: 0,
    currency: "USD",
    status: "paid",
    description: "Free Plan — December 2025",
    invoiceUrl: "#",
  },
];

// ─── Simulated API layer ───────────────────────────────────────────────────────
// Swap these for real axios calls when the backend is ready:
// e.g. return axios.get('/api/v1/billing/plans').then(r => r.data)

const delay = <T>(data: T, ms = 700): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const api = {
  getPlans: (): Promise<Plan[]> => delay(STATIC_PLANS),
  getCurrent: (): Promise<CurrentSubscription> => delay(STATIC_CURRENT),
  getUsage: (): Promise<UsageStats> => delay(STATIC_USAGE),
  getHistory: (): Promise<PaymentRecord[]> => delay(STATIC_HISTORY),
  subscribe: (planId: string): Promise<{ success: boolean }> =>
    delay({ success: true }, 1200).then((r) => {
      // POST /api/v1/billing/subscribe — replace with real call
      console.log("Subscribe to plan:", planId);
      return r;
    }),
};

// ─── React Query hooks ────────────────────────────────────────────────────────

export const usePlans = () =>
  useQuery({ queryKey: ["billing", "plans"], queryFn: api.getPlans, staleTime: 5 * 60 * 1000 });

export const useCurrentPlan = () =>
  useQuery({ queryKey: ["billing", "current"], queryFn: api.getCurrent });

export const useUsageStats = () =>
  useQuery({ queryKey: ["billing", "usage"], queryFn: api.getUsage });

export const usePaymentHistory = () =>
  useQuery({ queryKey: ["billing", "history"], queryFn: api.getHistory });

export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => api.subscribe(planId),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: ["billing", "current"] });
      toast.success(`Successfully switched to ${planId} plan.`);
    },
    onError: () => {
      toast.error("Failed to update plan. Please try again.");
    },
  });
};
