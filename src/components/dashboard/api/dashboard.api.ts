import { apiClient } from "@/services/apiClient";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get<T = any>(path: string, params?: Record<string, unknown>): Promise<T> {
  const res = await apiClient.get(path, { params });
  return res.data.data as T;
}

export const dashboardApi = {
  getKpis: (timeframe?: string) => get("/admin/dashboard/kpis", { timeframe }),
  getMarketConditions: () => get("/admin/dashboard/market-conditions"),
  getUserGrowth: (timeframe?: string) => get("/admin/dashboard/user-growth", { timeframe }),
  getRevenueOverview: (timeframe?: string) => get("/admin/dashboard/revenue-overview", { timeframe }),
  getPlanPerformance: () => get("/admin/dashboard/plan-performance"),
  getRecentActivity: (params?: Record<string, unknown>) => get("/admin/dashboard/recent-activity", params),
  getSystemStatus: () => get("/admin/dashboard/system-status"),

  exportCsv: async (timeframe?: string): Promise<{ filename: string; content: string }> => {
    const res = await apiClient.get("/admin/dashboard/export", { params: { timeframe, format: "csv" } });
    const payload = res.data?.data ?? res.data;
    if (!payload?.content) throw new Error("The server returned an empty export.");
    return { filename: payload.filename || "dashboard-export.csv", content: payload.content };
  },
};
