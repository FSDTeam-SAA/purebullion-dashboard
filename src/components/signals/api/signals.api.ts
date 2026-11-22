import { apiClient } from "@/services/apiClient";
import { GetSignalsParams, SignalStatus } from "../types/signals.types";

export const signalsApi = {
  getStats: async () => {
    const res = await apiClient.get("/admin/signals/stats");
    return res.data.data;
  },

  getSignals: async (params: GetSignalsParams = {}) => {
    const res = await apiClient.get("/admin/signals", { params });
    return res.data;
  },

  updateSignalStatus: async (id: string, status: SignalStatus) => {
    const res = await apiClient.patch(`/admin/signals/${id}/status`, {
      status,
    });
    return res.data;
  },

  createSignal: async (payload: any) => {
    const res = await apiClient.post("/admin/signals", payload);
    return res.data;
  },

  updateSignal: async (id: string, payload: any) => {
    const res = await apiClient.put(`/admin/signals/${id}`, payload);
    return res.data;
  },

  deleteSignal: async (id: string) => {
    const res = await apiClient.delete(`/admin/signals/${id}`);
    return res.data;
  },
};

