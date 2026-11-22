import { apiClient } from "@/services/apiClient";
import { GetAlertsParams, AlertStatus } from "../types/alerts.types";

export const alertsApi = {
  getStats: async () => {
    const res = await apiClient.get("/admin/alerts/stats");
    return res.data.data;
  },

  getHistory: async (params: GetAlertsParams = {}) => {
    const res = await apiClient.get("/admin/alerts/history", { params });
    return res.data;
  },

  updateStatus: async (id: string, status: AlertStatus) => {
    const res = await apiClient.patch(`/admin/alerts/${id}/status`, {
      status,
    });
    return res.data;
  },

  getTemplates: async () => {
    const res = await apiClient.get("/admin/alerts/templates");
    return res.data.data;
  },

  createTemplate: async (payload: {
    title: string;
    content: string;
    category?: string;
  }) => {
    const res = await apiClient.post("/admin/alerts/templates", payload);
    return res.data;
  },

  broadcastAlert: async (payload: {
    title: string;
    message: string;
    targetRole?: string;
  }) => {
    const res = await apiClient.post("/admin/alerts/broadcast", payload);
    return res.data;
  },

  // User notifications for header drawer
  getUserAlerts: async () => {
    const res = await apiClient.get("/alerts");
    return res.data.data;
  },

  getUnreadCount: async () => {
    const res = await apiClient.get("/alerts/unread-count");
    return res.data.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch("/alerts/read-all");
    return res.data;
  },

  markOneAsRead: async (id: string) => {
    const res = await apiClient.patch(`/alerts/${id}/read`);
    return res.data;
  },
};

