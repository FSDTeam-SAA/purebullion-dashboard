import { apiClient } from "@/services/apiClient";
import {
  DashboardOverviewResponse,
  DashboardKPIs,
  MarketConditionsData,
  UserGrowthData,
  RevenueOverviewData,
} from "../types/dashboard.types";

export const dashboardApi = {
  getOverview: async (timeframe?: string) => {
    const res = await apiClient.get<{ success: boolean; data: DashboardOverviewResponse }>(
      "/admin/dashboard/overview",
      { params: { timeframe } }
    );
    return res.data.data;
  },

  getKpis: async (timeframe?: string) => {
    const res = await apiClient.get<{ success: boolean; data: DashboardKPIs }>(
      "/admin/dashboard/kpis",
      { params: { timeframe } }
    );
    return res.data.data;
  },

  getMarketConditions: async () => {
    const res = await apiClient.get<{ success: boolean; data: MarketConditionsData }>(
      "/admin/dashboard/market-conditions"
    );
    return res.data.data;
  },

  getUserGrowth: async (timeframe?: string) => {
    const res = await apiClient.get<{ success: boolean; data: UserGrowthData }>(
      "/admin/dashboard/user-growth",
      { params: { timeframe } }
    );
    return res.data.data;
  },

  getRevenueOverview: async (timeframe?: string) => {
    const res = await apiClient.get<{ success: boolean; data: RevenueOverviewData }>(
      "/admin/dashboard/revenue-overview",
      { params: { timeframe } }
    );
    return res.data.data;
  },

  getPlanPerformance: async () => {
    const res = await apiClient.get<{ success: boolean; data: any }>(
      "/admin/dashboard/plan-performance"
    );
    return res.data.data;
  },

  getRecentActivity: async (params?: any) => {
    const res = await apiClient.get<{ success: boolean; data: any }>(
      "/admin/dashboard/recent-activity",
      { params }
    );
    return res.data.data;
  },

  getSystemStatus: async () => {
    const res = await apiClient.get<{ success: boolean; data: any }>(
      "/admin/dashboard/system-status"
    );
    return res.data.data;
  },

  exportDashboard: async (timeframe?: string) => {
    const res = await apiClient.get("/admin/dashboard/export", {
      params: { timeframe },
      responseType: "blob",
    });
    return res.data;
  },
};

