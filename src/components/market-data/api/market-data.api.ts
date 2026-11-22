import { apiClient } from "@/services/apiClient";
import {
  GetIntegrationsParams,
  ConnectionStatus,
} from "../types/market-data.types";

export const marketDataApi = {
  getStats: async () => {
    const res = await apiClient.get("/admin/market-data/stats");
    return res.data.data;
  },

  getIntegrations: async (params: GetIntegrationsParams = {}) => {
    const res = await apiClient.get("/admin/market-data", { params });
    return res.data;
  },

  getIntegrationById: async (id: string) => {
    const res = await apiClient.get(`/admin/market-data/${id}`);
    return res.data.data;
  },

  updateStatus: async (id: string, connection: ConnectionStatus) => {
    const res = await apiClient.patch(`/admin/market-data/${id}/status`, {
      connection,
    });
    return res.data;
  },

  triggerSync: async (id: string) => {
    const res = await apiClient.post(`/admin/market-data/${id}/sync`);
    return res.data;
  },

  deleteIntegration: async (id: string) => {
    const res = await apiClient.delete(`/admin/market-data/${id}`);
    return res.data;
  },
};

