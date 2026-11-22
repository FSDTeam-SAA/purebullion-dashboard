export interface DashboardKPIs {
  totalUsers: {
    label: string;
    value: string;
    numericValue: number;
    growth: string;
    growthPositive: boolean;
    sparkline: number[];
  };
  subscriptionRevenue: {
    label: string;
    value: string;
    numericValue: number;
    growth: string;
    growthPositive: boolean;
    sparkline: number[];
  };
  activeSignals: {
    label: string;
    value: string;
    numericValue: number;
    growth: string;
    growthPositive: boolean;
    sparkline: number[];
  };
  openAlerts: {
    label: string;
    value: string;
    numericValue: number;
    growth: string;
    growthPositive: boolean;
    sparkline: number[];
  };
}

export interface MarketConditionsData {
  regime: string;
  score: number;
  badge: string;
  status: string;
  timestamp: string;
  description: string;
}

export interface UserGrowthData {
  months: string[];
  newUsers: number[];
  activeUsers: number[];
  comparison?: {
    thisYearTotal: number;
    lastYearTotal: number;
    growthPercent: string;
  };
}

export interface RevenueOverviewData {
  totalRevenue: string;
  numericRevenue: number;
  timeframe: string;
  successfulPaymentsCount: number;
  failedPaymentsCount: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface PlanPerformanceItem {
  id: string;
  name: string;
  activeSubscribers: number;
  mrr: string;
  growth: string;
  color: string;
}

export interface PlatformActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface SystemServiceStatus {
  name: string;
  status: "Operational" | "Degraded" | "Outage";
  latency: string;
  uptime: string;
}

export interface SystemStatusData {
  overallHealth: string;
  services: SystemServiceStatus[];
  lastChecked: string;
}

export interface DashboardOverviewResponse {
  timeframe: string;
  kpis: DashboardKPIs;
  marketConditions: MarketConditionsData;
  userGrowth: UserGrowthData;
  revenueOverview: RevenueOverviewData;
  planPerformance: PlanPerformanceItem[];
  recentActivity: PlatformActivityItem[];
  systemStatus: SystemStatusData;
}

