import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "../api/subscriptions.api";
import {
  GetSubscribersParams,
  SubscriberStatus,
  PlanItem,
} from "../types/subscriptions.types";
import { toast } from "sonner";

export const SUBSCRIPTIONS_QUERY_KEY = ["admin-subscriptions"] as const;

export function useSubscribers(params: GetSubscribersParams = {}) {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, "list", params],
    queryFn: () => subscriptionsApi.getSubscribers(params),
    staleTime: 30 * 1000,
  });
}

export function useSubscriptionStats() {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, "stats"],
    queryFn: () => subscriptionsApi.getStatistics(),
    staleTime: 60 * 1000,
  });
}

export function useSubscriberDetail(id: string) {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, "detail", id],
    queryFn: () => subscriptionsApi.getSubscriberDetail(id),
    enabled: !!id,
  });
}

export function useUpdateSubscriberStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubscriberStatus }) =>
      subscriptionsApi.updateSubscriberStatus(id, status),
    onSuccess: () => {
      toast.success("Subscriber status updated");
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update subscriber status");
    },
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deleteSubscriber(id),
    onSuccess: () => {
      toast.success("Subscriber deleted");
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete subscriber");
    },
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, "plans"],
    queryFn: () => subscriptionsApi.getPlans(),
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PlanItem>) =>
      subscriptionsApi.createPlan(payload),
    onSuccess: () => {
      toast.success("Plan created successfully");
      queryClient.invalidateQueries({
        queryKey: [...SUBSCRIPTIONS_QUERY_KEY, "plans"],
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create plan");
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<PlanItem>;
    }) => subscriptionsApi.updatePlan(id, payload),
    onSuccess: () => {
      toast.success("Plan updated successfully");
      queryClient.invalidateQueries({
        queryKey: [...SUBSCRIPTIONS_QUERY_KEY, "plans"],
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update plan");
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deletePlan(id),
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [...SUBSCRIPTIONS_QUERY_KEY, "plans"],
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete plan");
    },
  });
}

