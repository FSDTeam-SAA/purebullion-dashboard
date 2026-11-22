import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsApi } from "../api/alerts.api";
import { GetAlertsParams, AlertStatus } from "../types/alerts.types";
import { toast } from "sonner";

export const ALERTS_QUERY_KEY = ["admin-alerts"] as const;

export function useAlertHistory(params: GetAlertsParams = {}) {
  return useQuery({
    queryKey: [...ALERTS_QUERY_KEY, "history", params],
    queryFn: () => alertsApi.getHistory(params),
    staleTime: 30 * 1000,
  });
}

export function useAlertStats() {
  return useQuery({
    queryKey: [...ALERTS_QUERY_KEY, "stats"],
    queryFn: () => alertsApi.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useAlertTemplates() {
  return useQuery({
    queryKey: [...ALERTS_QUERY_KEY, "templates"],
    queryFn: () => alertsApi.getTemplates(),
  });
}

export function useUpdateAlertStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AlertStatus }) =>
      alertsApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Alert status updated");
      queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update alert status");
    },
  });
}

export function useBroadcastAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      title: string;
      message: string;
      targetRole?: string;
    }) => alertsApi.broadcastAlert(payload),
    onSuccess: () => {
      toast.success("Alert broadcasted successfully");
      queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to broadcast alert");
    },
  });
}

// Hooks for Header Notification Drawer
export function useUserNotifications() {
  return useQuery({
    queryKey: ["user-notifications"],
    queryFn: () => alertsApi.getUserAlerts(),
    refetchInterval: 30 * 1000,
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => alertsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    },
  });
}

