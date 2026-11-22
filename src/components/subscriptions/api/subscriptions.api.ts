import { apiClient } from "@/services/apiClient";
import {
  GetSubscribersParams,
  SubscriberStatus,
  PlanItem,
} from "../types/subscriptions.types";

export const subscriptionsApi = {
  getSubscribers: async (params: GetSubscribersParams = {}) => {
    const res = await apiClient.get("/subscription/admin/subscribers", {
      params,
    });
    return res.data;
  },

  getStatistics: async () => {
    const res = await apiClient.get("/subscription/admin/statistics");
    return res.data.data;
  },

  getSubscriberDetail: async (id: string) => {
    const res = await apiClient.get(`/subscription/admin/subscribers/${id}`);
    return res.data.data;
  },

  updateSubscriberStatus: async (id: string, status: SubscriberStatus) => {
    const res = await apiClient.patch(
      `/subscription/admin/subscribers/${id}/status`,
      { status }
    );
    return res.data;
  },

  deleteSubscriber: async (id: string) => {
    const res = await apiClient.delete(
      `/subscription/admin/subscribers/${id}`
    );
    return res.data;
  },

  getPlans: async () => {
    const res = await apiClient.get("/subscription/plans");
    return res.data.data;
  },

  createPlan: async (payload: Partial<PlanItem>) => {
    const res = await apiClient.post("/subscription/plans", payload);
    return res.data;
  },

  updatePlan: async (id: string, payload: Partial<PlanItem>) => {
    const res = await apiClient.put(`/subscription/plans/${id}`, payload);
    return res.data;
  },

  deletePlan: async (id: string) => {
    const res = await apiClient.delete(`/subscription/plans/${id}`);
    return res.data;
  },
};

