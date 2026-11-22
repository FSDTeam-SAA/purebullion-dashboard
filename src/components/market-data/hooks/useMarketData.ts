import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketDataApi } from "../api/market-data.api";
import {
  GetIntegrationsParams,
  ConnectionStatus,
} from "../types/market-data.types";
import { toast } from "sonner";

export const MARKET_DATA_QUERY_KEY = ["admin-market-data"] as const;

export function useMarketDataIntegrations(params: GetIntegrationsParams = {}) {
  return useQuery({
    queryKey: [...MARKET_DATA_QUERY_KEY, "list", params],
    queryFn: () => marketDataApi.getIntegrations(params),
    staleTime: 30 * 1000,
  });
}

export function useMarketDataStats() {
  return useQuery({
    queryKey: [...MARKET_DATA_QUERY_KEY, "stats"],
    queryFn: () => marketDataApi.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useUpdateIntegrationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      connection,
    }: {
      id: string;
      connection: ConnectionStatus;
    }) => marketDataApi.updateStatus(id, connection),
    onSuccess: () => {
      toast.success("Service connection status updated");
      queryClient.invalidateQueries({ queryKey: MARKET_DATA_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    },
  });
}

export function useSyncIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketDataApi.triggerSync(id),
    onSuccess: () => {
      toast.success("Sync triggered successfully");
      queryClient.invalidateQueries({ queryKey: MARKET_DATA_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Sync failed");
    },
  });
}

