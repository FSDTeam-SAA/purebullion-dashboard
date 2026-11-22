import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const DASHBOARD_QUERY_KEY = ["admin-dashboard"] as const;

export function useDashboardOverview(timeframe?: string) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "overview", timeframe],
    queryFn: () => dashboardApi.getOverview(timeframe),
    staleTime: 60 * 1000,
  });
}

export function useDashboardKpis(timeframe?: string) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "kpis", timeframe],
    queryFn: () => dashboardApi.getKpis(timeframe),
    staleTime: 60 * 1000,
  });
}

export function useMarketConditions() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "market-conditions"],
    queryFn: () => dashboardApi.getMarketConditions(),
    staleTime: 60 * 1000,
  });
}

export function useUserGrowth(timeframe?: string) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "user-growth", timeframe],
    queryFn: () => dashboardApi.getUserGrowth(timeframe),
    staleTime: 60 * 1000,
  });
}

export function useRevenueOverview(timeframe?: string) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "revenue-overview", timeframe],
    queryFn: () => dashboardApi.getRevenueOverview(timeframe),
    staleTime: 60 * 1000,
  });
}

export function usePaidPlanPerformance() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "plan-performance"],
    queryFn: () => dashboardApi.getPlanPerformance(),
    staleTime: 60 * 1000,
  });
}

export function useRecentPlatformActivity(params?: any) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "recent-activity", params],
    queryFn: () => dashboardApi.getRecentActivity(params),
    staleTime: 30 * 1000,
  });
}

export function useSystemStatus() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "system-status"],
    queryFn: () => dashboardApi.getSystemStatus(),
    staleTime: 30 * 1000,
  });
}

