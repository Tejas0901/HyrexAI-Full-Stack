export type PlanId = "free" | "pro" | "enterprise";
export type PlanStatus = "active" | "expired" | "cancelled" | "trialing";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  priceAnnual: number;
  description: string;
  features: PlanFeature[];
  highlight: boolean;
  badge?: string;
  ctaLabel: string;
  limits: {
    apiRequests: number; // -1 = unlimited
    tokens: number;      // -1 = unlimited
    teamMembers: number; // -1 = unlimited
  };
}

export interface CurrentSubscription {
  planId: PlanId;
  planName: string;
  status: PlanStatus;
  nextBillingDate: string | null;
  cancelAtPeriodEnd: boolean;
  startDate: string;
}

export interface UsageStats {
  apiRequests: { used: number; limit: number };
  tokens: { used: number; limit: number };
  resetDate: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  invoiceUrl?: string;
}
