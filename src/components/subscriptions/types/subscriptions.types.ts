export type SubscriberStatus = "Active" | "Expired" | "Cancelled" | "Suspended";

export interface Subscriber {
  id: string | number;
  name: string;
  company: string;
  plan: "Essential" | "Professional" | "Elite";
  started: string;
  renewal: string;
  amount: string;
  status: SubscriberStatus;
}

export interface SubscriptionStats {
  totalSubscribers: number;
  activeSubscribers: number;
  suspendedSubscribers: number;
  expiredSubscribers: number;
  cancelledSubscribers: number;
  mrr: string;
  growth: string;
}

export interface PlanItem {
  id: string;
  name: string;
  tier: "Essential" | "Professional" | "Elite";
  priceMonthly: number;
  priceYearly: number;
  description?: string;
  features: string[];
  isActive: boolean;
}

export interface GetSubscribersParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

